import { signal, Signal } from '@angular/core';
import { Observable } from 'rxjs';

export interface EstadoRequisicao<T> {
  carregando: boolean;
  erro: string | null;
  dados: T | null;
}

export class Requisicao<T> {
  private readonly interno = signal<EstadoRequisicao<T>>({
    carregando: true,
    erro: null,
    dados: null,
  });

  readonly estado: Signal<EstadoRequisicao<T>> = this.interno.asReadonly();

  constructor(private readonly fonte: () => Observable<T>) {
    this.executar();
  }

  executar(): void {
    this.interno.update((atual) => ({ ...atual, carregando: true, erro: null }));

    this.fonte().subscribe({
      next: (dados) => this.interno.set({ carregando: false, erro: null, dados }),
      error: (erro: unknown) =>
        this.interno.set({
          carregando: false,
          erro: erro instanceof Error ? erro.message : 'Falha na comunicação com o servidor',
          dados: null,
        }),
    });
  }

  definir(dados: T): void {
    this.interno.set({ carregando: false, erro: null, dados });
  }
}
