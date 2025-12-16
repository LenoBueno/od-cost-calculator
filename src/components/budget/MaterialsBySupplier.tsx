import { DbBudgetItem } from '@/hooks/useBudgetDatabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MaterialsBySupplierProps {
  materials: DbBudgetItem[];
}

const calcularSubtotal = (preco: number, qtd: number) => preco * qtd;
const calcularImpostos = (subtotal: number, percImpostos: number) => subtotal * (percImpostos / 100);
const calcularCustoFinal = (subtotal: number, impostos: number, frete: number) => subtotal + impostos + frete;

export const MaterialsBySupplier = ({ materials }: MaterialsBySupplierProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Group materials by supplier
  const groupedBySupplier = materials.reduce((acc, material) => {
    const supplier = material.fornecedor?.trim() || 'Sem Fornecedor';
    if (!acc[supplier]) {
      acc[supplier] = [];
    }
    acc[supplier].push(material);
    return acc;
  }, {} as Record<string, DbBudgetItem[]>);

  // Sort each supplier's materials by unit price (cheapest first)
  Object.keys(groupedBySupplier).forEach(supplier => {
    groupedBySupplier[supplier].sort((a, b) => Number(a.preco_unit) - Number(b.preco_unit));
  });

  // Sort suppliers alphabetically
  const sortedSuppliers = Object.keys(groupedBySupplier).sort((a, b) => {
    if (a === 'Sem Fornecedor') return 1;
    if (b === 'Sem Fornecedor') return -1;
    return a.localeCompare(b, 'pt-BR');
  });

  if (materials.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhum material cadastrado ainda.</p>
        <p className="text-sm mt-2">Adicione materiais na aba "Matéria Prima" para vê-los organizados aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Materiais por Fornecedor
        </h2>
        <p className="text-muted-foreground mt-1">
          Ordenados do mais barato ao mais caro
        </p>
      </div>

      {sortedSuppliers.map(supplier => {
        const supplierMaterials = groupedBySupplier[supplier];
        const totalSupplier = supplierMaterials.reduce((sum, m) => {
          const subtotal = calcularSubtotal(Number(m.preco_unit), Number(m.quantidade));
          const impostos = calcularImpostos(subtotal, Number(m.impostos));
          return sum + calcularCustoFinal(subtotal, impostos, Number(m.frete));
        }, 0);

        return (
          <Card key={supplier} className="overflow-hidden">
            <CardHeader className="gradient-warm py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-display text-primary-foreground">
                  {supplier}
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-background/20 text-primary-foreground">
                    {supplierMaterials.length} {supplierMaterials.length === 1 ? 'item' : 'itens'}
                  </Badge>
                  <span className="font-semibold text-primary-foreground">
                    Total: {formatCurrency(totalSupplier)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">#</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Item</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Categoria</th>
                      <th className="px-4 py-2 text-right font-medium text-muted-foreground">Preço Unit.</th>
                      <th className="px-4 py-2 text-right font-medium text-muted-foreground">Qtd</th>
                      <th className="px-4 py-2 text-right font-medium text-muted-foreground">Frete</th>
                      <th className="px-4 py-2 text-right font-medium text-muted-foreground">Imp.</th>
                      <th className="px-4 py-2 text-right font-medium text-muted-foreground">Custo Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierMaterials.map((material, index) => {
                      const subtotal = calcularSubtotal(Number(material.preco_unit), Number(material.quantidade));
                      const impostosValor = calcularImpostos(subtotal, Number(material.impostos));
                      const custoFinal = calcularCustoFinal(subtotal, impostosValor, Number(material.frete));

                      return (
                        <tr
                          key={material.id}
                          className={`border-b border-border transition-colors hover:bg-accent/30 ${
                            index % 2 === 0 ? 'bg-card' : 'bg-muted/20'
                          }`}
                        >
                          <td className="px-4 py-3 text-muted-foreground">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 font-medium text-foreground">
                            {material.item || '-'}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {material.categoria || '-'}
                          </td>
                          <td className="px-4 py-3 text-right text-foreground">
                            {formatCurrency(Number(material.preco_unit))}
                          </td>
                          <td className="px-4 py-3 text-right text-muted-foreground">
                            {material.quantidade}
                          </td>
                          <td className="px-4 py-3 text-right text-muted-foreground">
                            {formatCurrency(Number(material.frete))}
                          </td>
                          <td className="px-4 py-3 text-right text-muted-foreground">
                            {material.impostos}%
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-secondary">
                            {formatCurrency(custoFinal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Summary */}
      <Card className="bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/30">
        <CardContent className="py-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-foreground">
              Total Geral de Materiais
            </span>
            <span className="text-2xl font-display font-bold text-secondary">
              {formatCurrency(
                materials.reduce((sum, m) => {
                  const subtotal = calcularSubtotal(Number(m.preco_unit), Number(m.quantidade));
                  const impostos = calcularImpostos(subtotal, Number(m.impostos));
                  return sum + calcularCustoFinal(subtotal, impostos, Number(m.frete));
                }, 0)
              )}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
