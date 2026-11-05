import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Obra } from '../../../core/models/obra.model';
import { AuditoriasService } from '../../../core/services/auditorias.service';
import { ObrasService } from '../../../core/services/obras.service';
import { PreferenciasService } from '../../../core/services/preferencias.service';
import { Requisicao } from '../../../core/utils/requisicao';
import { AvisoErro } from '../../../shared/components/aviso-erro/aviso-erro';
import { CabecalhoPagina } from '../../../shared/components/cabecalho-pagina/cabecalho-pagina';
import { Carregando } from '../../../shared/components/carregando/carregando';
import { EstadoVazio } from '../../../shared/components/estado-vazio/estado-vazio';
import { MoedaPipe } from '../../../shared/pipes/moeda.pipe';
import { QuantidadePipe } from '../../../shared/pipes/quantidade.pipe';
import { MaterialSelecionado, SelecaoMateriais } from './selecao-materiais/selecao-materiais';

@Component({
  selector: 'app-nova-auditoria',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AvisoErro,
    CabecalhoPagina,
    Carregando,
    EstadoVazio,
    MoedaPipe,
    QuantidadePipe,
    SelecaoMateriais,
  ],
  templateUrl: './nova-auditoria.html',
  styleUrl: './nova-auditoria.scss',
})
export class NovaAuditoria {
  private readonly obrasServico = inject(ObrasService);
  private readonly auditorias = inject(AuditoriasService);
  private readonly preferencias = inject(PreferenciasService);
  private readonly router = inject(Router);

  protected readonly etapas = ['Obra', 'Materiais', 'Início'];
  protected readonly etapa = signal(0);
  protected readonly obraId = signal('');
  protected readonly selecionados = signal<MaterialSelecionado[]>([]);
  protected readonly responsavel = signal(this.preferencias.valores().responsavelPadrao);
  protected readonly criando = signal(false);
  protected readonly erroCriacao = signal<string | null>(null);

  protected readonly requisicao = new Requisicao<Obra[]>(() => this.obrasServico.listarAtivas());
  protected readonly estado = this.requisicao.estado;

  protected readonly obras = computed(() => this.estado().dados ?? []);

  protected readonly obraEscolhida = computed(
    () => this.obras().find((item) => item.id === this.obraId()) ?? null,
  );

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

  protected escolherObra(id: string): void {
    if (this.obraId() && this.obraId() !== id) {
      this.selecionados.set([]);
    }
    this.obraId.set(id);
  }

  protected avancar(): void {
    this.etapa.update((atual) => Math.min(atual + 1, this.etapas.length - 1));
  }

  protected voltar(): void {
    this.etapa.update((atual) => Math.max(atual - 1, 0));
  }

  protected podeAvancar(): boolean {
    if (this.etapa() === 0) {
      return !!this.obraId();
    }

    if (this.etapa() === 1) {
      return this.selecionados().length > 0;
    }

    return false;
  }

  protected iniciar(): void {
    if (!this.obraId() || !this.selecionados().length || !this.responsavel().trim()) {
      this.erroCriacao.set('Informe o responsável pela auditoria antes de iniciar.');
      return;
    }

    this.criando.set(true);
    this.erroCriacao.set(null);

    this.auditorias
      .criar({
        obraId: this.obraId(),
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
