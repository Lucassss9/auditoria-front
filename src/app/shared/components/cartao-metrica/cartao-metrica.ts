import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type TomMetrica = 'neutro' | 'info' | 'ok' | 'atencao' | 'erro';

@Component({
  selector: 'app-cartao-metrica',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="metrica">
      <span class="metrica__rotulo">{{ rotulo() }}</span>
      <strong class="metrica__valor metrica__valor--{{ tom() }}">{{ valor() }}</strong>
      @if (detalhe()) {
        <span class="metrica__detalhe">{{ detalhe() }}</span>
      }
    </div>
  `,
  styles: [
    `
      .metrica {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: var(--esp-3) var(--esp-4);
        background: var(--superficie);
        border: 1px solid var(--borda);
        border-radius: var(--raio-g);
      }

      .metrica__rotulo {
        font-size: var(--t-12);
        color: var(--texto-fraco);
      }

      .metrica__valor {
        font-size: var(--t-22);
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        line-height: 1.2;
      }

      .metrica__valor--info {
        color: var(--azul-600);
      }

      .metrica__valor--ok {
        color: var(--verde-700);
      }

      .metrica__valor--atencao {
        color: var(--ambar-700);
      }

      .metrica__valor--erro {
        color: var(--vermelho-700);
      }

      .metrica__detalhe {
        font-size: var(--t-12);
        color: var(--texto-apagado);
      }
    `,
  ],
})
export class CartaoMetrica {
  readonly rotulo = input.required<string>();
  readonly valor = input.required<string | number>();
  readonly detalhe = input('');
  readonly tom = input<TomMetrica>('neutro');
}
