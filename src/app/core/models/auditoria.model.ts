export type StatusAuditoria = 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';

export type SituacaoItem = 'NAO_CONFERIDO' | 'CONFERIDO' | 'NAO_CONTADO';

export type MotivoNaoContagem =
  | 'LOCAL_TRANCADO'
  | 'OBRA_NAO_LOCALIZOU'
  | 'MATERIAL_EM_USO'
  | 'SEM_ACESSO_SEGURO';

export interface Evidencia {
  id: string;
  nome: string;
  conteudo: string;
  criadoEm: string;
}

export interface ItemAuditoria {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  quantidadeSistema: number;
  valorUnitarioReferencia: number | null;
  lista: string | null;
  quantidadeReal: number | null;
  situacao: SituacaoItem;
  motivoNaoContagem: MotivoNaoContagem | null;
  local: string | null;
  observacao: string;
  evidencias: Evidencia[];
}

export interface ItemForaDoEstoque {
  id: string;
  descricao: string;
  codigo: string | null;
  unidade: string;
  quantidade: number;
  valorUnitario: number | null;
  local: string | null;
  observacao: string;
  evidencias: Evidencia[];
}

export interface ReferenciaEstoque {
  origem: string;
  capturadoEm: string;
  totalItens: number;
}

export interface Comunicado {
  destinatariosIds: string[];
  prazo: string;
  assunto: string;
  mensagem: string;
  geradoEm: string;
}

export interface Auditoria {
  id: string;
  obraId: string;
  obraNome: string;
  filialNome: string | null;
  responsavel: string;
  status: StatusAuditoria;
  iniciadaEm: string;
  concluidaEm: string | null;
  referencia: ReferenciaEstoque;
  itens: ItemAuditoria[];
  foraDoEstoque: ItemForaDoEstoque[];
  comunicado: Comunicado | null;
}

export interface NovaAuditoria {
  obraId: string;
  responsavel: string;
  insumos: Array<{ insumoId: string; lista: string | null }>;
}

export interface ResumoAuditoria {
  totalItens: number;
  conferidos: number;
  naoConferidos: number;
  naoContados: number;
  divergentes: number;
  foraDoEstoque: number;
  valorFalta: number;
  valorSobra: number;
  itensSemValor: number;
}
