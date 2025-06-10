import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppComponent } from '../../app.component';
import { ModalAdvertenciaComponent } from '../../modal-advertencia/modal-advertencia.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ModalAdvertenciaComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  forgotForm!: FormGroup;
  dialogRef!: MatDialogRef<any>;
  showModal = false;
  modalType: 'error' = 'error';
  msgRecovery = '';
  errorRecovery = false;
  modalMessage = '';

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private app: AppComponent
  ) {}


  ngOnInit() {
    // --- LÓGICA DE VALIDACIÓN DE CUENTA DESDE URL ---
    this.route.queryParams.subscribe(params => {
      const validationToken = params['validationToken'];
      if (validationToken) {
        console.log('Validation token found in URL:', validationToken);
        this.validateAccountFromUrl(validationToken);
      }
    });
    // === LÓGICA DE LOGIN AUTOMÁTICO ===
    if (this.auth.isLoggedIn()) {
      const redirectUrl = this.auth.redirectUrl; // Obtiene la URL almacenada

      if (redirectUrl) {
        console.log('LoginComponent (auto-login): Redirecting to original URL:', redirectUrl);
        this.auth.redirectUrl = null; // Limpia la URL después de usarla
        this.router.navigateByUrl(redirectUrl); // Redirige a la URL original
      } else {
        console.log('LoginComponent (auto-login): No redirect URL found. Navigating to default /listas.');
        this.router.navigate(['/listas']); // O tu ruta por defecto
      }
      return; // Detener la ejecución de ngOnInit si ya se ha redirigido
    }
    // === FIN LÓGICA DE LOGIN AUTOMÁTICO ===

    // Inicialización del formulario de login (solo si no hay auto-login)
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pwd: ['', Validators.required]
    });
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, pwd } = this.loginForm.value;
    this.auth.login({ email, password: pwd }).subscribe({
      next: () => {
        // La lógica de redirección manual después del login (si el usuario escribe las credenciales)
        // Es la misma que la del auto-login en ngOnInit
        const redirectUrl = this.auth.redirectUrl;
        this.auth.redirectUrl = null; // Limpia la URL

        if (redirectUrl) {
          console.log('LoginComponent (manual login): Redirecting to original URL:', redirectUrl);
          this.router.navigateByUrl(redirectUrl);
        } else {
          console.log('LoginComponent (manual login): No redirect URL found. Navigating to default /listas.');
          this.router.navigate(['/listas']);
        }
      },
      error: err => {
        console.log('LoginComponent: Error during login:', err);
        this.showModal = true;
        this.modalMessage = err.error?.message
          || 'Error al iniciar sesión.';
        this.app.openGlobalModal('error', this.modalMessage);
      }
    });
  }

  // Cierra el modal
  onCancel() {
    this.showModal = false;
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

    private validateAccountFromUrl(token: string): void {
    this.auth.validateAccount(token).subscribe({
      next: () => {
        // Validation successful
        const message = '¡Tu cuenta ha sido validada con éxito! Ya puedes iniciar sesión.';
        this.app.openGlobalModal('info', message, () => this.router.navigate(['/login']));
      },
      error: (err) => {
        // Validation failed
        console.error('Account validation error:', err);
        const errorMessage = err.error?.message || 'Error al validar la cuenta. El token podría haber expirado o ser inválido.';
        this.app.openGlobalModal('error', errorMessage);
      }
    });
  }
}