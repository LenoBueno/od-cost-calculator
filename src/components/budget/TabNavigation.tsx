import { TabType } from '@/types/budget';
import { Package, Settings2, Factory, Wallet, Cog } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'materiais', label: 'Materiais Base', icon: <Package className="w-4 h-4" /> },
  { id: 'maquinas', label: 'Máquinas', icon: <Settings2 className="w-4 h-4" /> },
  { id: 'producao', label: 'Produção', icon: <Factory className="w-4 h-4" /> },
  { id: 'orcamento', label: 'Orçamento', icon: <Wallet className="w-4 h-4" /> },
  { id: 'config', label: 'Configurações', icon: <Cog className="w-4 h-4" /> },
];

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="flex gap-1 mb-8 border-b border-border overflow-x-auto pb-px">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'flex items-center gap-2 px-5 py-3 font-medium font-body text-sm transition-all duration-200 border-b-2 whitespace-nowrap',
            activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};
