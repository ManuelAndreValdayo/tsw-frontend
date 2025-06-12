import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListaCompraService } from '../listaCompra.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
export class ModalAddListasComponent {
    @Input() tipoAccion: number = 1;
    @Input() idLista: number = 0;
    nombreLista: string = '';
    lista: Lista[] = []; // Declaramos listas como un array de objetos Lista
    submitted = false;

    constructor(private listaCompraService : ListaCompraService, private router:Router) {    
    }


    submitForm(){
        this.submitted = true;

        if (!this.validarForm()) {
          return; // No continuar si el formulario no es válido
        }
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
              Swal.fire({
              title: 'Error',
              text: 'Hubo un error al Añadir la lista. Por favor, inténtalo de nuevo.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        ); 

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
