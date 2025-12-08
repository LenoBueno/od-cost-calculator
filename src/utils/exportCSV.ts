import { BudgetItem } from '@/types/budget';
import { calcularSubtotal, calcularImpostos, calcularCustoFinal } from '@/hooks/useBudget';

interface ExportData {
  materiais: BudgetItem[];
  maquinas: BudgetItem[];
  producao: BudgetItem[];
  totais: {
    materiais: number;
    maquinas: number;
    producao: number;
  };
  custoFixoPorPeca: number;
  custoVariavelPorPeca: number;
  custoTotalPorPeca: number;
  precos: {
    atacado: number;
    varejoMinimo: number;
    varejoIdeal: number;
  };
}

export const exportToCSV = (data: ExportData) => {
  const { materiais, maquinas, producao, totais, custoFixoPorPeca, custoVariavelPorPeca, custoTotalPorPeca, precos } = data;

  let csv = 'PLANILHA DE ORÇAMENTO ODÒ - LOJA DE ROUPAS\n\n';

  csv += '=== MATERIAIS BASE ===\n';
  csv += 'Item,Categoria,Descrição,Fornecedor,Preço Unit,Qtd,Subtotal,Frete,Impostos %,Impostos R$,Custo Final,Aplicação,Custo/Peça,Obs\n';
  materiais.forEach(m => {
    const subtotal = calcularSubtotal(m.precoUnit, m.quantidade);
    const impostosValor = calcularImpostos(subtotal, m.impostos);
    const custoFinal = calcularCustoFinal(subtotal, impostosValor, m.frete);
    csv += `${m.item},${m.categoria},${m.descricao},${m.fornecedor},${m.precoUnit},${m.quantidade},${subtotal.toFixed(2)},${m.frete},${m.impostos}%,${impostosValor.toFixed(2)},${custoFinal.toFixed(2)},${m.aplicacao},${m.custoPorPeca},${m.obs}\n`;
  });

  csv += '\n=== MÁQUINAS E EQUIPAMENTOS ===\n';
  csv += 'Item,Categoria,Descrição,Fornecedor,Preço Unit,Qtd,Subtotal,Frete,Impostos %,Impostos R$,Custo Final,Aplicação,Obs\n';
  maquinas.forEach(m => {
    const subtotal = calcularSubtotal(m.precoUnit, m.quantidade);
    const impostosValor = calcularImpostos(subtotal, m.impostos);
    const custoFinal = calcularCustoFinal(subtotal, impostosValor, m.frete);
    csv += `${m.item},${m.categoria},${m.descricao},${m.fornecedor},${m.precoUnit},${m.quantidade},${subtotal.toFixed(2)},${m.frete},${m.impostos}%,${impostosValor.toFixed(2)},${custoFinal.toFixed(2)},${m.aplicacao},${m.obs}\n`;
  });

  csv += '\n=== PRODUÇÃO ===\n';
  csv += 'Item,Categoria,Descrição,Fornecedor,Preço Unit,Qtd,Subtotal,Frete,Impostos %,Impostos R$,Custo Final,Aplicação,Custo/Peça,Obs\n';
  producao.forEach(p => {
    const subtotal = calcularSubtotal(p.precoUnit, p.quantidade);
    const impostosValor = calcularImpostos(subtotal, p.impostos);
    const custoFinal = calcularCustoFinal(subtotal, impostosValor, p.frete);
    csv += `${p.item},${p.categoria},${p.descricao},${p.fornecedor},${p.precoUnit},${p.quantidade},${subtotal.toFixed(2)},${p.frete},${p.impostos}%,${impostosValor.toFixed(2)},${custoFinal.toFixed(2)},${p.aplicacao},${p.custoPorPeca},${p.obs}\n`;
  });

  csv += '\n=== ORÇAMENTO GERAL ===\n';
  csv += `Total Materiais,R$ ${totais.materiais.toFixed(2)}\n`;
  csv += `Total Equipamentos,R$ ${totais.maquinas.toFixed(2)}\n`;
  csv += `Total Produção,R$ ${totais.producao.toFixed(2)}\n`;
  csv += `Custo Fixo por Peça,R$ ${custoFixoPorPeca.toFixed(2)}\n`;
  csv += `Custo Variável por Peça,R$ ${custoVariavelPorPeca.toFixed(2)}\n`;
  csv += `Custo Total por Peça,R$ ${custoTotalPorPeca.toFixed(2)}\n`;
  csv += `Preço Atacado (x2),R$ ${precos.atacado.toFixed(2)}\n`;
  csv += `Preço Varejo Mínimo (x3),R$ ${precos.varejoMinimo.toFixed(2)}\n`;
  csv += `Preço Varejo Ideal (x4),R$ ${precos.varejoIdeal.toFixed(2)}\n`;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'orcamento_odo.csv';
  link.click();
};
