import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ListaCompraService } from '../listaCompra.service';
import { ModalAddListasComponent } from '../modal-add-listas/modal-add-listas.component';
import { ModalAdvertenciaComponent } from '../modal-advertencia/modal-advertencia.component';
import { ModalMiembrosListaComponent } from '../modal-miembros-lista/modal-miembros-lista.component';
import { MtoUrlComponent } from '../mto-url/mto-url.component';
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
  imports: [CommonModule, ModalAddListasComponent, ModalAdvertenciaComponent, FormsModule, RouterLink, MtoUrlComponent],
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
  url: string = '';
  sharedModal:boolean = false;

  constructor(private listaCompraService: ListaCompraService, private dialog: MatDialog, private router: Router) {}

  ngOnInit() {
    this.cargarListas(); // Asegúrate de tener un método que recargue las listas del backend
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

  cargarListas(): void {
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

  handleModalClose(listaCreada: boolean): void {
    this.isModalOpen = false;
    if (listaCreada) {
      this.cargarListas(); // Asegúrate de tener un método que recargue las listas del backend
    }
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
  
  openInsertarLista() {
    const dialogRef = this.dialog.open(ModalAddListasComponent, {
      width: 'auto',
      data: { tipoAccion: 1 } // 👈 se pasa explícitamente
    });

    dialogRef.afterClosed().subscribe((listaCreada: boolean) => {
      if (listaCreada) this.cargarListas();
    });
  }

  openModificarLista(id: number, nombre: string) {
    const dialogRef = this.dialog.open(ModalAddListasComponent, {
      width: 'auto',
      data: { tipoAccion: 2, idLista: id, nombreLista: nombre } // 👈 se pasan los datos necesarios
    });

    dialogRef.afterClosed().subscribe((listaModificada: boolean) => {
      if (listaModificada) this.cargarListas();
    });
  }

  openEliminarLista(idLista: number, nombreLista: string): void {
    const dialogRef = this.dialog.open(ModalAdvertenciaComponent, {
      width: 'auto',
      data: {
        tipoAdvertencia: 'confirmación',
        mensaje: `¿Eliminar la lista "${nombreLista}"?`
      }
    });

    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      if (confirmado) {
        this.listaCompraService.eliminarLista(idLista).subscribe({
          next: () => {
            this.cargarListas();
            Swal.fire('Eliminada', 'La lista se eliminó correctamente', 'success');
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar la lista', 'error');
          }
        });
      }
    });
  }
  // Función para encriptar
  compartirLista(idLista: number){
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
