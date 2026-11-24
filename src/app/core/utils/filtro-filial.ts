/**
 * Escolher obra numa lista solta não funciona: são muitas. Em toda tela que
 * pede uma obra, primeiro se escolhe a filial e só então as obras dela
 * aparecem.
 *
 * As obras vêm do CF, então o `filialId` pode faltar. Quando falta, a obra
 * cai num grupo "Sem filial" em vez de desaparecer da tela — uma obra
 * inalcançável é pior que uma obra mal agrupada.
 */

import { Filial, Regional, Segmento } from '../models/obra.model';

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

/**
 * Os dois estados em que a empresa opera. O CF chama de `estado` na obra e
 * devolve como `regional` na filial — aqui o nome que vale é o da tela.
 */
export const ESTADOS: ReadonlyArray<{ valor: Regional; rotulo: string }> = [
  { valor: 'SP', rotulo: 'São Paulo' },
  { valor: 'RJ', rotulo: 'Rio de Janeiro' },
];

/**
 * Corta a lista de obras por estado. Vem antes do filtro de filial porque são
 * mais de 90 filiais, e o estado parte isso quase ao meio.
 *
 * Quem chama diz como achar a regional de cada obra, porque numas telas ela
 * vem dentro de `obra.filial` e noutras só pelo mapa de filiais.
 */
export function obrasDoEstado<T>(
  obras: readonly T[],
  estado: string,
  regionalDaObra: (obra: T) => string | null | undefined,
): readonly T[] {
  if (!estado) {
    return obras;
  }

  return obras.filter((obra) => regionalDaObra(obra) === estado);
}
