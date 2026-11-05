import { Auditoria, ItemAuditoria, ResumoAuditoria } from '../models/auditoria.model';

export function diferencaQuantidade(item: ItemAuditoria): number | null {
  if (item.situacao !== 'CONFERIDO' || item.quantidadeReal === null) {
    return null;
  }
  return item.quantidadeReal - item.quantidadeSistema;
}

export function diferencaValor(item: ItemAuditoria): number | null {
  const diferenca = diferencaQuantidade(item);
  if (diferenca === null || item.valorUnitarioReferencia === null) {
    return null;
  }
  return diferenca * item.valorUnitarioReferencia;
}

export function divergente(item: ItemAuditoria): boolean {
  const diferenca = diferencaQuantidade(item);
  return diferenca !== null && diferenca !== 0;
}

export function valorSemReferencia(item: ItemAuditoria): boolean {
  return divergente(item) && item.valorUnitarioReferencia === null;
}

export function resumirAuditoria(auditoria: Auditoria): ResumoAuditoria {
  const resumo: ResumoAuditoria = {
    totalItens: auditoria.itens.length,
    conferidos: 0,
    naoConferidos: 0,
    naoContados: 0,
    divergentes: 0,
    foraDoEstoque: auditoria.foraDoEstoque.length,
    valorFalta: 0,
    valorSobra: 0,
    itensSemValor: 0,
  };

  for (const item of auditoria.itens) {
    if (item.situacao === 'CONFERIDO') {
      resumo.conferidos += 1;
    } else if (item.situacao === 'NAO_CONTADO') {
      resumo.naoContados += 1;
    } else {
      resumo.naoConferidos += 1;
    }

    if (!divergente(item)) {
      continue;
    }

    resumo.divergentes += 1;
    const valor = diferencaValor(item);
    if (valor === null) {
      resumo.itensSemValor += 1;
    } else if (valor < 0) {
      resumo.valorFalta += Math.abs(valor);
    } else {
      resumo.valorSobra += valor;
    }
  }

  return resumo;
}

export function progresso(auditoria: Auditoria): number {
  if (!auditoria.itens.length) {
    return 0;
  }
  const tratados = auditoria.itens.filter((item) => item.situacao !== 'NAO_CONFERIDO').length;
  return Math.round((tratados / auditoria.itens.length) * 100);
}

export function prazoVencido(auditoria: Auditoria, hoje = new Date()): boolean {
  if (!auditoria.comunicado) {
    return false;
  }
  return new Date(auditoria.comunicado.prazo).getTime() < hoje.setHours(0, 0, 0, 0);
}
