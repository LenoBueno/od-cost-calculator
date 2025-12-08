import { BudgetItem, Config } from '@/types/budget';

export const initialMateriais: BudgetItem[] = [
  { id: 1, item: 'Linho puro', categoria: 'Tecido', descricao: 'Tecido linho 100%', fornecedor: 'Tecidos Brasil', precoUnit: 85.00, quantidade: 10, frete: 50.00, impostos: 12, aplicacao: 'Camisa', custoPorPeca: 45.00, obs: '' },
  { id: 2, item: 'Linho misto', categoria: 'Tecido', descricao: 'Linho com poliéster', fornecedor: 'Tecidos Brasil', precoUnit: 45.00, quantidade: 15, frete: 50.00, impostos: 12, aplicacao: 'Calça', custoPorPeca: 30.00, obs: '' },
  { id: 3, item: 'Viscose', categoria: 'Tecido', descricao: 'Viscose lisa', fornecedor: 'Tecimport', precoUnit: 32.00, quantidade: 20, frete: 40.00, impostos: 12, aplicacao: 'Bata', custoPorPeca: 18.00, obs: '' },
  { id: 4, item: 'Tricoline', categoria: 'Tecido', descricao: 'Tricoline estampada', fornecedor: 'Tecimport', precoUnit: 28.00, quantidade: 12, frete: 40.00, impostos: 12, aplicacao: 'Saia', custoPorPeca: 15.00, obs: '' },
  { id: 5, item: 'Linha poliéster', categoria: 'Insumo', descricao: 'Cone 5000m', fornecedor: 'Armarinho Central', precoUnit: 12.50, quantidade: 50, frete: 25.00, impostos: 18, aplicacao: 'Geral', custoPorPeca: 0.80, obs: '' },
  { id: 6, item: 'Botões de resina', categoria: 'Acessório', descricao: 'Botão 15mm', fornecedor: 'Armarinho Central', precoUnit: 0.35, quantidade: 1000, frete: 15.00, impostos: 18, aplicacao: 'Camisas', custoPorPeca: 0.50, obs: '' },
  { id: 7, item: 'Etiquetas bordadas', categoria: 'Acessório', descricao: 'Logo Odò bordado', fornecedor: 'Etiquetas Premium', precoUnit: 2.80, quantidade: 500, frete: 30.00, impostos: 18, aplicacao: 'Todas peças', custoPorPeca: 2.80, obs: '' },
];

export const initialMaquinas: BudgetItem[] = [
  { id: 1, item: 'Máquina reta industrial Direct Drive', categoria: 'Equipamento', descricao: 'Motor acoplado', fornecedor: 'Máquinas São Paulo', precoUnit: 2800.00, quantidade: 1, frete: 150.00, impostos: 15, aplicacao: 'Costura geral', custoPorPeca: 0, obs: '' },
  { id: 2, item: 'Overlock 3 fios', categoria: 'Equipamento', descricao: 'Acabamento profissional', fornecedor: 'Máquinas São Paulo', precoUnit: 3200.00, quantidade: 1, frete: 150.00, impostos: 15, aplicacao: 'Acabamento', custoPorPeca: 0, obs: '' },
  { id: 3, item: 'Bordadeira eletrônica 1 agulha', categoria: 'Equipamento', descricao: 'Automática', fornecedor: 'Brother Industrial', precoUnit: 8500.00, quantidade: 1, frete: 200.00, impostos: 15, aplicacao: 'Bordados', custoPorPeca: 0, obs: '' },
  { id: 4, item: 'Mesa de corte', categoria: 'Equipamento', descricao: '2m x 1,5m', fornecedor: 'Móveis Industriais', precoUnit: 1200.00, quantidade: 1, frete: 100.00, impostos: 15, aplicacao: 'Corte', custoPorPeca: 0, obs: '' },
];

export const initialProducao: BudgetItem[] = [
  { id: 1, item: 'Serviço de corte', categoria: 'Terceirizado', descricao: 'Corte profissional', fornecedor: 'Facção ABC', precoUnit: 5.00, quantidade: 100, frete: 0, impostos: 8, aplicacao: 'Por peça', custoPorPeca: 5.00, obs: '' },
  { id: 2, item: 'Costura completa', categoria: 'Terceirizado', descricao: 'Montagem da peça', fornecedor: 'Facção ABC', precoUnit: 18.00, quantidade: 100, frete: 0, impostos: 8, aplicacao: 'Por peça', custoPorPeca: 18.00, obs: '' },
  { id: 3, item: 'Acabamento', categoria: 'Terceirizado', descricao: 'Limpeza e prensa', fornecedor: 'Acabamentos Silva', precoUnit: 3.50, quantidade: 100, frete: 0, impostos: 8, aplicacao: 'Por peça', custoPorPeca: 3.50, obs: '' },
];

export const initialConfig: Config = {
  impostosDefault: 12,
  margemLucro: 200,
  fretemedio: 35,
  custoOperacional: 2500,
  maoObraInterna: 3500,
  producaoMensal: 100
};
