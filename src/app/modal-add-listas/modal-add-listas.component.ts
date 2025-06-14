import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListaCompraService } from '../listaCompra.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MODIFICAR } from '../shared/constantes';

interface Lista {
  id: number;
  nombre: string;
  idUsuario: number;
  Nombre: string;
  id_usuario: number;
}

@Component({
  selector: 'app-modal-add-listas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-add-listas.component.html',
  styleUrl: './modal-add-listas.component.css'
})
export class ModalAddListasComponent implements OnInit {
    nombreLista: string = '';
    lista: Lista[] = []; // Declaramos listas como un array de objetos Lista
    submitted = false;
    nombreAccion: string = 'Añadir';
    constructor(private listaCompraService : ListaCompraService, private router:Router, @Inject(MAT_DIALOG_DATA) public data: any) {    
    }

    ngOnInit(): void {
      if (this.data.intAccion === MODIFICAR){
        this.nombreAccion = 'Modificar';
        this.nombreLista = this.data.nombreLista; // Asignar el nombre de la lista a modificar
      }
    }
    submitForm(){
        this.submitted = true;

        if (!this.validarForm()) {
          return; // No continuar si el formulario no es válido
        }
        if(this.data.intAccion === MODIFICAR) {
          this.listaCompraService.modificarLista(this.nombreLista, this.data.idLista).subscribe(
          ok => {
          this.submitted = true;
              // Mensaje de confirmación
              Swal.fire({
                title: 'Lista añadida',
                text: '¡La lista se ha añadido correctamente!',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.reload();
                }
              });
          },
          error => {
                Swal.fire({
                title: 'Error',
                text: 'Hubo un error al Añadir la lista. Por favor, inténtalo de nuevo.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          ); 
        }else{
          this.listaCompraService.anadirLista(this.nombreLista).subscribe(
          ok => {
          this.submitted = true;
              // Mensaje de confirmación
              Swal.fire({
                title: 'Lista añadida',
                text: '¡La lista se ha añadido correctamente!',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.reload();
                }
              });
          },
          error => {
            switch (error.status) {
              case 403:
                Swal.fire({
                  title: 'Error',
                  text: 'No tienes permiso para añadir una lista.',
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
                break;
              case 406:
                Swal.fire({
                  title: 'Warning',
                  text: 'Para añadir mas listas, pasate a Premium.',
                  icon: 'warning',
                  confirmButtonText: 'OK'
                });
                break;
              default:
                Swal.fire({
                  title: 'Error',
                  text: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
            }
            }
          ); 
        }

        // Procesar formulario válido
        console.log('Formulario válido:', this.nombreLista);

        // Opcional: resetear formulario
        this.submitted = false;
        this.nombreLista = '';
    }
    validarForm(): boolean {
      const nombre = this.nombreLista.trim();
      if (!nombre || nombre.length > 50) {
        return false;
      }
      return true;
    }
}
