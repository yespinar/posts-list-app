import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login';
import { PostsList } from './features/posts/pages/posts-list/posts-list';
import { PostNew } from './features/posts/pages/post-new/post-new';
import { authGuard } from './features/auth/guards/auth.guard';
import { PostDetail } from './features/posts/pages/post-detail/post-detail';

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
    path: 'posts/new',
    component: PostNew,
    canActivate: [authGuard],
  },
  {
    path: 'post/:id',
    component: PostDetail,
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
