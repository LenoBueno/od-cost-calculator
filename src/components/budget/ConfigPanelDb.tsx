import { Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DbBudgetProject } from '@/hooks/useBudgetDatabase';

interface ConfigPanelDbProps {
  config: DbBudgetProject | null;
  onConfigChange: (config: Partial<DbBudgetProject>) => void;
}

export const ConfigPanelDb = ({ config, onConfigChange }: ConfigPanelDbProps) => {
  if (!config) return null;

  const handleChange = (field: keyof DbBudgetProject, value: string) => {
    onConfigChange({
      [field]: parseFloat(value) || 0
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="card-elevated p-8">
        <h3 className="text-2xl font-display font-bold mb-8 flex items-center gap-3 text-foreground">
          <div className="p-2 rounded-lg bg-primary/10">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          Configurações do Projeto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label htmlFor="impostos_default" className="text-sm font-semibold text-foreground">
              % Impostos Padrão
            </Label>
            <Input
              id="impostos_default"
              type="number"
              value={config.impostos_default}
              onChange={e => handleChange('impostos_default', e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="margem_lucro" className="text-sm font-semibold text-foreground">
              % Margem de Lucro
            </Label>
            <Input
              id="margem_lucro"
              type="number"
              value={config.margem_lucro}
              onChange={e => handleChange('margem_lucro', e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frete_medio" className="text-sm font-semibold text-foreground">
              Frete Médio (R$)
            </Label>
            <Input
              id="frete_medio"
              type="number"
              value={config.frete_medio}
              onChange={e => handleChange('frete_medio', e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="custo_operacional" className="text-sm font-semibold text-foreground">
              Custo Operacional Mensal (R$)
            </Label>
            <Input
              id="custo_operacional"
              type="number"
              value={config.custo_operacional}
              onChange={e => handleChange('custo_operacional', e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mao_obra_interna" className="text-sm font-semibold text-foreground">
              Mão de Obra Interna Mensal (R$)
            </Label>
            <Input
              id="mao_obra_interna"
              type="number"
              value={config.mao_obra_interna}
              onChange={e => handleChange('mao_obra_interna', e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="producao_mensal" className="text-sm font-semibold text-foreground">
              Produção Mensal Estimada (peças)
            </Label>
            <Input
              id="producao_mensal"
              type="number"
              value={config.producao_mensal}
              onChange={e => handleChange('producao_mensal', e.target.value)}
              className="h-12"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
