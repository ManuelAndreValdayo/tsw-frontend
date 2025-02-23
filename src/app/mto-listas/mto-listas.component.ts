import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule} from '@angular/forms'; // <-- Importa FormsModule
import { CommonModule } from '@angular/common'; // Usar CommonModule en lugar de BrowserModule
import { UserService } from '../user.service';
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
  selector: 'app-mto-listas',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './mto-listas.component.html',
  styleUrl: './mto-listas.component.css'

})
export class MtoListasComponent {
  @Output() modalClose = new EventEmitter<void>();
  @Input() tipoAccion: number = 0;
  @Input() idLista: number = 0;
  nombreLista: string = '';
  lista: Lista[] = []; // Declaramos listas como un array de objetos Lista
  submitted = false;
  
  constructor(private userService : UserService, private router:Router) {    
  }
  ngOnInit(){
    if(this.tipoAccion == 2){
      this.userService.obtenerLista(this.idLista).subscribe({
        next: (response) => {
          if (typeof response === 'string') {
            try {
              // Intentamos parsear el string a un objeto o array
              const parsedResponse = JSON.parse(response);
      
              // Verificamos si el parseo nos dio un objeto o un array
              if (Array.isArray(parsedResponse)) {
                this.lista = parsedResponse; // Si es un array
              } else {
                this.lista = [parsedResponse]; // Si es un objeto, lo convertimos en array
              }
              this.nombreLista = this.lista[0]?.Nombre;
            } catch (error) {
              console.error('Error al parsear el JSON:', error);
            }
          } else {
            // Si el response ya es un objeto o array, lo asignamos directamente
            if (Array.isArray(response)) {
              this.lista = response;
            } else {
              this.lista = [response];
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

  submitForm() {
    // Validar que las contraseñas coincidan
    if (this.nombreLista == "") {
      Swal.fire({
        title: 'Error',
        text: 'Debes de introducir el nombre de la lista',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    } 

    if(this.tipoAccion == 1){
      this.userService.anadirLista(this.nombreLista).subscribe(
      ok => {
      this.closeModal(); // Cierra la ventana modal tras enviar los datos
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
    }else if(this.tipoAccion == 2){
      this.userService.modificarLista(this.idLista,this.nombreLista).subscribe(
        ok => {
        this.closeModal(); // Cierra la ventana modal tras enviar los datos
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
    }

  }
}
