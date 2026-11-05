export type Regional = 'RJ' | 'SP';

export type Segmento = 'CIVIL' | 'INSTALL' | 'EPI';

export type SituacaoObra = 'ATIVA' | 'ENCERRADA';

export interface Filial {
  id: string;
  codigo: string;
  nome: string;
  regional: Regional;
}

export interface Obra {
  id: string;
  codigo: string;
  nome: string;
  segmento: Segmento;
  situacao: SituacaoObra;
  filialId: string | null;
}

export interface ObraResumo extends Obra {
  filial: Filial | null;
  totalAuditorias: number;
}
