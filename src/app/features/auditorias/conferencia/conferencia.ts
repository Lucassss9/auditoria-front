import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import {
  diferencaQuantidade,
  diferencaValor,
  divergente,
  progresso,
  resumirAuditoria,
} from '../../../core/domain/auditoria-calculos';
import {
  Auditoria,
  Evidencia,
  ItemAuditoria,
  ItemForaDoEstoque,
  MotivoNaoContagem,
  SituacaoItem,
} from '../../../core/models/auditoria.model';
import { AuditoriasService } from '../../../core/services/auditorias.service';
import { ContextoService } from '../../../core/services/contexto.service';
import { PreferenciasService } from '../../../core/services/preferencias.service';
import { contemTermo } from '../../../core/utils/texto';
import { Requisicao } from '../../../core/utils/requisicao';
import { AvisoErro } from '../../../shared/components/aviso-erro/aviso-erro';
import { CabecalhoPagina } from '../../../shared/components/cabecalho-pagina/cabecalho-pagina';
import { Carregando } from '../../../shared/components/carregando/carregando';
import { EstadoVazio } from '../../../shared/components/estado-vazio/estado-vazio';
import { Evidencias } from '../../../shared/components/evidencias/evidencias';
import { Selo } from '../../../shared/components/selo/selo';
import { DiferencaPipe } from '../../../shared/pipes/diferenca.pipe';
import { MoedaPipe } from '../../../shared/pipes/moeda.pipe';
import { QuantidadePipe } from '../../../shared/pipes/quantidade.pipe';
import { ICONES } from '../../../shared/icones';
import { FormForaDoEstoque } from './form-fora-do-estoque/form-fora-do-estoque';

export type FiltroConferencia =
  | 'TODOS'
  | 'NAO_CONFERIDO'
  | 'DIVERGENTES'
  | 'CONFERIDO'
  | 'NAO_CONTADO'
  | 'FORA';

export const MOTIVOS: ReadonlyArray<{ valor: MotivoNaoContagem; rotulo: string }> = [
  { valor: 'LOCAL_TRANCADO', rotulo: 'Local trancado' },
  { valor: 'OBRA_NAO_LOCALIZOU', rotulo: 'Obra não localizou' },
  { valor: 'MATERIAL_EM_USO', rotulo: 'Material em uso' },
  { valor: 'SEM_ACESSO_SEGURO', rotulo: 'Sem acesso seguro' },
];

@Component({
  selector: 'app-conferencia',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    RouterLink,
    LucideAngularModule,
    AvisoErro,
    CabecalhoPagina,
    Carregando,
    EstadoVazio,
    Evidencias,
    Selo,
    DiferencaPipe,
    MoedaPipe,
    QuantidadePipe,
    FormForaDoEstoque,
  ],
  templateUrl: './conferencia.html',
  styleUrl: './conferencia.scss',
})
export class Conferencia {
  private readonly rota = inject(ActivatedRoute);
  private readonly servico = inject(AuditoriasService);
  private readonly preferencias = inject(PreferenciasService);
  private readonly contexto = inject(ContextoService);
  private readonly router = inject(Router);

  private readonly id = this.rota.snapshot.paramMap.get('id') ?? '';

  protected readonly icones = ICONES;
  protected readonly motivos = MOTIVOS;

  protected readonly requisicao = new Requisicao<Auditoria | null>(() =>
    this.servico.buscarPorId(this.id),
  );

  protected readonly estado = this.requisicao.estado;

  protected readonly filtro = signal<FiltroConferencia>(
    this.contexto.recuperar<FiltroConferencia>('conferencia:filtro', 'TODOS'),
  );
  protected readonly listaSelecionada = signal(
    this.contexto.recuperar<string>('conferencia:lista', ''),
  );
  protected readonly termo = signal('');
  protected readonly itemAberto = signal<string | null>(null);
  protected readonly rascunhos = signal<Record<string, string>>({});
  protected readonly erros = signal<Record<string, string>>({});
  protected readonly salvando = signal<Record<string, 'salvando' | 'salvo'>>({});
  protected readonly foraDoEstoqueAberto = signal(false);
  protected readonly itemForaEmEdicao = signal<ItemForaDoEstoque | null>(null);
  protected readonly concluindo = signal(false);

  protected readonly mostrarValores = computed(
    () => this.preferencias.valores().mostrarValoresNaConferencia,
  );

  protected readonly auditoria = computed(() => this.estado().dados ?? null);
  protected readonly somenteLeitura = computed(() => this.auditoria()?.status !== 'EM_ANDAMENTO');

