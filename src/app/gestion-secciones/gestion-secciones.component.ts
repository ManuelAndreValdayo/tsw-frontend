import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd, RouterLink } from '@angular/router';
import {ModalAdvertenciaComponent} from '../modal-advertencia/modal-advertencia.component';
import { StripeService } from '../stripe.service';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import Swal from 'sweetalert2';


import $ from 'jquery';
import { UserService } from '../user.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-gestion-secciones',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, ModalAdvertenciaComponent],
  templateUrl: './gestion-secciones.component.html',
  styleUrl: './gestion-secciones.component.css'
})
export class GestionSeccionesComponent implements OnInit {
  isActive:boolean = false;
  gestion1:boolean = false;
  gestion2:boolean = false;
  mostrarModal: boolean = false;
  tipoAdvertencia: string = '';
  mensajeModal: string = '';
  isModalOpen: boolean = false;
  isAuthenticated = false;
  stripe: Stripe | null = null; // Inicializa stripe como null
  sessionId: string = ''; // Aquí se guardará el session_id recibido desde el backend
  isPremium: boolean = false; // Variable para verificar si el usuario es premium
  email: string = ''; // Variable para almacenar el email del usuario
  constructor(private formBuilder: FormBuilder, private userService : UserService, private router:Router, private stripeService: StripeService) {   
  
  }
  ngOnInit() {
    this.userService.checkPremium().subscribe({
      next: (response) => {
        if(response.status== 200) {
          if(response.body != "false") {
            this.isPremium = true;
          }
          }
      },
      error: (error) => {
        console.error(error);
        console.error('Error al verificar el login:', error);
      },
    });
    this.userService.obtenerMiUsuario().subscribe({
      next: (response) => {
        if(response.status== 200) {
          this.email = JSON.parse(response.body).email;
        }else{
          this.email = "no encontrado";

        }
      },
      error: (error) => {
        console.error(error);
        console.error('Error al verificar el login:', error);
      },
    });
    // Escuchar los eventos de navegación
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Aquí puedes manejar la lógica que necesites cuando se complete una navegación
      }
    });
  }
  toogleHeight(gestion: number){
    switch(gestion){
      case 1:
        this.gestion1 = !this.gestion1;
        this.gestion2 = false;
        break;

      case 2:
        this.gestion1 = false;
        this.gestion2 = !this.gestion2;
        break;
    }
  }
  cerrarSesion(tipo: string, mensaje: string) {
    this.tipoAdvertencia = tipo;
    this.mensajeModal = mensaje;
    this.mostrarModal = true;
  }
  confirmarCerrarSesion() {
    this.fncCerrarSesion();
    this.cerrarModal();
  }
  openModal() {
    this.isModalOpen = true;
  }
  cerrarModal() {
    this.mostrarModal = false;
  }
  fncCerrarSesion(){
    localStorage.removeItem('access_token');
    this.router.navigate(['/Login']);
  //   this.userService.cerrarSesion().subscribe(
  //     ok => {
  //       // this.router.navigate(['/Login']);
  //     },
  //     error => {
  //      }
  // );
}
  async abrirStripe() {
    loadStripe('pk_test_51RH5xFPnW5m9y1BSz8N1YywBFfir3xI9JdHJd2VdFUCLrrkjulPTeB0R0xFM5YJ06l3Y4tZ5SQzEE1zdR0io5B6O00gX9a2qCl')  // Usa tu clave pública de Stripe
    .then((stripe) => {
      this.stripe = stripe;  // Asigna el objeto stripe cargado
      // this.userService.checkLogin().subscribe(
      //   (Response: any) => {
      //     if(Response != "") {
      //     }else{
      //     }
      //   }
      // );
      let url = "http://localhost:4200"+this.router.url;
      this.stripeService.checkoutSession(300,url).subscribe(
        (Response: any) => {
          if(Response != "") {
            if(Response.sessionId != null && Response.sessionId != undefined) {
              this.sessionId = Response.sessionId; // Guardar el session_id en la variable de clase
              this.redirectToCheckout();
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo crear la sesión de pago. Inténtalo de nuevo más tarde.'
              });
            }
          }
        },
        (error: any) =>{
          console.log(error);
        }
      );
    })
    .catch(error => console.error("Error al cargar Stripe:", error));
  }
  redirectToCheckout() {
    this.stripe?.redirectToCheckout({ sessionId: this.sessionId })
      .then((result: any) => {
        if (result.error) {
          // Si ocurre algún error, muestra el mensaje al usuario
          console.error(result.error.message);
        }else{
        }
      });
  }

}
