import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import {
  diferencaQuantidade,
  diferencaValor,
  divergente,
} from '../../../core/domain/auditoria-calculos';
import { Auditoria } from '../../../core/models/auditoria.model';
import { Responsavel } from '../../../core/models/equipe.model';
import { AuditoriasService } from '../../../core/services/auditorias.service';
import { EquipeService } from '../../../core/services/equipe.service';
import { PreferenciasService } from '../../../core/services/preferencias.service';
import { AvisoErro } from '../../../shared/components/aviso-erro/aviso-erro';
import { CabecalhoPagina } from '../../../shared/components/cabecalho-pagina/cabecalho-pagina';
import { Carregando } from '../../../shared/components/carregando/carregando';
import { EstadoVazio } from '../../../shared/components/estado-vazio/estado-vazio';
import { ICONES } from '../../../shared/icones';
import { MOTIVOS } from '../conferencia/conferencia';

@Component({
  selector: 'app-email',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    LucideAngularModule,
    AvisoErro,
    CabecalhoPagina,
    Carregando,
    EstadoVazio,
  ],
  templateUrl: './email.html',
  styleUrl: './email.scss',
})
export class Email {
  private readonly rota = inject(ActivatedRoute);
  private readonly servico = inject(AuditoriasService);
  private readonly equipeServico = inject(EquipeService);
  private readonly preferencias = inject(PreferenciasService);

  private readonly id = this.rota.snapshot.paramMap.get('id') ?? '';

  protected readonly icones = ICONES;

  protected readonly estado = signal<{ carregando: boolean; erro: string | null }>({
    carregando: true,
    erro: null,
  });

  protected readonly auditoria = signal<Auditoria | null>(null);
  protected readonly equipe = signal<Responsavel[]>([]);
  protected readonly selecionados = signal<string[]>([]);
  protected readonly prazo = signal('');
  protected readonly assunto = signal('');
  protected readonly mensagem = signal('');
  protected readonly mensagemEditada = signal(false);
  protected readonly copiado = signal('');
  protected readonly salvando = signal(false);
  protected readonly salvo = signal(false);

  protected readonly destinatarios = computed(() =>
    this.equipe()
      .filter((pessoa) => this.selecionados().includes(pessoa.id))
      .map((pessoa) => pessoa.email),
  );

  protected readonly textoDestinatarios = computed(() => this.destinatarios().join('; '));

  constructor() {
    this.carregar();

    effect(() => {
      const atual = this.auditoria();
      const prazo = this.prazo();
      const lista = this.destinatarios();

      if (!atual || this.mensagemEditada()) {
        return;
      }

      this.mensagem.set(this.montarMensagem(atual, prazo, lista));
    });
  }

  protected alternarDestinatario(id: string): void {
    this.selecionados.update((atuais) =>
      atuais.includes(id) ? atuais.filter((item) => item !== id) : [...atuais, id],
    );
  }

  protected definirPrazo(valor: string): void {
    this.prazo.set(valor);
  }

  protected editarMensagem(valor: string): void {
    this.mensagemEditada.set(true);
    this.mensagem.set(valor);
  }

  protected restaurarMensagem(): void {
    this.mensagemEditada.set(false);
    const atual = this.auditoria();

    if (atual) {
      this.mensagem.set(this.montarMensagem(atual, this.prazo(), this.destinatarios()));
    }
  }

  protected copiar(qual: 'destinatarios' | 'assunto' | 'mensagem'): void {
    const texto =
      qual === 'destinatarios'
        ? this.textoDestinatarios()
        : qual === 'assunto'
          ? this.assunto()
          : this.mensagem();

    navigator.clipboard
      .writeText(texto)
      .then(() => {
        this.copiado.set(qual);
        setTimeout(() => this.copiado.set(''), 2000);
      })
      .catch(() => this.copiado.set('falhou'));
  }

  protected salvarComunicado(): void {
    const atual = this.auditoria();

    if (!atual || !this.prazo() || !this.selecionados().length) {
      return;
    }

    this.salvando.set(true);

    this.servico
      .salvarComunicado(atual.id, {
        destinatariosIds: this.selecionados(),
        prazo: this.prazo(),
        assunto: this.assunto(),
        mensagem: this.mensagem(),
        geradoEm: new Date().toISOString(),
      })
      .subscribe({
        next: (auditoria) => {
          this.auditoria.set(auditoria);
          this.salvando.set(false);
          this.salvo.set(true);
        },
        error: () => this.salvando.set(false),
      });
  }

