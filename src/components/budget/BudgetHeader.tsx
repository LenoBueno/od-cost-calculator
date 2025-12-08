import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BudgetHeaderProps {
  onExport: () => void;
}

export const BudgetHeader = ({ onExport }: BudgetHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
          Planilha de Orçamento
        </h1>
        <p className="text-lg text-muted-foreground mt-1 font-body">
          Sistema completo de gestão de custos e precificação
        </p>
      </div>
      <Button onClick={onExport} variant="success" size="lg" className="shrink-0">
        <Download className="w-5 h-5" />
        Exportar CSV
      </Button>
    </div>
  );
};
