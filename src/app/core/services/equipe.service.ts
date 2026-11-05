import { Observable } from 'rxjs';
import { Responsavel } from '../models/equipe.model';

export abstract class EquipeService {
  abstract listar(): Observable<Responsavel[]>;
  abstract listarPorObra(obraId: string): Observable<Responsavel[]>;
  abstract salvar(responsavel: Omit<Responsavel, 'id'> & { id?: string }): Observable<Responsavel>;
  abstract remover(id: string): Observable<void>;
}
