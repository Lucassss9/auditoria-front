export interface InsumoEstoque {
  id: string;
  obraId: string;
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number | null;
}

export interface FiltroEstoque {
  termo: string;
}

export interface ListaFavorita {
  id: string;
  nome: string;
  termos: string[];
}
