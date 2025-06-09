import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { EntrarListaCompartidaComponent } from './entrar-lista-compartida/entrar-lista-compartida.component';
import { GestionSeccionesComponent } from './gestion-secciones/gestion-secciones.component';
import { GestorListasComponent } from './gestor-listas/gestor-listas.component';
import { GestorProductosComponent } from './gestor-productos/gestor-productos.component';
import { RestablecerPasswordComponent } from './restablecer-password/restablecer-password.component';
import { ValidacionCuentaComponent } from './validacion-cuenta/validacion-cuenta.component';

export const routes: Routes = [
    { path: 'ValidacionCuenta', component: ValidacionCuentaComponent },
    { path: 'RestablecerPassword', component: RestablecerPasswordComponent },
    { path: 'Login', component: LoginComponent },
    { path: '', redirectTo: 'Login', pathMatch: 'full' },
    { path: 'Register', component: RegisterComponent },
    {
      path: 'Gestion',
      component: GestionSeccionesComponent,
      canActivate: [AuthGuard],
      children: [
        {
          path: 'listas',
          component: GestorListasComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'productos',
          component: GestorProductosComponent,
          canActivate: [AuthGuard]
        }
      ]
    },
    { 
      path: 'listaCompartida/:id', 
      component: EntrarListaCompartidaComponent,
      canActivate: [AuthGuard]
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
      { provide: LocationStrategy, useClass: HashLocationStrategy }
    ]
  })
  export class AppRoutingModule {}
