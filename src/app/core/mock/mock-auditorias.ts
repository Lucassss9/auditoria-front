import {
  Auditoria,
  ItemAuditoria,
  MotivoNaoContagem,
  SituacaoItem,
} from '../models/auditoria.model';
import { InsumoEstoque } from '../models/insumo.model';
import { FILIAIS_MOCK, OBRAS_MOCK } from './mock-cadastros';

interface SementeItem {
  codigo: string;
  lista: string | null;
  quantidadeReal?: number;
  situacao?: SituacaoItem;
  motivo?: MotivoNaoContagem;
  observacao?: string;
  local?: string;
  fotos?: number;
}

interface SementeAuditoria {
  id: string;
  obraId: string;
  responsavel: string;
  status: Auditoria['status'];
  iniciadaEm: string;
  concluidaEm: string | null;
  itens: SementeItem[];
  foraDoEstoque: Auditoria['foraDoEstoque'];
  comunicado: Auditoria['comunicado'];
}

const SEMENTES: SementeAuditoria[] = [
  {
    id: 'a1',
    obraId: 'o1',
    responsavel: 'Davi Ferreira',
    status: 'EM_ANDAMENTO',
    iniciadaEm: '2026-11-05T08:40:00',
    concluidaEm: null,
    itens: [
      { codigo: '29535', lista: 'Blocos', quantidadeReal: 850, situacao: 'CONFERIDO', local: 'Pátio dos fundos', fotos: 2 },
      { codigo: '29513', lista: 'Blocos', quantidadeReal: 480, situacao: 'CONFERIDO', local: 'Pátio dos fundos', fotos: 1 },
      { codigo: '28856', lista: 'Blocos', quantidadeReal: 148, situacao: 'CONFERIDO', local: 'Pátio dos fundos', observacao: 'Pallet aberto, contagem conferida duas vezes.' },
      {
        codigo: '29206',
        lista: 'Blocos',
        situacao: 'NAO_CONTADO',
        motivo: 'LOCAL_TRANCADO',
        observacao: 'Contêiner 3 sem chave no dia da visita.',
      },
      { codigo: '27401', lista: 'Blocos', quantidadeReal: 344, situacao: 'CONFERIDO', local: 'Almoxarifado' },
      { codigo: '31220', lista: 'Aço', quantidadeReal: 232, situacao: 'CONFERIDO', local: 'Pátio de armação', fotos: 1 },
      { codigo: '31222', lista: 'Aço', quantidadeReal: 304, situacao: 'CONFERIDO' },
      { codigo: '31230', lista: 'Aço' },
      { codigo: '30510', lista: 'Cabos' },
      { codigo: '30512', lista: 'Cabos' },
      { codigo: '33781', lista: null, quantidadeReal: 0, situacao: 'CONFERIDO', local: 'Contêiner 2', fotos: 1 },
      { codigo: '41010', lista: 'Louças', quantidadeReal: 118, situacao: 'CONFERIDO', local: 'Depósito do subsolo' },
      { codigo: '41011', lista: 'Louças' },
      { codigo: '41014', lista: 'Louças' },
    ],
    foraDoEstoque: [
      {
        id: 'fe1',
        descricao: 'Perfil metálico 50x70 sem etiqueta',
        codigo: null,
        unidade: 'un',
        quantidade: 12,
        valorUnitario: null,
        local: 'Lateral do bloco B',
        observacao: 'Amarrado junto com sobra de forma. Ninguém soube informar a origem.',
        evidencias: [
          { id: 'ev-fe1-1', nome: 'perfil-lateral-b.jpg', conteudo: '', criadoEm: '2026-11-05T10:12:00' },
        ],
      },
    ],
    comunicado: null,
  },
  {
    id: 'a2',
    obraId: 'o4',
    responsavel: 'Davi Ferreira',
    status: 'CONCLUIDA',
    iniciadaEm: '2026-10-09T08:10:00',
    concluidaEm: '2026-10-12T17:25:00',
    itens: [
      { codigo: '29535', lista: 'Blocos', quantidadeReal: 820, situacao: 'CONFERIDO' },
      { codigo: '27401', lista: 'Blocos', quantidadeReal: 294, situacao: 'CONFERIDO' },
      { codigo: '27420', lista: 'Blocos', quantidadeReal: 202, situacao: 'CONFERIDO' },
      { codigo: '31221', lista: 'Aço', quantidadeReal: 1210, situacao: 'CONFERIDO' },
      { codigo: '31240', lista: 'Aço', quantidadeReal: 71, situacao: 'CONFERIDO' },
      { codigo: '30511', lista: 'Cabos', quantidadeReal: 13, situacao: 'CONFERIDO' },
      { codigo: '30520', lista: 'Cabos', situacao: 'NAO_CONTADO', motivo: 'OBRA_NAO_LOCALIZOU' },
      { codigo: '32111', lista: null, quantidadeReal: 118, situacao: 'CONFERIDO' },
    ],
    foraDoEstoque: [],
    comunicado: {
      destinatariosIds: ['r8', 'r9'],
      prazo: '2026-10-27',
      assunto: 'Auditoria de estoque — Jardim Aurora — 12/10/2026',
      mensagem: '',
      geradoEm: '2026-10-12T17:40:00',
    },
  },
  {
    id: 'a3',
    obraId: 'o2',
    responsavel: 'Davi Ferreira',
    status: 'CONCLUIDA',
    iniciadaEm: '2026-10-27T09:00:00',
    concluidaEm: '2026-10-28T16:05:00',
    itens: [
      { codigo: '41010', lista: 'Louças', quantidadeReal: 74, situacao: 'CONFERIDO' },
      { codigo: '41011', lista: 'Louças', quantidadeReal: 73, situacao: 'CONFERIDO' },
      { codigo: '41013', lista: 'Louças', quantidadeReal: 30, situacao: 'CONFERIDO' },
      { codigo: '41041', lista: 'Louças', quantidadeReal: 130, situacao: 'CONFERIDO' },
      { codigo: '32110', lista: null, quantidadeReal: 161, situacao: 'CONFERIDO' },
      { codigo: '32130', lista: null, quantidadeReal: 47, situacao: 'CONFERIDO' },
    ],
    foraDoEstoque: [
      {
        id: 'fe2',
        descricao: 'Bomba submersa 1/2 cv',
        codigo: null,
        unidade: 'un',
        quantidade: 1,
        valorUnitario: null,
        local: 'Subsolo',
        observacao: 'Em uso no esgotamento da caixa.',
        evidencias: [],
      },
    ],
    comunicado: {
      destinatariosIds: ['r5', 'r6', 'r7'],
      prazo: '2026-11-12',
      assunto: 'Auditoria de estoque — Alvorada II — 28/10/2026',
      mensagem: '',
      geradoEm: '2026-10-28T16:20:00',
    },
  },
];

