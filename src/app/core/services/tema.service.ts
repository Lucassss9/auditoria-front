import { Injectable, effect, signal } from '@angular/core';

export type Tema = 'claro' | 'escuro' | 'sistema';

const CHAVE = 'auditoria-estoque:tema';

@Injectable({ providedIn: 'root' })
export class TemaService {
  readonly tema = signal<Tema>(this.ler());

  readonly opcoes: ReadonlyArray<{ valor: Tema; rotulo: string }> = [
    { valor: 'claro', rotulo: 'Claro' },
    { valor: 'escuro', rotulo: 'Escuro' },
    { valor: 'sistema', rotulo: 'Sistema' },
  ];

  constructor() {
    effect(() => this.aplicar(this.tema()));
  }

  definir(tema: Tema): void {
    this.tema.set(tema);

    try {
      localStorage.setItem(CHAVE, tema);
    } catch {
      return;
    }
  }

  private aplicar(tema: Tema): void {
    const raiz = document.documentElement;

    if (tema === 'sistema') {
      raiz.removeAttribute('data-tema');
      return;
    }

    raiz.setAttribute('data-tema', tema);
  }

  private ler(): Tema {
    try {
      const salvo = localStorage.getItem(CHAVE);
      return salvo === 'claro' || salvo === 'escuro' ? salvo : 'sistema';
    } catch {
      return 'sistema';
    }
  }
}
