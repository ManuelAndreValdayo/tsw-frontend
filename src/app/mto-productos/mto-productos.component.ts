import { Component, EventEmitter, Input, NgModule ,Output } from '@angular/core';
import { FormBuilder, FormGroup,FormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { INSERTAR, MODIFICAR } from '../shared/constantes';


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
  styleUrl: './mto-productos.component.css'
})
export class MtoProductosComponent {
    @Output() modalClose = new EventEmitter<void>();
    @Input() tipoAccion: number = 0;
    @Input() idProducto: number = 0;
    @Input() idLista: number = 0;
    @Input() ws: WebSocket | undefined;
    @Input() listaCompartida: boolean | undefined;
    nombreProducto: string = '';
    cantidad: number = 0;
    producto: Producto[] = []; // Declaramos productos como un array de objetos Producto
    submitted = false;
    productoForm: FormGroup

    constructor(private formBuilder: FormBuilder, private userService : UserService) {    
      this.productoForm = this.formBuilder.group(
        {
          email: ['', [Validators.required, Validators.email]],
        }
      );
    }
    ngOnInit(){
      if(this.tipoAccion == 2){
        this.userService.obtenerProducto(this.idProducto).subscribe({
          next: (response) => {
            console.log(response)
            if (typeof response === 'string') {
              try {
                // Intentamos parsear el string a un objeto o array
                const parsedResponse = JSON.parse(response);
        
                // Verificamos si el parseo nos dio un objeto o un array
                if (Array.isArray(parsedResponse)) {
                  this.producto = parsedResponse; // Si es un array
                } else {
                  this.producto = [parsedResponse]; // Si es un objeto, lo convertimos en array
                }
                this.nombreProducto = this.producto[0]?.nombre;
                this.cantidad = this.producto[0]?.cantidad;
              } catch (error) {
                console.error('Error al parsear el JSON:', error);
              }
            } else {
              // Si el response ya es un objeto o array, lo asignamos directamente
              if (Array.isArray(response)) {
                this.producto = response;
              } else {
                this.producto = [response];
              }      
            }
          },
          error: (error) => {
            console.error('Error en la solicitud:', error);
          }
        });
      }
    }
    closeModal() {
      this.modalClose.emit(); // Notifica al componente padre que se cerró la ventana modal
    }
    validar(){
      if (this.nombreProducto == "") {
        Swal.fire({
          title: 'Error',
          text: 'Debes de introducir el nombre de la lista',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return false;
      }
      if (this.cantidad <= 0 || this.cantidad == null) {
        Swal.fire({
          title: 'Error',
          text: 'Debes de introducir una cantidad',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return false;
      }
      return true
    }
    submitForm() {
      if (this.validar()) {
        if(this.tipoAccion == INSERTAR && !this.listaCompartida){
          this.userService.anadirProducto(this.nombreProducto, this.cantidad, this.idLista).subscribe(
          ok => {
          this.closeModal(); // Cierra la ventana modal tras enviar los datos
          this.submitted = true;
              // Mensaje de confirmación
              Swal.fire({
                title: 'Producto añadido',
                text: '¡El producto se ha añadido correctamente!',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.isConfirmed) {
                  if(this.listaCompartida){

                  }else{
                    window.location.reload();
                  }
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
        }
        else if(this.tipoAccion == MODIFICAR){
          this.userService.modificarProducto(this.idProducto,this.nombreProducto, this.cantidad).subscribe(
            ok => {
            this.closeModal(); // Cierra la ventana modal tras enviar los datos
            this.submitted = true;
                // Mensaje de confirmación
                Swal.fire({
                  title: 'Producto añadido',
                  text: '¡El producto se ha añadido correctamente!',
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
                  text: 'Hubo un error al Añadir el producto. Por favor, inténtalo de nuevo.',
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
            }
            ); 
        }
      }
    }
}
