import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    data: { showSearch: false, showLogout: false },
  },
  {
    path: 'posts',
    loadChildren: () => import('./features/posts/posts.routes').then((m) => m.POSTS_ROUTES),
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
