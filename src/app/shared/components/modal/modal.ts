import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ICONES } from '../../icones';

@Component({
  selector: 'app-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  readonly titulo = input.required<string>();
  readonly fechar = output<void>();
  protected readonly icones = ICONES;

  @HostListener('document:keydown.escape')
  aoPressionarEsc(): void {
    this.fechar.emit();
  }

  protected aoClicarFundo(evento: MouseEvent): void {
    if (evento.target === evento.currentTarget) {
      this.fechar.emit();
    }
  }
}
