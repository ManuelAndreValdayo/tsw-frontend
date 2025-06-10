import { CommonModule } from '@angular/common'; // Usar CommonModule en lugar de BrowserModule
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Client, Frame, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ModalAdvertenciaComponent } from '../modal-advertencia/modal-advertencia.component';
import { MtoProductosComponent } from '../mto-productos/mto-productos.component';
import { UserService } from '../user.service';


interface Producto {
  id: number;
  cantidad: number;
  nombre: string;
  id_lista_compra: number;
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
  searchTerm: string = '';

  // Modal de añadir/editar productos
  isModalOpen = false;
  intAccion: number = 0;
  idProducto: number | null = null;
  readonly INSERTAR = 1;
  readonly MODIFICAR = 2;

  // Modal de advertencia para eliminar
  tipoAdvertencia: string = '';
  mensajeModal: string = '';
  mostrarModal: boolean = false;
  private idToDelete: number | null = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.idLista = +params['id'];
      this.connectWebSocket();
    });
  }

  ngOnDestroy() {
    this.disconnectWs();
  }

  /** Conexión STOMP/SockJS al backend */
private connectWebSocket() {
  const token = this.userService.getToken();
  this.stompClient = new Client({
    webSocketFactory: () => new SockJS('http://localhost:9000/ws'),
    connectHeaders: { Authorization: `Bearer ${token}` },
    reconnectDelay: 5000,
    debug: str => console.log('STOMP:', str),
    onConnect: (_frame: Frame) => {
      // 1) Snapshot inicial: broker lo enviará a /user/queue/listas/{id}
      this.stompClient.subscribe(
        `/user/queue/listas/${this.idLista}`,
        (msg: Message) => {
          const body = JSON.parse(msg.body);
          if (Array.isArray(body)) {
            this.productos = body;
          }
        }
      );

      // 2) Cambios posteriores: añade/edita/borra en /topic/listas/{id}
      this.stompClient.subscribe(
        `/topic/listas/${this.idLista}`,
        (msg: Message) => this.onProductUpdate(msg)
      );

      // 3) Errores: cualquier excepción va a /user/queue/errors
      this.stompClient.subscribe(
        '/user/queue/errors',
        (err: Message) => {
          const payload = JSON.parse(err.body);
          alert(`Error: ${payload.message}`);
        }
      );
    },
    onStompError: (frame: Frame) => {
      console.error('STOMP ERROR:', frame.headers['message']);
    }
  });

  this.stompClient.activate();
}


  /** Actualiza el array de productos según el mensaje recibido */
  private onProductUpdate(msg: Message) {
    const body = JSON.parse(msg.body);
    if (body.eliminadoId != null) {
      this.productos = this.productos.filter(p => p.id !== body.eliminadoId);
    } else {
      const idx = this.productos.findIndex(p => p.id === body.id);
      if (idx === -1) this.productos.push(body);
      else this.productos[idx] = body;
    }
  }

  /** Filtra productos en base al término de búsqueda (client-side) */
  filteredProductos(): Producto[] {
    if (!this.searchTerm) return this.productos;
    const term = this.searchTerm.toLowerCase();
    return this.productos.filter(p =>
      p.nombre?.toLowerCase().includes(term)
    );
  }

  /** Método invocado al pulsar BUSCAR */
  onSearch(): void {
    // Con client-side filter no es necesario más código aquí
  }

  /** Prepara el modal de confirmación de eliminación */
  confirmDelete(id: number): void {
    this.idToDelete = id;
    this.tipoAdvertencia = 'ELIMINAR';
    this.mensajeModal = '¿Estás seguro que deseas eliminar este producto?';
    this.mostrarModal = true;
  }

  /** Elimina el producto tras confirmar */
  eliminarProductoConfirmada(): void {
    if (this.idToDelete != null) {
      this.stompClient.publish({
        destination: `/app/listas/${this.idLista}/productos/${this.idToDelete}/eliminar`,
        body: ''
      });
    }
    this.cerrarModal();
  }

  /** Cierra el modal de añadir/editar */
  closeModal(): void {
    this.isModalOpen = false;
    this.idProducto = null;
  }

  /** Cierra el modal de advertencia */
  cerrarModal(): void {
    this.mostrarModal = false;
    this.idToDelete = null;
  }

  /** Abre el modal de alta o edición según la acción */
  openModalAndPrepare(action: number, prod?: Producto): void {
    this.intAccion = action;
    this.idProducto = action === this.MODIFICAR && prod ? prod.id : null;
    this.isModalOpen = true;
  }

  /** Ajustado para aceptar CustomEvent del modal o un Producto directo */
  onModalSave(event: any): void {
    const prod: Producto = (event && (event as CustomEvent).detail)
      ? (event as CustomEvent).detail
      : event;
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

  /** Desconecta del WebSocket */
  disconnectWs(): void {
    if (this.stompClient) this.stompClient.deactivate();
  }
}
