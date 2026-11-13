import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '../../../environments/environment';
import { AutenticacaoService } from '../../core/services/autenticacao.service';
import { ContextoService } from '../../core/services/contexto.service';
import { SessaoService } from '../../core/services/sessao.service';
import { SeletorTema } from '../../shared/components/seletor-tema/seletor-tema';
import { IniciaisPipe } from '../../shared/pipes/iniciais.pipe';
import { ICONES } from '../../shared/icones';

@Component({
  selector: 'app-topbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LucideAngularModule, SeletorTema, IniciaisPipe],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  private readonly contexto = inject(ContextoService);
  private readonly sessao = inject(SessaoService);
  private readonly autenticacao = inject(AutenticacaoService);
  private readonly router = inject(Router);

  readonly recolhida = input(false);
  readonly podeAlternar = input(true);
  readonly alternar = output<void>();

  protected readonly icones = ICONES;
  protected readonly usandoMock = environment.usarDadosMock;
  protected readonly obra = this.contexto.obraSelecionada;
  protected readonly usuario = this.sessao.usuario;
  protected readonly menuAberto = signal(false);

  @HostListener('document:keydown.escape')
  protected fecharComEsc(): void {
    this.menuAberto.set(false);
  }

  protected alternarMenu(): void {
    this.menuAberto.update((valor) => !valor);
  }

  protected fecharMenu(): void {
    this.menuAberto.set(false);
  }

  protected limparObra(): void {
    this.contexto.selecionarObra(null);
  }

  protected sair(): void {
    this.fecharMenu();

    this.autenticacao.sair().subscribe(() => {
      this.sessao.encerrar();
      this.contexto.selecionarObra(null);
      void this.router.navigate(['/entrar']);
    });
  }
}
