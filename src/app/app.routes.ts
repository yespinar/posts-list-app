import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    data: { showSearch: false, showLogout: false },
  },
];
