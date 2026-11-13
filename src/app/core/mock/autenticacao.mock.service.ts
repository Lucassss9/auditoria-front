import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Credenciais, Usuario } from '../models/usuario.model';
import { AutenticacaoService } from '../services/autenticacao.service';
import { responder } from './responder';

interface ContaDemonstracao extends Usuario {
  senha: string;
}

export const CONTAS_DEMONSTRACAO: ContaDemonstracao[] = [
  {
    id: 'u1',
    nome: 'Davi Ferreira',
    email: 'auditor@exemplo.com.br',
    cargo: 'Auditor de estoque',
    senha: 'demo1234',
  },
  {
    id: 'u2',
    nome: 'Regina Paes',
    email: 'coordenacao@exemplo.com.br',
    cargo: 'Coordenação de suprimentos',
    senha: 'demo1234',
  },
];

@Injectable()
export class AutenticacaoMockService extends AutenticacaoService {
  entrar(credenciais: Credenciais): Observable<Usuario> {
    const email = credenciais.email.trim().toLowerCase();
    const conta = CONTAS_DEMONSTRACAO.find((item) => item.email === email);

    if (!conta || conta.senha !== credenciais.senha) {
      return throwError(() => new Error('E-mail ou senha incorretos.'));
    }

    const { senha: _senha, ...usuario } = conta;
    return responder(usuario);
  }

  sair(): Observable<void> {
    return responder(undefined);
  }

  sessao(): Observable<Usuario> {
    const usuario = CONTAS_DEMONSTRACAO[0];
    const { senha: _senha, ...usuarioSemSenha } = usuario;
    return responder(usuarioSemSenha);
  }
}
