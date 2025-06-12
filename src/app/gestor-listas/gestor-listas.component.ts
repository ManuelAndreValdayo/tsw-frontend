import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ListaCompraService } from '../listaCompra.service';
import { ModalAddListasComponent } from '../modal-add-listas/modal-add-listas.component';
import { ModalAdvertenciaComponent } from '../modal-advertencia/modal-advertencia.component';
import { ModalMiembrosListaComponent } from '../modal-miembros-lista/modal-miembros-lista.component';
import { MtoUrlComponent } from '../mto-url/mto-url.component';
import { MODIFICAR } from '../shared/constantes';
interface Lista {
  lista: {
    id: number;
    nombre: string;
    idUsuario: number;
    Nombre: string;
    id_usuario: number;
    fecha_creacion: number;
  }
  compartida: boolean;
}

@Component({
  selector: 'app-gestor-listas',
  standalone: true,
  imports: [CommonModule, ModalAddListasComponent, ModalAdvertenciaComponent, FormsModule, MtoUrlComponent],
  templateUrl: './gestor-listas.component.html',
  styleUrls: ['./gestor-listas.component.css'],
})
export class GestorListasComponent {
  @Output() onInsertar = new EventEmitter<void>(); // Confirmar acción
  @Input() onModificar = new EventEmitter<void>(); // Confirmar acción
  listas: Lista[] = []; // Declaramos listas como un array de objetos Lista
  searchTerm: string = ''; // Término de búsqueda para filtrar listas

  isModalOpen = false;
  intAccion: number = 0;
  idLista: number = 0;
  tipoAdvertencia: string = ''; // Tipo de advertencia actual
  mostrarModal: boolean = false; // Controla si el modal está visible
  mensajeModal: string = ''; // Mensaje del modal
  url: string = '';
  sharedModal:boolean = false;
  secretKey = 'miClaveSecreta123';

  constructor(private listaCompraService: ListaCompraService, private dialog: MatDialog, private router: Router) {}

  // Abrir el modal con un tipo y mensaje específico
  abrirModal(tipo: string, mensaje: string, id: number) {
    this.tipoAdvertencia = tipo;
    this.mensajeModal = mensaje;
    this.mostrarModal = true;
    this.idLista = id;
  }

  ngOnInit() {
    this.listaCompraService.obtenerListasUsuario().subscribe({
      next: (response) => {
        // Verificar si la respuesta es un string y parsearlo si es necesario
        if (typeof response === 'string') {
          try {
            // for( item of JSON.parse(response)){}
            this.listas = JSON.parse(response); // Convertimos a array si es un string
          } catch (error) {
            console.error('Error al parsear el JSON:', error);
          }
        } else {
          this.listas = response; // Si ya es un array, simplemente lo asignamos
        }

      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
      },
    });
  }

    onSearch(): void {}

    listasFiltradas(): Lista[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.listas;
    }
    return this.listas.filter(lista =>
      lista.lista.nombre?.toLowerCase().includes(term)
    );
  }

  // Cerrar el modal
  cerrarModal() {
    this.mostrarModal = false;
  }

  // Confirmar acción (por ejemplo, eliminar una lista)
  eliminarListaConfirmada() {
    this.fncEliminarLista(this.idLista);
    this.cerrarModal();
  }
  modificarLista(id: number){
    this.openModal();

  }
  openInsertarLista() {
    this.dialog.open(ModalAddListasComponent, {
      width: 'auto',
      data: { /* puedes pasar datos si quieres */ }
    });
  }
    openVerMiembros(id: number, compartida: boolean) {
    this.dialog.open(ModalMiembrosListaComponent, {
      width: 'auto',
      data: { 
        idLista: id,
        compartida: compartida
      } // Pasamos el id de la lista al modal
    });
  }
    openModificarLista(id: number) {
      this.intAccion = MODIFICAR;
      this.idLista = id;
      this.dialog.open(ModalAddListasComponent, {
        width: 'auto',
        data: { /* puedes pasar datos si quieres */ }
      });
  }
  eliminarLista(tipo: string, mensaje: string, id: number){
    this.tipoAdvertencia = tipo;
    this.mensajeModal = mensaje;
    this.mostrarModal = true;
    this.idLista = id;
  }
  openModal() {
    this.isModalOpen = true;
  }


  fncModificarLista(id: any){
    this.listaCompraService
  }
  fncEliminarLista(id: number){
    this.listaCompraService.eliminarLista(id).subscribe({
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

  // Función para encriptar
  compartirLista(idLista: number){
    // const numberAsString = idLista.toString(); // Convertir el número a string
    // const encrypted = CryptoJS.AES.encrypt(numberAsString, this.secretKey).toString();
    // this.url = `${window.location.origin}/listaCompartida/${encodeURIComponent(encrypted)}`;
    // this.openSharedModal();
    this.listaCompraService.crearListaCompartida(idLista).subscribe({
      next: (response: any) => {
        console.log(response.status)
          if(response.status == 201){
            this.url = `${window.location.origin}/listaCompartida/${response.body}`;
            this.openSharedModal();
          }

      },
      error: (error) => {
                switch (error.status) {
          case 404:
            Swal.fire({
              title: 'Error',
              text: 'No se encontró la lista.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            break;
          case 500:
            Swal.fire({
              title: 'Error',
              text: 'Error interno del servidor al crear la lista compartida.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            break;
          case 403:
            this.router.navigate(['/Login']);
            break;
        }
        console.error('Error al obtener los datos:', error);
      },
    });
  }
  openSharedModal(){
    this.sharedModal = true;
  }
}
