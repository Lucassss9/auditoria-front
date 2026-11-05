import { Injectable, effect, signal } from '@angular/core';

const CHAVE = 'auditoria-estoque:preferencias';

export interface Preferencias {
  prazoPadraoDias: number;
  responsavelPadrao: string;
  mostrarValoresNaConferencia: boolean;
}

const PADRAO: Preferencias = {
  prazoPadraoDias: 10,
  responsavelPadrao: '',
  mostrarValoresNaConferencia: true,
};

@Injectable({ providedIn: 'root' })
export class PreferenciasService {
  private readonly interno = signal<Preferencias>(this.ler());

  readonly valores = this.interno.asReadonly();

  constructor() {
    effect(() => {
      const atual = this.interno();
      try {
        localStorage.setItem(CHAVE, JSON.stringify(atual));
      } catch {
        return;
      }
    });
  }

  atualizar(mudancas: Partial<Preferencias>): void {
    this.interno.update((atual) => ({ ...atual, ...mudancas }));
  }

  restaurarPadrao(): void {
    this.interno.set({ ...PADRAO });
  }

  private ler(): Preferencias {
    try {
      const bruto = localStorage.getItem(CHAVE);
      return bruto ? { ...PADRAO, ...(JSON.parse(bruto) as Partial<Preferencias>) } : { ...PADRAO };
    } catch {
      return { ...PADRAO };
    }
  }
}
