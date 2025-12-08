import { Download, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectSelector } from './ProjectSelector';
import { DbBudgetProject } from '@/hooks/useBudgetDatabase';

interface BudgetHeaderProps {
  onExport: () => void;
  onSignOut: () => void;
  projects: DbBudgetProject[];
  currentProject: DbBudgetProject | null;
  onSelectProject: (project: DbBudgetProject) => void;
  onCreateProject: (name: string) => Promise<DbBudgetProject | null>;
  onDeleteProject: (id: string) => Promise<void>;
}

export const BudgetHeader = ({
  onExport,
  onSignOut,
  projects,
  currentProject,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
}: BudgetHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
            Planilha de Orçamento
          </h1>
          <p className="text-lg text-muted-foreground mt-1 font-body">
            Sistema completo de gestão de custos e precificação
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onExport} variant="success" size="lg" className="shrink-0">
            <Download className="w-5 h-5" />
            Exportar CSV
          </Button>
          <Button onClick={onSignOut} variant="ghost" size="icon">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <ProjectSelector
        projects={projects}
        currentProject={currentProject}
        onSelectProject={onSelectProject}
        onCreateProject={onCreateProject}
        onDeleteProject={onDeleteProject}
      />
    </div>
  );
};
