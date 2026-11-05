import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ObraResumo, SituacaoObra } from '../../core/models/obra.model';
import { ObrasService } from '../../core/services/obras.service';
import { contemTermo } from '../../core/utils/texto';
import { Requisicao } from '../../core/utils/requisicao';
import { AvisoErro } from '../../shared/components/aviso-erro/aviso-erro';
import { CabecalhoPagina } from '../../shared/components/cabecalho-pagina/cabecalho-pagina';
import { Carregando } from '../../shared/components/carregando/carregando';
import { EstadoVazio } from '../../shared/components/estado-vazio/estado-vazio';
import { Selo } from '../../shared/components/selo/selo';
import { ICONES } from '../../shared/icones';

const POR_PAGINA = 8;

@Component({
  selector: 'app-obras',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    LucideAngularModule,
    AvisoErro,
    CabecalhoPagina,
    Carregando,
    EstadoVazio,
    Selo,
  ],
  templateUrl: './obras.html',
  styleUrl: './obras.scss',
})
export class Obras {
  private readonly servico = inject(ObrasService);

  protected readonly icones = ICONES;
  protected readonly requisicao = new Requisicao(() => this.servico.listar());
  protected readonly estado = this.requisicao.estado;

  protected readonly termo = signal('');
  protected readonly filialSelecionada = signal('');
  protected readonly situacaoSelecionada = signal<SituacaoObra | ''>('');
  protected readonly pagina = signal(1);

  protected readonly todas = computed<ObraResumo[]>(() => this.estado().dados ?? []);

  protected readonly filiais = computed(() => {
    const vistas = new Map<string, string>();

    for (const obra of this.todas()) {
      if (obra.filial) {
        vistas.set(obra.filial.id, obra.filial.codigo + ' - ' + obra.filial.nome);
      }
    }

    return [...vistas].map(([id, rotulo]) => ({ id, rotulo }));
  });

  protected readonly filtradas = computed(() => {
    const termo = this.termo().trim();
    const filial = this.filialSelecionada();
    const situacao = this.situacaoSelecionada();

    return this.todas().filter((obra) => {
      const casaTermo =
        !termo || contemTermo(obra.nome, termo) || contemTermo(obra.codigo, termo);
      const casaFilial = !filial || obra.filialId === filial;
      const casaSituacao = !situacao || obra.situacao === situacao;
      return casaTermo && casaFilial && casaSituacao;
    });
  });

  protected readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.filtradas().length / POR_PAGINA)),
  );

  protected readonly visiveis = computed(() => {
    const inicio = (Math.min(this.pagina(), this.totalPaginas()) - 1) * POR_PAGINA;
    return this.filtradas().slice(inicio, inicio + POR_PAGINA);
  });

  protected definirTermo(valor: string): void {
    this.termo.set(valor);
    this.pagina.set(1);
  }

  protected definirFilial(valor: string): void {
    this.filialSelecionada.set(valor);
    this.pagina.set(1);
  }

  protected definirSituacao(valor: string): void {
    this.situacaoSelecionada.set(valor as SituacaoObra | '');
    this.pagina.set(1);
  }

  protected irPara(destino: number): void {
    this.pagina.set(Math.min(Math.max(1, destino), this.totalPaginas()));
  }

  protected limparFiltros(): void {
    this.termo.set('');
    this.filialSelecionada.set('');
    this.situacaoSelecionada.set('');
    this.pagina.set(1);
  }
}
