import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../user.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthResolver implements Resolve<boolean> {
  constructor(private userService: UserService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let url = state.url.split('/')
    if(url[1] == 'listaCompartida'){
      if(url.length > 2){
        sessionStorage.setItem('tokenListaCompartida', url[2]);
      }
    }else{
      if(sessionStorage.getItem('tokenListaCompartida') != undefined){
        sessionStorage.removeItem('tokenListaCompartida');
      }
    }
    return this.userService.checkLogin().pipe(
      map((response: any) => {
        if (response != "") {
          return true;
        } else {
          this.router.navigate(['/Login']); // Redirigir si no está logueado
          return false;
        }
      }),
      catchError((error: any) => {
        this.router.navigate(['/Login']); // Redirigir si no está logueado
        return of(false);
      })
    );
  }
  resolve2(): Observable<boolean> {
    console.log("Resolviendo autenticación");
    return of(true);
  }
}
