import { Auditoria, ItemAuditoria } from '../models/auditoria.model';
import {
  diferencaQuantidade,
  diferencaValor,
  divergente,
  prazoVencido,
  progresso,
  resumirAuditoria,
} from './auditoria-calculos';

function item(parcial: Partial<ItemAuditoria>): ItemAuditoria {
  return {
    id: 'i1',
    codigo: '29535',
    descricao: 'Bloco de concreto estrutural',
    categoria: 'Alvenaria',
    unidade: 'un',
    quantidadeSistema: 1000,
    valorUnitarioReferencia: 3,
    lista: null,
    quantidadeReal: null,
    situacao: 'NAO_CONFERIDO',
    motivoNaoContagem: null,
    local: null,
    observacao: '',
    evidencias: [],
    ...parcial,
  };
}

function auditoria(itens: ItemAuditoria[], parcial: Partial<Auditoria> = {}): Auditoria {
  return {
    id: 'a1',
    obraId: 'o1',
    obraNome: 'Obra exemplo',
    filialNome: null,
    responsavel: 'Auditor',
    status: 'EM_ANDAMENTO',
    iniciadaEm: '2026-11-05T08:00:00',
    concluidaEm: null,
    referencia: { origem: 'teste', capturadoEm: '2026-11-05T08:00:00', totalItens: itens.length },
    itens,
    foraDoEstoque: [],
    comunicado: null,
    ...parcial,
  };
}

describe('cálculos da auditoria', () => {
  it('não calcula diferença enquanto o item não foi conferido', () => {
    expect(diferencaQuantidade(item({}))).toBeNull();
    expect(diferencaValor(item({}))).toBeNull();
  });

  it('calcula a falta em quantidade e em valor', () => {
    const conferido = item({ situacao: 'CONFERIDO', quantidadeReal: 850 });

    expect(diferencaQuantidade(conferido)).toBe(-150);
    expect(diferencaValor(conferido)).toBe(-450);
    expect(divergente(conferido)).toBe(true);
  });

  it('calcula a sobra em quantidade e em valor', () => {
    const conferido = item({ situacao: 'CONFERIDO', quantidadeReal: 1020 });

    expect(diferencaQuantidade(conferido)).toBe(20);
    expect(diferencaValor(conferido)).toBe(60);
  });

  it('não inventa divergência financeira quando não há valor de referência', () => {
    const semValor = item({
      situacao: 'CONFERIDO',
      quantidadeReal: 900,
      valorUnitarioReferencia: null,
    });

    expect(diferencaQuantidade(semValor)).toBe(-100);
    expect(diferencaValor(semValor)).toBeNull();
  });

  it('não trata contagem igual ao sistema como divergência', () => {
    expect(divergente(item({ situacao: 'CONFERIDO', quantidadeReal: 1000 }))).toBe(false);
  });

  it('distingue saldo zero contado de item não conferido', () => {
    const zeroContado = item({ situacao: 'CONFERIDO', quantidadeReal: 0 });

    expect(diferencaQuantidade(zeroContado)).toBe(-1000);
    expect(diferencaQuantidade(item({ situacao: 'NAO_CONFERIDO' }))).toBeNull();
  });

  it('resume faltas, sobras e itens sem valor separadamente', () => {
    const resumo = resumirAuditoria(
      auditoria([
        item({ id: 'a', situacao: 'CONFERIDO', quantidadeReal: 850 }),
        item({ id: 'b', situacao: 'CONFERIDO', quantidadeReal: 1100 }),
        item({
          id: 'c',
          situacao: 'CONFERIDO',
          quantidadeReal: 900,
          valorUnitarioReferencia: null,
        }),
        item({ id: 'd', situacao: 'NAO_CONTADO', motivoNaoContagem: 'LOCAL_TRANCADO' }),
        item({ id: 'e' }),
      ]),
    );

    expect(resumo.totalItens).toBe(5);
    expect(resumo.conferidos).toBe(3);
    expect(resumo.naoContados).toBe(1);
    expect(resumo.naoConferidos).toBe(1);
    expect(resumo.divergentes).toBe(3);
    expect(resumo.valorFalta).toBe(450);
    expect(resumo.valorSobra).toBe(300);
    expect(resumo.itensSemValor).toBe(1);
  });

  it('conta como progresso tudo que já foi tratado', () => {
    const parcial = auditoria([
      item({ id: 'a', situacao: 'CONFERIDO', quantidadeReal: 1000 }),
      item({ id: 'b', situacao: 'NAO_CONTADO' }),
      item({ id: 'c' }),
      item({ id: 'd' }),
    ]);

    expect(progresso(parcial)).toBe(50);
  });

  it('só considera prazo vencido quando existe comunicado com data passada', () => {
    const base = auditoria([]);
    const hoje = new Date('2026-11-05T12:00:00');

    expect(prazoVencido(base, new Date(hoje))).toBe(false);

    const vencida = auditoria([], {
      comunicado: {
        destinatariosIds: [],
        prazo: '2026-10-30',
        assunto: '',
        mensagem: '',
        geradoEm: '2026-10-20T10:00:00',
      },
    });

    expect(prazoVencido(vencida, new Date(hoje))).toBe(true);

    const noPrazo = auditoria([], {
      comunicado: {
        destinatariosIds: [],
        prazo: '2026-11-20',
        assunto: '',
        mensagem: '',
        geradoEm: '2026-11-05T10:00:00',
      },
    });

    expect(prazoVencido(noPrazo, new Date(hoje))).toBe(false);
  });
});
