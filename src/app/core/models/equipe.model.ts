export type FuncaoObra =
  | 'RESIDENTE'
  | 'PRODUCAO'
  | 'ADM'
  | 'ALMOXARIFE'
  | 'GERENTE'
  | 'GERENTE_GERAL'
  | 'DIRETOR'
  | 'OUTRO';

export interface Responsavel {
  id: string;
  obraIds: string[];
  nome: string;
  funcao: FuncaoObra;
  email: string;
  ativo: boolean;
  receberEmail: boolean;
}

export const FUNCOES: ReadonlyArray<{ valor: FuncaoObra; rotulo: string }> = [
  { valor: 'RESIDENTE', rotulo: 'Residente' },
  { valor: 'PRODUCAO', rotulo: 'Produção' },
  { valor: 'ADM', rotulo: 'Administrativo' },
  { valor: 'ALMOXARIFE', rotulo: 'Almoxarife' },
  { valor: 'GERENTE', rotulo: 'Gerente' },
  { valor: 'GERENTE_GERAL', rotulo: 'Gerente geral' },
  { valor: 'DIRETOR', rotulo: 'Diretor' },
  { valor: 'OUTRO', rotulo: 'Outro' },
];
