import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { TabType } from '@/types/budget';
import { useAuth } from '@/hooks/useAuth';
import { useBudgetDatabase, DbBudgetItem } from '@/hooks/useBudgetDatabase';
import { BudgetHeader } from './BudgetHeader';
import { TabNavigation } from './TabNavigation';
import { BudgetTableDb } from './BudgetTableDb';
import { BudgetOverviewDb } from './BudgetOverviewDb';
import { ConfigPanelDb } from './ConfigPanelDb';
import { MaterialsBySupplier } from './MaterialsBySupplier';

const calcularSubtotal = (preco: number, qtd: number) => preco * qtd;
const calcularImpostos = (subtotal: number, percImpostos: number) => subtotal * (percImpostos / 100);
const calcularCustoFinal = (subtotal: number, impostos: number, frete: number) => subtotal + impostos + frete;

export const OrcamentoOdo = () => {
  const [activeTab, setActiveTab] = useState<TabType>('materiais');
  const navigate = useNavigate();
  const { signOut, loading: authLoading } = useAuth();
  const {
    projects,
    currentProject,
    setCurrentProject,
    materials,
    machines,
    production,
    loading,
    createProject,
    deleteProject,
    updateProjectConfig,
    addItem,
    updateItem,
    removeItem
  } = useBudgetDatabase();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleExport = () => {
    if (!currentProject) return;

    let csv = 'PLANILHA DE ORÇAMENTO ODÒ - LOJA DE ROUPAS\n\n';
    csv += `Projeto: ${currentProject.name}\n\n`;

    csv += '=== MATERIAIS BASE ===\n';
    csv += 'Item,Categoria,Fornecedor,Preço Unit,Qtd,Subtotal,Frete,Impostos %,Impostos R$,Custo Final\n';
    materials.forEach((m: DbBudgetItem) => {
      const subtotal = calcularSubtotal(Number(m.preco_unit), Number(m.quantidade));
      const impostosValor = calcularImpostos(subtotal, Number(m.impostos));
      const custoFinal = calcularCustoFinal(subtotal, impostosValor, Number(m.frete));
      csv += `${m.item},${m.categoria},${m.fornecedor},${m.preco_unit},${m.quantidade},${subtotal.toFixed(2)},${m.frete},${m.impostos}%,${impostosValor.toFixed(2)},${custoFinal.toFixed(2)}\n`;
    });

    csv += '\n=== MÁQUINAS E EQUIPAMENTOS ===\n';
    csv += 'Item,Categoria,Fornecedor,Preço Unit,Qtd,Subtotal,Frete,Impostos %,Impostos R$,Custo Final\n';
    machines.forEach((m: DbBudgetItem) => {
      const subtotal = calcularSubtotal(Number(m.preco_unit), Number(m.quantidade));
      const impostosValor = calcularImpostos(subtotal, Number(m.impostos));
      const custoFinal = calcularCustoFinal(subtotal, impostosValor, Number(m.frete));
      csv += `${m.item},${m.categoria},${m.fornecedor},${m.preco_unit},${m.quantidade},${subtotal.toFixed(2)},${m.frete},${m.impostos}%,${impostosValor.toFixed(2)},${custoFinal.toFixed(2)}\n`;
    });

    csv += '\n=== PRODUÇÃO ===\n';
    csv += 'Item,Categoria,Fornecedor,Preço Unit,Qtd,Subtotal,Frete,Impostos %,Impostos R$,Custo Final\n';
    production.forEach((p: DbBudgetItem) => {
      const subtotal = calcularSubtotal(Number(p.preco_unit), Number(p.quantidade));
      const impostosValor = calcularImpostos(subtotal, Number(p.impostos));
      const custoFinal = calcularCustoFinal(subtotal, impostosValor, Number(p.frete));
      csv += `${p.item},${p.categoria},${p.fornecedor},${p.preco_unit},${p.quantidade},${subtotal.toFixed(2)},${p.frete},${p.impostos}%,${impostosValor.toFixed(2)},${custoFinal.toFixed(2)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orcamento_${currentProject.name.toLowerCase().replace(/\s+/g, '_')}.csv`;
    link.click();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-elevated p-6 sm:p-8">
          <BudgetHeader
            onExport={handleExport}
            onSignOut={handleSignOut}
            projects={projects}
            currentProject={currentProject}
            onSelectProject={setCurrentProject}
            onCreateProject={createProject}
            onDeleteProject={deleteProject}
          />
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'materiais' && (
            <BudgetTableDb
              tipo="materials"
              dados={materials}
              onAdd={() => addItem('materials')}
              onRemove={id => removeItem('materials', id)}
              onUpdate={(id, campo, valor) => updateItem('materials', id, campo, valor)}
            />
          )}

          {activeTab === 'maquinas' && (
            <BudgetTableDb
              tipo="machines"
              dados={machines}
              onAdd={() => addItem('machines')}
              onRemove={id => removeItem('machines', id)}
              onUpdate={(id, campo, valor) => updateItem('machines', id, campo, valor)}
            />
          )}

          {activeTab === 'producao' && (
            <BudgetTableDb
              tipo="production"
              dados={production}
              onAdd={() => addItem('production')}
              onRemove={id => removeItem('production', id)}
              onUpdate={(id, campo, valor) => updateItem('production', id, campo, valor)}
            />
          )}

          {activeTab === 'fornecedores' && (
            <MaterialsBySupplier materials={materials} />
          )}

          {activeTab === 'orcamento' && (
            <BudgetOverviewDb
              materials={materials}
              machines={machines}
              production={production}
              config={currentProject}
            />
          )}

          {activeTab === 'config' && (
            <ConfigPanelDb
              config={currentProject}
              onConfigChange={updateProjectConfig}
            />
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
