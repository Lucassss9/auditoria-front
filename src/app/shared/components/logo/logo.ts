import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="logo" [class.logo--compacta]="!comTexto()">
      <svg
        class="logo__marca"
        [attr.width]="tamanho()"
        [attr.height]="tamanho()"
        viewBox="0 0 32 32"
        fill="none"
        role="img"
        [attr.aria-label]="comTexto() ? null : 'Contagem'"
        [attr.aria-hidden]="comTexto() ? 'true' : null"
      >
        <rect class="logo__caixa" x="1" y="1" width="30" height="30" rx="8" />
        <g
          class="logo__riscos"
          stroke-width="2.6"
          stroke-linecap="round"
          vector-effect="non-scaling-stroke"
        >
          <path d="M10 9.5V22.5" />
          <path d="M16 9.5V22.5" />
          <path d="M22 9.5V22.5" />
        </g>
        <path
          class="logo__corte"
          d="M7 23.5L25 8.5"
          stroke-width="2.6"
          stroke-linecap="round"
        />
      </svg>

      @if (comTexto()) {
        <span class="logo__texto">
          <span class="logo__nome">Contagem</span>
          <span class="logo__assinatura">auditoria de estoque</span>
        </span>
      }
    </span>
  `,
  styles: [
    `
      .logo {
        display: inline-flex;
        align-items: center;
        gap: var(--esp-3);
        min-width: 0;
      }

      .logo__marca {
        flex: 0 0 auto;
        display: block;
      }

      .logo__caixa {
        fill: var(--logo-caixa, transparent);
        stroke: var(--logo-contorno, transparent);
        stroke-width: 1.5;
      }

      .logo__riscos {
        stroke: var(--logo-riscos, var(--acao));
      }

      .logo__corte {
        stroke: var(--logo-corte, var(--realce));
      }

      .logo__texto {
        display: flex;
        flex-direction: column;
        line-height: 1.1;
        min-width: 0;
      }

      .logo__nome {
        font-size: var(--t-15);
        font-weight: 600;
        letter-spacing: -0.02em;
        color: var(--logo-nome, var(--texto));
        white-space: nowrap;
      }

      .logo__assinatura {
        font-family: var(--fonte-num);
        font-size: 9px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--logo-assinatura, var(--texto-apagado));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `,
  ],
})
export class Logo {
  readonly tamanho = input(30);
  readonly comTexto = input(true);
}
