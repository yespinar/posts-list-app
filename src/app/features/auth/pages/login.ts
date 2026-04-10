import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { LoginData } from '../interfaces/login-data';
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
  loginModel = signal<LoginData>({
    user: '',
    password: '',
  });

  loginForm = form(this.loginModel);
}
