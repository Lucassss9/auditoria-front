import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Filial, Obra, ObraResumo } from '../models/obra.model';
import { ObrasService } from '../services/obras.service';

@Injectable()
export class ObrasApiService extends ObrasService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/obras`;

  listar(): Observable<ObraResumo[]> {
    return this.http.get<ObraResumo[]>(this.base);
  }

  buscarPorId(id: string): Observable<ObraResumo | null> {
    return this.http.get<ObraResumo | null>(`${this.base}/${id}`);
  }

  listarFiliais(): Observable<Filial[]> {
    return this.http.get<Filial[]>(`${environment.apiBaseUrl}/filiais`);
  }

  listarAtivas(): Observable<Obra[]> {
    return this.http.get<Obra[]>(this.base, { params: { situacao: 'ATIVA' } });
  }
}
