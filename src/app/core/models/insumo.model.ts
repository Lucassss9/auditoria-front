export interface InsumoEstoque {
  id: string;
  obraId: string;
  codigo: string;
  descricao: string;
  categoria: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number | null;
  estoqueMinimo: number | null;
}

export interface FiltroEstoque {
  termo: string;
  categoria: string | null;
}

export interface ListaFavorita {
  id: string;
  nome: string;
  termos: string[];
}
