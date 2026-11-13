import { Observable } from 'rxjs';
import { Credenciais, Usuario } from '../models/usuario.model';

export abstract class AutenticacaoService {
  abstract entrar(credenciais: Credenciais): Observable<Usuario>;
  abstract sair(): Observable<void>;
  abstract sessao(): Observable<Usuario>;
}
