import { Pipe, PipeTransform } from '@angular/core';

const PARTICULAS = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);

@Pipe({ name: 'iniciais' })
export class IniciaisPipe implements PipeTransform {
  transform(nome: string | null | undefined): string {
    if (!nome) {
      return '--';
    }

    const partes = nome
      .trim()
      .split(/\s+/)
      .filter((parte) => parte.length > 0 && !PARTICULAS.has(parte.toLowerCase()));

    if (partes.length === 0) {
      return '--';
    }

    const primeira = partes[0].charAt(0);
    const ultima = partes.length > 1 ? partes[partes.length - 1].charAt(0) : '';

    return (primeira + ultima).toUpperCase();
  }
}
