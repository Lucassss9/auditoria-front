import { Provider } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuditoriasApiService } from './api/auditorias.api.service';
import { EquipeApiService } from './api/equipe.api.service';
import { EstoqueApiService } from './api/estoque.api.service';
import { ObrasApiService } from './api/obras.api.service';
import { AuditoriasMockService } from './mock/auditorias.mock.service';
import { EquipeMockService } from './mock/equipe.mock.service';
import { EstoqueMockService } from './mock/estoque.mock.service';
import { ObrasMockService } from './mock/obras.mock.service';
import { AuditoriasService } from './services/auditorias.service';
import { EquipeService } from './services/equipe.service';
import { EstoqueService } from './services/estoque.service';
import { ObrasService } from './services/obras.service';

export function fornecerDados(): Provider[] {
  if (environment.usarDadosMock) {
    return [
      { provide: ObrasService, useClass: ObrasMockService },
      { provide: EstoqueService, useClass: EstoqueMockService },
      { provide: EquipeService, useClass: EquipeMockService },
      { provide: AuditoriasService, useClass: AuditoriasMockService },
    ];
  }

  return [
    { provide: ObrasService, useClass: ObrasApiService },
    { provide: EstoqueService, useClass: EstoqueApiService },
    { provide: EquipeService, useClass: EquipeApiService },
    { provide: AuditoriasService, useClass: AuditoriasApiService },
  ];
}
