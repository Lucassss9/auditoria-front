import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Responsavel } from '../models/equipe.model';
import { EquipeService } from '../services/equipe.service';
import { novoId } from '../utils/texto';
import { MockStore } from './mock-store';
import { responder } from './responder';

@Injectable()
export class EquipeMockService extends EquipeService {
  private readonly store = inject(MockStore);

  listar(): Observable<Responsavel[]> {
    return responder(this.store.responsaveis().map((item) => ({ ...item })));
  }

  listarPorObra(obraId: string): Observable<Responsavel[]> {
    return responder(
      this.store
        .responsaveis()
        .filter((item) => item.obraId === obraId)
        .map((item) => ({ ...item })),
    );
  }

  salvar(responsavel: Omit<Responsavel, 'id'> & { id?: string }): Observable<Responsavel> {
    const salvo: Responsavel = { ...responsavel, id: responsavel.id ?? novoId('r') };

    this.store.responsaveis.update((atuais) =>
      atuais.some((item) => item.id === salvo.id)
        ? atuais.map((item) => (item.id === salvo.id ? salvo : item))
        : [...atuais, salvo],
    );

    return responder(salvo);
  }

  remover(id: string): Observable<void> {
    this.store.responsaveis.update((atuais) => atuais.filter((item) => item.id !== id));
    return responder(undefined);
  }
}
