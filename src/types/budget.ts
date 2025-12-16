export interface BudgetItem {
  id: number;
  item: string;
  categoria: string;
  descricao: string;
  fornecedor: string;
  precoUnit: number;
  quantidade: number;
  frete: number;
  impostos: number;
  aplicacao: string;
  custoPorPeca: number;
  obs: string;
}

export interface Config {
  impostosDefault: number;
  margemLucro: number;
  fretemedio: number;
  custoOperacional: number;
  maoObraInterna: number;
  producaoMensal: number;
}

export type TabType = 'materiais' | 'maquinas' | 'producao' | 'fornecedores' | 'orcamento' | 'config';
