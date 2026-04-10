import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { LoginData } from '../interfaces/login-data';
import { User } from '../interfaces/user';

export interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
  user?: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authUrl = 'http://localhost:3000';

  login(credentials: LoginData): Observable<AuthResponse> {
    return this.http.get<User[]>(`${this.authUrl}/users`).pipe(
      map((users) => {
        const user = users.find((u) => u.name === credentials.user && u.password === credentials.password);

        if (!user) {
          return {
            success: false,
            message: 'Credenciales incorrectas.',
          };
        }

        return {
          success: true,
          token: 'fake-jwt-token',
          user,
        };
      }),
      catchError(() =>
        of({
          success: false,
          message: 'Error al intentar iniciar sesión.',
        })
      )
    );
  }
}
