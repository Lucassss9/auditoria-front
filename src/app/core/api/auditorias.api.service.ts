import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Auditoria,
  Comunicado,
  ContagemItem,
  ItemForaDoEstoque,
  NovaAuditoria,
} from '../models/auditoria.model';
import { AuditoriasService } from '../services/auditorias.service';

@Injectable()
export class AuditoriasApiService extends AuditoriasService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/auditorias`;

  listar(): Observable<Auditoria[]> {
    return this.http.get<Auditoria[]>(this.base);
  }

  buscarPorId(id: string): Observable<Auditoria | null> {
    return this.http.get<Auditoria | null>(`${this.base}/${id}`);
  }

  criar(dados: NovaAuditoria): Observable<Auditoria> {
    return this.http.post<Auditoria>(this.base, dados);
  }

  atualizarItem(
    auditoriaId: string,
    itemId: string,
    contagem: ContagemItem,
  ): Observable<Auditoria> {
    return this.http.patch<Auditoria>(`${this.base}/${auditoriaId}/itens/${itemId}`, contagem);
  }

  salvarItemForaDoEstoque(
    auditoriaId: string,
    item: Omit<ItemForaDoEstoque, 'id'> & { id?: string },
  ): Observable<Auditoria> {
    return item.id
      ? this.http.put<Auditoria>(`${this.base}/${auditoriaId}/fora-do-estoque/${item.id}`, item)
      : this.http.post<Auditoria>(`${this.base}/${auditoriaId}/fora-do-estoque`, item);
  }

  removerItemForaDoEstoque(auditoriaId: string, itemId: string): Observable<Auditoria> {
    return this.http.delete<Auditoria>(`${this.base}/${auditoriaId}/fora-do-estoque/${itemId}`);
  }

  concluir(auditoriaId: string): Observable<Auditoria> {
    return this.http.post<Auditoria>(`${this.base}/${auditoriaId}/concluir`, {});
  }

  cancelar(auditoriaId: string): Observable<Auditoria> {
    return this.http.post<Auditoria>(`${this.base}/${auditoriaId}/cancelar`, {});
  }

  anexarEvidencia(auditoriaId: string, itemId: string, arquivo: File): Observable<Auditoria> {
    const corpo = new FormData();
    corpo.append('arquivo', arquivo);

    return this.http.post<Auditoria>(
      `${this.base}/${auditoriaId}/itens/${itemId}/evidencias`,
      corpo,
    );
  }

  removerEvidencia(auditoriaId: string, evidenciaId: string): Observable<Auditoria> {
    return this.http.delete<Auditoria>(
      `${this.base}/${auditoriaId}/evidencias/${evidenciaId}`,
    );
  }

  salvarComunicado(auditoriaId: string, comunicado: Comunicado): Observable<Auditoria> {
    return this.http.put<Auditoria>(`${this.base}/${auditoriaId}/comunicado`, comunicado);
  }
}
