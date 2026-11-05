import { Filial, Obra } from '../models/obra.model';
import { Responsavel } from '../models/equipe.model';
import { ListaFavorita } from '../models/insumo.model';

export const FILIAIS_MOCK: Filial[] = [
  { id: 'f1', codigo: 'CCISA101', nome: 'CIDADE ALVORADA', regional: 'RJ' },
  { id: 'f2', codigo: 'CCISA118', nome: 'PARQUE AURORA', regional: 'SP' },
  { id: 'f3', codigo: 'CCISA133', nome: 'MIRANTE DO PORTO', regional: 'RJ' },
];

export const OBRAS_MOCK: Obra[] = [
  { id: 'o1', codigo: 'OBR-1011', nome: 'Alvorada I', segmento: 'INSTALL', situacao: 'ATIVA', filialId: 'f1' },
  { id: 'o2', codigo: 'OBR-1012', nome: 'Alvorada II', segmento: 'INSTALL', situacao: 'ATIVA', filialId: 'f1' },
  { id: 'o3', codigo: 'OBR-1013', nome: 'Alvorada III', segmento: 'CIVIL', situacao: 'ATIVA', filialId: 'f1' },
  { id: 'o4', codigo: 'OBR-1181', nome: 'Jardim Aurora', segmento: 'CIVIL', situacao: 'ATIVA', filialId: 'f2' },
  { id: 'o5', codigo: 'OBR-1331', nome: 'Mirante do Porto', segmento: 'CIVIL', situacao: 'ENCERRADA', filialId: 'f3' },
];

export const RESPONSAVEIS_MOCK: Responsavel[] = [
  {
    id: 'r1',
    obraId: 'o1',
    nome: 'Helena Braga',
    funcao: 'RESIDENTE',
    email: 'residente.alvorada1@exemplo.com.br',
    ativo: true,
    receberEmail: true,
  },
  {
    id: 'r2',
    obraId: 'o1',
    nome: 'Tarcísio Lemos',
    funcao: 'ALMOXARIFE',
    email: 'almoxarifado.alvorada1@exemplo.com.br',
    ativo: true,
    receberEmail: true,
  },
  {
    id: 'r3',
    obraId: 'o1',
    nome: 'Rubens Fontes',
    funcao: 'GERENTE',
    email: 'gerencia.alvorada@exemplo.com.br',
    ativo: true,
    receberEmail: true,
  },
  {
    id: 'r4',
    obraId: 'o1',
    nome: 'Ivone Castro',
    funcao: 'ENGENHEIRO',
    email: 'engenharia.alvorada1@exemplo.com.br',
    ativo: true,
    receberEmail: false,
  },
  {
    id: 'r5',
    obraId: 'o2',
    nome: 'Marcos Aurélio Pinto',
    funcao: 'RESIDENTE',
    email: 'residente.alvorada2@exemplo.com.br',
    ativo: true,
    receberEmail: true,
  },
  {
    id: 'r6',
    obraId: 'o2',
    nome: 'Dalva Siqueira',
    funcao: 'ALMOXARIFE',
    email: 'almoxarifado.alvorada2@exemplo.com.br',
    ativo: true,
    receberEmail: true,
  },
  {
    id: 'r7',
    obraId: 'o2',
    nome: 'Rubens Fontes',
    funcao: 'GERENTE',
    email: 'gerencia.alvorada@exemplo.com.br',
    ativo: true,
    receberEmail: true,
  },
  {
    id: 'r8',
    obraId: 'o4',
    nome: 'Cléber Matos',
    funcao: 'RESIDENTE',
    email: 'residente.aurora@exemplo.com.br',
    ativo: true,
    receberEmail: true,
  },
  {
    id: 'r9',
    obraId: 'o4',
    nome: 'Sueli Andrade',
    funcao: 'ALMOXARIFE',
    email: 'almoxarifado.aurora@exemplo.com.br',
    ativo: true,
    receberEmail: true,
  },
  {
    id: 'r10',
    obraId: 'o4',
    nome: 'Paulo Renato Dias',
    funcao: 'GERENTE',
    email: 'gerencia.aurora@exemplo.com.br',
    ativo: false,
    receberEmail: false,
  },
  {
    id: 'r11',
    obraId: 'o5',
    nome: 'Nadir Gomes',
    funcao: 'ALMOXARIFE',
    email: 'almoxarifado.porto@exemplo.com.br',
    ativo: true,
    receberEmail: true,
  },
];

export const LISTAS_FAVORITAS_MOCK: ListaFavorita[] = [
  {
    id: 'lf1',
    nome: 'Louças e metais',
    termos: ['vaso', 'lavatório', 'cuba', 'tanque', 'pia', 'torneira', 'sifão', 'válvula'],
  },
  { id: 'lf2', nome: 'Blocos', termos: ['bloco', 'canaleta', 'argamassa', 'rejunte'] },
  { id: 'lf3', nome: 'Aço', termos: ['aço', 'tela soldada', 'arame', 'espaçador'] },
  { id: 'lf4', nome: 'Cabos', termos: ['cabo', 'eletroduto', 'disjuntor'] },
];
