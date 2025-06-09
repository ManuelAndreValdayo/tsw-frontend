import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-restablecer-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './restablecer-password.component.html',
  styleUrl: './restablecer-password.component.css'
})
export class RestablecerPasswordComponent implements OnInit {
  pwdForm: FormGroup;
  submitted = false;
  token: string | null = null;

  constructor(private formBuilder: FormBuilder, private userService : UserService, private router:Router, private route: ActivatedRoute) {    
    this.pwdForm = this.formBuilder.group(
      {
        pwd1: ['' , [Validators.required, Validators.minLength(6)] ],
        pwd2: ['', [Validators.required]]
        
      },
      {
        validators: passwordMatchValidator('pwd1', 'pwd2')
      }
    );
    }

    ngOnInit() {
      this.token = this.route.snapshot.queryParamMap.get('token');
      if (this.token !== null) {
          this.userService.validarCuentaRecuperarPassword(this.token
          ).subscribe({
            error: (error) =>{
              if(error.status == 409){
                Swal.fire({
                  title: 'Error',
                  text: 'Cuenta ya validada',
                  icon: 'error',
                  confirmButtonText: 'OK'
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.router.navigate(['/Login']);
                  }
                });
              }else if(error.status == 410){
                  Swal.fire({
                  title: 'Error',
                  text: 'Token expirado',
                  icon: 'error',
                  confirmButtonText: 'OK'
                }).then((result) => {
                  this.router.navigate(['/Login']);
                });
              }
              else if(error.status == 404){
                  Swal.fire({
                  title: 'Error',
                  text: 'Token incorrecto',
                  icon: 'error',
                  confirmButtonText: 'OK'
                }).then((result) => {
                  this.router.navigate(['/Login']);
                });
              }
              // this.router.navigate(['/Login']);
            }
          }
          );  
      } else {
        this.router.navigate(['/Login']);
      }
    }
    onSubmit() {
      this.submitted=true;
      if(this.pwdForm.invalid){
        Swal.fire({
          title: 'Error',
          text: 'Credenciales incorrectas',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
      else{
        //ENVIAR DATOS SERVIDOR EXTERNO para comprobar credenciales
        this.userService.restablecerPassword(this.pwdForm.controls['pwd1'].value, this.pwdForm.controls['pwd2'].value, this.token
        ).subscribe({
          next: (response) =>{
            if(response == 201){
              Swal.fire({
                title: '¡Contraseña restablecida!',
                text: 'Tu contraseña ha sido restablecida correctamente.',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/Login']);
                }
              });
            }
          },
          error: (error) =>{
            console.log(error.status);
            if(error.status == 409){
              Swal.fire({
                title: 'Error',
                text: 'Introduzca una contraseña diferente a la anterior',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }else if(error.status == 410){
                Swal.fire({
                title: 'Error',
                text: 'Token expirado',
                icon: 'error',
                confirmButtonText: 'OK'
              }).then((result) => {
                this.router.navigate(['/Login']);
              });
            }
            else if(error.status == 404){
                Swal.fire({
                title: 'Error',
                text: 'Token incorrecto',
                icon: 'error',
                confirmButtonText: 'OK'
              }).then((result) => {
                this.router.navigate(['/Login']);
              });
            }else{
              Swal.fire({
                title: 'Error',
                text: 'Error al restablecer la contraseña. Por favor, inténtalo de nuevo.',
                icon: 'error',
                confirmButtonText: 'OK'
              }).then((result) => {
                this.router.navigate(['/Login']);
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
}
export function passwordMatchValidator(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordKey);
    const confirmPassword = control.get(confirmPasswordKey);

    if (!password || !confirmPassword) return null;

    if (confirmPassword.errors && !confirmPassword.errors['passwordMismatch']) {
      return null; // mantener otros errores
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword.setErrors(null);
    }

    return null;
  };
}
