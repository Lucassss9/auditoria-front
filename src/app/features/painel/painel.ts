import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { prazoVencido, resumirAuditoria } from '../../core/domain/auditoria-calculos';
import { Auditoria } from '../../core/models/auditoria.model';
import { AuditoriasService } from '../../core/services/auditorias.service';
import { Requisicao } from '../../core/utils/requisicao';
import { AvisoErro } from '../../shared/components/aviso-erro/aviso-erro';
import { CabecalhoPagina } from '../../shared/components/cabecalho-pagina/cabecalho-pagina';
import { Carregando } from '../../shared/components/carregando/carregando';
import { CartaoMetrica } from '../../shared/components/cartao-metrica/cartao-metrica';
import { EstadoVazio } from '../../shared/components/estado-vazio/estado-vazio';
import { Selo, TipoSelo } from '../../shared/components/selo/selo';
import { ICONES } from '../../shared/icones';

interface Atividade {
  id: string;
  data: string;
  texto: string;
  obra: string;
}

@Component({
  selector: 'app-painel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    RouterLink,
    LucideAngularModule,
    AvisoErro,
    CabecalhoPagina,
    Carregando,
    CartaoMetrica,
    EstadoVazio,
    Selo,
  ],
  templateUrl: './painel.html',
  styleUrl: './painel.scss',
})
export class Painel {
  private readonly servico = inject(AuditoriasService);

  protected readonly icones = ICONES;
  protected readonly requisicao = new Requisicao(() => this.servico.listar());
  protected readonly estado = this.requisicao.estado;

  protected readonly auditorias = computed(() => this.estado().dados ?? []);

  protected readonly indicadores = computed(() => {
    const lista = this.auditorias();

    return {
      total: lista.length,
      emAndamento: lista.filter((item) => item.status === 'EM_ANDAMENTO').length,
      aguardando: lista.filter(
        (item) => item.status === 'CONCLUIDA' && !!item.comunicado && !prazoVencido(item),
      ).length,
      vencidos: lista.filter((item) => prazoVencido(item)).length,
    };
  });

  protected readonly recentes = computed(() =>
    this.auditorias()
      .slice(0, 6)
      .map((auditoria) => ({
        auditoria,
        resumo: resumirAuditoria(auditoria),
        situacao: this.descreverSituacao(auditoria),
        tom: this.tomSituacao(auditoria),
        rota:
          auditoria.status === 'EM_ANDAMENTO'
            ? ['/auditorias', auditoria.id]
            : ['/auditorias', auditoria.id, 'relatorio'],
      })),
  );

  protected readonly atividades = computed(() => {
    const eventos: Atividade[] = [];

    for (const auditoria of this.auditorias()) {
      eventos.push({
        id: auditoria.id + '-inicio',
        data: auditoria.iniciadaEm,
        texto: 'Auditoria iniciada',
        obra: auditoria.obraNome,
      });

      if (auditoria.concluidaEm) {
        eventos.push({
          id: auditoria.id + '-fim',
          data: auditoria.concluidaEm,
          texto: auditoria.status === 'CANCELADA' ? 'Auditoria cancelada' : 'Auditoria concluída',
          obra: auditoria.obraNome,
        });
      }

      if (auditoria.comunicado) {
        eventos.push({
          id: auditoria.id + '-comunicado',
          data: auditoria.comunicado.geradoEm,
          texto: 'E-mail preparado com prazo até ' + this.formatarData(auditoria.comunicado.prazo),
          obra: auditoria.obraNome,
        });
      }
    }

    return eventos
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 7);
  });

  private descreverSituacao(auditoria: Auditoria): string {
    if (auditoria.status === 'EM_ANDAMENTO') {
      return 'Em andamento';
    }

    if (auditoria.status === 'CANCELADA') {
      return 'Cancelada';
    }

    if (prazoVencido(auditoria)) {
      return 'Prazo vencido';
    }

    return auditoria.comunicado ? 'Aguardando obra' : 'Concluída';
  }

  private tomSituacao(auditoria: Auditoria): TipoSelo {
    if (auditoria.status === 'EM_ANDAMENTO') {
      return 'info';
    }

    if (auditoria.status === 'CANCELADA') {
      return 'neutro';
    }

    if (prazoVencido(auditoria)) {
      return 'erro';
    }

    return auditoria.comunicado ? 'atencao' : 'ok';
  }

  private formatarData(valor: string): string {
    return new Date(valor + 'T00:00:00').toLocaleDateString('pt-BR');
  }
}
