import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'quantidade' })
export class QuantidadePipe implements PipeTransform {
  transform(valor: number | null | undefined, casas = 2): string {
    if (valor === null || valor === undefined || Number.isNaN(valor)) {
      return '—';
    }

    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: casas,
    });
  }
}
