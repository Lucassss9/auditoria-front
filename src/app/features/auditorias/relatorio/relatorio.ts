import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import {
  diferencaQuantidade,
  diferencaValor,
  divergente,
  resumirAuditoria,
} from '../../../core/domain/auditoria-calculos';
import { Auditoria, Evidencia, ItemAuditoria } from '../../../core/models/auditoria.model';
import { AuditoriasService } from '../../../core/services/auditorias.service';
import { Requisicao } from '../../../core/utils/requisicao';
import { AvisoErro } from '../../../shared/components/aviso-erro/aviso-erro';
import { CabecalhoPagina } from '../../../shared/components/cabecalho-pagina/cabecalho-pagina';
import { Carregando } from '../../../shared/components/carregando/carregando';
import { EstadoVazio } from '../../../shared/components/estado-vazio/estado-vazio';
import { DiferencaPipe } from '../../../shared/pipes/diferenca.pipe';
import { MoedaPipe } from '../../../shared/pipes/moeda.pipe';
import { QuantidadePipe } from '../../../shared/pipes/quantidade.pipe';
import { ICONES } from '../../../shared/icones';
import { MOTIVOS } from '../conferencia/conferencia';

interface LinhaDivergencia {
  item: ItemAuditoria;
  diferenca: number;
  valor: number | null;
}

interface GrupoEvidencias {
  titulo: string;
  evidencias: Evidencia[];
}

@Component({
  selector: 'app-relatorio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    RouterLink,
    LucideAngularModule,
    AvisoErro,
    CabecalhoPagina,
    Carregando,
    EstadoVazio,
    DiferencaPipe,
    MoedaPipe,
    QuantidadePipe,
  ],
  templateUrl: './relatorio.html',
  styleUrl: './relatorio.scss',
})
export class Relatorio {
  private readonly rota = inject(ActivatedRoute);
  private readonly servico = inject(AuditoriasService);

  private readonly id = this.rota.snapshot.paramMap.get('id') ?? '';

  protected readonly icones = ICONES;

  protected readonly requisicao = new Requisicao<Auditoria | null>(() =>
    this.servico.buscarPorId(this.id),
  );

  protected readonly estado = this.requisicao.estado;
  protected readonly auditoria = computed(() => this.estado().dados ?? null);

  protected readonly resumo = computed(() => {
    const atual = this.auditoria();
    return atual ? resumirAuditoria(atual) : null;
  });

  protected readonly divergenciasQuantidade = computed<LinhaDivergencia[]>(() =>
    (this.auditoria()?.itens ?? [])
      .filter((item) => divergente(item))
      .map((item) => ({
        item,
        diferenca: diferencaQuantidade(item) ?? 0,
        valor: diferencaValor(item),
      }))
      .sort((a, b) => Math.abs(b.diferenca) - Math.abs(a.diferenca)),
  );

  protected readonly divergenciasValor = computed<LinhaDivergencia[]>(() =>
    this.divergenciasQuantidade()
      .filter((linha) => linha.valor !== null)
      .sort((a, b) => Math.abs(b.valor ?? 0) - Math.abs(a.valor ?? 0)),
  );

  protected readonly semValorCalculavel = computed(() =>
    this.divergenciasQuantidade().filter((linha) => linha.valor === null),
  );

  protected readonly naoContados = computed(() =>
    (this.auditoria()?.itens ?? []).filter((item) => item.situacao === 'NAO_CONTADO'),
  );

  protected readonly naoConferidos = computed(() =>
    (this.auditoria()?.itens ?? []).filter((item) => item.situacao === 'NAO_CONFERIDO'),
  );

  protected readonly gruposDeEvidencias = computed<GrupoEvidencias[]>(() => {
    const atual = this.auditoria();

    if (!atual) {
      return [];
    }

    const grupos: GrupoEvidencias[] = [];

    for (const item of atual.itens) {
      if (item.evidencias.length) {
        grupos.push({ titulo: item.codigo + ' · ' + item.descricao, evidencias: item.evidencias });
      }
    }

    for (const achado of atual.foraDoEstoque) {
      if (achado.evidencias.length) {
        grupos.push({ titulo: achado.descricao, evidencias: achado.evidencias });
      }
    }

    return grupos;
  });

  protected readonly observacoes = computed(() =>
    (this.auditoria()?.itens ?? []).filter((item) => item.observacao.trim().length > 0),
  );

  protected rotuloMotivo(valor: ItemAuditoria['motivoNaoContagem']): string {
    return MOTIVOS.find((item) => item.valor === valor)?.rotulo ?? 'Sem motivo informado';
  }

  protected salvarPdf(): void {
    window.print();
  }
}
