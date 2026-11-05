import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type TipoSelo = 'neutro' | 'info' | 'ok' | 'atencao' | 'erro';

@Component({
  selector: 'app-selo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="selo selo--{{ tipo() }}"><ng-content /></span>`,
})
export class Selo {
  readonly tipo = input<TipoSelo>('neutro');
}
