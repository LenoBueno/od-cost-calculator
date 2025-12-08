import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BudgetItem } from '@/types/budget';
import { calcularSubtotal, calcularImpostos, calcularCustoFinal } from '@/hooks/useBudget';
import { Input } from '@/components/ui/input';

interface BudgetTableProps {
  tipo: 'materiais' | 'maquinas' | 'producao';
  dados: BudgetItem[];
  onAdd: () => void;
  onRemove: (id: number) => void;
  onUpdate: (id: number, campo: keyof BudgetItem, valor: string | number) => void;
}

export const BudgetTable = ({ tipo, dados, onAdd, onRemove, onUpdate }: BudgetTableProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="animate-fade-in">
      <div className="overflow-x-auto rounded-xl border border-border shadow-elegant">
        <table className="w-full text-sm">
          <thead>
            <tr className="gradient-warm">
              <th className="px-4 py-3 text-left font-semibold text-primary-foreground">Item</th>
              <th className="px-4 py-3 text-left font-semibold text-primary-foreground">Categoria</th>
              <th className="px-4 py-3 text-left font-semibold text-primary-foreground">Fornecedor</th>
              <th className="px-4 py-3 text-right font-semibold text-primary-foreground">Preço Unit</th>
              <th className="px-4 py-3 text-right font-semibold text-primary-foreground">Qtd</th>
              <th className="px-4 py-3 text-right font-semibold text-primary-foreground">Subtotal</th>
              <th className="px-4 py-3 text-right font-semibold text-primary-foreground">Frete</th>
              <th className="px-4 py-3 text-right font-semibold text-primary-foreground">Imp %</th>
              <th className="px-4 py-3 text-right font-semibold text-primary-foreground">Imp R$</th>
              <th className="px-4 py-3 text-right font-semibold text-primary-foreground">Custo Final</th>
              <th className="px-4 py-3 text-center font-semibold text-primary-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item, index) => {
              const subtotal = calcularSubtotal(item.precoUnit, item.quantidade);
              const impostosValor = calcularImpostos(subtotal, item.impostos);
              const custoFinal = calcularCustoFinal(subtotal, impostosValor, item.frete);

              return (
                <tr
                  key={item.id}
                  className={`border-b border-border transition-colors hover:bg-accent/50 ${
                    index % 2 === 0 ? 'bg-card' : 'bg-muted/30'
                  }`}
                >
                  <td className="px-4 py-2">
                    <Input
                      type="text"
                      value={item.item}
                      onChange={e => onUpdate(item.id, 'item', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="text"
                      value={item.categoria}
                      onChange={e => onUpdate(item.id, 'categoria', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="text"
                      value={item.fornecedor}
                      onChange={e => onUpdate(item.id, 'fornecedor', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      value={item.precoUnit}
                      onChange={e => onUpdate(item.id, 'precoUnit', parseFloat(e.target.value) || 0)}
                      className="h-8 text-sm w-24 text-right"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      value={item.quantidade}
                      onChange={e => onUpdate(item.id, 'quantidade', parseFloat(e.target.value) || 0)}
                      className="h-8 text-sm w-20 text-right"
                    />
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-foreground">
                    {formatCurrency(subtotal)}
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      value={item.frete}
                      onChange={e => onUpdate(item.id, 'frete', parseFloat(e.target.value) || 0)}
                      className="h-8 text-sm w-24 text-right"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      value={item.impostos}
                      onChange={e => onUpdate(item.id, 'impostos', parseFloat(e.target.value) || 0)}
                      className="h-8 text-sm w-16 text-right"
                    />
                  </td>
                  <td className="px-4 py-2 text-right text-muted-foreground">
                    {formatCurrency(impostosValor)}
                  </td>
                  <td className="px-4 py-2 text-right font-bold text-secondary">
                    {formatCurrency(custoFinal)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Button onClick={onAdd} variant="outline" className="mt-6">
        <Plus className="w-4 h-4" />
        Adicionar Item
      </Button>
    </div>
  );
};
