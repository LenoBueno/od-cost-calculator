import { useState } from 'react';
import { TabType } from '@/types/budget';
import { useBudget } from '@/hooks/useBudget';
import { exportToCSV } from '@/utils/exportCSV';
import { BudgetHeader } from './BudgetHeader';
import { TabNavigation } from './TabNavigation';
import { BudgetTable } from './BudgetTable';
import { BudgetOverview } from './BudgetOverview';
import { ConfigPanel } from './ConfigPanel';

export const OrcamentoOdo = () => {
  const [activeTab, setActiveTab] = useState<TabType>('materiais');

  const {
    materiais,
    maquinas,
    producao,
    config,
    setConfig,
    totais,
    custoFixoPorPeca,
    custoVariavelPorPeca,
    custoTotalPorPeca,
    precos,
    adicionarItem,
    removerItem,
    atualizarItem
  } = useBudget();

  const handleExport = () => {
    exportToCSV({
      materiais,
      maquinas,
      producao,
      totais,
      custoFixoPorPeca,
      custoVariavelPorPeca,
      custoTotalPorPeca,
      precos
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-elevated p-6 sm:p-8">
          <BudgetHeader onExport={handleExport} />
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'materiais' && (
            <BudgetTable
              tipo="materiais"
              dados={materiais}
              onAdd={() => adicionarItem('materiais')}
              onRemove={id => removerItem('materiais', id)}
              onUpdate={(id, campo, valor) => atualizarItem('materiais', id, campo, valor)}
            />
          )}

          {activeTab === 'maquinas' && (
            <BudgetTable
              tipo="maquinas"
              dados={maquinas}
              onAdd={() => adicionarItem('maquinas')}
              onRemove={id => removerItem('maquinas', id)}
              onUpdate={(id, campo, valor) => atualizarItem('maquinas', id, campo, valor)}
            />
          )}

          {activeTab === 'producao' && (
            <BudgetTable
              tipo="producao"
              dados={producao}
              onAdd={() => adicionarItem('producao')}
              onRemove={id => removerItem('producao', id)}
              onUpdate={(id, campo, valor) => atualizarItem('producao', id, campo, valor)}
            />
          )}

          {activeTab === 'orcamento' && (
            <BudgetOverview
              totais={totais}
              custoFixoPorPeca={custoFixoPorPeca}
              custoVariavelPorPeca={custoVariavelPorPeca}
              custoTotalPorPeca={custoTotalPorPeca}
              precos={precos}
            />
          )}

          {activeTab === 'config' && (
            <ConfigPanel config={config} onConfigChange={setConfig} />
          )}
        </div>

        <footer className="text-center mt-8 text-sm text-muted-foreground">
          <p className="font-display text-lg text-foreground mb-1">ODÒ</p>
          <p>Sistema de Gestão de Custos e Precificação</p>
        </footer>
      </div>
    </div>
  );
};
