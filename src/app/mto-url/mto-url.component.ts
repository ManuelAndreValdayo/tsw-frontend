import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule} from '@angular/forms'; // <-- Importa FormsModule
import { CommonModule } from '@angular/common'; // Usar CommonModule en lugar de BrowserModule
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-mto-url',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './mto-url.component.html',
  styleUrl: './mto-url.component.css'
})
export class MtoUrlComponent {
  @Output() sharedModalClose = new EventEmitter<void>();
  @Input() url: string = '';
  secretKey = 'miClaveSecreta123';

  constructor(private router: Router) {}

  closeModal() {
    this.sharedModalClose.emit(); // Notifica al componente padre que se cerró la ventana modal
  }
  copiarAlPortapapeles(){
    const inputElement = document.getElementById('txtUrl') as HTMLInputElement;
    if (inputElement) {
      navigator.clipboard.writeText(inputElement.value)
        .then(() => {
          alert('Texto copiado al portapapeles: ' + inputElement.value);
        })
        .catch(err => {
          console.error('Error al copiar al portapapeles: ', err);
        });
    }
  }
}