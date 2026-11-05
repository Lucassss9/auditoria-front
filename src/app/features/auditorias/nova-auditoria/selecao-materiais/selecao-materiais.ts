import { ChangeDetectionStrategy, Component, computed, inject, input, model, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { forkJoin, of } from 'rxjs';
import { InsumoEstoque, ListaFavorita } from '../../../../core/models/insumo.model';
import { EstoqueService } from '../../../../core/services/estoque.service';
import { Requisicao } from '../../../../core/utils/requisicao';
import { AvisoErro } from '../../../../shared/components/aviso-erro/aviso-erro';
import { Carregando } from '../../../../shared/components/carregando/carregando';
import { EstadoVazio } from '../../../../shared/components/estado-vazio/estado-vazio';
import { MoedaPipe } from '../../../../shared/pipes/moeda.pipe';
import { QuantidadePipe } from '../../../../shared/pipes/quantidade.pipe';
import { ICONES } from '../../../../shared/icones';

export interface MaterialSelecionado {
  insumo: InsumoEstoque;
  lista: string | null;
}

@Component({
  selector: 'app-selecao-materiais',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LucideAngularModule,
    AvisoErro,
    Carregando,
    EstadoVazio,
    MoedaPipe,
    QuantidadePipe,
  ],
  templateUrl: './selecao-materiais.html',
  styleUrl: './selecao-materiais.scss',
})
export class SelecaoMateriais {
  private readonly servico = inject(EstoqueService);

  readonly obraId = input.required<string>();
  readonly selecionados = model<MaterialSelecionado[]>([]);

  protected readonly icones = ICONES;
  protected readonly termo = signal('');
  protected readonly buscando = signal(false);
  protected readonly erroBusca = signal<string | null>(null);
  protected readonly resultados = signal<InsumoEstoque[]>([]);
  protected readonly jaBuscou = signal(false);
  protected readonly nomeNovaLista = signal('');
  protected readonly listaDestino = signal('');

  protected readonly favoritas = new Requisicao<ListaFavorita[]>(() =>
    this.servico.listarListasFavoritas(),
  );

  protected readonly selecionadosIds = computed(
    () => new Set(this.selecionados().map((item) => item.insumo.id)),
  );

  protected readonly grupos = computed(() => {
    const mapa = new Map<string, MaterialSelecionado[]>();

    for (const item of this.selecionados()) {
      const chave = item.lista ?? 'Sem lista';
      mapa.set(chave, [...(mapa.get(chave) ?? []), item]);
    }

    return [...mapa.entries()]
      .map(([nome, itens]) => ({ nome, itens }))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  });

  protected readonly nomesDeListas = computed(() => {
    const nomes = new Set<string>();

    for (const item of this.selecionados()) {
      if (item.lista) {
        nomes.add(item.lista);
      }
    }

    for (const favorita of this.favoritas.estado().dados ?? []) {
      nomes.add(favorita.nome);
    }

    return [...nomes].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  });

  protected buscar(termo: string): void {
    this.termo.set(termo);
    this.executarBusca([termo]);
  }

  protected aplicarFavorita(favorita: ListaFavorita): void {
    this.termo.set(favorita.termos.join(', '));
    this.listaDestino.set(favorita.nome);
    this.executarBusca(favorita.termos);
  }

  protected alternar(insumo: InsumoEstoque): void {
    const existe = this.selecionadosIds().has(insumo.id);

    if (existe) {
      this.selecionados.update((atuais) =>
        atuais.filter((item) => item.insumo.id !== insumo.id),
      );
      return;
    }

    this.selecionados.update((atuais) => [
      ...atuais,
      { insumo, lista: this.listaDestino() || null },
    ]);
  }

  protected adicionarTodosOsResultados(): void {
    const atuais = this.selecionados();
    const jaTem = new Set(atuais.map((item) => item.insumo.id));
    const novos = this.resultados()
      .filter((insumo) => !jaTem.has(insumo.id))
      .map((insumo) => ({ insumo, lista: this.listaDestino() || null }));

    this.selecionados.set([...atuais, ...novos]);
  }

  protected removerSelecionado(insumoId: string): void {
    this.selecionados.update((atuais) => atuais.filter((item) => item.insumo.id !== insumoId));
  }

  protected limparSelecao(): void {
    this.selecionados.set([]);
  }

  protected moverParaLista(insumoId: string, lista: string): void {
    this.selecionados.update((atuais) =>
      atuais.map((item) =>
        item.insumo.id === insumoId ? { ...item, lista: lista || null } : item,
      ),
    );
  }

  protected salvarComoFavorita(): void {
    const nome = this.nomeNovaLista().trim();
    const termos = this.termo()
      .split(',')
      .map((parte) => parte.trim())
      .filter(Boolean);

    if (!nome || !termos.length) {
      return;
    }

    this.servico.salvarListaFavorita({ nome, termos }).subscribe(() => {
      this.nomeNovaLista.set('');
      this.favoritas.executar();
    });
  }

  protected removerFavorita(id: string): void {
    this.servico.removerListaFavorita(id).subscribe(() => this.favoritas.executar());
  }

  private executarBusca(termos: string[]): void {
    const limpos = termos.map((item) => item.trim()).filter(Boolean);

    this.buscando.set(true);
    this.erroBusca.set(null);
    this.jaBuscou.set(true);

    const consultas = limpos.length
      ? limpos.map((termo) => this.servico.buscarPorObra(this.obraId(), termo))
      : [this.servico.buscarPorObra(this.obraId(), '')];

    forkJoin(consultas.length ? consultas : [of<InsumoEstoque[]>([])]).subscribe({
      next: (respostas) => {
        const unicos = new Map<string, InsumoEstoque>();

        for (const lista of respostas) {
          for (const insumo of lista) {
            unicos.set(insumo.id, insumo);
          }
        }

        this.resultados.set(
          [...unicos.values()].sort((a, b) => a.descricao.localeCompare(b.descricao, 'pt-BR')),
        );
        this.buscando.set(false);
      },
      error: () => {
        this.resultados.set([]);
        this.buscando.set(false);
        this.erroBusca.set('Não foi possível consultar o estoque da obra.');
      },
    });
  }
}
