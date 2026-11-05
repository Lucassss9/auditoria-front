import { InsumoEstoque } from '../models/insumo.model';

interface ItemCatalogo {
  codigo: string;
  descricao: string;
  unidade: string;
  valorUnitario: number | null;
  base: number;
}

const CATALOGO: ItemCatalogo[] = [
  { codigo: '41010', descricao: 'Vaso sanitário com caixa acoplada branco', unidade: 'un', valorUnitario: 389.9, base: 120 },
  { codigo: '41011', descricao: 'Lavatório com coluna suspensa branco', unidade: 'un', valorUnitario: 214.5, base: 118 },
  { codigo: '41012', descricao: 'Cuba de embutir oval branca', unidade: 'un', valorUnitario: 168, base: 64 },
  { codigo: '41013', descricao: 'Tanque de louça 22L com coluna', unidade: 'un', valorUnitario: 276.4, base: 58 },
  { codigo: '41014', descricao: 'Pia de inox 1,20m com cuba simples', unidade: 'un', valorUnitario: 398, base: 72 },
  { codigo: '41020', descricao: 'Assento sanitário em polipropileno branco', unidade: 'un', valorUnitario: 52.3, base: 130 },
  { codigo: '41030', descricao: 'Torneira de mesa para lavatório bica baixa', unidade: 'un', valorUnitario: 97.6, base: 96 },
  { codigo: '41031', descricao: 'Misturador monocomando para cozinha', unidade: 'un', valorUnitario: 243.1, base: 0 },
  { codigo: '41040', descricao: 'Válvula de descarga 1.1/2 polegada', unidade: 'un', valorUnitario: 186.7, base: 44 },
  { codigo: '41041', descricao: 'Sifão sanfonado universal', unidade: 'un', valorUnitario: 14.2, base: 210 },
  { codigo: '29535', descricao: 'Bloco de concreto estrutural 14x19x39', unidade: 'un', valorUnitario: 3.18, base: 1000 },
  { codigo: '29513', descricao: 'Bloco de concreto vedação 9x19x39', unidade: 'un', valorUnitario: 2.74, base: 480 },
  { codigo: '28856', descricao: 'Bloco canaleta 14x19x39', unidade: 'un', valorUnitario: 4.6, base: 120 },
  { codigo: '29206', descricao: 'Bloco meia-cana 9x19x19', unidade: 'un', valorUnitario: 2.1, base: 150 },
  { codigo: '29240', descricao: 'Bloco de concreto estrutural 19x19x39', unidade: 'un', valorUnitario: 3.9, base: 0 },
  { codigo: '27401', descricao: 'Argamassa colante AC-II 20kg', unidade: 'sc', valorUnitario: 24.8, base: 350 },
  { codigo: '27410', descricao: 'Rejunte flexível 5kg', unidade: 'sc', valorUnitario: 12.3, base: 90 },
  { codigo: '27420', descricao: 'Argamassa de assentamento estrutural 25kg', unidade: 'sc', valorUnitario: 31.95, base: 240 },
  { codigo: '31220', descricao: 'Aço CA-50 10mm barra 12m', unidade: 'un', valorUnitario: 58.9, base: 240 },
  { codigo: '31221', descricao: 'Aço CA-60 5mm rolo', unidade: 'kg', valorUnitario: 7.42, base: 1500 },
  { codigo: '31222', descricao: 'Aço CA-50 8mm barra 12m', unidade: 'un', valorUnitario: 37.6, base: 310 },
  { codigo: '31230', descricao: 'Tela soldada Q138 2,45x6,00m', unidade: 'un', valorUnitario: 189, base: 60 },
  { codigo: '31240', descricao: 'Arame recozido n18', unidade: 'kg', valorUnitario: 16.85, base: 85 },
  { codigo: '31250', descricao: 'Espaçador plástico para armadura 25mm', unidade: 'un', valorUnitario: 0.38, base: 4200 },
  { codigo: '30510', descricao: 'Cabo flexível 2,5mm2 750V rolo 100m', unidade: 'rl', valorUnitario: 318, base: 28 },
  { codigo: '30511', descricao: 'Cabo flexível 4,0mm2 750V rolo 100m', unidade: 'rl', valorUnitario: 487.5, base: 16 },
  { codigo: '30512', descricao: 'Cabo flexível 1,5mm2 750V rolo 100m', unidade: 'rl', valorUnitario: 206.4, base: 34 },
  { codigo: '30520', descricao: 'Cabo PP 3x2,5mm2 rolo 100m', unidade: 'rl', valorUnitario: 612, base: 9 },
  { codigo: '30120', descricao: 'Eletroduto flexível corrugado 3/4 polegada rolo 50m', unidade: 'rl', valorUnitario: 61.2, base: 45 },
  { codigo: '30130', descricao: 'Caixa de passagem 4x2 PVC', unidade: 'un', valorUnitario: 2.95, base: 620 },
  { codigo: '30140', descricao: 'Disjuntor monopolar 16A curva C', unidade: 'un', valorUnitario: 13.7, base: 180 },
  { codigo: '30150', descricao: 'Quadro de distribuição 12 disjuntores embutir', unidade: 'un', valorUnitario: 148, base: 42 },
  { codigo: '32110', descricao: 'Tubo PVC soldável 25mm barra 6m', unidade: 'un', valorUnitario: 23.4, base: 260 },
  { codigo: '32111', descricao: 'Tubo PVC esgoto 100mm barra 6m', unidade: 'un', valorUnitario: 68.9, base: 140 },
  { codigo: '32120', descricao: 'Joelho 90 graus PVC soldável 25mm', unidade: 'un', valorUnitario: 1.65, base: 900 },
  { codigo: '32130', descricao: 'Registro de gaveta 3/4 polegada bruto', unidade: 'un', valorUnitario: 41.2, base: 76 },
  { codigo: '29093', descricao: 'Morsa de bancada n6', unidade: 'un', valorUnitario: 247.25, base: 2 },
  { codigo: '33781', descricao: 'Caixote metálico para equipamentos 1,20x0,70x0,65m', unidade: 'un', valorUnitario: null, base: 3 },
  { codigo: '30744', descricao: 'Rádio comunicador analógico UHF', unidade: 'un', valorUnitario: 872, base: 6 },
  { codigo: '32157', descricao: 'Lixadeira combinada 370W 220V', unidade: 'un', valorUnitario: 1060.18, base: 1 },
  { codigo: '26010', descricao: 'Capacete de segurança classe B branco', unidade: 'un', valorUnitario: 21.5, base: 80 },
  { codigo: '26022', descricao: 'Luva de vaqueta punho curto', unidade: 'pr', valorUnitario: 9.8, base: 150 },
  { codigo: '26030', descricao: 'Óculos de proteção incolor antiembaçante', unidade: 'un', valorUnitario: 7.45, base: 95 },
  { codigo: '26040', descricao: 'Cinto de segurança paraquedista 5 pontos', unidade: 'un', valorUnitario: 184, base: 24 },
  { codigo: '26050', descricao: 'Protetor auricular plug com cordão', unidade: 'pr', valorUnitario: 2.3, base: 300 },
  { codigo: '35010', descricao: 'Lona plástica preta 4x100m 150 micras', unidade: 'rl', valorUnitario: 289, base: 12 },
  { codigo: '35020', descricao: 'Fita de demarcação zebrada 200m', unidade: 'rl', valorUnitario: 18.6, base: 0 },
  { codigo: '31560', descricao: 'Frete caminhão munck', unidade: 'vg', valorUnitario: 2790, base: 0 },
];

const FATOR_POR_OBRA: Record<string, number> = { o1: 1, o2: 0.62, o3: 1.35, o4: 0.84, o5: 0.2 };

const SEM_ESTOQUE_MINIMO = new Set(['33781', '31560', '35020', '29240']);

export function gerarEstoqueMock(): InsumoEstoque[] {
  const estoque: InsumoEstoque[] = [];

  for (const [obraId, fator] of Object.entries(FATOR_POR_OBRA)) {
    const deslocamento = Number(obraId.slice(1));

    CATALOGO.forEach((item, indice) => {
      if ((indice + deslocamento) % 11 === 0) {
        return;
      }

      estoque.push({
        id: `${obraId}-${item.codigo}`,
        obraId,
        codigo: item.codigo,
        descricao: item.descricao,
        unidade: item.unidade,
        quantidade: Math.round(item.base * fator),
        valorUnitario: item.valorUnitario,
        estoqueMinimo: SEM_ESTOQUE_MINIMO.has(item.codigo)
          ? null
          : Math.round(item.base * fator * 0.1),
      });
    });
  }

  return estoque;
}
