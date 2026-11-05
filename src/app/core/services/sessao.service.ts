import { Injectable, computed, signal } from '@angular/core';
import { Usuario } from '../models/usuario.model';

const CHAVE = 'auditoria-estoque:sessao';

@Injectable({ providedIn: 'root' })
export class SessaoService {
  private readonly interno = signal<Usuario | null>(this.ler());

  readonly usuario = this.interno.asReadonly();
  readonly autenticado = computed(() => this.interno() !== null);

  abrir(usuario: Usuario): void {
    this.interno.set(usuario);

    try {
      localStorage.setItem(CHAVE, JSON.stringify(usuario));
    } catch {
      return;
    }
  }

  encerrar(): void {
    this.interno.set(null);

    try {
      localStorage.removeItem(CHAVE);
    } catch {
      return;
    }
  }

  private ler(): Usuario | null {
    try {
      const bruto = localStorage.getItem(CHAVE);
      return bruto ? (JSON.parse(bruto) as Usuario) : null;
    } catch {
      return null;
    }
  }
}
