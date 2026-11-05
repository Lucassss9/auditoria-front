import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { PreferenciasService } from '../../core/services/preferencias.service';
import { CabecalhoPagina } from '../../shared/components/cabecalho-pagina/cabecalho-pagina';

@Component({
  selector: 'app-configuracoes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CabecalhoPagina],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.scss',
})
export class Configuracoes {
  private readonly preferencias = inject(PreferenciasService);

  protected readonly valores = this.preferencias.valores;
  protected readonly ambiente = environment;

  protected definirPrazo(valor: string): void {
    const dias = Number(valor);

    if (Number.isFinite(dias) && dias >= 1 && dias <= 90) {
      this.preferencias.atualizar({ prazoPadraoDias: Math.round(dias) });
    }
  }

  protected definirResponsavel(valor: string): void {
    this.preferencias.atualizar({ responsavelPadrao: valor });
  }

  protected definirMostrarValores(valor: boolean): void {
    this.preferencias.atualizar({ mostrarValoresNaConferencia: valor });
  }

  protected restaurar(): void {
    this.preferencias.restaurarPadrao();
  }
}
