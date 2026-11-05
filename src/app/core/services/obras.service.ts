import { Observable } from 'rxjs';
import { Filial, Obra, ObraResumo } from '../models/obra.model';

export abstract class ObrasService {
  abstract listar(): Observable<ObraResumo[]>;
  abstract buscarPorId(id: string): Observable<ObraResumo | null>;
  abstract listarFiliais(): Observable<Filial[]>;
  abstract listarAtivas(): Observable<Obra[]>;
}
