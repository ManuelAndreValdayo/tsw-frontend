import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { UserService } from '../user.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthResolver implements Resolve<boolean> {
  constructor(private userService: UserService, private router: Router) {}

  resolve(): Observable<boolean> {
    return this.userService.checkCookie().pipe(
      map((response: any) => {
        console.log(response);
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
