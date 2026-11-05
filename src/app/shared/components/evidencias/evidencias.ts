import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Evidencia } from '../../../core/models/auditoria.model';
import { novoId } from '../../../core/utils/texto';
import { ICONES } from '../../icones';

@Component({
  selector: 'app-evidencias',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  templateUrl: './evidencias.html',
  styleUrl: './evidencias.scss',
})
export class Evidencias {
  readonly lista = model<Evidencia[]>([]);
  readonly somenteLeitura = input(false);
  protected readonly icones = ICONES;

  protected aoEscolher(evento: Event): void {
    const entrada = evento.target as HTMLInputElement;
    const arquivos = Array.from(entrada.files ?? []);

    for (const arquivo of arquivos) {
      const leitor = new FileReader();

      leitor.onload = () => {
        const nova: Evidencia = {
          id: novoId('ev'),
          nome: arquivo.name,
          conteudo: String(leitor.result ?? ''),
          criadoEm: new Date().toISOString(),
        };
        this.lista.update((atuais) => [...atuais, nova]);
      };

      leitor.readAsDataURL(arquivo);
    }

    entrada.value = '';
  }

  protected remover(id: string): void {
    this.lista.update((atuais) => atuais.filter((item) => item.id !== id));
  }
}
