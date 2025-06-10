import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { ModalAdvertenciaComponent } from '../../modal-advertencia/modal-advertencia.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    ModalAdvertenciaComponent
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  // Control del modal de feedback
  showModal = false;
  modalType: 'error' | 'info' = 'info';
  modalMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      email:     ['', [Validators.required, Validators.email]],
      nombre:    ['', Validators.required],
      apellidos: ['', Validators.required],
      pwd1:      ['', [Validators.required, Validators.minLength(6)]],
      pwd2:      ['', Validators.required]
    }, {
      validators: group =>
        group.get('pwd1')!.value === group.get('pwd2')!.value
          ? null : { passwordMismatch: true }
    });
  }

  validarFormulario() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const { email, nombre, apellidos, pwd1, pwd2 } = this.registerForm.value;

    this.auth.register({
      email,
      nombre,
      apellidos,
      password: pwd1,
      confirmPassword: pwd2
    }).subscribe({
      next: () => {
        this.modalType = 'info';
        this.modalMessage = 'Registro correcto. Revisa tu correo para activar la cuenta.';
        this.showModal = true;
      },
      error: err => {
        this.modalType = 'error';
        this.modalMessage = err.error?.message || 'Error al registrarse.';
        this.showModal = true;
      }
    });
  }

  onCancel() {
    this.showModal = false;
    if (this.modalType === 'info') {
      // Tras el éxito, redirigir al login
      this.router.navigate(['/Login']);
    }
  }
}