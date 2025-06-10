// src/app/auth/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot // <--- You need RouterStateSnapshot here
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.auth.isLoggedIn()) {
      return true;
    } else {
      // Store the URL the user was trying to access
      this.auth.redirectUrl = state.url; // <--- Store the URL here
      console.log('AuthGuard: User not logged in. Storing redirect URL:', state.url);
      // Redirect to the login page
      return this.router.createUrlTree(['/login']); // Use createUrlTree for better guard handling
    }
  }
}