  private carregar(): void {
    this.estado.set({ carregando: true, erro: null });

    this.servico.buscarPorId(this.id).subscribe({
      next: (auditoria) => {
        this.auditoria.set(auditoria);

        if (!auditoria) {
          this.estado.set({ carregando: false, erro: null });
          return;
        }

        this.assunto.set(
          'Auditoria de estoque — ' +
            auditoria.obraNome +
            ' — ' +
            this.formatarData(auditoria.concluidaEm ?? auditoria.iniciadaEm),
        );

        this.prazo.set(auditoria.comunicado?.prazo ?? this.prazoPadrao());

        this.equipeServico.listarPorObra(auditoria.obraId).subscribe({
          next: (equipe) => {
            this.equipe.set(equipe);
            this.selecionados.set(
              auditoria.comunicado?.destinatariosIds ??
                equipe.filter((pessoa) => pessoa.ativo && pessoa.receberEmail).map((p) => p.id),
            );
            this.estado.set({ carregando: false, erro: null });
          },
          error: () =>
            this.estado.set({ carregando: false, erro: 'Falha ao carregar a equipe da obra.' }),
        });
      },
      error: () => this.estado.set({ carregando: false, erro: 'Falha ao carregar a auditoria.' }),
    });
  }

  private prazoPadrao(): string {
    const data = new Date();
    data.setDate(data.getDate() + this.preferencias.valores().prazoPadraoDias);
    return data.toISOString().slice(0, 10);
  }

  private formatarData(valor: string): string {
    return new Date(valor).toLocaleDateString('pt-BR');
  }

  private montarMensagem(auditoria: Auditoria, prazo: string, destinatarios: string[]): string {
    const faltas: string[] = [];
    const sobras: string[] = [];

    for (const item of auditoria.itens) {
      if (!divergente(item)) {
        continue;
      }

      const diferenca = diferencaQuantidade(item) ?? 0;
      const valor = diferencaValor(item);
      const sufixo =
        valor === null
          ? ' (valor de referência não disponível)'
          : ' (' + Math.abs(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + ')';

      const linha =
        '  ' +
        item.codigo +
        '  ' +
        item.descricao +
        ' — sistema ' +
        item.quantidadeSistema.toLocaleString('pt-BR') +
        ', contado ' +
        (item.quantidadeReal ?? 0).toLocaleString('pt-BR') +
        ' ' +
        item.unidade +
        sufixo;

      if (diferenca < 0) {
        faltas.push(linha);
      } else {
        sobras.push(linha);
      }
    }

    const fora = auditoria.foraDoEstoque.map(
      (achado) =>
        '  ' +
        achado.descricao +
        ' — ' +
        achado.quantidade.toLocaleString('pt-BR') +
        ' ' +
        achado.unidade +
        (achado.local ? ' — ' + achado.local : '') +
        (achado.observacao ? ' — ' + achado.observacao : ''),
    );

    const naoContados = auditoria.itens
      .filter((item) => item.situacao === 'NAO_CONTADO')
      .map(
        (item) =>
          '  ' +
          item.codigo +
          '  ' +
          item.descricao +
          ' — ' +
          (MOTIVOS.find((motivo) => motivo.valor === item.motivoNaoContagem)?.rotulo ??
            'sem motivo informado'),
      );

    const bloco = (titulo: string, linhas: string[], vazio: string) =>
      titulo + '\n' + (linhas.length ? linhas.join('\n') : '  ' + vazio);

    return [
      'Prezados,',
      '',
      'Segue o resultado da auditoria de estoque realizada na obra ' +
        auditoria.obraNome +
        (auditoria.filialNome ? ' (' + auditoria.filialNome + ')' : '') +
        '. O estoque de referência foi extraído em ' +
        new Date(auditoria.referencia.capturadoEm).toLocaleString('pt-BR') +
        '.',
      '',
      'Prazo para regularização: ' + (prazo ? this.formatarData(prazo + 'T00:00:00') : 'a definir'),
      '',
      bloco(
        'FALTAS — material no sistema que não foi encontrado na obra',
        faltas,
        'nenhuma falta identificada',
      ),
      '',
      bloco(
        'SOBRAS — material encontrado acima do saldo do sistema',
        sobras,
        'nenhuma sobra identificada',
      ),
      '',
      bloco('ENCONTRADOS FORA DO ESTOQUE', fora, 'nenhum registro'),
      '',
      bloco('ITENS NÃO CONTADOS', naoContados, 'nenhum'),
      '',
      'As fotos e observações de cada apontamento estão no relatório desta auditoria.',
      '',
      'Atenciosamente,',
      auditoria.responsavel,
      destinatarios.length ? '' : '(selecione os destinatários para concluir o envio)',
    ].join('\n');
  }
}
