/**
 * Escolher obra numa lista solta não funciona: são muitas. Em toda tela que
 * pede uma obra, primeiro se escolhe a filial e só então as obras dela
 * aparecem.
 *
 * As obras vêm do CF, então o `filialId` pode faltar. Quando falta, a obra
 * cai num grupo "Sem filial" em vez de desaparecer da tela — uma obra
 * inalcançável é pior que uma obra mal agrupada.
 */

import { Filial, Segmento } from '../models/obra.model';

export const SEM_FILIAL = 'SEM_FILIAL';

/**
 * A filial com o código na frente: `CCISA66 - CIDADE MOOCA`. É assim que ela
 * se chama no CF, e é pelo código que se procura — ordenar por ele agrupa as
 * filiais na ordem em que a empresa pensa nelas.
 */
export function rotuloDaFilial(filial: Filial | null | undefined): string | null {
  if (!filial) {
    return null;
  }

  return filial.codigo ? `${filial.codigo} - ${filial.nome}` : filial.nome;
}

/**
 * A mesma obra existe duas vezes no CF, uma por segmento, com estoques
 * separados. O nome vem sem o segmento, então sem isto as duas aparecem
 * idênticas em qualquer lista e não há como escolher a certa.
 */
export function rotuloDaObra(obra: { nome: string; segmento: Segmento }): string {
  return obra.segmento === 'INSTALL' ? `${obra.nome} - INSTALL` : obra.nome;
}

export interface OpcaoFilial {
  id: string;
  nome: string;
}

interface ComFilial {
  filialId: string | null;
}

/**
 * As filiais que de fato têm obra na lista, em ordem alfabética. Filial sem
 * obra não entra: abrir uma opção que leva a uma lista vazia é só desperdício
 * de clique.
 *
 * @param nomeDaFilial como achar o nome, que muda conforme a tela tenha
 *   `ObraResumo` (traz a filial inteira) ou `Obra` (traz só o id).
 */
export function opcoesDeFilial<T extends ComFilial>(
  obras: readonly T[],
  nomeDaFilial: (obra: T) => string | null | undefined,
): OpcaoFilial[] {
  const porId = new Map<string, string>();
  let temSemFilial = false;

  for (const obra of obras) {
    if (obra.filialId) {
      porId.set(obra.filialId, nomeDaFilial(obra) || obra.filialId);
    } else {
      temSemFilial = true;
    }
  }

  const lista = [...porId].map(([id, nome]) => ({ id, nome }));

  if (temSemFilial) {
    lista.push({ id: SEM_FILIAL, nome: 'Sem filial' });
  }

  return lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

/** As obras de uma filial. Sem filial escolhida, nenhuma — a tela pede a filial primeiro. */
export function obrasDaFilial<T extends ComFilial>(obras: readonly T[], filialId: string): T[] {
  if (!filialId) {
    return [];
  }

  return obras.filter((obra) =>
    filialId === SEM_FILIAL ? !obra.filialId : obra.filialId === filialId,
  );
}
