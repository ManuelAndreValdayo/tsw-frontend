import { Component } from '@angular/core';
import { UserService } from '../user.service';
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

    constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) {}
  
  confirmar(){
    this.userService.agregarUserListaCompartida().subscribe({
      next: (response) => {
        console.log(response);
        // Aquí puedes manejar la respuesta exitosa

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

  }
}
