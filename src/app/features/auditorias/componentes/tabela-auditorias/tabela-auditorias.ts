import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { prazoVencido, resumirAuditoria } from '../../../../core/domain/auditoria-calculos';
import { Auditoria } from '../../../../core/models/auditoria.model';
import { EstadoVazio } from '../../../../shared/components/estado-vazio/estado-vazio';
import { Selo, TipoSelo } from '../../../../shared/components/selo/selo';

@Component({
  selector: 'app-tabela-auditorias',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterLink, EstadoVazio, Selo],
  templateUrl: './tabela-auditorias.html',
  styleUrl: './tabela-auditorias.scss',
})
export class TabelaAuditorias {
  readonly auditorias = input.required<Auditoria[]>();
  readonly tituloVazio = input('Nenhuma auditoria encontrada');
  readonly descricaoVazio = input('Ajuste os filtros para ver outros registros.');

  protected readonly linhas = computed(() =>
    this.auditorias().map((auditoria) => ({
      auditoria,
      resumo: resumirAuditoria(auditoria),
      situacao: this.descrever(auditoria),
      tom: this.tom(auditoria),
      rota:
        auditoria.status === 'EM_ANDAMENTO'
          ? ['/auditorias', auditoria.id]
          : ['/auditorias', auditoria.id, 'relatorio'],
    })),
  );

  private descrever(auditoria: Auditoria): string {
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

  private tom(auditoria: Auditoria): TipoSelo {
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
}
