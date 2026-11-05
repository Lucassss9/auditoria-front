import { Observable } from 'rxjs';
import {
  Auditoria,
  Comunicado,
  ItemAuditoria,
  ItemForaDoEstoque,
  NovaAuditoria,
} from '../models/auditoria.model';

export abstract class AuditoriasService {
  abstract listar(): Observable<Auditoria[]>;
  abstract buscarPorId(id: string): Observable<Auditoria | null>;
  abstract criar(dados: NovaAuditoria): Observable<Auditoria>;
  abstract atualizarItem(
    auditoriaId: string,
    itemId: string,
    mudancas: Partial<ItemAuditoria>,
  ): Observable<Auditoria>;
  abstract salvarItemForaDoEstoque(
    auditoriaId: string,
    item: Omit<ItemForaDoEstoque, 'id'> & { id?: string },
  ): Observable<Auditoria>;
  abstract removerItemForaDoEstoque(auditoriaId: string, itemId: string): Observable<Auditoria>;
  abstract concluir(auditoriaId: string): Observable<Auditoria>;
  abstract cancelar(auditoriaId: string): Observable<Auditoria>;
  abstract salvarComunicado(auditoriaId: string, comunicado: Comunicado): Observable<Auditoria>;
}
