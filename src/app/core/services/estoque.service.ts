import { Observable } from 'rxjs';
import { InsumoEstoque, ListaFavorita } from '../models/insumo.model';

export abstract class EstoqueService {
  abstract buscarPorObra(obraId: string, termo: string): Observable<InsumoEstoque[]>;
  abstract listarListasFavoritas(): Observable<ListaFavorita[]>;
  abstract salvarListaFavorita(lista: Omit<ListaFavorita, 'id'>): Observable<ListaFavorita>;
  abstract removerListaFavorita(id: string): Observable<void>;
}
