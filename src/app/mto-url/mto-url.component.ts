import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common'; // Usar CommonModule en lugar de BrowserModule
import { Component, Inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- Importa FormsModule
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mto-url',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './mto-url.component.html',
  styleUrl: './mto-url.component.css'
})
export class MtoUrlComponent {
  @Input() url: string = '';

  constructor(
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<MtoUrlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { url: string } // <--- ¡LA CLAVE ESTÁ AQUÍ!
  ) {
    this.url = data.url; // Asigna la URL recibida a la propiedad 'url' del componente
  }

  copiarAlPortapapeles() {
    const inputElement = document.getElementById('txtUrl') as HTMLInputElement;
    if (inputElement) {
      this.url = inputElement.value; // Actualizar la URL desde el input
      this.clipboard.copy(this.url); // Copiar la URL al portapapeles
      this.mostrarMensaje('URL copiada al portapapeles');
    }
  }

  private mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  closeModal() {
    // Esto debería manejarse desde el componente padre
    this.dialogRef.close();
  }
}