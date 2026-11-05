import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Responsavel } from '../models/equipe.model';
import { EquipeService } from '../services/equipe.service';

@Injectable()
export class EquipeApiService extends EquipeService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/responsaveis`;

  listar(): Observable<Responsavel[]> {
    return this.http.get<Responsavel[]>(this.base);
  }

  listarPorObra(obraId: string): Observable<Responsavel[]> {
    return this.http.get<Responsavel[]>(this.base, { params: { obra: obraId } });
  }

  salvar(responsavel: Omit<Responsavel, 'id'> & { id?: string }): Observable<Responsavel> {
    return responsavel.id
      ? this.http.put<Responsavel>(`${this.base}/${responsavel.id}`, responsavel)
      : this.http.post<Responsavel>(this.base, responsavel);
  }

  remover(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
