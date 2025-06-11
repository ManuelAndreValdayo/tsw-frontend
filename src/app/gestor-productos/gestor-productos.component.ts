import { CommonModule } from '@angular/common'; // Usar CommonModule en lugar de BrowserModule
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Client, Frame, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ModalAdvertenciaComponent } from '../modal-advertencia/modal-advertencia.component';
import { MtoProductosComponent } from '../mto-productos/mto-productos.component';
import { UserService } from '../user.service';


interface Producto {
  id: number;
  cantidad: number;
  cantidad_comprada: number;
  nombre: string;
  id_lista_compra: number;
  id_creador: number;
}
@Component({
  selector: 'app-gestor-productos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MtoProductosComponent,
    ModalAdvertenciaComponent
  ],
  templateUrl: './gestor-productos.component.html',
  styleUrls: ['./gestor-productos.component.css']
})
export class GestorProductosComponent implements OnInit, OnDestroy {
  private stompClient!: Client;
  productos: Producto[] = [];
  idLista = 0;
  searchTerm = '';

  // Usuario actual extraído del JWT
  currentUserId: number;
  // mapa de valores a comprar
  purchaseAmount: Record<number, number> = {};

  // Modal añadir/editar
  isModalOpen = false;
  intAccion = 0;
  idProducto: number | null = null;
  selectedProducto!: Producto;
  readonly INSERTAR = 1;
  readonly MODIFICAR = 2;

  // Modal advertencia
  tipoAdvertencia = '';
  mensajeModal = '';
  mostrarModal = false;
  private idToDelete: number | null = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Decodifica el subject (userId) del JWT
    const token = this.userService.getToken();
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUserId = Number(payload.sub);
    } catch {
      this.currentUserId = 0;
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idLista = +params['id'];
      this.connectWebSocket();
    });
  }

  ngOnDestroy(): void {
    this.disconnectWs();
  }

  private connectWebSocket(): void {
    const token = this.userService.getToken();
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:9000/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      debug: str => console.log('STOMP:', str),
      onConnect: (_frame: Frame) => {
        // Suscripción al snapshot inicial
        this.stompClient.subscribe(
          `/app/listas/${this.idLista}/productos`,
          (msg: Message) => {
            const raw = JSON.parse(msg.body) as any[];
            console.log('📥 Snapshot:', raw);
            this.productos = raw.map(r => this.mapToProducto(r));
            console.log('➡️ Mappeados:', this.productos);
          }
        );
        // Suscripción a diffs: añade, edita, elimina
        this.stompClient.subscribe(
          `/topic/listas/${this.idLista}/productos`,
          (msg: Message) => {
            const raw = JSON.parse(msg.body) as any;
            console.log('📨 Diff:', raw);
            this.applyDiff(raw);
          }
        );
        // Suscripción a errores
        this.stompClient.subscribe(
          '/user/queue/errors',
          (err: Message) => alert(`Error: ${JSON.parse(err.body).message}`)
        );
      },
      onStompError: frame => console.error('STOMP ERROR:', frame.headers['message'])
    });
    this.stompClient.activate();
  }

  /** Convierte objeto JSON crudo a Producto */
  private mapToProducto(r: any): Producto {
    return {
      id: r.id,
      nombre: r.nombre,
      cantidad: r.cantidadTotal ?? r.cantidad ?? 0,
      cantidad_comprada: r.cantidadComprada ?? 0,
      id_lista_compra: r.id_lista_compra,
      id_creador: r.creador
    };
  }

  /** Aplica un diff del broker: add/edit/delete */
  private applyDiff(raw: any): void {
    if (raw.eliminadoId != null) {
      this.productos = this.productos.filter(p => p.id !== raw.eliminadoId);
      return;
    }
    const prod = this.mapToProducto(raw);
    const idx = this.productos.findIndex(p => p.id === prod.id);
    if (idx === -1) {
      this.productos.push(prod);
    } else {
      this.productos[idx] = prod;
    }
  }
  
  filteredProductos(): Producto[] {
    return this.searchTerm
      ? this.productos.filter(p => p.nombre?.toLowerCase().includes(this.searchTerm.toLowerCase()))
      : this.productos;
  }

  onSearch(): void { /* Client-side filter */ }

  confirmDelete(id: number): void {
    this.idToDelete = id;
    this.tipoAdvertencia = 'confirmación';
    this.mensajeModal = '¿Seguro que deseas eliminar este producto?';
    this.mostrarModal = true;
  }

  eliminarProductoConfirmada(): void {
    if (this.idToDelete != null) {
      this.stompClient.publish({
        destination: `/app/listas/${this.idLista}/productos/${this.idToDelete}/eliminar`,
        body: ''
      });
    }
    this.cerrarModal();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.idProducto = null;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.idToDelete = null;
  }

  openModalAndPrepare(action: number, prod?: Producto): void {
    this.intAccion = action;
    if (action === this.MODIFICAR && prod) {
      this.selectedProducto = prod;
      this.idProducto = prod.id;
    }
    this.isModalOpen = action === this.MODIFICAR
      ? true : action === this.INSERTAR;
  }

  onModalSave(prod: Producto): void {
    console.log('Producto recibido a modificar o crear:', prod);
    if (this.intAccion === this.INSERTAR) {
      this.stompClient.publish({
        destination: `/app/listas/${this.idLista}/productos/añadir`,
        body: JSON.stringify(prod)
      });
    } else if (this.intAccion === this.MODIFICAR && this.idProducto != null) {
      this.stompClient.publish({
        destination: `/app/listas/${this.idLista}/productos/${this.idProducto}/editar`,
        body: JSON.stringify(prod)
      });
    }
    this.closeModal();
  }

  /** Añade cantidad comprada a un producto (cualquier usuario) */
  addPurchased(product: Producto): void {
    const qty = this.purchaseAmount[product.id] || 0;
    if (qty > 0) {
      this.stompClient.publish({
        destination: `/app/listas/${this.idLista}/productos/${product.id}/comprar`,
        body: JSON.stringify({ cantidadComprada: qty })
      });
      // reset input
      this.purchaseAmount[product.id] = 0;
    }
  }

  disconnectWs(): void {
    if (this.stompClient) this.stompClient.deactivate();
    this.router.navigate(['../listas'], { relativeTo: this.route });
  }
}
