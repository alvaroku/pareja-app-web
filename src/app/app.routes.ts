import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { UserRole } from './models/usuario.model';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/simple-layout/simple-layout').then(m => m.SimpleLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/landing/landing').then(m => m.Landing)
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent)
      },
      {
        path: 'solicitar-recuperacion',
        loadComponent: () => import('./pages/solicitar-recuperacion/solicitar-recuperacion').then(m => m.SolicitarRecuperacionComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./pages/reset-password/reset-password').then(m => m.ResetPasswordComponent)
      },
      {
        path: 'unauthorized',
        loadComponent: () => import('./pages/unauthorized/unauthorized').then(m => m.UnauthorizedComponent)
      },
      {
        path: '404',
        loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFoundComponent)
      }
    ]
  },
  {
    path: 'app',
    loadComponent: () => import('./layouts/menu-layout/menu-layout').then(m => m.MenuLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.SuperAdmin, UserRole.User] }
      },
      {
        path: 'citas',
        loadComponent: () => import('./pages/citas/citas').then(m => m.CitasComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.SuperAdmin, UserRole.User] }
      },
      {
        path: 'metas',
        loadComponent: () => import('./pages/metas/metas').then(m => m.MetasComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.SuperAdmin, UserRole.User] }
      },
      {
        path: 'memorias',
        loadComponent: () => import('./pages/memorias/memorias').then(m => m.MemoriasComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.SuperAdmin, UserRole.User] }
      },
      {
        path: 'perfil',
        loadComponent: () => import('./pages/perfil/perfil').then(m => m.PerfilComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.SuperAdmin, UserRole.User] }
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/usuarios/usuarios').then(m => m.UsuariosComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.SuperAdmin] }
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];
