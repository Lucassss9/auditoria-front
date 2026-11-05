import { InsumoEstoque } from '../models/insumo.model';

interface Familia {
  categoria: string;
  prefixo: string;
  nome: string;
  unidade: string;
  valorBase: number | null;
  quantidadeBase: number;
  variantes: string[];
}

export const CATEGORIAS = [
  'Louças e metais',
  'Alvenaria',
  'Aço e armação',
  'Elétrica',
  'Hidráulica',
  'Revestimentos',
  'Pintura',
  'Impermeabilização',
  'Esquadrias',
  'Ferramentas e equipamentos',
  'EPI',
  'Consumíveis',
] as const;

const FAMILIAS: Familia[] = [
  {
    categoria: 'Louças e metais',
    prefixo: '410',
    nome: 'Vaso sanitário com caixa acoplada',
    unidade: 'un',
    valorBase: 389.9,
    quantidadeBase: 120,
    variantes: ['branco', 'bege', 'cinza', 'linha acessível', 'linha econômica'],
  },
  {
    categoria: 'Louças e metais',
    prefixo: '411',
    nome: 'Lavatório',
    unidade: 'un',
    valorBase: 214.5,
    quantidadeBase: 110,
    variantes: ['com coluna suspensa branco', 'de canto branco', 'sobrepor 40cm', 'sobrepor 55cm'],
  },
  {
    categoria: 'Louças e metais',
    prefixo: '412',
    nome: 'Cuba',
    unidade: 'un',
    valorBase: 168,
    quantidadeBase: 70,
    variantes: ['de embutir oval branca', 'de apoio redonda branca', 'de inox 40x34', 'dupla de inox 100cm'],
  },
  {
    categoria: 'Louças e metais',
    prefixo: '413',
    nome: 'Tanque de louça',
    unidade: 'un',
    valorBase: 276.4,
    quantidadeBase: 55,
    variantes: ['22L com coluna', '30L com coluna', '18L de parede'],
  },
  {
    categoria: 'Louças e metais',
    prefixo: '414',
    nome: 'Pia de inox',
    unidade: 'un',
    valorBase: 398,
    quantidadeBase: 72,
    variantes: ['1,20m cuba simples', '1,50m cuba simples', '1,20m cuba dupla', '1,00m cuba rasa'],
  },
  {
    categoria: 'Louças e metais',
    prefixo: '415',
    nome: 'Torneira',
    unidade: 'un',
    valorBase: 97.6,
    quantidadeBase: 130,
    variantes: ['de mesa bica baixa', 'de parede bica móvel', 'de jardim 3/4', 'para tanque 1/2', 'monocomando cozinha'],
  },
  {
    categoria: 'Louças e metais',
    prefixo: '416',
    nome: 'Válvula',
    unidade: 'un',
    valorBase: 186.7,
    quantidadeBase: 60,
    variantes: ['de descarga 1.1/2', 'de escoamento para pia', 'americana para cuba', 'de esgoto para tanque'],
  },
  {
    categoria: 'Louças e metais',
    prefixo: '417',
    nome: 'Sifão',
    unidade: 'un',
    valorBase: 14.2,
    quantidadeBase: 240,
    variantes: ['sanfonado universal', 'copo metálico 1.1/2', 'flexível para pia', 'rígido para lavatório'],
  },
  {
    categoria: 'Alvenaria',
    prefixo: '295',
    nome: 'Bloco de concreto estrutural',
    unidade: 'un',
    valorBase: 3.18,
    quantidadeBase: 900,
    variantes: ['14x19x39', '19x19x39', '14x19x19', '19x19x19', '09x19x39'],
  },
  {
    categoria: 'Alvenaria',
    prefixo: '296',
    nome: 'Bloco de concreto vedação',
    unidade: 'un',
    valorBase: 2.74,
    quantidadeBase: 640,
    variantes: ['09x19x39', '14x19x39', '09x19x19', 'meia-cana 09x19x19'],
  },
  {
    categoria: 'Alvenaria',
    prefixo: '288',
    nome: 'Bloco canaleta',
    unidade: 'un',
    valorBase: 4.6,
    quantidadeBase: 180,
    variantes: ['14x19x39', '19x19x39', '09x19x39', 'compensador 14x19x14'],
  },
  {
    categoria: 'Alvenaria',
    prefixo: '274',
    nome: 'Argamassa',
    unidade: 'sc',
    valorBase: 24.8,
    quantidadeBase: 320,
    variantes: ['colante AC-I 20kg', 'colante AC-II 20kg', 'colante AC-III 20kg', 'de assentamento estrutural 25kg', 'de reboco interno 25kg', 'de contrapiso 25kg'],
  },
  {
    categoria: 'Alvenaria',
    prefixo: '275',
    nome: 'Cimento Portland',
    unidade: 'sc',
    valorBase: 38.5,
    quantidadeBase: 260,
    variantes: ['CP II-E-32 50kg', 'CP III-40 50kg', 'CP V-ARI 50kg'],
  },
  {
    categoria: 'Aço e armação',
    prefixo: '312',
    nome: 'Aço CA-50',
    unidade: 'un',
    valorBase: 58.9,
    quantidadeBase: 280,
    variantes: ['6,3mm barra 12m', '8,0mm barra 12m', '10,0mm barra 12m', '12,5mm barra 12m', '16,0mm barra 12m', '20,0mm barra 12m'],
  },
  {
    categoria: 'Aço e armação',
    prefixo: '313',
    nome: 'Aço CA-60',
    unidade: 'kg',
    valorBase: 7.42,
    quantidadeBase: 1400,
    variantes: ['4,2mm rolo', '5,0mm rolo', '6,0mm rolo'],
  },
  {
    categoria: 'Aço e armação',
    prefixo: '314',
    nome: 'Tela soldada nervurada',
    unidade: 'un',
    valorBase: 189,
    quantidadeBase: 70,
    variantes: ['Q92 2,45x6,00m', 'Q138 2,45x6,00m', 'Q196 2,45x6,00m', 'Q283 2,45x6,00m'],
  },
  {
    categoria: 'Aço e armação',
    prefixo: '315',
    nome: 'Acessório de armação',
    unidade: 'un',
    valorBase: 0.38,
    quantidadeBase: 3800,
    variantes: ['espaçador plástico 25mm', 'espaçador plástico 30mm', 'espaçador circular 40mm', 'caranguejo 10mm'],
  },
  {
    categoria: 'Elétrica',
    prefixo: '305',
    nome: 'Cabo flexível 750V',
    unidade: 'rl',
    valorBase: 318,
    quantidadeBase: 32,
    variantes: ['1,5mm2 rolo 100m', '2,5mm2 rolo 100m', '4,0mm2 rolo 100m', '6,0mm2 rolo 100m', '10,0mm2 rolo 100m'],
  },
  {
    categoria: 'Elétrica',
    prefixo: '306',
    nome: 'Cabo PP',
    unidade: 'rl',
    valorBase: 612,
    quantidadeBase: 12,
    variantes: ['2x2,5mm2 rolo 100m', '3x2,5mm2 rolo 100m', '3x4,0mm2 rolo 100m'],
  },
  {
    categoria: 'Elétrica',
    prefixo: '301',
    nome: 'Eletroduto',
    unidade: 'rl',
    valorBase: 61.2,
    quantidadeBase: 60,
    variantes: ['flexível corrugado 3/4 rolo 50m', 'flexível corrugado 1 rolo 50m', 'rígido PVC 3/4 barra 3m', 'rígido PVC 1 barra 3m'],
  },
  {
    categoria: 'Elétrica',
    prefixo: '302',
    nome: 'Disjuntor',
    unidade: 'un',
    valorBase: 13.7,
    quantidadeBase: 220,
    variantes: ['monopolar 10A curva C', 'monopolar 16A curva C', 'monopolar 20A curva C', 'bipolar 25A curva C', 'tripolar 40A curva C', 'DR bipolar 25A 30mA'],
  },
  {
    categoria: 'Elétrica',
    prefixo: '303',
    nome: 'Caixa de passagem',
    unidade: 'un',
    valorBase: 2.95,
    quantidadeBase: 700,
    variantes: ['4x2 PVC', '4x4 PVC', 'octogonal 3x3 PVC', 'de piso 4x4 metálica'],
  },
  {
    categoria: 'Elétrica',
    prefixo: '304',
    nome: 'Quadro de distribuição',
    unidade: 'un',
    valorBase: 148,
    quantidadeBase: 48,
    variantes: ['8 disjuntores embutir', '12 disjuntores embutir', '18 disjuntores embutir', '24 disjuntores sobrepor'],
  },
  {
    categoria: 'Hidráulica',
    prefixo: '321',
    nome: 'Tubo PVC soldável',
    unidade: 'un',
    valorBase: 23.4,
    quantidadeBase: 300,
    variantes: ['20mm barra 6m', '25mm barra 6m', '32mm barra 6m', '40mm barra 6m', '50mm barra 6m'],
  },
  {
    categoria: 'Hidráulica',
    prefixo: '322',
    nome: 'Tubo PVC esgoto',
    unidade: 'un',
    valorBase: 68.9,
    quantidadeBase: 160,
    variantes: ['40mm barra 6m', '50mm barra 6m', '75mm barra 6m', '100mm barra 6m', '150mm barra 6m'],
  },
  {
    categoria: 'Hidráulica',
    prefixo: '323',
    nome: 'Conexão PVC soldável',
    unidade: 'un',
    valorBase: 1.65,
    quantidadeBase: 820,
    variantes: ['joelho 90 25mm', 'joelho 45 25mm', 'tê 25mm', 'luva 25mm', 'adaptador 25mm x 3/4', 'bucha de redução 32x25mm'],
  },
  {
    categoria: 'Hidráulica',
    prefixo: '324',
    nome: 'Registro',
    unidade: 'un',
    valorBase: 41.2,
    quantidadeBase: 90,
    variantes: ['de gaveta 3/4 bruto', 'de gaveta 1 bruto', 'de pressão 3/4 bruto', 'esfera PVC 25mm'],
  },
  {
    categoria: 'Revestimentos',
    prefixo: '281',
    nome: 'Piso cerâmico',
    unidade: 'm2',
    valorBase: 42.7,
    quantidadeBase: 540,
    variantes: ['60x60 acetinado', '45x45 esmaltado', '80x80 polido', '30x30 antiderrapante'],
  },
  {
    categoria: 'Revestimentos',
    prefixo: '282',
    nome: 'Revestimento de parede',
    unidade: 'm2',
    valorBase: 36.9,
    quantidadeBase: 480,
    variantes: ['32x60 branco', '30x45 branco', '33x60 acetinado'],
  },
  {
    categoria: 'Revestimentos',
    prefixo: '283',
    nome: 'Rejunte',
    unidade: 'sc',
    valorBase: 12.3,
    quantidadeBase: 180,
    variantes: ['flexível cinza 5kg', 'flexível branco 5kg', 'acrílico 1kg', 'epóxi 1kg'],
  },
  {
    categoria: 'Pintura',
    prefixo: '341',
    nome: 'Tinta acrílica',
    unidade: 'lt',
    valorBase: 24.9,
    quantidadeBase: 260,
    variantes: ['fosca branca 18L', 'fosca branca 3,6L', 'acetinada branca 18L', 'premium gelo 18L'],
  },
  {
    categoria: 'Pintura',
    prefixo: '342',
    nome: 'Preparação de superfície',
    unidade: 'lt',
    valorBase: 18.4,
    quantidadeBase: 200,
    variantes: ['selador acrílico 18L', 'massa corrida PVA 18L', 'massa acrílica 18L', 'fundo preparador 3,6L'],
  },
  {
    categoria: 'Pintura',
    prefixo: '343',
    nome: 'Acessório de pintura',
    unidade: 'un',
    valorBase: 11.5,
    quantidadeBase: 180,
    variantes: ['rolo de lã 23cm', 'rolo de espuma 15cm', 'pincel 2 polegadas', 'bandeja plástica', 'fita crepe 48mm'],
  },
  {
    categoria: 'Impermeabilização',
    prefixo: '351',
    nome: 'Manta e membrana',
    unidade: 'rl',
    valorBase: 289,
    quantidadeBase: 40,
    variantes: ['asfáltica 3mm 10m2', 'asfáltica 4mm 10m2', 'líquida acrílica 18L', 'autoadesiva aluminizada 10m'],
  },
  {
    categoria: 'Impermeabilização',
    prefixo: '352',
    nome: 'Argamassa polimérica',
    unidade: 'cj',
    valorBase: 96.4,
    quantidadeBase: 56,
    variantes: ['bicomponente 18kg', 'flexível 18kg', 'rígida 18kg'],
  },
  {
    categoria: 'Esquadrias',
    prefixo: '361',
    nome: 'Porta',
    unidade: 'un',
    valorBase: 318,
    quantidadeBase: 90,
    variantes: ['de madeira 80x210 com batente', 'de madeira 70x210 com batente', 'de alumínio 80x210', 'corta-fogo P90 90x210'],
  },
  {
    categoria: 'Esquadrias',
    prefixo: '362',
    nome: 'Janela de alumínio',
    unidade: 'un',
    valorBase: 486,
    quantidadeBase: 72,
    variantes: ['de correr 120x100', 'de correr 150x100', 'maxim-ar 60x60', 'basculante 80x60'],
  },
  {
    categoria: 'Esquadrias',
    prefixo: '363',
    nome: 'Ferragem',
    unidade: 'cj',
    valorBase: 64.3,
    quantidadeBase: 140,
    variantes: ['fechadura de entrada', 'fechadura interna', 'dobradiça 3 polegadas', 'puxador de alumínio 30cm'],
  },
  {
    categoria: 'Ferramentas e equipamentos',
    prefixo: '331',
    nome: 'Equipamento elétrico',
    unidade: 'un',
    valorBase: 1060.18,
    quantidadeBase: 4,
    variantes: ['lixadeira combinada 370W', 'furadeira de impacto 800W', 'martelete perfurador 8,3kg', 'serra circular 1400W', 'policorte 2200W'],
  },
  {
    categoria: 'Ferramentas e equipamentos',
    prefixo: '332',
    nome: 'Equipamento de apoio',
    unidade: 'un',
    valorBase: null,
    quantidadeBase: 6,
    variantes: ['caixote metálico 1,20x0,70x0,65m', 'carrinho de mão reforçado', 'betoneira 400L', 'andaime fachadeiro painel 2,00m'],
  },
  {
    categoria: 'Ferramentas e equipamentos',
    prefixo: '333',
    nome: 'Ferramenta manual',
    unidade: 'un',
    valorBase: 78.4,
    quantidadeBase: 48,
    variantes: ['morsa de bancada n6', 'talhadeira de aço 3/4x12', 'ponteiro de aço 3/4x12', 'colher de pedreiro 9 polegadas', 'nível de alumínio 60cm'],
  },
  {
    categoria: 'EPI',
    prefixo: '260',
    nome: 'Proteção individual',
    unidade: 'un',
    valorBase: 21.5,
    quantidadeBase: 150,
    variantes: ['capacete classe B branco', 'capacete classe B azul', 'óculos incolor antiembaçante', 'óculos fumê', 'protetor facial 8 polegadas'],
  },
  {
    categoria: 'EPI',
    prefixo: '261',
    nome: 'Proteção de mãos e pés',
    unidade: 'pr',
    valorBase: 9.8,
    quantidadeBase: 240,
    variantes: ['luva de vaqueta punho curto', 'luva de vaqueta punho longo', 'luva nitrílica', 'bota de segurança com bico', 'bota de PVC cano longo'],
  },
  {
    categoria: 'EPI',
    prefixo: '262',
    nome: 'Proteção contra quedas',
    unidade: 'un',
    valorBase: 184,
    quantidadeBase: 36,
    variantes: ['cinto paraquedista 5 pontos', 'talabarte duplo em Y', 'trava-quedas deslizante', 'linha de vida 10m'],
  },
  {
    categoria: 'Consumíveis',
    prefixo: '350',
    nome: 'Proteção de obra',
    unidade: 'rl',
    valorBase: 56.8,
    quantidadeBase: 60,
    variantes: ['lona plástica preta 4x100m', 'lona plástica azul 4x50m', 'fita zebrada 200m', 'tela de sinalização laranja 50m'],
  },
  {
    categoria: 'Consumíveis',
    prefixo: '355',
    nome: 'Fixação',
    unidade: 'cx',
    valorBase: 32.4,
    quantidadeBase: 150,
    variantes: ['parafuso 4,5x40 com bucha', 'parafuso 6,0x60 com bucha', 'prego 17x27 1kg', 'prego 18x30 1kg', 'arame recozido n18 1kg'],
  },
];

