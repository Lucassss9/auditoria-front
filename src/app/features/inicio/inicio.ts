import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import {
  prazoVencido,
  progresso,
  resumirAuditoria,
} from '../../core/domain/auditoria-calculos';
import { Auditoria } from '../../core/models/auditoria.model';
import { AuditoriasService } from '../../core/services/auditorias.service';
import { Requisicao } from '../../core/utils/requisicao';
import { AvisoErro } from '../../shared/components/aviso-erro/aviso-erro';
import { Carregando } from '../../shared/components/carregando/carregando';
import { EstadoVazio } from '../../shared/components/estado-vazio/estado-vazio';
import { Selo } from '../../shared/components/selo/selo';
import { MoedaPipe } from '../../shared/pipes/moeda.pipe';
import { ICONES } from '../../shared/icones';

interface Atividade {
  id: string;
  data: string;
  texto: string;
  obra: string;
  tipo: 'inicio' | 'fim' | 'comunicado';
}

interface Pendencia {
  auditoria: Auditoria;
  rotulo: string;
  detalhe: string;
  vencido: boolean;
  valor: number;
}

@Component({
  selector: 'app-inicio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    RouterLink,
    LucideAngularModule,
    AvisoErro,
    Carregando,
    EstadoVazio,
    Selo,
    MoedaPipe,
  ],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {
  private readonly servico = inject(AuditoriasService);

  protected readonly icones = ICONES;
  protected readonly requisicao = new Requisicao(() => this.servico.listar());
  protected readonly estado = this.requisicao.estado;

  protected readonly auditorias = computed(() => this.estado().dados ?? []);

  protected readonly emAndamento = computed(() =>
    this.auditorias()
      .filter((item) => item.status === 'EM_ANDAMENTO')
      .map((auditoria) => {
        const resumo = resumirAuditoria(auditoria);
        return {
          auditoria,
          resumo,
          percentual: progresso(auditoria),
          restantes: resumo.naoConferidos,
        };
      }),
  );

  protected readonly numeros = computed(() => {
    const lista = this.auditorias();

    return {
      total: lista.length,
      andamento: lista.filter((item) => item.status === 'EM_ANDAMENTO').length,
      aguardando: lista.filter(
        (item) => item.status === 'CONCLUIDA' && !!item.comunicado && !prazoVencido(item),
      ).length,
      vencidos: lista.filter((item) => prazoVencido(item)).length,
    };
  });

  protected readonly pendencias = computed<Pendencia[]>(() =>
    this.auditorias()
      .filter((auditoria) => auditoria.status === 'CONCLUIDA' && !!auditoria.comunicado)
      .map((auditoria) => {
        const resumo = resumirAuditoria(auditoria);
        const vencido = prazoVencido(auditoria);

        return {
          auditoria,
          rotulo: vencido ? 'Prazo vencido' : 'Aguardando a obra',
          detalhe:
            resumo.divergentes +
            ' divergências · prazo ' +
            this.formatarData(auditoria.comunicado?.prazo ?? ''),
          vencido,
          valor: resumo.valorFalta,
        };
      })
      .sort((a, b) => Number(b.vencido) - Number(a.vencido) || b.valor - a.valor),
  );

  protected readonly atividades = computed(() => {
    const eventos: Atividade[] = [];

    for (const auditoria of this.auditorias()) {
      eventos.push({
        id: auditoria.id + '-inicio',
        data: auditoria.iniciadaEm,
        texto: 'Contagem iniciada',
        obra: auditoria.obraNome,
        tipo: 'inicio',
      });

      if (auditoria.concluidaEm) {
        eventos.push({
          id: auditoria.id + '-fim',
          data: auditoria.concluidaEm,
          texto: auditoria.status === 'CANCELADA' ? 'Auditoria cancelada' : 'Conferência concluída',
          obra: auditoria.obraNome,
          tipo: 'fim',
        });
      }

      if (auditoria.comunicado) {
        eventos.push({
          id: auditoria.id + '-comunicado',
          data: auditoria.comunicado.geradoEm,
          texto: 'E-mail preparado, prazo até ' + this.formatarData(auditoria.comunicado.prazo),
          obra: auditoria.obraNome,
          tipo: 'comunicado',
        });
      }
    }

    return eventos
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 8);
  });

  private formatarData(valor: string): string {
    if (!valor) {
      return 'sem data';
    }

    return new Date(valor + 'T00:00:00').toLocaleDateString('pt-BR');
  }
}
