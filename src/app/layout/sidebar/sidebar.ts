import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ICONES } from '../../shared/icones';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  readonly recolhida = input(false);

  protected readonly icones = ICONES;

  protected readonly principais = [
    { rota: '/inicio', rotulo: 'Início', icone: ICONES.inicio, exato: true },
    { rota: '/auditorias', rotulo: 'Auditorias', icone: ICONES.auditorias, exato: false },
    { rota: '/obras', rotulo: 'Obras', icone: ICONES.obras, exato: false },
    { rota: '/equipes', rotulo: 'Equipes', icone: ICONES.equipes, exato: false },
    { rota: '/historico', rotulo: 'Histórico', icone: ICONES.historico, exato: false },
  ];
}
