import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '../../../environments/environment';
import { ICONES } from '../../shared/icones';

@Component({
  selector: 'app-topbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  readonly recolhida = input(false);
  readonly alternar = output<void>();

  protected readonly icones = ICONES;
  protected readonly usandoMock = environment.usarDadosMock;
  protected readonly usuario = 'Auditoria de estoque';
}
