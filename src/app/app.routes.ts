import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'painel' },
      {
        path: 'painel',
        title: 'Visão geral',
        loadComponent: () => import('./features/painel/painel').then((m) => m.Painel),
      },
      {
        path: 'obras',
        title: 'Obras',
        loadComponent: () => import('./features/obras/obras').then((m) => m.Obras),
      },
      {
        path: 'obras/:id',
        title: 'Detalhe da obra',
        loadComponent: () =>
          import('./features/obras/obra-detalhe/obra-detalhe').then((m) => m.ObraDetalhe),
      },
      {
        path: 'equipes',
        title: 'Equipes',
        loadComponent: () => import('./features/equipes/equipes').then((m) => m.Equipes),
      },
      {
        path: 'configuracoes',
        title: 'Configurações',
        loadComponent: () =>
          import('./features/configuracoes/configuracoes').then((m) => m.Configuracoes),
      },
      {
        path: '**',
        title: 'Página não encontrada',
        loadComponent: () =>
          import('./features/nao-encontrada/nao-encontrada').then((m) => m.NaoEncontrada),
      },
    ],
  },
];
