import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginDTO } from './models/login.dto';
import { RegisterDTO } from './models/register.dto';
import { UserBasicInfoDTO } from './models/user-basic-info.dto';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiAuthUrl}`;
  
  public redirectUrl: string | null = null;
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {}

  login(dto: LoginDTO): Observable<UserBasicInfoDTO> {
    return this.http
      .post<UserBasicInfoDTO>(
        `${this.apiUrl}/login`,
        dto,
        { observe: 'response' }
      )
      .pipe(
        tap(resp => {
          // 1) Mira todo el objeto resp para confirmar que headers está bien
          console.log('[AuthService] full response:', resp);

          // 2) Extrae el header Authorization
          const header = resp.headers.get('Authorization');
          console.log('[AuthService] Authorization header:', header);

          if (header) {
            const rawToken = header.replace('Bearer ', '');
            console.log('[AuthService] rawToken to save:', rawToken);

            // 3) Guarda en localStorage
            localStorage.setItem('auth_token', rawToken);
            console.log('[AuthService] after setItem, storage value:',
                        localStorage.getItem('auth_token'));
          } else {
            console.warn('[AuthService] no Authorization header, skipping storage');
          }
        }),
        map(resp => resp.body!)
      );
  }


  /** Devuelve true si hay token en browser; en server siempre false */
  isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    const raw = localStorage.getItem('auth_token');
    if (!raw) return false;
    try {
      const payload = JSON.parse(atob(raw.split('.')[1]));
      return payload.exp && payload.exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }

  register(dto: RegisterDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, dto);
  }

  sendRecoveryEmail(email: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/recuperarPassword`,
      { email }
    );
  }

  validateAccount(token: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/validarCuenta`,
      { token: token },
      { observe: 'response' }
    ).pipe(
      tap(resp => {
      // Solo intenta acceder a localStorage si estamos en el navegador
        if (isPlatformBrowser(this.platformId)) {
          const header = resp.headers.get('Authorization');
          if (header) {
            const rawToken = header.replace('Bearer ', '');
            localStorage.setItem('auth_token', rawToken);
            console.log('Account validated and new token saved:', rawToken);
          } else {
            console.warn('No Authorization header received after account validation.');
          }
        } else {
          console.log('Running on server, skipping localStorage for account validation.');
        }
      }),
      map(() => void 0)
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
    }
  }
}