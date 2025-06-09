import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      nombre:   ['', Validators.required],
      apellidos:['', Validators.required],
      pwd1:     ['', [Validators.required, Validators.minLength(6)]],
      pwd2:     ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(group: AbstractControl) {
    return group.get('pwd1')?.value === group.get('pwd2')?.value
      ? null : { passwordMismatch: true };
  }

  validarFormulario() {
    if (this.registerForm.invalid) return;
    const { email, nombre, apellidos, pwd1, pwd2 } = this.registerForm.value;
    this.auth.register({
      email,
      nombre,
      apellidos,
      password: pwd1,
      confirmPassword: pwd2
    }).subscribe({
      next: ()  => this.router.navigate(['/Login']),
      error: err => this.error = err.error?.message || 'Registro fallido'
    });
  }
}