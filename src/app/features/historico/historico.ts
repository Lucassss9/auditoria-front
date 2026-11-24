import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { prazoVencido } from '../../core/domain/auditoria-calculos';
import { Auditoria } from '../../core/models/auditoria.model';
import { ObraResumo } from '../../core/models/obra.model';
import { AuditoriasService } from '../../core/services/auditorias.service';
import { ObrasService } from '../../core/services/obras.service';
import {
  obrasDaFilial,
  obrasDoEstado,
  ESTADOS,
  opcoesDeFilial,
  rotuloDaFilial,
  rotuloDaObra,
} from '../../core/utils/filtro-filial';
import { Requisicao } from '../../core/utils/requisicao';
import { AvisoErro } from '../../shared/components/aviso-erro/aviso-erro';
import { CabecalhoPagina } from '../../shared/components/cabecalho-pagina/cabecalho-pagina';
import { Carregando } from '../../shared/components/carregando/carregando';
import { TabelaAuditorias } from '../auditorias/componentes/tabela-auditorias/tabela-auditorias';

type FiltroSituacao = '' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA' | 'PRAZO_VENCIDO';

interface DadosHistorico {
  auditorias: Auditoria[];
  obras: ObraResumo[];
}

@Component({
  selector: 'app-historico',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvisoErro, CabecalhoPagina, Carregando, TabelaAuditorias],
  templateUrl: './historico.html',
  styleUrl: './historico.scss',
})
export class Historico {
  private readonly servico = inject(AuditoriasService);
  private readonly obrasServico = inject(ObrasService);

  protected readonly requisicao = new Requisicao<DadosHistorico>(() =>
    forkJoin({
      auditorias: this.servico.listar(),
      obras: this.obrasServico.listar(),
    }),
  );

  protected readonly estado = this.requisicao.estado;

  protected readonly estadoSelecionado = signal('');
  protected readonly filialSelecionada = signal('');
  protected readonly obraSelecionada = signal('');
  protected readonly situacao = signal<FiltroSituacao>('');
  protected readonly de = signal('');
  protected readonly ate = signal('');

  protected readonly obras = computed(() => this.estado().dados?.obras ?? []);

  protected readonly rotuloDaObra = rotuloDaObra;
  protected readonly estados = ESTADOS;

  protected readonly obrasVisiveis = computed(() =>
    obrasDoEstado(this.obras(), this.estadoSelecionado(), (obra) => obra.filial?.regional),
  );

  protected readonly filiais = computed(() =>
    opcoesDeFilial(this.obrasVisiveis(), (obra) => rotuloDaFilial(obra.filial)),
  );

  protected readonly obrasDaFilial = computed(() =>
    obrasDaFilial(this.obrasVisiveis(), this.filialSelecionada()),
  );

  protected trocarEstado(valor: string): void {
    this.estadoSelecionado.set(valor);
    this.filialSelecionada.set('');
    this.obraSelecionada.set('');
  }

  protected trocarFilial(valor: string): void {
    this.filialSelecionada.set(valor);
    this.obraSelecionada.set('');
  }

  protected readonly filtradas = computed(() => {
    const todas = this.estado().dados?.auditorias ?? [];
    const obraId = this.obraSelecionada();
    const situacao = this.situacao();
    const de = this.de() ? new Date(this.de() + 'T00:00:00').getTime() : null;
    const ate = this.ate() ? new Date(this.ate() + 'T23:59:59').getTime() : null;

    // Filial escolhida sem obra: vale o histórico de todas as obras dela.
    // Estado sem filial: idem, para todas as obras daquele estado.
    const escopo =
      obraId || (!this.filialSelecionada() && !this.estadoSelecionado())
        ? null
        : new Set(
            (this.filialSelecionada() ? this.obrasDaFilial() : this.obrasVisiveis()).map(
              (obra) => obra.id,
            ),
          );

    return todas.filter((auditoria) => {
      if (obraId && auditoria.obraId !== obraId) {
        return false;
      }

      if (escopo && !escopo.has(auditoria.obraId)) {
        return false;
      }

      const inicio = new Date(auditoria.iniciadaEm).getTime();

      if (de !== null && inicio < de) {
        return false;
      }

      if (ate !== null && inicio > ate) {
        return false;
      }

      if (!situacao) {
        return true;
      }

      if (situacao === 'PRAZO_VENCIDO') {
        return prazoVencido(auditoria);
      }

      return auditoria.status === situacao;
    });
  });

  protected readonly vencidas = computed(
    () => this.filtradas().filter((auditoria) => prazoVencido(auditoria)).length,
  );

  protected limpar(): void {
    this.estadoSelecionado.set('');
    this.filialSelecionada.set('');
    this.obraSelecionada.set('');
    this.situacao.set('');
    this.de.set('');
    this.ate.set('');
  }
}
