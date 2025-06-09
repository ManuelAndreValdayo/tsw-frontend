import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import e from 'express';

@Component({
  selector: 'app-validacion-cuenta',
  standalone: true,
  imports: [],
  templateUrl: './validacion-cuenta.component.html',
  styleUrl: './validacion-cuenta.component.css'
})
export class ValidacionCuentaComponent implements OnInit {
  constructor(private router: Router, private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token !== null) {
        this.userService.validarCuenta(token
        ).subscribe({
          next: (response) =>{ 
            if(response == 201){
              Swal.fire({
                title: 'Cuenta validada',
                text: '¡Tu cuenta ha sido validada correctamente!',
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
                if (result.isConfirmed) {
                  this.router.navigate(['/Login']);
                }
              });
            }
            else if(error.status == 404){
                Swal.fire({
                title: 'Error',
                text: 'Token incorrecto',
                icon: 'error',
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/Login']);
                }
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
}
