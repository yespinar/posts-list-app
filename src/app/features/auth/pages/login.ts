import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { LoginData } from '../interfaces/login-data';
import { AuthService } from '../services/auth.service';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [FormField, CardModule, InputTextModule, FloatLabelModule, ButtonModule, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginModel = signal<LoginData>({
    user: '',
    password: '',
  });
  loginForm = form(this.loginModel);

  onSubmit(): void {
    this.errorMessage.set(null);

    const credentials = this.loginModel();

    if (!credentials.user.trim() || !credentials.password.trim()) {
      this.errorMessage.set('Por favor, rellena todos los campos.');
      return;
    }

    this.isLoading.set(true);

    this.authService.login(credentials).subscribe({
      next: ({ success, message }) => {
        this.isLoading.set(false);
        if (!success) {
          this.errorMessage.set(message ?? 'Credenciales incorrectas.');
          return;
        }

        this.router.navigateByUrl('/posts');
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Error al conectar con el servidor.');
      },
    });
  }
}
