import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginDTO } from './models/login.dto';
import { RegisterDTO } from './models/register.dto';
import { UserBasicInfoDTO } from './models/user-basic-info.dto';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiAuthUrl}`;

  constructor(private http: HttpClient) {}

  login(dto: LoginDTO): Observable<UserBasicInfoDTO> {
    return this.http
      .post<UserBasicInfoDTO>(
        `${this.apiUrl}/login`,
        dto,
        { observe: 'response' }
      )
      .pipe(
        tap(resp => {
          const header = resp.headers.get('Authorization');
          if (header) {
            localStorage.setItem('auth_token', header.replace('Bearer ', ''));
          }
        }),
        map(resp => resp.body!)
      );
  }

  /** Devuelve true si hay un token (y opcionalmente no expirado) */
  isLoggedIn(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;
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

  logout(): void {
    localStorage.removeItem('auth_token');
  }
}