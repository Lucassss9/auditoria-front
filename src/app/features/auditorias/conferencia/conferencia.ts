import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import {
  diferencaQuantidade,
  diferencaValor,
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

type Filtro = 'TODOS' | 'NAO_CONFERIDO' | 'DIVERGENTES' | 'CONFERIDO' | 'NAO_CONTADO';

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
  private readonly router = inject(Router);

  private readonly id = this.rota.snapshot.paramMap.get('id') ?? '';

  protected readonly icones = ICONES;
  protected readonly motivos = MOTIVOS;

  protected readonly requisicao = new Requisicao<Auditoria | null>(() =>
    this.servico.buscarPorId(this.id),
  );

  protected readonly estado = this.requisicao.estado;
  protected readonly filtro = signal<Filtro>('TODOS');
  protected readonly listaSelecionada = signal('');
  protected readonly termo = signal('');
  protected readonly expandido = signal<string | null>(null);
  protected readonly rascunhos = signal<Record<string, string>>({});
  protected readonly errosDeEntrada = signal<Record<string, string>>({});
  protected readonly foraDoEstoqueAberto = signal(false);
  protected readonly itemForaEmEdicao = signal<ItemForaDoEstoque | null>(null);
  protected readonly concluindo = signal(false);

  protected readonly mostrarValores = computed(
    () => this.preferencias.valores().mostrarValoresNaConferencia,
  );

  protected readonly auditoria = computed(() => this.estado().dados ?? null);

  protected readonly resumo = computed(() => {
    const atual = this.auditoria();
    return atual ? resumirAuditoria(atual) : null;
  });

  protected readonly progresso = computed(() => {
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

  protected readonly itensVisiveis = computed(() => {
    const itens = this.auditoria()?.itens ?? [];
    const filtro = this.filtro();
    const lista = this.listaSelecionada();
    const termo = this.termo().trim();

    return itens.filter((item) => {
      const casaLista = !lista || (item.lista ?? 'Sem lista') === lista;
      const casaTermo =
        !termo || contemTermo(item.descricao, termo) || item.codigo.includes(termo);

      if (!casaLista || !casaTermo) {
        return false;
      }

      if (filtro === 'TODOS') {
        return true;
      }

      if (filtro === 'DIVERGENTES') {
        const diferenca = diferencaQuantidade(item);
        return diferenca !== null && diferenca !== 0;
      }

      return item.situacao === filtro;
    });
  });

  protected readonly somenteLeitura = computed(() => this.auditoria()?.status !== 'EM_ANDAMENTO');

  protected valorDigitado(item: ItemAuditoria): string {
    const rascunho = this.rascunhos()[item.id];

    if (rascunho !== undefined) {
      return rascunho;
    }

    return item.quantidadeReal === null ? '' : String(item.quantidadeReal);
  }

  protected diferencaDe(item: ItemAuditoria): number | null {
    const rascunho = this.rascunhos()[item.id];

    if (rascunho !== undefined) {
      const numero = this.converter(rascunho);
      return numero === null ? null : numero - item.quantidadeSistema;
    }

    return diferencaQuantidade(item);
  }

  protected diferencaEmValor(item: ItemAuditoria): number | null {
    const rascunho = this.rascunhos()[item.id];

    if (rascunho === undefined) {
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
      this.rascunhos.update(({ [item.id]: _removido, ...resto }) => resto);
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
    this.rascunhos.update(({ [item.id]: _removido, ...resto }) => resto);
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

    this.rascunhos.update(({ [item.id]: _removido, ...resto }) => resto);
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

  protected alternarDetalhe(itemId: string): void {
    this.expandido.update((atual) => (atual === itemId ? null : itemId));
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
    return this.errosDeEntrada()[itemId] ?? null;
  }

  private salvarItem(itemId: string, mudancas: Partial<ItemAuditoria>): void {
    this.servico
      .atualizarItem(this.id, itemId, mudancas)
      .subscribe((auditoria) => this.requisicao.definir(auditoria));
  }

  private converter(valor: string): number | null {
    const normalizado = valor.replace(/\s/g, '').replace(',', '.');

    if (!/^-?\d+(\.\d+)?$/.test(normalizado)) {
      return null;
    }

    return Number(normalizado);
  }

  private definirErro(itemId: string, mensagem: string): void {
    this.errosDeEntrada.update((atuais) => ({ ...atuais, [itemId]: mensagem }));
  }

  private limparErro(itemId: string): void {
    this.errosDeEntrada.update(({ [itemId]: _removido, ...resto }) => resto);
  }
}
