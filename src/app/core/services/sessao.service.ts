import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AutenticacaoService } from './autenticacao.service';

@Injectable({ providedIn: 'root' })
export class SessaoService {
  private readonly autenticacao = inject(AutenticacaoService);

  private readonly interno = signal<Usuario | null>(null);

  readonly usuario = this.interno.asReadonly();
  readonly autenticado = computed(() => this.interno() !== null);

  carregar(): Observable<Usuario | null> {
    return this.autenticacao.sessao().pipe(
      tap((usuario) => this.interno.set(usuario)),
      catchError(() => {
        this.interno.set(null);
        return of(null);
      }),
    );
  }

  abrir(usuario: Usuario): void {
    this.interno.set(usuario);
  }

  encerrar(): void {
    this.interno.set(null);
  }
}
