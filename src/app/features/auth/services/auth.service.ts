import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
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
  private readonly baseUrl = 'http://localhost:3000';
  private readonly storageKey = 'authSession';

  login(credentials: LoginData): Observable<AuthResponse> {
    return this.http.get<User[]>(`${this.baseUrl}/users`).pipe(
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
      tap((response) => {
        if (response.success && response.token && response.user) {
          localStorage.setItem(this.storageKey, JSON.stringify({ token: response.token, user: response.user }));
        }
      }),
      catchError(() =>
        of({
          success: false,
          message: 'Error al intentar iniciar sesión.',
        }),
      ),
    );
  }

  getSession(): AuthResponse | null {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as { token: string; user: User };
    return {
      success: true,
      token: parsed.token,
      user: parsed.user,
    };
  }

  isLoggedIn(): boolean {
    return !!this.getSession()?.token;
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }
}
