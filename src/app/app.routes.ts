import { RouterModule, Routes } from '@angular/router';
import { Register1Component } from './register1/register1.component';
import { Login1Component } from './login1/login1.component';
import { GestionSeccionesComponent } from './gestion-secciones/gestion-secciones.component';
import { GestorListasComponent } from './gestor-listas/gestor-listas.component';
import { GestorProductosComponent } from './gestor-productos/gestor-productos.component';
import { AuthResolver } from './resolvers/auth.resolver';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ValidacionCuentaComponent } from './validacion-cuenta/validacion-cuenta.component';
import { RestablecerPasswordComponent } from './restablecer-password/restablecer-password.component';
import { EntrarListaCompartidaComponent } from './entrar-lista-compartida/entrar-lista-compartida.component';

export const routes: Routes = [
    { path: 'ValidacionCuenta', component: ValidacionCuentaComponent },
    { path: 'RestablecerPassword', component: RestablecerPasswordComponent },
    { path: 'Login', component: Login1Component },
    { path: '', redirectTo: 'Login', pathMatch: 'full' },
    { path: 'Register', component: Register1Component },
    { 
        path: 'Gestion', 
        component: GestionSeccionesComponent,
        resolve: { auth: AuthResolver },
        children: [
            { path: 'listas', 
              component: GestorListasComponent,
              resolve: { auth: AuthResolver }
            },
            { path: 'productos', 
              component: GestorProductosComponent,
              resolve: { auth: AuthResolver }
            }
        ]
    },
    { path: 'Gestion', pathMatch: 'full', redirectTo: 'Gestion/listas' },
    { path: 'gestion', pathMatch: 'full', redirectTo: 'Gestion/listas' },
    { path: 'listaCompartida/:id', component: EntrarListaCompartidaComponent, resolve: { auth: AuthResolver } },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
      { provide: LocationStrategy, useClass: HashLocationStrategy }
    ]
  })
  export class AppRoutingModule {}
