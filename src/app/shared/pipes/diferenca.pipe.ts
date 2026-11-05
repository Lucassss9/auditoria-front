import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'diferenca' })
export class DiferencaPipe implements PipeTransform {
  transform(valor: number | null | undefined, casas = 2): string {
    if (valor === null || valor === undefined || Number.isNaN(valor)) {
      return '—';
    }

    const formatado = Math.abs(valor).toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: casas,
    });

    if (valor === 0) {
      return '0';
    }

    return `${valor > 0 ? '+' : '−'}${formatado}`;
  }
}
