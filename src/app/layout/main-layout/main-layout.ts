import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';

const LARGURA_ESTREITA = '(max-width: 880px)';

@Component({
  selector: 'app-main-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Sidebar, Topbar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  private readonly destruir = inject(DestroyRef);

  private readonly consulta = window.matchMedia(LARGURA_ESTREITA);
  private readonly estreito = signal(this.consulta.matches);
  private readonly recolhidaPorEscolha = signal(false);

  protected readonly recolhida = computed(() => this.estreito() || this.recolhidaPorEscolha());
  protected readonly podeAlternar = computed(() => !this.estreito());

  constructor() {
    const aoMudar = (evento: MediaQueryListEvent) => this.estreito.set(evento.matches);
    this.consulta.addEventListener('change', aoMudar);
    this.destruir.onDestroy(() => this.consulta.removeEventListener('change', aoMudar));
  }

  protected alternarMenu(): void {
    if (this.estreito()) {
      return;
    }

    this.recolhidaPorEscolha.update((valor) => !valor);
  }
}
