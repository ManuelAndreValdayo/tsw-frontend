import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-modal-eliminar-miembro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-eliminar-miembro.component.html',
  styleUrl: './modal-eliminar-miembro.component.css'
})
export class ModalEliminarMiembroComponent {

  constructor(private dialogRef: MatDialogRef<ModalEliminarMiembroComponent>, private userService: UserService,@Inject(MAT_DIALOG_DATA) public data: any,) {}
  confirmar(){
    this.userService.eliminarMiembroLista(this.data.idListaCompartida).subscribe({
      next: (response) => {
        console.log("Miembro eliminado correctamente",response);
        this.dialogRef.close(true); // Cierra el modal y devuelve true para indicar éxito
        Swal.fire({
          title: 'Miembro eliminado',
          text: 'El miembro ha sido eliminado correctamente.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
            this.dialogRef.close();
        });
      },
      error: (error) => {
        console.error("Error al eliminar miembro:", error);
        this.dialogRef.close(false); // Cierra el modal y devuelve false para indicar error
      } 
    });
  }
  cancelar(){
    console.log("Cancelar eliminar miembro");
    this.dialogRef.close(); // Cierra el modal sin hacer nada
  }
}
