import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Register1Component } from './register1/register1.component';
import { Login1Component } from "./login1/login1.component";
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormBuilder } from '@angular/forms';
import { UserService } from './user.service';
import { AppConstants } from './constantes';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Register1Component, Login1Component],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sslfe';
  token = "";   

  constructor(private formBuilder: FormBuilder, private userService : UserService, private router:Router) {
  }

  ngOnInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.userService.checkCookie().subscribe({
          next: (response) => {
            if(event.urlAfterRedirects.startsWith('/listaCompartida')){
              AppConstants.URL = event.urlAfterRedirects;              
            }
            if((event.urlAfterRedirects != '/Register') && response == ''){
              this.router.navigate(['/Login']);
            }else if(event.urlAfterRedirects == '/' && response != ''){
              this.router.navigate(['/Gestion/listas']);
            }
          },
          error: (error) => {
            console.error('Error al obtener el string:', error);
          },
        });
      }
    });


  }
}


  
