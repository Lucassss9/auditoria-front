import { Routes } from '@angular/router';
import { sessaoGuard, visitanteGuard } from './core/guards/sessao.guard';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'entrar',
    title: 'Entrar',
    canActivate: [visitanteGuard],
    loadComponent: () => import('./features/entrar/entrar').then((m) => m.Entrar),
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [sessaoGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        title: 'Início',
        loadComponent: () => import('./features/inicio/inicio').then((m) => m.Inicio),
      },
      {
        path: 'auditorias',
        title: 'Auditorias',
        loadComponent: () => import('./features/auditorias/auditorias').then((m) => m.Auditorias),
      },
      {
        path: 'auditorias/nova',
        title: 'Nova auditoria',
        loadComponent: () =>
          import('./features/auditorias/nova-auditoria/nova-auditoria').then(
            (m) => m.NovaAuditoria,
          ),
      },
      {
        path: 'auditorias/:id',
        title: 'Conferência',
        loadComponent: () =>
          import('./features/auditorias/conferencia/conferencia').then((m) => m.Conferencia),
      },
      {
        path: 'auditorias/:id/relatorio',
        title: 'Relatório da auditoria',
        loadComponent: () =>
          import('./features/auditorias/relatorio/relatorio').then((m) => m.Relatorio),
      },
      {
        path: 'auditorias/:id/email',
        title: 'E-mail da auditoria',
        loadComponent: () => import('./features/auditorias/email/email').then((m) => m.Email),
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
        path: 'historico',
        title: 'Histórico',
        loadComponent: () => import('./features/historico/historico').then((m) => m.Historico),
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
