import { Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Config } from '@/types/budget';

interface ConfigPanelProps {
  config: Config;
  onConfigChange: (newConfig: Config) => void;
}

export const ConfigPanel = ({ config, onConfigChange }: ConfigPanelProps) => {
  const handleChange = (field: keyof Config, value: string) => {
    onConfigChange({
      ...config,
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
          Configurações Gerais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label htmlFor="impostosDefault" className="text-sm font-semibold text-foreground">
              % Impostos Padrão
            </Label>
            <Input
              id="impostosDefault"
              type="number"
              value={config.impostosDefault}
              onChange={e => handleChange('impostosDefault', e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="margemLucro" className="text-sm font-semibold text-foreground">
              % Margem de Lucro
            </Label>
            <Input
              id="margemLucro"
              type="number"
              value={config.margemLucro}
              onChange={e => handleChange('margemLucro', e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fretemedio" className="text-sm font-semibold text-foreground">
              Frete Médio (R$)
            </Label>
            <Input
              id="fretemedio"
              type="number"
              value={config.fretemedio}
              onChange={e => handleChange('fretemedio', e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="custoOperacional" className="text-sm font-semibold text-foreground">
              Custo Operacional Mensal (R$)
            </Label>
            <Input
              id="custoOperacional"
              type="number"
              value={config.custoOperacional}
              onChange={e => handleChange('custoOperacional', e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maoObraInterna" className="text-sm font-semibold text-foreground">
              Mão de Obra Interna Mensal (R$)
            </Label>
            <Input
              id="maoObraInterna"
              type="number"
              value={config.maoObraInterna}
              onChange={e => handleChange('maoObraInterna', e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="producaoMensal" className="text-sm font-semibold text-foreground">
              Produção Mensal Estimada (peças)
            </Label>
            <Input
              id="producaoMensal"
              type="number"
              value={config.producaoMensal}
              onChange={e => handleChange('producaoMensal', e.target.value)}
              className="h-12"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
