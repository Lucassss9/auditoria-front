import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { prazoVencido } from '../../core/domain/auditoria-calculos';
import { Auditoria } from '../../core/models/auditoria.model';
import { Obra } from '../../core/models/obra.model';
import { AuditoriasService } from '../../core/services/auditorias.service';
import { ObrasService } from '../../core/services/obras.service';
import { Requisicao } from '../../core/utils/requisicao';
import { AvisoErro } from '../../shared/components/aviso-erro/aviso-erro';
import { CabecalhoPagina } from '../../shared/components/cabecalho-pagina/cabecalho-pagina';
import { Carregando } from '../../shared/components/carregando/carregando';
import { TabelaAuditorias } from '../auditorias/componentes/tabela-auditorias/tabela-auditorias';

type FiltroSituacao = '' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA' | 'PRAZO_VENCIDO';

interface DadosHistorico {
  auditorias: Auditoria[];
  obras: Obra[];
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

  protected readonly obraSelecionada = signal('');
  protected readonly situacao = signal<FiltroSituacao>('');
  protected readonly de = signal('');
  protected readonly ate = signal('');

  protected readonly obras = computed(() => this.estado().dados?.obras ?? []);

  protected readonly filtradas = computed(() => {
    const todas = this.estado().dados?.auditorias ?? [];
    const obraId = this.obraSelecionada();
    const situacao = this.situacao();
    const de = this.de() ? new Date(this.de() + 'T00:00:00').getTime() : null;
    const ate = this.ate() ? new Date(this.ate() + 'T23:59:59').getTime() : null;

    return todas.filter((auditoria) => {
      if (obraId && auditoria.obraId !== obraId) {
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
    this.obraSelecionada.set('');
    this.situacao.set('');
    this.de.set('');
    this.ate.set('');
  }
}
