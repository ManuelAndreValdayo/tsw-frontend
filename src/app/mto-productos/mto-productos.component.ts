import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';


interface Producto {
  id: number;
  cantidad: number;
  nombre: string;
  id_lista_compra: number;
}
@Component({
  selector: 'app-mto-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mto-productos.component.html',
  styleUrls: ['./mto-productos.component.css']
})
export class MtoProductosComponent implements OnInit {
  @Input() tipoAccion: number = 1;
  @Input() idProducto: number = 0;
  @Input() idLista: number = 0;
  @Output() modalClose = new EventEmitter<void>();
  @Output() modalSave = new EventEmitter<Producto>();

  nombreProducto: string = '';
  cantidad: number = 1;

  readonly INSERTAR = 1;
  readonly MODIFICAR = 2;

  ngOnInit(): void {
    // If modifying, you could prefill fields by passing full Producto via separate @Input.
    // For now, fields start empty for INSERTAR or require manual user input for MODIFICAR.
  }

  /** Envía el producto al padre */
  submitForm(): void {
    const producto: Producto = {
      id: this.idProducto,
      nombre: this.nombreProducto,
      cantidad: this.cantidad,
      id_lista_compra: this.idLista
    };
    this.modalSave.emit(producto);
  }

  /** Cierra el modal sin cambios */
  closeModal(): void {
    this.modalClose.emit();
  }
}
