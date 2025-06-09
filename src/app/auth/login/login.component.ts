import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  forgotForm!: FormGroup;
  dialogRef!: MatDialogRef<any>;
  msgRecovery = '';
  errorRecovery = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private auth: AuthService,
    private router: Router
  ) {}

ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pwd:   ['', Validators.required]
    });
    // form para la recuperación
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    const { email, pwd } = this.loginForm.value;
    this.auth.login({ email, password: pwd }).subscribe({
      next: () => this.router.navigate(['/Gestion/listas']),
      error: err => this.error = err.error?.message || 'Login fallido'
    });
  }

  openRecoveryDialog(tpl: TemplateRef<any>) {
    this.msgRecovery = '';
    this.errorRecovery = false;
    this.forgotForm.reset();
    this.dialogRef = this.dialog.open(tpl, {
      width: '400px'
    });
  }

  submitRecovery() {
    if (this.forgotForm.invalid) return;
    const email = this.forgotForm.value.email;
    this.auth.sendRecoveryEmail(email).subscribe({
      next: () => {
        this.msgRecovery = 'Si existe ese correo, recibirás un email en breve.';
        this.errorRecovery = false;
      },
      error: () => {
        this.msgRecovery = 'Ese correo no está registrado.';
        this.errorRecovery = true;
      }
    });
  }
}