  protected readonly resumo = computed(() => {
    const atual = this.auditoria();
    return atual ? resumirAuditoria(atual) : null;
  });

  protected readonly percentual = computed(() => {
    const atual = this.auditoria();
    return atual ? progresso(atual) : 0;
  });

  protected readonly listas = computed(() => {
    const nomes = new Set<string>();

    for (const item of this.auditoria()?.itens ?? []) {
      nomes.add(item.lista ?? 'Sem lista');
    }

    return [...nomes].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  });

  private readonly porTextoELista = computed(() => {
    const itens = this.auditoria()?.itens ?? [];
    const lista = this.listaSelecionada();
    const termo = this.termo().trim();

    return itens.filter((item) => {
      const casaLista = !lista || (item.lista ?? 'Sem lista') === lista;
      const casaTermo =
        !termo || contemTermo(item.descricao, termo) || item.codigo.includes(termo);
      return casaLista && casaTermo;
    });
  });

  protected readonly contagens = computed(() => {
    const base = this.porTextoELista();

    return {
      TODOS: base.length,
      NAO_CONFERIDO: base.filter((item) => item.situacao === 'NAO_CONFERIDO').length,
      DIVERGENTES: base.filter((item) => divergente(item)).length,
      CONFERIDO: base.filter((item) => item.situacao === 'CONFERIDO').length,
      NAO_CONTADO: base.filter((item) => item.situacao === 'NAO_CONTADO').length,
      FORA: this.auditoria()?.foraDoEstoque.length ?? 0,
    };
  });

  protected readonly itensVisiveis = computed(() => {
    const filtro = this.filtro();
    const base = this.porTextoELista();

    if (filtro === 'TODOS' || filtro === 'FORA') {
      return base;
    }

    if (filtro === 'DIVERGENTES') {
      return base.filter((item) => divergente(item));
    }

    return base.filter((item) => item.situacao === filtro);
  });

  protected readonly detalhe = computed(() => {
    const id = this.itemAberto();
    return id ? ((this.auditoria()?.itens ?? []).find((item) => item.id === id) ?? null) : null;
  });

  protected definirFiltro(valor: FiltroConferencia): void {
    this.filtro.set(valor);
    this.contexto.lembrar('conferencia:filtro', valor);
  }

  protected definirLista(valor: string): void {
    this.listaSelecionada.set(valor);
    this.contexto.lembrar('conferencia:lista', valor);
  }

  protected valorDigitado(item: ItemAuditoria): string {
    const rascunho = this.rascunhos()[item.id];

    if (rascunho !== undefined) {
      return rascunho;
    }

    return item.quantidadeReal === null ? '' : String(item.quantidadeReal);
  }

  protected alterado(item: ItemAuditoria): boolean {
    return this.rascunhos()[item.id] !== undefined;
  }

  protected diferencaDe(item: ItemAuditoria): number | null {
    const rascunho = this.rascunhos()[item.id];

    if (rascunho === undefined) {
      return diferencaQuantidade(item);
    }

    const numero = this.converter(rascunho);
    return numero === null ? null : numero - item.quantidadeSistema;
  }

  protected diferencaEmValor(item: ItemAuditoria): number | null {
    if (this.rascunhos()[item.id] === undefined) {
      return diferencaValor(item);
    }

    const diferenca = this.diferencaDe(item);

    if (diferenca === null || item.valorUnitarioReferencia === null) {
      return null;
    }

    return diferenca * item.valorUnitarioReferencia;
  }

  protected aoDigitar(item: ItemAuditoria, valor: string): void {
    this.rascunhos.update((atuais) => ({ ...atuais, [item.id]: valor }));
    this.limparErro(item.id);
  }

  protected aoConfirmar(item: ItemAuditoria, valor: string): void {
    const limpo = valor.trim();

    if (!limpo) {
      this.descartarRascunho(item.id);
      this.salvarItem(item.id, {
        quantidadeReal: null,
        situacao: 'NAO_CONFERIDO',
        motivoNaoContagem: null,
      });
      return;
    }

    const numero = this.converter(limpo);

    if (numero === null) {
      this.definirErro(item.id, 'Use apenas números, com vírgula para decimais.');
      return;
    }

    if (numero < 0) {
      this.definirErro(item.id, 'A quantidade contada não pode ser negativa.');
      return;
    }

    this.limparErro(item.id);
    this.descartarRascunho(item.id);
    this.salvarItem(item.id, {
      quantidadeReal: numero,
      situacao: 'CONFERIDO',
      motivoNaoContagem: null,
    });
  }

