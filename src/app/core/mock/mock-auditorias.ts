import {
  Auditoria,
  ItemAuditoria,
  MotivoNaoContagem,
  SituacaoItem,
} from '../models/auditoria.model';
import { InsumoEstoque } from '../models/insumo.model';
import { FILIAIS_MOCK, OBRAS_MOCK } from './mock-cadastros';

interface SementeAuditoria {
  id: string;
  obraId: string;
  responsavel: string;
  status: Auditoria['status'];
  iniciadaEm: string;
  concluidaEm: string | null;
  totalItens: number;
  deixarPendentes: boolean;
  foraDoEstoque: Auditoria['foraDoEstoque'];
  comunicado: Auditoria['comunicado'];
}

const MOTIVOS_CICLO: MotivoNaoContagem[] = [
  'LOCAL_TRANCADO',
  'OBRA_NAO_LOCALIZOU',
  'MATERIAL_EM_USO',
  'SEM_ACESSO_SEGURO',
];

const LISTAS = ['Alvenaria', 'Hidráulica', 'Elétrica', 'Acabamento'];

const LOCAIS = ['Pátio dos fundos', 'Almoxarifado', 'Contêiner 2', 'Subsolo', 'Lateral do bloco B'];

const SEMENTES: SementeAuditoria[] = [
  {
    id: 'a1',
    obraId: 'o1',
    responsavel: 'Davi Ferreira',
    status: 'EM_ANDAMENTO',
    iniciadaEm: '2026-11-05T08:40:00',
    concluidaEm: null,
    totalItens: 36,
    deixarPendentes: true,
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
    totalItens: 21,
    deixarPendentes: false,
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
    responsavel: 'Regina Paes',
    status: 'CONCLUIDA',
    iniciadaEm: '2026-10-27T09:00:00',
    concluidaEm: '2026-10-28T16:05:00',
    totalItens: 16,
    deixarPendentes: false,
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

function montarItem(
  insumo: InsumoEstoque,
  indice: number,
  deixarPendentes: boolean,
): ItemAuditoria {
  let situacao: SituacaoItem = 'CONFERIDO';
  let quantidadeReal: number | null = insumo.quantidade;
  let motivo: MotivoNaoContagem | null = null;

  if (deixarPendentes && indice % 4 === 3) {
    situacao = 'NAO_CONFERIDO';
    quantidadeReal = null;
  } else if (indice % 13 === 5) {
    situacao = 'NAO_CONTADO';
    quantidadeReal = null;
    motivo = MOTIVOS_CICLO[indice % MOTIVOS_CICLO.length];
  } else if (indice % 5 === 0 && insumo.quantidade > 0) {
    quantidadeReal = Math.max(0, insumo.quantidade - Math.ceil(insumo.quantidade * 0.08) - 2);
  } else if (indice % 7 === 2) {
    quantidadeReal = insumo.quantidade + 1 + (indice % 4);
  }

  return {
    id: 'item-' + insumo.obraId + '-' + insumo.codigo,
    codigo: insumo.codigo,
    descricao: insumo.descricao,
    unidade: insumo.unidade,
    quantidadeSistema: insumo.quantidade,
    valorUnitarioReferencia: insumo.valorUnitario,
    lista: LISTAS[indice % LISTAS.length],
    quantidadeReal,
    situacao,
    motivoNaoContagem: motivo,
    local: situacao === 'CONFERIDO' ? LOCAIS[indice % LOCAIS.length] : null,
    observacao:
      situacao === 'NAO_CONTADO' ? 'Registrado em campo para verificação na próxima visita.' : '',
    evidencias: [],
  };
}

export function gerarAuditoriasMock(estoque: InsumoEstoque[]): Auditoria[] {
  return SEMENTES.map((semente) => {
    const obra = OBRAS_MOCK.find((item) => item.id === semente.obraId)!;
    const filial = FILIAIS_MOCK.find((item) => item.id === obra.filialId) ?? null;

    const selecionados = estoque
      .filter((item) => item.obraId === semente.obraId)
      .slice(0, semente.totalItens);

    const itens = selecionados.map((insumo, indice) =>
      montarItem(insumo, indice, semente.deixarPendentes),
    );

    return {
      id: semente.id,
      obraId: obra.id,
      obraNome: obra.nome,
      segmento: obra.segmento,
      filialNome: filial ? filial.codigo + ' - ' + filial.nome : null,
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
