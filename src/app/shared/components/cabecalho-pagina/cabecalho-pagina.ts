import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface PassoTrilha {
  rotulo: string;
  rota?: string | unknown[];
}

@Component({
  selector: 'app-cabecalho-pagina',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './cabecalho-pagina.html',
  styleUrl: './cabecalho-pagina.scss',
})
export class CabecalhoPagina {
  readonly titulo = input.required<string>();
  readonly descricao = input('');
  readonly trilha = input<PassoTrilha[]>([]);
}
