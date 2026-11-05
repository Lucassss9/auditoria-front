import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ObraResumo } from '../../../core/models/obra.model';
import { AuditoriasService } from '../../../core/services/auditorias.service';
import { ContextoService } from '../../../core/services/contexto.service';
import { ObrasService } from '../../../core/services/obras.service';
import { PreferenciasService } from '../../../core/services/preferencias.service';
import { SessaoService } from '../../../core/services/sessao.service';
import { contemTermo } from '../../../core/utils/texto';
import { Requisicao } from '../../../core/utils/requisicao';
import { AvisoErro } from '../../../shared/components/aviso-erro/aviso-erro';
import { CabecalhoPagina } from '../../../shared/components/cabecalho-pagina/cabecalho-pagina';
import { Carregando } from '../../../shared/components/carregando/carregando';
import { EstadoVazio } from '../../../shared/components/estado-vazio/estado-vazio';
import { MoedaPipe } from '../../../shared/pipes/moeda.pipe';
import { ICONES } from '../../../shared/icones';
import { MaterialSelecionado, SelecaoMateriais } from './selecao-materiais/selecao-materiais';

interface GrupoDeFilial {
  chave: string;
  filial: string;
  regional: string | null;
  obras: ObraResumo[];
}

@Component({
  selector: 'app-nova-auditoria',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LucideAngularModule,
    AvisoErro,
    CabecalhoPagina,
    Carregando,
    EstadoVazio,
    MoedaPipe,
    SelecaoMateriais,
  ],
  templateUrl: './nova-auditoria.html',
  styleUrl: './nova-auditoria.scss',
})
export class NovaAuditoria {
  private readonly obrasServico = inject(ObrasService);
  private readonly auditorias = inject(AuditoriasService);
  private readonly preferencias = inject(PreferenciasService);
  private readonly contexto = inject(ContextoService);
  private readonly sessao = inject(SessaoService);
  private readonly router = inject(Router);

  protected readonly icones = ICONES;
  protected readonly selecionados = signal<MaterialSelecionado[]>([]);
  protected readonly buscaObra = signal('');
  protected readonly trocandoObra = signal(false);
  protected readonly criando = signal(false);
  protected readonly erroCriacao = signal<string | null>(null);

  protected readonly responsavel = signal(
    this.preferencias.valores().responsavelPadrao || (this.sessao.usuario()?.nome ?? ''),
  );

  protected readonly requisicao = new Requisicao<ObraResumo[]>(() => this.obrasServico.listar());
  protected readonly estado = this.requisicao.estado;

  protected readonly obras = computed(() =>
    (this.estado().dados ?? []).filter((item) => item.situacao === 'ATIVA'),
  );

  protected readonly obra = this.contexto.obraSelecionada;

  protected readonly obrasFiltradas = computed(() => {
    const termo = this.buscaObra().trim();

    if (!termo) {
      return this.obras();
    }

    return this.obras().filter(
      (item) =>
        contemTermo(item.nome, termo) ||
        contemTermo(item.codigo, termo) ||
        contemTermo(item.filial?.nome ?? '', termo) ||
        contemTermo(item.filial?.codigo ?? '', termo),
    );
  });

  protected readonly gruposPorFilial = computed<GrupoDeFilial[]>(() => {
    const mapa = new Map<string, GrupoDeFilial>();

    for (const obra of this.obrasFiltradas()) {
      const chave = obra.filial?.id ?? 'sem-filial';
      const grupo = mapa.get(chave) ?? {
        chave,
        filial: obra.filial ? obra.filial.codigo + ' · ' + obra.filial.nome : 'Sem filial',
        regional: obra.filial?.regional ?? null,
        obras: [],
      };

      grupo.obras.push(obra);
      mapa.set(chave, grupo);
    }

    return [...mapa.values()].sort((a, b) => a.filial.localeCompare(b.filial, 'pt-BR'));
  });

  protected readonly escolhendoObra = computed(() => !this.obra() || this.trocandoObra());

  protected readonly listas = computed(() => {
    const mapa = new Map<string, number>();

    for (const item of this.selecionados()) {
      const chave = item.lista ?? 'Sem lista';
      mapa.set(chave, (mapa.get(chave) ?? 0) + 1);
    }

    return [...mapa.entries()].map(([nome, total]) => ({ nome, total }));
  });

  protected readonly valorDeReferencia = computed(() =>
    this.selecionados().reduce((soma, item) => {
      const valor = item.insumo.valorUnitario;
      return valor === null ? soma : soma + valor * item.insumo.quantidade;
    }, 0),
  );

  protected readonly itensSemValor = computed(
    () => this.selecionados().filter((item) => item.insumo.valorUnitario === null).length,
  );

  protected escolherObra(obra: ObraResumo): void {
    const atual = this.obra();

    if (atual && atual.id !== obra.id) {
      this.selecionados.set([]);
    }

    this.contexto.selecionarObra(obra);
    this.trocandoObra.set(false);
    this.buscaObra.set('');
  }

  protected trocarObra(): void {
    this.trocandoObra.set(true);
  }

  protected cancelarTroca(): void {
    this.trocandoObra.set(false);
  }

  protected iniciar(): void {
    const obra = this.obra();

    if (!obra || !this.selecionados().length) {
      return;
    }

    if (!this.responsavel().trim()) {
      this.erroCriacao.set('Informe quem conduz esta auditoria.');
      return;
    }

    this.criando.set(true);
    this.erroCriacao.set(null);

    this.auditorias
      .criar({
        obraId: obra.id,
        responsavel: this.responsavel().trim(),
        insumos: this.selecionados().map((item) => ({
          insumoId: item.insumo.id,
          lista: item.lista,
        })),
      })
      .subscribe({
        next: (auditoria) => {
          this.criando.set(false);
          void this.router.navigate(['/auditorias', auditoria.id]);
        },
        error: () => {
          this.criando.set(false);
          this.erroCriacao.set('Não foi possível criar a auditoria. Tente novamente.');
        },
      });
  }
}
