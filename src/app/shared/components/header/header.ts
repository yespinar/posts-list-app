import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, FormsModule, FloatLabelModule, InputTextModule, SelectButtonModule, TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly title = 'PostsListApp';
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  search = '';

  languageOptions = [
    { label: 'ES', value: 'es' },
    { label: 'EN', value: 'en' },
  ];
  languageSelected = signal('es');

  onLanguageChange(language: string): void {
    this.languageSelected.set(language);
    this.translateService.use(language);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
