import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '../../../environments/environment';
import { AutenticacaoService } from '../../core/services/autenticacao.service';
import { SessaoService } from '../../core/services/sessao.service';
import { Logo } from '../../shared/components/logo/logo';
import { SeletorTema } from '../../shared/components/seletor-tema/seletor-tema';
import { ICONES } from '../../shared/icones';

@Component({
  selector: 'app-entrar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LucideAngularModule, Logo, SeletorTema],
  templateUrl: './entrar.html',
  styleUrl: './entrar.scss',
})
export class Entrar {
  private readonly fb = inject(FormBuilder);
  private readonly autenticacao = inject(AutenticacaoService);
  private readonly sessao = inject(SessaoService);
  private readonly router = inject(Router);
  private readonly rota = inject(ActivatedRoute);

  protected readonly icones = ICONES;
  protected readonly usandoMock = environment.usarDadosMock;
  protected readonly enviando = signal(false);
  protected readonly erro = signal<string | null>(null);
  protected readonly mostrarSenha = signal(false);

  protected readonly formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected alternarSenha(): void {
    this.mostrarSenha.update((valor) => !valor);
  }

  protected preencherDemonstracao(): void {
    this.formulario.setValue({ email: 'auditor@exemplo.com.br', senha: 'demo1234' });
    this.erro.set(null);
  }

  protected entrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.erro.set(null);

    this.autenticacao.entrar(this.formulario.getRawValue()).subscribe({
      next: (usuario) => {
        this.sessao.abrir(usuario);
        this.enviando.set(false);
        const destino = this.rota.snapshot.queryParamMap.get('destino') ?? '/inicio';
        void this.router.navigateByUrl(destino);
      },
      error: (falha: unknown) => {
        this.enviando.set(false);
        this.erro.set(
          falha instanceof Error ? falha.message : 'Não foi possível entrar. Tente novamente.',
        );
      },
    });
  }

  protected campoInvalido(nome: 'email' | 'senha'): boolean {
    const campo = this.formulario.get(nome);
    return !!campo && campo.invalid && campo.touched;
  }
}
