import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { ModalAdvertenciaComponent } from './modal-advertencia/modal-advertencia.component';
import { StripeService } from './stripe.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    ModalAdvertenciaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  globalModalShow = false;
  globalModalType: 'error'|'info'|'confirmación' = 'info';
  globalModalMessage = '';

  public globalConfirmHandler: () => void = () => this.closeGlobalModal();

  constructor(
    private stripe: StripeService,
    private auth: AuthService,
    private router: Router
  ) {}

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  /** 
   * Abre el modal con un tipo, mensaje y callback personalizado
   * @param type  'error'|'info'|'confirmación'
   * @param msg   Texto a mostrar
   * @param onConfirm  Función que se ejecuta al aceptar
   */
  openGlobalModal(
    type: 'error'|'info'|'confirmación',
    msg: string,
    onConfirm: () => void = () => this.closeGlobalModal()
  ) {
    this.globalModalType = type;
    this.globalModalMessage = msg;
    this.globalConfirmHandler = () => {
      onConfirm();
      this.closeGlobalModal();
    };
    this.globalModalShow = true;
  }

  // Cierra el modal global
  closeGlobalModal() {
    this.globalModalShow = false;
  }

  // Ejemplo de logout con confirmación
  promptLogout() {
    this.openGlobalModal(
      'confirmación',
      '¿Estás seguro de que quieres cerrar sesión?',
      () => {
        this.auth.logout();
        this.router.navigate(['/login']);
      }
    );
  }

  // Ejemplo de premium
  promptUpgrade() {
    this.openGlobalModal(
      'confirmación',
      '¿Deseas pasarte a Premium ahora?',
      () => this.stripe.createCheckoutSession().subscribe()
    );
  }

  confirmarLogout() {
    this.auth.logout();
    this.closeGlobalModal();
    this.router.navigate(['/login']);
  }
}