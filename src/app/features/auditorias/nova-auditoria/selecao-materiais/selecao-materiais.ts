import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
  untracked,
} from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { forkJoin } from 'rxjs';
import { FiltroEstoque, InsumoEstoque, ListaFavorita } from '../../../../core/models/insumo.model';
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

type CampoOrdem = 'descricao' | 'codigo' | 'quantidade' | 'valor';

const ESPERA_BUSCA = 220;

@Component({
  selector: 'app-selecao-materiais',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, AvisoErro, Carregando, EstadoVazio, MoedaPipe, QuantidadePipe],
  templateUrl: './selecao-materiais.html',
  styleUrl: './selecao-materiais.scss',
})
export class SelecaoMateriais {
  private readonly servico = inject(EstoqueService);

  readonly obraId = input.required<string>();
  readonly selecionados = model<MaterialSelecionado[]>([]);

  protected readonly icones = ICONES;
  protected readonly termo = signal('');
  protected readonly categoria = signal<string | null>(null);
  protected readonly buscando = signal(false);
  protected readonly erroBusca = signal<string | null>(null);
  protected readonly resultados = signal<InsumoEstoque[]>([]);
  protected readonly campoOrdem = signal<CampoOrdem>('descricao');
  protected readonly ordemCrescente = signal(true);
  protected readonly listaDestino = signal('');
  protected readonly nomeNovaLista = signal('');
  protected readonly favoritaAplicada = signal<string | null>(null);
  protected readonly painelSelecao = signal(true);

  protected readonly favoritas = new Requisicao<ListaFavorita[]>(() =>
    this.servico.listarListasFavoritas(),
  );

  protected readonly categorias = signal<string[]>([]);

  private temporizador: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const obra = this.obraId();

      if (!obra) {
        return;
      }

      untracked(() => {
        this.servico.listarCategorias(obra).subscribe((lista) => this.categorias.set(lista));
        this.executarBusca([this.termo()]);
      });
    });
  }

  protected readonly selecionadosIds = computed(
    () => new Set(this.selecionados().map((item) => item.insumo.id)),
  );

  protected readonly resultadosOrdenados = computed(() => {
    const campo = this.campoOrdem();
    const sinal = this.ordemCrescente() ? 1 : -1;

    return [...this.resultados()].sort((a, b) => {
      if (campo === 'codigo') {
        return a.codigo.localeCompare(b.codigo, 'pt-BR') * sinal;
      }

      if (campo === 'quantidade') {
        return (a.quantidade - b.quantidade) * sinal;
      }

      if (campo === 'valor') {
        return ((a.valorUnitario ?? -1) - (b.valorUnitario ?? -1)) * sinal;
      }

      return a.descricao.localeCompare(b.descricao, 'pt-BR') * sinal;
    });
  });

  protected readonly naoSelecionadosVisiveis = computed(() => {
    const escolhidos = this.selecionadosIds();
    return this.resultadosOrdenados().filter((item) => !escolhidos.has(item.id)).length;
  });

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
    const nomes = new Set<string>(this.categorias());

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

  protected aoDigitar(valor: string): void {
    this.termo.set(valor);
    this.favoritaAplicada.set(null);

    if (this.temporizador) {
      clearTimeout(this.temporizador);
    }

    this.temporizador = setTimeout(() => this.executarBusca([valor]), ESPERA_BUSCA);
  }

  protected definirCategoria(valor: string | null): void {
    this.categoria.set(valor);
    this.executarBusca([this.termo()]);
  }

  protected ordenarPor(campo: CampoOrdem): void {
    if (this.campoOrdem() === campo) {
      this.ordemCrescente.update((valor) => !valor);
      return;
    }

    this.campoOrdem.set(campo);
    this.ordemCrescente.set(true);
  }

  protected aplicarFavorita(favorita: ListaFavorita): void {
    this.termo.set(favorita.termos.join(', '));
    this.listaDestino.set(favorita.nome);
    this.categoria.set(null);
    this.favoritaAplicada.set(favorita.id);
    this.executarBusca(favorita.termos);
  }

  protected alternar(insumo: InsumoEstoque): void {
    if (this.selecionadosIds().has(insumo.id)) {
      this.selecionados.update((atuais) => atuais.filter((item) => item.insumo.id !== insumo.id));
      return;
    }

    this.selecionados.update((atuais) => [
      ...atuais,
      { insumo, lista: this.listaDestino() || insumo.categoria },
    ]);
  }

  protected adicionarResultados(): void {
    const atuais = this.selecionados();
    const jaTem = new Set(atuais.map((item) => item.insumo.id));

    const novos = this.resultadosOrdenados()
      .filter((insumo) => !jaTem.has(insumo.id))
      .map((insumo) => ({ insumo, lista: this.listaDestino() || insumo.categoria }));

    this.selecionados.set([...atuais, ...novos]);
  }

  protected removerSelecionado(insumoId: string): void {
    this.selecionados.update((atuais) => atuais.filter((item) => item.insumo.id !== insumoId));
  }

  protected removerGrupo(nome: string): void {
    this.selecionados.update((atuais) =>
      atuais.filter((item) => (item.lista ?? 'Sem lista') !== nome),
    );
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

  protected removerFavorita(id: string, evento: Event): void {
    evento.stopPropagation();
    this.servico.removerListaFavorita(id).subscribe(() => this.favoritas.executar());
  }

  private executarBusca(termos: string[]): void {
    const obra = untracked(() => this.obraId());
    const categoria = untracked(() => this.categoria());

    if (!obra) {
      return;
    }

    const limpos = termos.map((item) => item.trim()).filter(Boolean);
    const filtros: FiltroEstoque[] = limpos.length
      ? limpos.map((termo) => ({ termo, categoria }))
      : [{ termo: '', categoria }];

    this.buscando.set(true);
    this.erroBusca.set(null);

    forkJoin(filtros.map((filtro) => this.servico.buscarPorObra(obra, filtro))).subscribe({
      next: (respostas) => {
        const unicos = new Map<string, InsumoEstoque>();

        for (const lista of respostas) {
          for (const insumo of lista) {
            unicos.set(insumo.id, insumo);
          }
        }

        this.resultados.set([...unicos.values()]);
        this.buscando.set(false);
      },
      error: () => {
        this.resultados.set([]);
        this.buscando.set(false);
        this.erroBusca.set('Não foi possível consultar o estoque desta obra.');
      },
    });
  }
}
