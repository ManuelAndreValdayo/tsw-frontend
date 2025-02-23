import { Component, ElementRef, ViewChild, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd, RouterLink } from '@angular/router';
import {ModalAdvertenciaComponent} from '../modal-advertencia/modal-advertencia.component';


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
export class GestionSeccionesComponent {
  isActive:boolean = false;
  gestion1:boolean = false;
  gestion2:boolean = false;
  mostrarModal: boolean = false;
  tipoAdvertencia: string = '';
  mensajeModal: string = '';
  isModalOpen: boolean = false;
  isAuthenticated = false;
  constructor(private formBuilder: FormBuilder, private userService : UserService, private router:Router) {   
  
  }
  ngOnInit() {
    this.userService.checkCookie().subscribe({
      next: (response) => {
        if(response != ''){
          this.isAuthenticated = true;
        }
      },
      error: (error) => {
        console.error('Error al obtener el string:', error);
      },
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
  fncClickChincheta(){
    if(this.isActive == false){
      $(".gestionSecciones").css("clip-path","inset(0px 0px 0px 0px)");
      $("#contenidoSecciones").css("width","calc(100% - 255px)");
      $("#contenidoSecciones").css("left","255px");
      $(".gestionSecciones .icono").css("display","block");
      $(".gestionSecciones .icono").css("opacity","1");
      $("#chincheta").css("color","#4b77c9");
      this.isActive = !this.isActive
    }else{
      $(".gestionSecciones").css("clip-path","inset(0px 225px 0px 0px)");
      $("#contenidoSecciones").css("width","calc(100% - 35px)");
      $("#contenidoSecciones").css("left","35px");
      $("#chincheta").css("color","white");
      this.isActive = !this.isActive
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
    this.userService.cerrarSesion().subscribe(
      ok => {
        this.router.navigate(['/Login']);
      },
      error => {
       }
    //   {
    //   next: (response: any) => {
    //     console.log(response);
    //     if(response == true){
    //       window.location.reload();
    //     }
    //   },
    //   error: (error) => {
    //     console.error('Error al obtener los datos:', error);
    //   },
    // }
  );
}
}
