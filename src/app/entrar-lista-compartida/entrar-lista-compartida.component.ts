import { Component } from '@angular/core';
import { ListaCompraService } from '../listaCompra.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-entrar-lista-compartida',
  standalone: true,
  imports: [],
  templateUrl: './entrar-lista-compartida.component.html',
  styleUrl: './entrar-lista-compartida.component.css'
})
export class EntrarListaCompartidaComponent {

    constructor(private listaCompraService: ListaCompraService, private route: ActivatedRoute, private router: Router) {}
  
  confirmar(){
    this.listaCompraService.agregarUserListaCompartida().subscribe({
      next: (response) => {

        console.log(JSON.parse(response.body));
        // Aquí puedes manejar la respuesta exitosa
        Swal.fire({
          title: 'Éxito',
          text: 'Te has unido a la lista compartida correctamente.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          this.router.navigate(['/Gestion/listas']);
        });
      },
      error: (error) => {
        // Aquí puedes manejar el error
        switch (error.status) {
          case 409:
            Swal.fire({
              title: 'Error',
              text: 'Ya pertenece a esta lista compartida.',
              icon: 'error',
              confirmButtonText: 'OK'
            }).then((result) => {
              this.router.navigate(['/Gestion/listas']);
            });
            console.error('Error al agregar usuario a la lista compartida:', error);
            break;
          case 403:
            Swal.fire({
              title: 'Warning',
              text: 'Eres el creador de la lista compartida, no puedes unirte a ella.',
              icon: 'warning',
              confirmButtonText: 'OK'
            }).then((result) => {
              this.router.navigate(['/Gestion/listas']);
            });
            console.error('Error al agregar usuario a la lista compartida:', error);
            break;
          case 404:
            Swal.fire({
              title: 'Error',
              text: 'Token expirado o inválido.',
              icon: 'error',
              confirmButtonText: 'OK'
            }).then((result) => {
              this.router.navigate(['/Gestion/listas']);
            });
            console.error('Error al agregar usuario a la lista compartida:', error);
            break;
          case 411:
            Swal.fire({
              title: 'Warning',
              text: 'Pasate a premium para invitar a mas usuarios a la lista compartida.',
              icon: 'warning',
              confirmButtonText: 'OK'
            }).then((result) => {
              this.router.navigate(['/Gestion/listas']);
            });
            console.error('Error al agregar usuario a la lista compartida:', error);
            break;
          case 500:
            Swal.fire({
              title: 'Error',
              text: 'Error al agregar usuario a la lista compartida.',
              icon: 'error',
              confirmButtonText: 'OK'
            }).then((result) => {
              this.router.navigate(['/Gestion/listas']);
            });
            console.error('Error al agregar usuario a la lista compartida:', error);
            break;
      }
    }
    })
  }
  cancelar() {
    this.router.navigate(['/Gestion/listas']);
  }
}
