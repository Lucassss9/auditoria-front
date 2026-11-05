import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'moeda' })
export class MoedaPipe implements PipeTransform {
  transform(valor: number | null | undefined): string {
    if (valor === null || valor === undefined || Number.isNaN(valor)) {
      return 'não disponível';
    }

    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
