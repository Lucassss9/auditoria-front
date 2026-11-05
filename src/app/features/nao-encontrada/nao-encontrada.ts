import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoVazio } from '../../shared/components/estado-vazio/estado-vazio';

@Component({
  selector: 'app-nao-encontrada',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, EstadoVazio],
  template: `
    <app-estado-vazio
      titulo="Página não encontrada"
      descricao="O endereço acessado não existe neste sistema."
    >
      <a class="botao" routerLink="/painel">Ir para a visão geral</a>
    </app-estado-vazio>
  `,
})
export class NaoEncontrada {}
