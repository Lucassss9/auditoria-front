import { Observable } from 'rxjs';
import { FiltroEstoque, InsumoEstoque, ListaFavorita } from '../models/insumo.model';

export abstract class EstoqueService {
  abstract buscarPorObra(obraId: string, filtro: FiltroEstoque): Observable<InsumoEstoque[]>;
  abstract listarCategorias(obraId: string): Observable<string[]>;
  abstract listarListasFavoritas(): Observable<ListaFavorita[]>;
  abstract salvarListaFavorita(lista: Omit<ListaFavorita, 'id'>): Observable<ListaFavorita>;
  abstract removerListaFavorita(id: string): Observable<void>;
}
