import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Auditoria, StatusAuditoria } from '../../core/models/auditoria.model';
import { AuditoriasService } from '../../core/services/auditorias.service';
import { contemTermo } from '../../core/utils/texto';
import { Requisicao } from '../../core/utils/requisicao';
import { AvisoErro } from '../../shared/components/aviso-erro/aviso-erro';
import { CabecalhoPagina } from '../../shared/components/cabecalho-pagina/cabecalho-pagina';
import { Carregando } from '../../shared/components/carregando/carregando';
import { ICONES } from '../../shared/icones';
import { TabelaAuditorias } from './componentes/tabela-auditorias/tabela-auditorias';

@Component({
  selector: 'app-auditorias',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    LucideAngularModule,
    AvisoErro,
    CabecalhoPagina,
    Carregando,
    TabelaAuditorias,
  ],
  templateUrl: './auditorias.html',
  styleUrl: './auditorias.scss',
})
export class Auditorias {
  private readonly servico = inject(AuditoriasService);

  protected readonly icones = ICONES;
  protected readonly requisicao = new Requisicao<Auditoria[]>(() => this.servico.listar());
  protected readonly estado = this.requisicao.estado;

  protected readonly termo = signal('');
  protected readonly status = signal<StatusAuditoria | ''>('');

  protected readonly todas = computed(() => this.estado().dados ?? []);

  protected readonly filtradas = computed(() => {
    const termo = this.termo().trim();
    const status = this.status();

    return this.todas().filter((auditoria) => {
      const casaTermo =
        !termo ||
        contemTermo(auditoria.obraNome, termo) ||
        contemTermo(auditoria.responsavel, termo);
      const casaStatus = !status || auditoria.status === status;
      return casaTermo && casaStatus;
    });
  });

  protected limpar(): void {
    this.termo.set('');
    this.status.set('');
  }
}
