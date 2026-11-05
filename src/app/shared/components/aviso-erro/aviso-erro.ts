import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ICONES } from '../../icones';

@Component({
  selector: 'app-aviso-erro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  templateUrl: './aviso-erro.html',
  styleUrl: './aviso-erro.scss',
})
export class AvisoErro {
  readonly titulo = input('Não foi possível carregar os dados');
  readonly detalhe = input('');
  readonly mostrarTentarNovamente = input(true);
  readonly tentarNovamente = output<void>();
  protected readonly icones = ICONES;
}
