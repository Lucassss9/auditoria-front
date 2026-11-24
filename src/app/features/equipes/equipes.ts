import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { forkJoin } from 'rxjs';
import { FUNCOES, FuncaoObra, Responsavel } from '../../core/models/equipe.model';
import { Filial, Obra } from '../../core/models/obra.model';
import { EquipeService } from '../../core/services/equipe.service';
import { ObrasService } from '../../core/services/obras.service';
import { mensagemDeErro } from '../../core/utils/erro';
import {
  SEM_FILIAL,
  obrasDaFilial,
  opcoesDeFilial,
  rotuloDaFilial,
  rotuloDaObra,
} from '../../core/utils/filtro-filial';
import { Requisicao } from '../../core/utils/requisicao';
import { ValidacaoFormulario } from '../../core/utils/validacao-formulario';
import { AvisoErro } from '../../shared/components/aviso-erro/aviso-erro';
import { CabecalhoPagina } from '../../shared/components/cabecalho-pagina/cabecalho-pagina';
import { Carregando } from '../../shared/components/carregando/carregando';
import { EstadoVazio } from '../../shared/components/estado-vazio/estado-vazio';
import { Modal } from '../../shared/components/modal/modal';
import { Selo } from '../../shared/components/selo/selo';
import { ICONES } from '../../shared/icones';

interface DadosEquipe {
  responsaveis: Responsavel[];
  obras: Obra[];
  filiais: Filial[];
}

@Component({
  selector: 'app-equipes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AvisoErro,
    CabecalhoPagina,
    Carregando,
    EstadoVazio,
    Modal,
    Selo,
  ],
  templateUrl: './equipes.html',
  styleUrl: './equipes.scss',
})
export class Equipes {
  private readonly servico = inject(EquipeService);
  private readonly obrasServico = inject(ObrasService);
  private readonly fb = inject(FormBuilder);

  protected readonly icones = ICONES;
  protected readonly funcoes = FUNCOES;

  protected readonly requisicao = new Requisicao<DadosEquipe>(() =>
    forkJoin({
      responsaveis: this.servico.listar(),
      obras: this.obrasServico.listarAtivas(),
      filiais: this.obrasServico.listarFiliais(),
    }),
  );

  protected readonly estado = this.requisicao.estado;
  protected readonly filialSelecionada = signal('');
  protected readonly obraSelecionada = signal('');
  protected readonly filialFormulario = signal('');
  protected readonly editando = signal<Responsavel | null>(null);
  protected readonly formularioAberto = signal(false);
  protected readonly salvando = signal(false);
  protected readonly erroSalvar = signal<string | null>(null);
  protected readonly erroAcao = signal<string | null>(null);
  protected readonly confirmandoRemocao = signal<string | null>(null);

