import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login';
import { Posts } from './features/posts/pages/posts';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    data: { showSearch: false, showLogout: false },
  },
  {
    path: 'posts',
    component: Posts,
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'posts',
  },
];
