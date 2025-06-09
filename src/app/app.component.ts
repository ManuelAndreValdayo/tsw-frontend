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
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sslfe';
  token = "";   
}


  
