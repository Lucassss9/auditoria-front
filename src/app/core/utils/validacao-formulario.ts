import { Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';

export class ValidacaoFormulario {
  private readonly situacao: Signal<string>;
  private readonly tentou = signal(false);

  constructor(private readonly grupo: FormGroup) {
    this.situacao = toSignal(grupo.statusChanges, { initialValue: grupo.status });
  }

  marcarTentativa(): void {
    this.grupo.markAllAsTouched();
    this.tentou.set(true);
  }

  reiniciar(): void {
    this.tentou.set(false);
  }

  invalido(nome: string): boolean {
    this.situacao();

    const campo = this.grupo.get(nome);
    return !!campo && campo.invalid && (campo.touched || this.tentou());
  }
}
