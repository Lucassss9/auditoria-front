import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TemaService } from '../../../core/services/tema.service';

@Component({
  selector: 'app-seletor-tema',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="seletor" role="group" aria-label="Tema da interface">
      @for (opcao of servico.opcoes; track opcao.valor) {
        <button
          type="button"
          class="seletor__opcao"
          [class.seletor__opcao--ativa]="servico.tema() === opcao.valor"
          [attr.aria-pressed]="servico.tema() === opcao.valor"
          (click)="servico.definir(opcao.valor)"
        >
          {{ opcao.rotulo }}
        </button>
      }
    </div>
  `,
  styles: [
    `
      .seletor {
        display: inline-flex;
        padding: 2px;
        border: 1px solid var(--borda);
        border-radius: 999px;
        background: var(--superficie-alt);
      }

      .seletor__opcao {
        padding: 2px var(--esp-2);
        border: none;
        border-radius: 999px;
        background: transparent;
        color: var(--texto-apagado);
        font-size: var(--t-11);
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
        transition:
          background var(--rapido),
          color var(--rapido);
      }

      .seletor__opcao:hover {
        color: var(--texto);
      }

      .seletor__opcao--ativa {
        background: var(--superficie);
        border: 1px solid var(--borda);
        color: var(--texto);
        box-shadow: var(--sombra-1);
      }
    `,
  ],
})
export class SeletorTema {
  protected readonly servico = inject(TemaService);
}
