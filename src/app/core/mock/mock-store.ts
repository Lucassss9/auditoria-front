import { Injectable, signal } from '@angular/core';
import { Auditoria } from '../models/auditoria.model';
import { Responsavel } from '../models/equipe.model';
import { InsumoEstoque, ListaFavorita } from '../models/insumo.model';
import { gerarAuditoriasMock } from './mock-auditorias';
import { LISTAS_FAVORITAS_MOCK, RESPONSAVEIS_MOCK } from './mock-cadastros';
import { gerarEstoqueMock } from './mock-catalogo';

@Injectable({ providedIn: 'root' })
export class MockStore {
  readonly estoque = signal<InsumoEstoque[]>(gerarEstoqueMock());
  readonly auditorias = signal<Auditoria[]>([]);
  readonly responsaveis = signal<Responsavel[]>(RESPONSAVEIS_MOCK.map((item) => ({ ...item })));
  readonly listasFavoritas = signal<ListaFavorita[]>(
    LISTAS_FAVORITAS_MOCK.map((item) => ({ ...item, termos: [...item.termos] })),
  );

  constructor() {
    this.auditorias.set(gerarAuditoriasMock(this.estoque()));
  }

  substituirAuditoria(auditoria: Auditoria): Auditoria {
    this.auditorias.update((lista) =>
      lista.map((item) => (item.id === auditoria.id ? auditoria : item)),
    );
    return auditoria;
  }

  exigirAuditoria(id: string): Auditoria {
    const auditoria = this.auditorias().find((item) => item.id === id);
    if (!auditoria) {
      throw new Error(`Auditoria ${id} não encontrada`);
    }
    return auditoria;
  }
}
