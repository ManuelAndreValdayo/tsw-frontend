import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ModalEmailComponent } from '../modal-email/modal-email.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login1',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './login1.component.html',
  styleUrls: ['./login1.component.css']
})
export class Login1Component implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  loading = false; // Indica petición en curso

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private host: ElementRef<HTMLElement>
  ) {
    // El constructor solo para DI
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pwd:   ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    this.triggerInvalidPulse();
    this.submitted = true;

    if (this.loginForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    this.loading = true; // Deshabilita botón
    console.log('Formulario válido');

    const { email, pwd } = this.loginForm.value;
    this.userService.login(email, pwd).subscribe({
      next: (response) => {
        localStorage.setItem('access_token', response);
        const sharedToken = sessionStorage.getItem('tokenListaCompartida');
        if (sharedToken) {
          this.router.navigate([`/listaCompartida/${sharedToken}`]);
        } else {
          console.log('No hay token de lista compartida');
          this.router.navigate(['/Gestion/listas']);
        }
      },
      error: (error) => {
        console.log(error.status);
        if (error.status === 403) {
          Swal.fire({
            title: 'Error',
            text: 'La cuenta no ha sido confirmada. Por favor, revisa tu correo electrónico.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Error al iniciar sesión. Por favor, revisa tus credenciales.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      },
      complete: () => {
        this.loading = false; // Reactiva botón
      }
    });
  }

  /**
   * Recorre los controles inválidos y aplica la animación pulse
   */
  private triggerInvalidPulse(): void {
    Object.keys(this.loginForm.controls).forEach(name => {
      const control = this.loginForm.get(name)!;
      if (control.invalid) {
        const inputEl = this.host.nativeElement.querySelector(`[formControlName="${name}"]`);
        this.restartAnimation(inputEl);
        const feedbackEl = this.host.nativeElement.querySelector(`#${name}-error`);
        this.restartAnimation(feedbackEl);
      }
    });
  }

  /**
   * Fuerza reflow y reaplica la clase para reiniciar animación
   */
  private restartAnimation(el: Element | null): void {
    if (!el) return;
    el.classList.remove('invalid-pulse');
    (el as HTMLElement).offsetWidth;
    el.classList.add('invalid-pulse');
  }

  /**
   * Abre el modal para recuperación de contraseña
   */
  openRecoveryPassword(): void {
    this.dialog.open(ModalEmailComponent, {
      width: 'auto',
      data: {}
    });
  }
}
