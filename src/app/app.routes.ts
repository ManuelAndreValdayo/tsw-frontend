import { RouterModule, Routes } from '@angular/router';
import { Register1Component } from './register1/register1.component';
import { Login1Component } from './login1/login1.component';
import { GestionSeccionesComponent } from './gestion-secciones/gestion-secciones.component';
import { GestorListasComponent } from './gestor-listas/gestor-listas.component';
import { GestorProductosComponent } from './gestor-productos/gestor-productos.component';
import {GestorListaCompartidaComponent} from './gestor-lista-compartida/gestor-lista-compartida.component';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export const routes: Routes = [
    { path: 'Login', component: Login1Component },
    { path: 'Register', component: Register1Component },
    { 
        path: 'Gestion', component: GestionSeccionesComponent,
        children: [
            { path: 'listas', component: GestorListasComponent},
            { path: 'productos', component: GestorProductosComponent}
        ]
    },
    { path: 'listaCompartida/:id', component: GestorListaCompartidaComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
      { provide: LocationStrategy, useClass: HashLocationStrategy }
    ]
  })
  export class AppRoutingModule {}
