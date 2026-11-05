import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { resumirAuditoria } from '../../../core/domain/auditoria-calculos';
import { Auditoria } from '../../../core/models/auditoria.model';
import { FUNCOES, Responsavel } from '../../../core/models/equipe.model';
import { ObraResumo } from '../../../core/models/obra.model';
import { AuditoriasService } from '../../../core/services/auditorias.service';
import { EquipeService } from '../../../core/services/equipe.service';
import { ObrasService } from '../../../core/services/obras.service';
import { Requisicao } from '../../../core/utils/requisicao';
import { AvisoErro } from '../../../shared/components/aviso-erro/aviso-erro';
import { CabecalhoPagina } from '../../../shared/components/cabecalho-pagina/cabecalho-pagina';
import { Carregando } from '../../../shared/components/carregando/carregando';
import { EstadoVazio } from '../../../shared/components/estado-vazio/estado-vazio';
import { Selo } from '../../../shared/components/selo/selo';

interface DadosObra {
  obra: ObraResumo | null;
  equipe: Responsavel[];
  auditorias: Auditoria[];
}

@Component({
  selector: 'app-obra-detalhe',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterLink, AvisoErro, CabecalhoPagina, Carregando, EstadoVazio, Selo],
  templateUrl: './obra-detalhe.html',
  styleUrl: './obra-detalhe.scss',
})
export class ObraDetalhe {
  private readonly rota = inject(ActivatedRoute);
  private readonly obras = inject(ObrasService);
  private readonly equipe = inject(EquipeService);
  private readonly auditorias = inject(AuditoriasService);

  private readonly id = this.rota.snapshot.paramMap.get('id') ?? '';

  protected readonly requisicao = new Requisicao<DadosObra>(() =>
    forkJoin({
      obra: this.obras.buscarPorId(this.id),
      equipe: this.equipe.listarPorObra(this.id),
      auditorias: this.auditorias.listar(),
    }),
  );

  protected readonly estado = this.requisicao.estado;

  protected readonly obra = computed(() => this.estado().dados?.obra ?? null);

  protected readonly equipeDaObra = computed(() => this.estado().dados?.equipe ?? []);

  protected readonly auditoriasDaObra = computed(() =>
    (this.estado().dados?.auditorias ?? [])
      .filter((item) => item.obraId === this.id)
      .map((auditoria) => ({ auditoria, resumo: resumirAuditoria(auditoria) })),
  );

  protected readonly trilha = computed(() => [
    { rotulo: 'Obras', rota: '/obras' },
    { rotulo: this.obra()?.nome ?? 'Obra' },
  ]);

  protected rotuloFuncao(valor: Responsavel['funcao']): string {
    return FUNCOES.find((item) => item.valor === valor)?.rotulo ?? valor;
  }

  protected rotaDaAuditoria(auditoria: Auditoria): unknown[] {
    return auditoria.status === 'EM_ANDAMENTO'
      ? ['/auditorias', auditoria.id]
      : ['/auditorias', auditoria.id, 'relatorio'];
  }
}