  protected marcarNaoContado(item: ItemAuditoria, motivo: string): void {
    if (!motivo) {
      this.salvarItem(item.id, { situacao: 'NAO_CONFERIDO', motivoNaoContagem: null });
      return;
    }

    this.descartarRascunho(item.id);
    this.salvarItem(item.id, {
      situacao: 'NAO_CONTADO',
      motivoNaoContagem: motivo as MotivoNaoContagem,
      quantidadeReal: null,
    });
  }

  protected salvarObservacao(item: ItemAuditoria, texto: string): void {
    this.salvarItem(item.id, { observacao: texto });
  }

  protected salvarLocal(item: ItemAuditoria, texto: string): void {
    this.salvarItem(item.id, { local: texto || null });
  }

  protected salvarEvidencias(item: ItemAuditoria, evidencias: Evidencia[]): void {
    this.salvarItem(item.id, { evidencias });
  }

  protected abrirDetalhe(item: ItemAuditoria): void {
    this.itemAberto.set(item.id);
  }

  protected fecharDetalhe(): void {
    this.itemAberto.set(null);
  }

  protected abrirForaDoEstoque(item: ItemForaDoEstoque | null): void {
    this.itemForaEmEdicao.set(item);
    this.foraDoEstoqueAberto.set(true);
  }

  protected fecharForaDoEstoque(): void {
    this.foraDoEstoqueAberto.set(false);
    this.itemForaEmEdicao.set(null);
  }

  protected salvarForaDoEstoque(item: Omit<ItemForaDoEstoque, 'id'> & { id?: string }): void {
    this.servico.salvarItemForaDoEstoque(this.id, item).subscribe((auditoria) => {
      this.requisicao.definir(auditoria);
      this.fecharForaDoEstoque();
      this.definirFiltro('FORA');
    });
  }

  protected removerForaDoEstoque(itemId: string): void {
    this.servico
      .removerItemForaDoEstoque(this.id, itemId)
      .subscribe((auditoria) => this.requisicao.definir(auditoria));
  }

  protected concluir(): void {
    this.concluindo.set(true);

    this.servico.concluir(this.id).subscribe({
      next: () => {
        this.concluindo.set(false);
        void this.router.navigate(['/auditorias', this.id, 'relatorio']);
      },
      error: () => this.concluindo.set(false),
    });
  }

  protected rotuloSituacao(situacao: SituacaoItem): string {
    if (situacao === 'CONFERIDO') {
      return 'Conferido';
    }

    return situacao === 'NAO_CONTADO' ? 'Não contado' : 'Pendente';
  }

  protected rotuloMotivo(motivo: MotivoNaoContagem | null): string {
    return MOTIVOS.find((item) => item.valor === motivo)?.rotulo ?? '';
  }

  protected erroDe(itemId: string): string | null {
    return this.erros()[itemId] ?? null;
  }

  protected estadoSalvamento(itemId: string): 'salvando' | 'salvo' | null {
    return this.salvando()[itemId] ?? null;
  }

  private salvarItem(itemId: string, mudancas: Partial<ItemAuditoria>): void {
    this.salvando.update((atuais) => ({ ...atuais, [itemId]: 'salvando' }));

    this.servico.atualizarItem(this.id, itemId, mudancas).subscribe({
      next: (auditoria) => {
        this.requisicao.definir(auditoria);
        this.salvando.update((atuais) => ({ ...atuais, [itemId]: 'salvo' }));
        setTimeout(() => {
          this.salvando.update(({ [itemId]: _removido, ...resto }) => resto);
        }, 1600);
      },
      error: () => {
        this.salvando.update(({ [itemId]: _removido, ...resto }) => resto);
        this.definirErro(itemId, 'Não foi possível salvar. Tente de novo.');
      },
    });
  }

  private converter(valor: string): number | null {
    const normalizado = valor.replace(/\s/g, '').replace(',', '.');

    if (!/^-?\d+(\.\d+)?$/.test(normalizado)) {
      return null;
    }

    return Number(normalizado);
  }

  private descartarRascunho(itemId: string): void {
    this.rascunhos.update(({ [itemId]: _removido, ...resto }) => resto);
  }

  private definirErro(itemId: string, mensagem: string): void {
    this.erros.update((atuais) => ({ ...atuais, [itemId]: mensagem }));
  }

  private limparErro(itemId: string): void {
    this.erros.update(({ [itemId]: _removido, ...resto }) => resto);
  }
}
