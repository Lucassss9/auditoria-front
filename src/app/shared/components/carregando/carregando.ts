import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-carregando',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="carregando" role="status" aria-live="polite">
      <span class="carregando__roda" aria-hidden="true"></span>
      <span class="carregando__texto">{{ texto() }}</span>
    </div>
  `,
  styles: [
    `
      .carregando {
        display: flex;
        align-items: center;
        gap: var(--esp-2);
        padding: var(--esp-6) var(--esp-4);
        color: var(--texto-fraco);
        font-size: var(--t-13);
      }

      .carregando__roda {
        width: 14px;
        height: 14px;
        border: 2px solid var(--cinza-300);
        border-top-color: var(--azul-600);
        border-radius: 50%;
        animation: girar 0.7s linear infinite;
      }

      @keyframes girar {
        to {
          transform: rotate(360deg);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .carregando__roda {
          animation-duration: 2s;
        }
      }
    `,
  ],
})
export class Carregando {
  readonly texto = input('Carregando…');
}
