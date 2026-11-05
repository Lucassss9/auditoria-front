import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { forkJoin } from 'rxjs';
import { FUNCOES, FuncaoObra, Responsavel } from '../../core/models/equipe.model';
import { Obra } from '../../core/models/obra.model';
import { EquipeService } from '../../core/services/equipe.service';
import { ObrasService } from '../../core/services/obras.service';
import { Requisicao } from '../../core/utils/requisicao';
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
    }),
  );

  protected readonly estado = this.requisicao.estado;
  protected readonly obraSelecionada = signal('');
  protected readonly editando = signal<Responsavel | null>(null);
  protected readonly formularioAberto = signal(false);
  protected readonly salvando = signal(false);

  protected readonly formulario = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    funcao: ['RESIDENTE' as FuncaoObra, Validators.required],
    email: ['', [Validators.required, Validators.email]],
    obraId: ['', Validators.required],
    ativo: [true],
    receberEmail: [true],
  });

  protected readonly obras = computed(() => this.estado().dados?.obras ?? []);

  protected readonly responsaveis = computed(() => {
    const obraId = this.obraSelecionada();
    const lista = this.estado().dados?.responsaveis ?? [];
    return obraId ? lista.filter((item) => item.obraId === obraId) : lista;
  });

  protected readonly agrupados = computed(() => {
    const grupos = new Map<string, { obra: string; pessoas: Responsavel[] }>();

    for (const pessoa of this.responsaveis()) {
      const obra = this.obras().find((item) => item.id === pessoa.obraId);
      const chave = pessoa.obraId;
      const atual = grupos.get(chave) ?? { obra: obra?.nome ?? 'Obra não cadastrada', pessoas: [] };
      atual.pessoas.push(pessoa);
      grupos.set(chave, atual);
    }

    return [...grupos.values()].sort((a, b) => a.obra.localeCompare(b.obra, 'pt-BR'));
  });

  protected abrirNovo(): void {
    this.editando.set(null);
    this.formulario.reset({
      nome: '',
      funcao: 'RESIDENTE',
      email: '',
      obraId: this.obraSelecionada() || (this.obras()[0]?.id ?? ''),
      ativo: true,
      receberEmail: true,
    });
    this.formularioAberto.set(true);
  }

  protected abrirEdicao(pessoa: Responsavel): void {
    this.editando.set(pessoa);
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
      this.formulario.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    const valores = this.formulario.getRawValue();
    const atual = this.editando();

    this.servico.salvar({ ...valores, id: atual?.id }).subscribe({
      next: () => this.recarregar(),
      error: () => this.salvando.set(false),
    });
  }

  protected remover(pessoa: Responsavel): void {
    this.servico.remover(pessoa.id).subscribe(() => this.requisicao.executar());
  }

  protected alternarRecebimento(pessoa: Responsavel): void {
    this.servico
      .salvar({ ...pessoa, receberEmail: !pessoa.receberEmail })
      .subscribe(() => this.requisicao.executar());
  }

  protected rotuloFuncao(valor: FuncaoObra): string {
    return FUNCOES.find((item) => item.valor === valor)?.rotulo ?? valor;
  }

  protected campoInvalido(nome: string): boolean {
    const campo = this.formulario.get(nome);
    return !!campo && campo.invalid && campo.touched;
  }

  private recarregar(): void {
    this.salvando.set(false);
    this.formularioAberto.set(false);
    this.requisicao.executar();
  }
}
