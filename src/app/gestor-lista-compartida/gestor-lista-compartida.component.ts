import { Component, OnInit } from '@angular/core';
import {INSERTAR, MODIFICAR} from '../shared/constantes';
import { CommonModule } from '@angular/common'; // Usar CommonModule en lugar de BrowserModule
import { MtoProductosComponent } from '../mto-productos/mto-productos.component';
import {ModalAdvertenciaComponent} from '../modal-advertencia/modal-advertencia.component';
import { UserService } from '../user.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { AppConstants } from '../constantes';



interface Producto {
  id: number;
  cantidad: number;
  nombre: string;
  id_lista_compra: number;
}
@Component({
  selector: 'app-gestor-lista-compartida',
  standalone: true,
  imports: [CommonModule, MtoProductosComponent, ModalAdvertenciaComponent],
  templateUrl: './gestor-lista-compartida.component.html',
  styleUrl: './gestor-lista-compartida.component.css'
})
export class GestorListaCompartidaComponent{

  productos: Producto[] = []
  idLista: number = 0;
  idProducto: number = 0;
  mostrarModal: boolean = false; // Controla si el modal está visible
  tipoAdvertencia: string = ''; // Tipo de advertencia actual
  mensajeModal: string = '';
  isModalOpen = false;
  intAccion: number = 0;
  hash: string | null  = '';
  isAuthenticated = false;
  isAcepted = false
  secretKey = 'miClaveSecreta123';


  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) {}

  decryptNumber(encryptedData: string): number {
    const hash = decodeURIComponent(encryptedData);
    const bytes = CryptoJS.AES.decrypt(hash, this.secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return parseInt(decrypted, 10); // Convertir el string desencriptado a número
  }

  insertarProducto() {
    this.openModal();
    this.intAccion = INSERTAR;
  }
  openModal() {
    this.isModalOpen = true;
  }
  cerrarModal() {
    this.mostrarModal = false;
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
  fncCargarProductos(){
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
  }
    cancelar() {
      this.router.navigate(['/Login']);
    }
    confirmar() {
      this.isAcepted = true;
      const ws = new WebSocket("wss://localhost:9000/wsChat");
      ws.onopen = function(event) {

      };

    }
}
