import { Calculator, TrendingUp } from 'lucide-react';
import { DbBudgetItem, DbBudgetProject } from '@/hooks/useBudgetDatabase';

interface BudgetOverviewDbProps {
  materials: DbBudgetItem[];
  machines: DbBudgetItem[];
  production: DbBudgetItem[];
  config: DbBudgetProject | null;
}

const calcularSubtotal = (preco: number, qtd: number) => preco * qtd;
const calcularImpostos = (subtotal: number, percImpostos: number) => subtotal * (percImpostos / 100);
const calcularCustoFinal = (subtotal: number, impostos: number, frete: number) => subtotal + impostos + frete;

const calcularTotais = (items: DbBudgetItem[]) => {
  return items.reduce((acc, item) => {
    const subtotal = calcularSubtotal(Number(item.preco_unit), Number(item.quantidade));
    const impostosValor = calcularImpostos(subtotal, Number(item.impostos));
    const custoFinal = calcularCustoFinal(subtotal, impostosValor, Number(item.frete));
    return acc + custoFinal;
  }, 0);
};

export const BudgetOverviewDb = ({ materials, machines, production, config }: BudgetOverviewDbProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totais = {
    materiais: calcularTotais(materials),
    maquinas: calcularTotais(machines),
    producao: calcularTotais(production)
  };

  const producaoMensal = config?.producao_mensal || 100;
  const custoOperacional = Number(config?.custo_operacional) || 2500;
  const maoObraInterna = Number(config?.mao_obra_interna) || 3500;

  const custoFixoPorPeca = (totais.maquinas / 24 / producaoMensal) + (custoOperacional / producaoMensal) + (maoObraInterna / producaoMensal);
  const custoVariavelPorPeca = totais.producao / producaoMensal;
  const custoMaterialMedio = materials.length > 0 
    ? materials.reduce((acc, m) => acc + Number(m.custo_por_peca), 0) / materials.length 
    : 67.85;
  const custoTotalPorPeca = custoFixoPorPeca + custoVariavelPorPeca + custoMaterialMedio;

  const precos = {
    atacado: custoTotalPorPeca * 2,
    varejoMinimo: custoTotalPorPeca * 3,
    varejoIdeal: custoTotalPorPeca * 4
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Total Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-elevated p-6 gradient-warm">
          <h3 className="text-lg font-semibold text-primary-foreground/90 mb-2">Total Materiais</h3>
          <p className="text-3xl font-display font-bold text-primary-foreground">
            {formatCurrency(totais.materiais)}
          </p>
        </div>
        <div className="card-elevated p-6 gradient-sage">
          <h3 className="text-lg font-semibold text-secondary-foreground/90 mb-2">Total Equipamentos</h3>
          <p className="text-3xl font-display font-bold text-secondary-foreground">
            {formatCurrency(totais.maquinas)}
          </p>
        </div>
        <div className="card-elevated p-6 gradient-gold">
          <h3 className="text-lg font-semibold text-charcoal/80 mb-2">Total Produção</h3>
          <p className="text-3xl font-display font-bold text-charcoal">
            {formatCurrency(totais.producao)}
          </p>
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="card-elevated p-6">
        <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-3 text-foreground">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          Análise por Peça
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/50 p-5 rounded-xl border-l-4 border-primary">
            <p className="text-sm text-muted-foreground font-medium">Custo Fixo por Peça</p>
            <p className="text-2xl font-display font-bold text-primary mt-1">
              {formatCurrency(custoFixoPorPeca)}
            </p>
          </div>
          <div className="bg-muted/50 p-5 rounded-xl border-l-4 border-secondary">
            <p className="text-sm text-muted-foreground font-medium">Custo Variável por Peça</p>
            <p className="text-2xl font-display font-bold text-secondary mt-1">
              {formatCurrency(custoVariavelPorPeca)}
            </p>
          </div>
          <div className="bg-muted/50 p-5 rounded-xl border-l-4 border-gold">
            <p className="text-sm text-muted-foreground font-medium">Custo Total por Peça</p>
            <p className="text-2xl font-display font-bold text-gold mt-1">
              {formatCurrency(custoTotalPorPeca)}
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Suggestions */}
      <div className="card-elevated p-6 bg-gradient-to-br from-card to-accent/30">
        <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-3 text-foreground">
          <div className="p-2 rounded-lg bg-secondary/10">
            <TrendingUp className="w-5 h-5 text-secondary" />
          </div>
          Sugestões de Preço de Venda
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-xl shadow-elegant border border-border">
            <p className="text-sm text-muted-foreground font-semibold mb-2">Atacado (x2)</p>
            <p className="text-3xl font-display font-bold text-secondary">
              {formatCurrency(precos.atacado)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Lucro: {formatCurrency(precos.atacado - custoTotalPorPeca)}
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-elegant border border-border">
            <p className="text-sm text-muted-foreground font-semibold mb-2">Varejo Mínimo (x3)</p>
            <p className="text-3xl font-display font-bold text-primary">
              {formatCurrency(precos.varejoMinimo)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Lucro: {formatCurrency(precos.varejoMinimo - custoTotalPorPeca)}
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-elegant border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gold text-charcoal text-xs font-bold px-3 py-1 rounded-bl-lg">
              Recomendado
            </div>
            <p className="text-sm text-muted-foreground font-semibold mb-2">Varejo Ideal (x4)</p>
            <p className="text-3xl font-display font-bold text-gold">
              {formatCurrency(precos.varejoIdeal)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Lucro: {formatCurrency(precos.varejoIdeal - custoTotalPorPeca)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
