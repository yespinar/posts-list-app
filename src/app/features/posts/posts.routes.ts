import { Routes } from '@angular/router';
import { authGuard } from '../auth/guards/auth.guard';
import { PostDetail } from './pages/post-detail/post-detail';
import { PostNew } from './pages/post-new/post-new';
import { PostsList } from './pages/posts-list/posts-list';

export const POSTS_ROUTES: Routes = [
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        component: PostsList,
      },
      {
        path: 'new',
        component: PostNew,
      },
      {
        path: ':id',
        component: PostDetail,
      },
    ],
  },
];