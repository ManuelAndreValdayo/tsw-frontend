import { Component, NgModule } from '@angular/core';
import { MtoProductosComponent } from '../mto-productos/mto-productos.component';
import {ModalAdvertenciaComponent} from '../modal-advertencia/modal-advertencia.component';
import { CommonModule } from '@angular/common'; // Usar CommonModule en lugar de BrowserModule
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import {INSERTAR, MODIFICAR} from '../shared/constantes';


interface Producto {
  id: number;
  cantidad: number;
  nombre: string;
  id_lista_compra: number;
}
@Component({
  selector: 'app-gestor-productos',
  standalone: true,
  imports: [MtoProductosComponent, CommonModule, RouterLink, ModalAdvertenciaComponent],
  templateUrl: './gestor-productos.component.html',
  styleUrl: './gestor-productos.component.css'
})

export class GestorProductosComponent {
  productos: Producto[] = []
  idLista: number = 0;
  idProducto: number = 0;
  mostrarModal: boolean = false; // Controla si el modal está visible
  tipoAdvertencia: string = ''; // Tipo de advertencia actual
  mensajeModal: string = ''; // Mensaje del modal
  intAccion: number = 0;
  ws = new WebSocket("wss://localhost:9000/wsChat");


  constructor(private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit() {
    const idLista = this.idLista;
    this.ws.onopen = function(e) {
    };
    this.ws.onmessage = function(event){
      console.log(event.data);
    }
    this.fncCargarProductos();
  }
  fncCargarProductos(){
    this.route.queryParams.subscribe(params => {
      this.idLista = +params['id'];  // Convertimos a número
      this.userService.obtenerProductos(this.idLista).subscribe({
        next: (response) => {
          // Verificar si la respuesta es un string y parsearlo si es necesario
          if (typeof response === 'string') {
            try {
              this.productos = JSON.parse(response); // Convertimos a array si es un string
            } catch (error) {
              console.error('Error al parsear el JSON:', error);
            }
          } else {
            this.productos = response; // Si ya es un array, simplemente lo asignamos
          }

        },
        error: (error) => {
          console.error('Error al obtener los datos:', error);
        },
      });
    });
  }

  eliminarProducto(tipo: string, mensaje: string, id: number) {
    this.tipoAdvertencia = tipo;
    this.mensajeModal = mensaje;
    this.mostrarModal = true;
    this.idLista = id;
  }
  // Confirmar acción (por ejemplo, eliminar una lista)
  eliminarProductoConfirmada() {
    this.fncEliminarProducto(this.idLista);
    this.cerrarModal();
  }
  fncEliminarProducto(id: number){
    this.userService.eliminarProducto(id).subscribe({
      next: (response: any) => {
        if(response == true){
          window.location.reload();
        }
      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
      },
    });
  }
  modificarProducto(id: number) {
    this.openModal();
    this.intAccion = MODIFICAR;
    this.idProducto = id;
    }
  insertarProducto() {
    this.openModal();
    this.intAccion = INSERTAR;
  }
  
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }
  cerrarModal() {
    this.mostrarModal = false;
  }
  fncCerrarWs(){
    this.ws.onclose = function(){};
  }
}