function montarItem(semente: SementeItem, insumo: InsumoEstoque, indice: number): ItemAuditoria {
  const situacao: SituacaoItem = semente.situacao ?? 'NAO_CONFERIDO';

  return {
    id: `${insumo.obraId}-${semente.codigo}-${indice}`,
    codigo: insumo.codigo,
    descricao: insumo.descricao,
    unidade: insumo.unidade,
    quantidadeSistema: insumo.quantidade,
    valorUnitarioReferencia: insumo.valorUnitario,
    lista: semente.lista,
    quantidadeReal: situacao === 'CONFERIDO' ? (semente.quantidadeReal ?? 0) : null,
    situacao,
    motivoNaoContagem: semente.motivo ?? null,
    local: semente.local ?? null,
    observacao: semente.observacao ?? '',
    evidencias: Array.from({ length: semente.fotos ?? 0 }, (_, posicao) => ({
      id: `ev-${insumo.obraId}-${semente.codigo}-${posicao}`,
      nome: `${semente.codigo}-${posicao + 1}.jpg`,
      conteudo: '',
      criadoEm: '2026-11-05T10:00:00',
    })),
  };
}

export function gerarAuditoriasMock(estoque: InsumoEstoque[]): Auditoria[] {
  return SEMENTES.map((semente) => {
    const obra = OBRAS_MOCK.find((item) => item.id === semente.obraId)!;
    const filial = FILIAIS_MOCK.find((item) => item.id === obra.filialId) ?? null;

    const itens = semente.itens
      .map((item, indice) => {
        const insumo = estoque.find(
          (linha) => linha.obraId === semente.obraId && linha.codigo === item.codigo,
        );
        return insumo ? montarItem(item, insumo, indice) : null;
      })
      .filter((item): item is ItemAuditoria => item !== null);

    return {
      id: semente.id,
      obraId: obra.id,
      obraNome: obra.nome,
      filialNome: filial ? `${filial.codigo} - ${filial.nome}` : null,
      responsavel: semente.responsavel,
      status: semente.status,
      iniciadaEm: semente.iniciadaEm,
      concluidaEm: semente.concluidaEm,
      referencia: {
        origem: 'Relatório de estoque — dados de demonstração',
        capturadoEm: semente.iniciadaEm,
        totalItens: itens.length,
      },
      itens,
      foraDoEstoque: semente.foraDoEstoque,
      comunicado: semente.comunicado,
    };
  });
}
