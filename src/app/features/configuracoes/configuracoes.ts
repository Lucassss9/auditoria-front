import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '../../../environments/environment';
import { AutenticacaoService } from '../../core/services/autenticacao.service';
import { PreferenciasService } from '../../core/services/preferencias.service';
import { SessaoService } from '../../core/services/sessao.service';
import { CabecalhoPagina } from '../../shared/components/cabecalho-pagina/cabecalho-pagina';
import { SeletorTema } from '../../shared/components/seletor-tema/seletor-tema';
import { IniciaisPipe } from '../../shared/pipes/iniciais.pipe';
import { ICONES } from '../../shared/icones';

@Component({
  selector: 'app-configuracoes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, LucideAngularModule, CabecalhoPagina, SeletorTema, IniciaisPipe],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.scss',
})
export class Configuracoes {
  private readonly preferencias = inject(PreferenciasService);
  private readonly sessao = inject(SessaoService);
  private readonly autenticacao = inject(AutenticacaoService);
  private readonly router = inject(Router);

  protected readonly icones = ICONES;
  protected readonly valores = this.preferencias.valores;
  protected readonly ambiente = environment;
  protected readonly usuario = this.sessao.usuario;

  protected sair(): void {
    this.autenticacao.sair().subscribe(() => {
      this.sessao.encerrar();
      void this.router.navigate(['/entrar']);
    });
  }

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
