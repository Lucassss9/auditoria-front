import { Injectable, signal } from '@angular/core';
import { Obra } from '../models/obra.model';

@Injectable({ providedIn: 'root' })
export class ContextoService {
  readonly obraSelecionada = signal<Obra | null>(null);

  private readonly memoria = new Map<string, unknown>();

  selecionarObra(obra: Obra | null): void {
    this.obraSelecionada.set(obra);
  }

  lembrar<T>(chave: string, valor: T): void {
    this.memoria.set(chave, valor);
  }

  recuperar<T>(chave: string, padrao: T): T {
    return this.memoria.has(chave) ? (this.memoria.get(chave) as T) : padrao;
  }
}
