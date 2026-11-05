import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Filial, Obra, ObraResumo } from '../models/obra.model';
import { ObrasService } from '../services/obras.service';
import { FILIAIS_MOCK, OBRAS_MOCK } from './mock-cadastros';
import { MockStore } from './mock-store';
import { responder } from './responder';

@Injectable()
export class ObrasMockService extends ObrasService {
  private readonly store = inject(MockStore);

  listar(): Observable<ObraResumo[]> {
    const auditorias = this.store.auditorias();

    const resumos = OBRAS_MOCK.map((obra) => ({
      ...obra,
      filial: FILIAIS_MOCK.find((filial) => filial.id === obra.filialId) ?? null,
      totalAuditorias: auditorias.filter((auditoria) => auditoria.obraId === obra.id).length,
    }));

    return responder(resumos);
  }

  buscarPorId(id: string): Observable<ObraResumo | null> {
    const obra = OBRAS_MOCK.find((item) => item.id === id);

    if (!obra) {
      return responder(null);
    }

    return responder({
      ...obra,
      filial: FILIAIS_MOCK.find((filial) => filial.id === obra.filialId) ?? null,
      totalAuditorias: this.store.auditorias().filter((item) => item.obraId === obra.id).length,
    });
  }

  listarFiliais(): Observable<Filial[]> {
    return responder(FILIAIS_MOCK.map((item) => ({ ...item })));
  }

  listarAtivas(): Observable<Obra[]> {
    return responder(OBRAS_MOCK.filter((obra) => obra.situacao === 'ATIVA').map((obra) => ({ ...obra })));
  }
}
