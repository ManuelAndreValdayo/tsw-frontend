import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AppConstants } from '../constantes';
import { MatDialog } from '@angular/material/dialog';
import { ModalEmailComponent } from '../modal-email/modal-email.component';

import {Router } from '@angular/router';

@Component({
  selector: 'app-login1',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login1.component.html',
  styleUrl: './login1.component.css'
})
export class Login1Component {
  loginForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private userService : UserService, private router:Router, private dialog: MatDialog) {    
    this.loginForm = this.formBuilder.group(
      {
        email: ['' , [Validators.required] ],
        pwd: ['', [Validators.required]]
        
      },
    );
    }
  
    ngOnInit(){
      // // Escuchar los eventos de navegación
      // this.router.events.subscribe(event => {
      //   if (event instanceof NavigationStart) {
      //     console.log('Cargando...');
      //     toggleLoading(true); // Mostrar "Cargando"
      //   } else if (event instanceof NavigationEnd) {
      //     // toggleLoading(false); // Mostrar "Cargando"
      //   }
      // });
      // this.userService.checkCookie().subscribe({
      //   next: (response) => {
      //     if(response != ''){
      //       this.router.navigate(['/Gestion']);
      //     }
      //   },
      //   error: (error) => {
      //     console.error('Error al obtener el string:', error);
      //   },
      // });
    }
    

    onSubmit() {
      this.submitted=true;
      if(this.loginForm.invalid){
        Swal.fire({
          title: 'Error',
          text: 'Credenciales incorrectas',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
      else{
        //ENVIAR DATOS SERVIDOR EXTERNO para comprobar credenciales
        this.userService.login(this.loginForm.controls['email'].value, this.loginForm.controls['pwd'].value
        ).subscribe({
          next: (response) =>{
            this.submitted = true;
            localStorage.setItem('access_token', response);
            if(AppConstants.URL.startsWith('/listaCompartida')){
              this.router.navigate([AppConstants.URL]);
            }else{
              this.router.navigate(['/Gestion/listas']);
            }
          },
          error: (error) =>{
            console.log(error.status);
            if(error.status == 403){
              Swal.fire({
                title: 'Error',
                text: 'La cuenta no ha sido confirmada. Por favor, revisa tu correo electrónico.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
          }else{
            Swal.fire({
              title: 'Error',
              text: 'Error al inciar sesión. Por favor, revisa tus credenciales.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
          }
        }
          // ok => {
          //   this.submitted = true;
          //   Swal.fire({
          //     title: 'Login correcto',
          //     text: 'Credenciales correctas',
          //     icon: 'success',
          //     confirmButtonText: 'OK'
          //   }).then((result) => {
          //     if (result.isConfirmed) {
          //       this.router.navigate(['/Gestion']);
          //     }
          //   });
          // },
          // error => {
          //   Swal.fire({
          //     title: 'Error',
          //     text: 'Hubo un error al loguearse. Por favor, inténtalo de nuevo.',
          //     icon: 'error',
          //     confirmButtonText: 'OK'
          //   });
          // }
    
        );  
      }
    }
    openRecoveryPassword() {
    this.dialog.open(ModalEmailComponent, {
      width: 'auto',
      data: { /* puedes pasar datos si quieres */ }
    });
  }
}

