import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InsumoEstoque, ListaFavorita } from '../models/insumo.model';
import { EstoqueService } from '../services/estoque.service';
import { contemTermo, novoId } from '../utils/texto';
import { MockStore } from './mock-store';
import { responder } from './responder';

@Injectable()
export class EstoqueMockService extends EstoqueService {
  private readonly store = inject(MockStore);

  buscarPorObra(obraId: string, termo: string): Observable<InsumoEstoque[]> {
    const daObra = this.store.estoque().filter((item) => item.obraId === obraId);
    const limpo = termo.trim();

    const encontrados = limpo
      ? daObra.filter(
          (item) => contemTermo(item.descricao, limpo) || item.codigo.includes(limpo),
        )
      : daObra;

    return responder(
      [...encontrados].sort((a, b) => a.descricao.localeCompare(b.descricao, 'pt-BR')),
    );
  }

  listarListasFavoritas(): Observable<ListaFavorita[]> {
    return responder(this.store.listasFavoritas().map((item) => ({ ...item, termos: [...item.termos] })));
  }

  salvarListaFavorita(lista: Omit<ListaFavorita, 'id'>): Observable<ListaFavorita> {
    const nova: ListaFavorita = { ...lista, id: novoId('lf') };
    this.store.listasFavoritas.update((atuais) => [...atuais, nova]);
    return responder(nova);
  }

  removerListaFavorita(id: string): Observable<void> {
    this.store.listasFavoritas.update((atuais) => atuais.filter((item) => item.id !== id));
    return responder(undefined);
  }
}
