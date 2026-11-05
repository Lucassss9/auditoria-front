import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InsumoEstoque, ListaFavorita } from '../models/insumo.model';
import { EstoqueService } from '../services/estoque.service';

@Injectable()
export class EstoqueApiService extends EstoqueService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/estoque`;

  buscarPorObra(obraId: string, termo: string): Observable<InsumoEstoque[]> {
    return this.http.get<InsumoEstoque[]>(this.base, { params: { obra: obraId, termo } });
  }

  listarListasFavoritas(): Observable<ListaFavorita[]> {
    return this.http.get<ListaFavorita[]>(`${environment.apiBaseUrl}/listas-favoritas`);
  }

  salvarListaFavorita(lista: Omit<ListaFavorita, 'id'>): Observable<ListaFavorita> {
    return this.http.post<ListaFavorita>(`${environment.apiBaseUrl}/listas-favoritas`, lista);
  }

  removerListaFavorita(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/listas-favoritas/${id}`);
  }
}
