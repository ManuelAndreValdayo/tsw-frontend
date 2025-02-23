import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-advertencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-advertencia.component.html',
  styleUrl: './modal-advertencia.component.css'
})
export class ModalAdvertenciaComponent {
  @Input() tipoAdvertencia: string = ''; // Tipo de advertencia: 'confirmación', 'error', 'info'
  @Input() mensaje: string = ''; // Mensaje del modal
  @Input() mostrar: boolean = false; // Controla si el modal está visible
  @Output() onConfirmar = new EventEmitter<void>(); // Confirmar acción
  @Output() onCancelar = new EventEmitter<void>(); // Cancelar acción

  // Emitir evento de confirmación
  confirmar() {
    this.onConfirmar.emit();
    this.cerrar();
  }

  // Emitir evento de cancelación
  cancelar() {
    this.onCancelar.emit();
    this.cerrar();
  }

  // Cerrar el modal
  cerrar() {
    this.mostrar = false;
  }
}
