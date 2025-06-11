import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';


interface Producto {
  id: number;
  cantidad: number;
  cantidad_comprada: number;
  nombre: string;
  id_lista_compra: number;
  id_creador: number;
}
@Component({
  selector: 'app-mto-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mto-productos.component.html',
  styleUrls: ['./mto-productos.component.css']
})
export class MtoProductosComponent implements OnInit {
  @Input() tipoAccion = 1;
  @Input() idProducto = 0;
  @Input() idLista = 0;
  @Input() producto?: Producto;
  @Output() modalClose = new EventEmitter<void>();
  @Output() modalSave = new EventEmitter<Producto>();

  nombreProducto: string = '';
  cantidad: number = 1;
  cantidad_comprada: number = 0;

  readonly INSERTAR = 1;
  readonly MODIFICAR = 2;

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['producto'] && this.producto) {
      // precarga todos los campos al editar
      this.nombreProducto = this.producto.nombre;
      this.cantidad = this.producto.cantidad;
      this.cantidad_comprada = this.producto.cantidad_comprada;
      console.log('Producto cargado para edición:', this.producto);
    }
  }
    // Evita la tecla “-” para no poder escribir valores negativos
  blockMinus(event: KeyboardEvent) {
    if (event.key === '-' ) {
      event.preventDefault();
    }
  }

  // Llamado por el botón, no por el form
  save(productoForm: NgForm) {
    if (productoForm.invalid) {
      return;
    }
    // Aquí ya puedes emitir el evento con el producto válido
    const nuevoProducto: Producto = {
          id: this.idProducto,
          nombre: this.nombreProducto,
          cantidad: this.cantidad,
          cantidad_comprada: this.cantidad_comprada,
          id_lista_compra: this.idLista,
          id_creador: this.producto?.id_creador ?? 0
        };
    this.modalSave.emit(nuevoProducto);
  }

  close(): void {
    this.modalClose.emit();
  }
}
