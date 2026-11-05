export type FuncaoObra = 'RESIDENTE' | 'ALMOXARIFE' | 'GERENTE' | 'ENGENHEIRO' | 'OUTRO';

export interface Responsavel {
  id: string;
  obraId: string;
  nome: string;
  funcao: FuncaoObra;
  email: string;
  ativo: boolean;
  receberEmail: boolean;
}

export const FUNCOES: ReadonlyArray<{ valor: FuncaoObra; rotulo: string }> = [
  { valor: 'RESIDENTE', rotulo: 'Residente' },
  { valor: 'ALMOXARIFE', rotulo: 'Almoxarife' },
  { valor: 'GERENTE', rotulo: 'Gerente' },
  { valor: 'ENGENHEIRO', rotulo: 'Engenheiro' },
  { valor: 'OUTRO', rotulo: 'Outro' },
];
