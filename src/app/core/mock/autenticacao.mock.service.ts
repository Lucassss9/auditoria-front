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
  /**
   * Quem está logado nesta aba. O mock não tem cookie de sessão, então o
   * estado mora aqui — e começa vazio, porque ninguém entrou ainda.
   */
  private entrou: Usuario | null = null;

  entrar(credenciais: Credenciais): Observable<Usuario> {
    const email = credenciais.email.trim().toLowerCase();
    const conta = CONTAS_DEMONSTRACAO.find((item) => item.email === email);

    if (!conta || conta.senha !== credenciais.senha) {
      return throwError(() => new Error('E-mail ou senha incorretos.'));
    }

    const { senha: _senha, ...usuario } = conta;
    this.entrou = usuario;
    return responder(usuario);
  }

  sair(): Observable<void> {
    this.entrou = null;
    return responder(undefined);
  }

  sessao(): Observable<Usuario> {
    // Sem isto o mock devolvia a primeira conta sempre, e quem ligasse
    // `usarDadosMock: true` apareceria logado sem ter entrado — e perderia a
    // tarde achando que o defeito estava no guard de rota.
    if (!this.entrou) {
      return throwError(() => new Error('Sessão não encontrada.'));
    }

    return responder(this.entrou);
  }
}