  protected readonly formulario = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    funcao: ['RESIDENTE' as FuncaoObra, Validators.required],
    email: ['', [Validators.required, Validators.email]],
    obraId: ['', Validators.required],
    ativo: [true],
    receberEmail: [true],
  });

  private readonly validacao = new ValidacaoFormulario(this.formulario);

  protected readonly obras = computed(() => this.estado().dados?.obras ?? []);

  protected readonly rotuloDaObra = rotuloDaObra;

  protected readonly emailVinculado = signal('');

  protected readonly todasAsPessoas = computed(() => this.estado().dados?.responsaveis ?? []);

  protected readonly pessoasCadastradas = computed(() => {
    const porEmail = new Map<string, Responsavel>();

    for (const pessoa of this.todasAsPessoas()) {
      const chave = pessoa.email.toLowerCase();

      if (!porEmail.has(chave)) {
        porEmail.set(chave, pessoa);
      }
    }

    return [...porEmail.values()].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  });

  protected readonly obrasDaPessoa = computed(() => {
    const email = this.emailVinculado().toLowerCase();

    if (!email) {
      return [];
    }

    const nomes = new Map(this.obras().map((obra) => [obra.id, rotuloDaObra(obra)]));

    return this.todasAsPessoas()
      .filter((pessoa) => pessoa.email.toLowerCase() === email)
      .map((pessoa) => nomes.get(pessoa.obraId) ?? 'Obra não cadastrada')
      .sort((a, b) => a.localeCompare(b, 'pt-BR'));
  });

  protected readonly filiais = computed(() => {
    const porId = new Map((this.estado().dados?.filiais ?? []).map((f) => [f.id, f]));
    return opcoesDeFilial(this.obras(), (obra) => rotuloDaFilial(porId.get(obra.filialId ?? '')));
  });

  protected readonly obrasDaFilial = computed(() =>
    obrasDaFilial(this.obras(), this.filialSelecionada()),
  );

  protected readonly obrasDoFormulario = computed(() =>
    obrasDaFilial(this.obras(), this.filialFormulario()),
  );

  protected readonly responsaveis = computed(() => {
    const obraId = this.obraSelecionada();
    const lista = this.estado().dados?.responsaveis ?? [];

    if (obraId) {
      return lista.filter((item) => item.obraId === obraId);
    }

    if (this.filialSelecionada()) {
      const daFilial = new Set(this.obrasDaFilial().map((obra) => obra.id));
      return lista.filter((item) => daFilial.has(item.obraId));
    }

    return lista;
  });

  protected trocarFilial(valor: string): void {
    this.filialSelecionada.set(valor);
    this.obraSelecionada.set('');
  }

  protected trocarFilialFormulario(valor: string): void {
    this.filialFormulario.set(valor);
    this.formulario.patchValue({ obraId: '' });
  }

  protected readonly agrupados = computed(() => {
    const grupos = new Map<string, { obra: string; pessoas: Responsavel[] }>();

    for (const pessoa of this.responsaveis()) {
      const obra = this.obras().find((item) => item.id === pessoa.obraId);
      const chave = pessoa.obraId;
      const atual =
        grupos.get(chave) ??
        { obra: obra ? rotuloDaObra(obra) : 'Obra não cadastrada', pessoas: [] };
      atual.pessoas.push(pessoa);
      grupos.set(chave, atual);
    }

    return [...grupos.values()].sort((a, b) => a.obra.localeCompare(b.obra, 'pt-BR'));
  });

  protected vincularPessoa(email: string): void {
    this.emailVinculado.set(email);

    const pessoa = this.pessoasCadastradas().find((item) => item.email === email);

    if (pessoa) {
      this.formulario.patchValue({ nome: pessoa.nome, email: pessoa.email, funcao: pessoa.funcao });
    }
  }

  protected abrirNovo(): void {
    this.editando.set(null);
    this.erroSalvar.set(null);
    this.emailVinculado.set('');
    this.filialFormulario.set(this.filialSelecionada());
    this.formulario.reset({
      nome: '',
      funcao: 'RESIDENTE',
      email: '',
      obraId: this.obraSelecionada(),
      ativo: true,
      receberEmail: true,
    });
    this.validacao.reiniciar();
    this.formularioAberto.set(true);
  }

  protected abrirEdicao(pessoa: Responsavel): void {
    this.editando.set(pessoa);
    this.erroSalvar.set(null);
    this.emailVinculado.set('');

    const obra = this.obras().find((item) => item.id === pessoa.obraId);
    this.filialFormulario.set(obra ? (obra.filialId ?? SEM_FILIAL) : '');

    this.formulario.setValue({
      nome: pessoa.nome,
      funcao: pessoa.funcao,
      email: pessoa.email,
      obraId: pessoa.obraId,
      ativo: pessoa.ativo,
      receberEmail: pessoa.receberEmail,
    });
    this.formularioAberto.set(true);
  }

  protected fechar(): void {
    this.formularioAberto.set(false);
  }

  protected salvar(): void {
    if (this.formulario.invalid) {
      this.validacao.marcarTentativa();
      return;
    }

    this.salvando.set(true);
    this.erroSalvar.set(null);
    const valores = this.formulario.getRawValue();
    const atual = this.editando();

    this.servico.salvar({ ...valores, id: atual?.id }).subscribe({
      next: () => this.recarregar(),
      error: (erro: unknown) => {
        // Sem isto o modal só parava de girar: o 409 de e-mail repetido, que
        // vem da 3.4, ficava invisível e a pessoa tentava salvar de novo.
        this.erroSalvar.set(mensagemDeErro(erro));
        this.salvando.set(false);
      },
    });
  }

  protected pedirRemocao(id: string): void {
    this.confirmandoRemocao.set(id);
  }

  protected cancelarRemocao(): void {
    this.confirmandoRemocao.set(null);
  }

  protected remover(pessoa: Responsavel): void {
    this.confirmandoRemocao.set(null);
    this.erroAcao.set(null);
    this.servico.remover(pessoa.id).subscribe({
      next: () => this.requisicao.executar(),
      error: (erro: unknown) => this.erroAcao.set(mensagemDeErro(erro)),
    });
  }

  protected alternarRecebimento(pessoa: Responsavel): void {
    this.erroAcao.set(null);
    this.servico.salvar({ ...pessoa, receberEmail: !pessoa.receberEmail }).subscribe({
      next: () => this.requisicao.executar(),
      error: (erro: unknown) => this.erroAcao.set(mensagemDeErro(erro)),
    });
  }

  protected rotuloFuncao(valor: FuncaoObra): string {
    return FUNCOES.find((item) => item.valor === valor)?.rotulo ?? valor;
  }

  protected campoInvalido(nome: string): boolean {
    return this.validacao.invalido(nome);
  }

  private recarregar(): void {
    this.salvando.set(false);
    this.formularioAberto.set(false);
    this.requisicao.executar();
  }
}
