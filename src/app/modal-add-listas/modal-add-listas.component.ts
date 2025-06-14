import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ListaCompraService } from '../listaCompra.service';

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
    @Input() idLista!: number;
    nombreLista: string = '';
    lista: Lista[] = []; // Declaramos listas como un array de objetos Lista
    submitted = false;
    @Output() modalClose = new EventEmitter<boolean>(); // Emitir evento al cerrar el modal

    constructor(private listaCompraService : ListaCompraService, private router:Router, private dialogRef: MatDialogRef<ModalAddListasComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {    
      this.tipoAccion = data?.tipoAccion || 1;
      this.idLista = data?.idLista || 0;
      this.nombreLista = data?.nombreLista || '';
    }

    submitForm(){
      this.submitted = true;

      if (this.nombreLista.trim() === '' || this.nombreLista.trim().length > 50) {
        return;
      }

      const nuevaListaNombre = this.nombreLista.trim();

      if (this.tipoAccion === 1) {
        // Lógica de creación
        this.listaCompraService.anadirLista(nuevaListaNombre).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Lista creada correctamente', 'success').then(() => {
              this.dialogRef.close(true);
            });
          },
          error: () => {
            Swal.fire('Error', 'No se pudo crear la lista', 'error').then(() => {
              this.dialogRef.close(false);
            });
          }
        });
      } else if (this.tipoAccion === 2) {
        // Lógica de modificación
        this.listaCompraService.modificarLista(this.idLista, nuevaListaNombre).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Lista modificada correctamente', 'success').then(() => {
              this.dialogRef.close(true);
            });
          },
          error: () => {
            Swal.fire('Error', 'No se pudo modificar la lista', 'error').then(() => {
              this.dialogRef.close(false);
            });
          }
        });
      }
    }
}
