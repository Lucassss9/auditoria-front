import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { forkJoin, of } from 'rxjs';
import { InsumoEstoque, ListaFavorita } from '../../core/models/insumo.model';
import { Obra } from '../../core/models/obra.model';
import { EstoqueService } from '../../core/services/estoque.service';
import { ObrasService } from '../../core/services/obras.service';
import { Requisicao } from '../../core/utils/requisicao';
import { normalizar } from '../../core/utils/texto';
import { AvisoErro } from '../../shared/components/aviso-erro/aviso-erro';
import { CabecalhoPagina } from '../../shared/components/cabecalho-pagina/cabecalho-pagina';
import { Carregando } from '../../shared/components/carregando/carregando';
import { EstadoVazio } from '../../shared/components/estado-vazio/estado-vazio';
import { ICONES } from '../../shared/icones';

interface DadosBuscas {
  listas: ListaFavorita[];
  obras: Obra[];
}

@Component({
  selector: 'app-buscas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, AvisoErro, CabecalhoPagina, Carregando, EstadoVazio],
  templateUrl: './buscas.html',
  styleUrl: './buscas.scss',
})
export class Buscas {
  private readonly servico = inject(EstoqueService);
  private readonly obrasServico = inject(ObrasService);

  protected readonly icones = ICONES;

  protected readonly requisicao = new Requisicao<DadosBuscas>(() =>
    forkJoin({
      listas: this.servico.listarListasFavoritas(),
      obras: this.obrasServico.listarAtivas(),
    }),
  );

  protected readonly estado = this.requisicao.estado;

  protected readonly listas = computed(() => this.estado().dados?.listas ?? []);
  protected readonly obras = computed(() => this.estado().dados?.obras ?? []);

  protected readonly editando = signal<string | null>(null);
  protected readonly nome = signal('');
  protected readonly termos = signal<string[]>([]);
  protected readonly termoNovo = signal('');
  protected readonly erro = signal<string | null>(null);
  protected readonly salvando = signal(false);
  protected readonly confirmandoRemocao = signal<string | null>(null);

  protected readonly obraTeste = signal('');
  protected readonly testando = signal(false);
  protected readonly resultadoTeste = signal<InsumoEstoque[] | null>(null);

  protected readonly editorAberto = computed(() => this.editando() !== null);

  protected readonly tituloEditor = computed(() =>
    this.editando() === 'nova' ? 'Nova busca salva' : 'Editar busca salva',
  );

  protected novaBusca(): void {
    this.editando.set('nova');
    this.nome.set('');
    this.termos.set([]);
    this.termoNovo.set('');
    this.erro.set(null);
    this.resultadoTeste.set(null);
  }

  protected editar(lista: ListaFavorita): void {
    this.editando.set(lista.id);
    this.nome.set(lista.nome);
    this.termos.set([...lista.termos]);
    this.termoNovo.set('');
    this.erro.set(null);
    this.resultadoTeste.set(null);
  }

  protected duplicar(lista: ListaFavorita): void {
    this.editando.set('nova');
    this.nome.set(lista.nome + ' (cópia)');
    this.termos.set([...lista.termos]);
    this.termoNovo.set('');
    this.erro.set(null);
    this.resultadoTeste.set(null);
  }

  protected fecharEditor(): void {
    this.editando.set(null);
    this.resultadoTeste.set(null);
  }

  protected adicionarTermo(): void {
    const bruto = this.termoNovo();

    const novos = bruto
      .split(',')
      .map((parte) => parte.trim())
      .filter(Boolean);

    if (!novos.length) {
      return;
    }

    this.termos.update((atuais) => {
      const vistos = new Set(atuais.map((item) => normalizar(item)));
      const aceitos = novos.filter((item) => !vistos.has(normalizar(item)));
      return [...atuais, ...aceitos];
    });

    this.termoNovo.set('');
    this.erro.set(null);
    this.resultadoTeste.set(null);
  }

  protected removerTermo(termo: string): void {
    this.termos.update((atuais) => atuais.filter((item) => item !== termo));
    this.resultadoTeste.set(null);
  }

  protected salvar(): void {
    const nome = this.nome().trim();

    if (!nome) {
      this.erro.set('Dê um nome para a busca, como Louças ou Aço.');
      return;
    }

    if (!this.termos().length) {
      this.erro.set('Inclua pelo menos um termo de busca.');
      return;
    }

    const repetido = this.listas().some(
      (item) => normalizar(item.nome) === normalizar(nome) && item.id !== this.editando(),
    );

    if (repetido) {
      this.erro.set('Já existe uma busca salva com esse nome.');
      return;
    }

    this.salvando.set(true);
    const id = this.editando() === 'nova' ? undefined : (this.editando() ?? undefined);

    this.servico.salvarListaFavorita({ id, nome, termos: this.termos() }).subscribe({
      next: () => {
        this.salvando.set(false);
        this.fecharEditor();
        this.requisicao.executar();
      },
      error: () => {
        this.salvando.set(false);
        this.erro.set('Não foi possível salvar. Tente novamente.');
      },
    });
  }

  protected pedirRemocao(id: string): void {
    this.confirmandoRemocao.set(id);
  }

  protected cancelarRemocao(): void {
    this.confirmandoRemocao.set(null);
  }

  protected remover(id: string): void {
    this.confirmandoRemocao.set(null);

    this.servico.removerListaFavorita(id).subscribe(() => {
      if (this.editando() === id) {
        this.fecharEditor();
      }
      this.requisicao.executar();
    });
  }

  protected testar(): void {
    const obraId = this.obraTeste() || this.obras()[0]?.id;

    if (!obraId || !this.termos().length) {
      return;
    }

    this.obraTeste.set(obraId);
    this.testando.set(true);

    const consultas = this.termos().map((termo) =>
      this.servico.buscarPorObra(obraId, { termo, categoria: null }),
    );

    forkJoin(consultas.length ? consultas : [of<InsumoEstoque[]>([])]).subscribe({
      next: (respostas) => {
        const unicos = new Map<string, InsumoEstoque>();

        for (const lista of respostas) {
          for (const insumo of lista) {
            unicos.set(insumo.id, insumo);
          }
        }

        this.resultadoTeste.set(
          [...unicos.values()].sort((a, b) => a.descricao.localeCompare(b.descricao, 'pt-BR')),
        );
        this.testando.set(false);
      },
      error: () => {
        this.resultadoTeste.set([]);
        this.testando.set(false);
      },
    });
  }

  protected nomeDaObraTeste(): string {
    const id = this.obraTeste();
    return this.obras().find((item) => item.id === id)?.nome ?? '';
  }
}
