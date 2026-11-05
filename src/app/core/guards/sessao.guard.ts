import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessaoService } from '../services/sessao.service';

export const sessaoGuard: CanActivateFn = (_rota, estado) => {
  const sessao = inject(SessaoService);
  const router = inject(Router);

  if (sessao.autenticado()) {
    return true;
  }

  return router.createUrlTree(['/entrar'], { queryParams: { destino: estado.url } });
};

export const visitanteGuard: CanActivateFn = () => {
  const sessao = inject(SessaoService);
  const router = inject(Router);

  return sessao.autenticado() ? router.createUrlTree(['/inicio']) : true;
};
