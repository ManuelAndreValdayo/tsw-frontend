import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { GestorProductosComponent } from './gestor-productos/gestor-productos.component';
import { GestorListasComponent } from './list/gestor-listas/gestor-listas.component';
import { InvitationViewComponent } from './list/invitation-view/invitation-view.component';
import { RestablecerPasswordComponent } from './restablecer-password/restablecer-password.component';

export const routes: Routes = [
    { path: 'restablecerPassword', component: RestablecerPasswordComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
      path: 'listas',
      component: GestorListasComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'productos',
      component: GestorProductosComponent,
      canActivate: [AuthGuard]
    },
    { 
      path: 'invitaciones/:invToken', 
      component: InvitationViewComponent,
      canActivate: [AuthGuard]
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
      { provide: LocationStrategy, useClass: HashLocationStrategy }
    ]
  })
  export class AppRoutingModule {}