const FATOR_POR_OBRA: Record<string, number> = { o1: 1, o2: 0.62, o3: 1.35, o4: 0.84, o5: 0.2 };

interface ItemCatalogo {
  codigo: string;
  descricao: string;
  categoria: string;
  unidade: string;
  valorUnitario: number | null;
  base: number;
}

function montarCatalogo(): ItemCatalogo[] {
  const catalogo: ItemCatalogo[] = [];

  FAMILIAS.forEach((familia, indiceFamilia) => {
    familia.variantes.forEach((variante, indiceVariante) => {
      const sequencia = String(10 + indiceVariante * 7 + indiceFamilia).padStart(2, '0');
      const ajuste = 1 + (indiceVariante - familia.variantes.length / 2) * 0.12;

      catalogo.push({
        codigo: familia.prefixo + sequencia,
        descricao: familia.nome + ' ' + variante,
        categoria: familia.categoria,
        unidade: familia.unidade,
        valorUnitario:
          familia.valorBase === null ? null : Math.round(familia.valorBase * ajuste * 100) / 100,
        base: Math.max(0, Math.round(familia.quantidadeBase * ajuste)),
      });
    });
  });

  return catalogo;
}

const CATALOGO = montarCatalogo();

const SEM_VALOR = new Set(
  CATALOGO.filter((item) => item.categoria === 'Ferramentas e equipamentos')
    .slice(0, 3)
    .map((item) => item.codigo),
);

const SALDO_ZERADO = new Set(CATALOGO.filter((_, indice) => indice % 23 === 0).map((i) => i.codigo));

export function gerarEstoqueMock(): InsumoEstoque[] {
  const estoque: InsumoEstoque[] = [];

  for (const [obraId, fator] of Object.entries(FATOR_POR_OBRA)) {
    const deslocamento = Number(obraId.slice(1));

    CATALOGO.forEach((item, indice) => {
      if (obraId !== 'o1' && (indice + deslocamento) % 17 === 0) {
        return;
      }

      const quantidade = SALDO_ZERADO.has(item.codigo)
        ? 0
        : Math.round(item.base * fator * (1 + ((indice * 13 + deslocamento) % 9) / 100));

      estoque.push({
        id: obraId + '-' + item.codigo,
        obraId,
        codigo: item.codigo,
        descricao: item.descricao,
        categoria: item.categoria,
        unidade: item.unidade,
        quantidade,
        valorUnitario: SEM_VALOR.has(item.codigo) ? null : item.valorUnitario,
        estoqueMinimo: quantidade ? Math.round(quantidade * 0.1) : null,
      });
    });
  }

  return estoque;
}
