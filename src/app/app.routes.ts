import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login';
import { PostsList } from './features/posts/pages/posts-list/posts-list';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    data: { showSearch: false, showLogout: false },
  },
  {
    path: 'posts',
    component: PostsList,
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
