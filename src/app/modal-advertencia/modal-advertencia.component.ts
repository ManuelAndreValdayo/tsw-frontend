import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-advertencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-advertencia.component.html',
  styleUrl: './modal-advertencia.component.css'
})
export class ModalAdvertenciaComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalAdvertenciaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

    // ✅ Getters para que el HTML funcione igual que antes
  get tipoAdvertencia(): string {
    return this.data.tipoAdvertencia;
  }

  get mensaje(): string {
    return this.data.mensaje;
  }

  confirmar() {
    this.dialogRef.close(true);
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}