import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Credenciais, Usuario } from '../models/usuario.model';
import { AutenticacaoService } from '../services/autenticacao.service';

@Injectable()
export class AutenticacaoApiService extends AutenticacaoService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/auth`;

  entrar(credenciais: Credenciais): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.base}/login`, credenciais);
  }

  sair(): Observable<void> {
    return this.http.post<void>(`${this.base}/logout`, {});
  }
}
