import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface DbBudgetItem {
  id: string;
  project_id: string;
  item: string;
  categoria: string;
  descricao: string | null;
  fornecedor: string | null;
  preco_unit: number;
  quantidade: number;
  frete: number;
  impostos: number;
  aplicacao: string | null;
  custo_por_peca: number;
  obs: string | null;
}

export interface DbBudgetProject {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  impostos_default: number;
  margem_lucro: number;
  frete_medio: number;
  custo_operacional: number;
  mao_obra_interna: number;
  producao_mensal: number;
  created_at: string;
  updated_at: string;
}

export const useBudgetDatabase = () => {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<DbBudgetProject[]>([]);
  const [currentProject, setCurrentProject] = useState<DbBudgetProject | null>(null);
  const [materials, setMaterials] = useState<DbBudgetItem[]>([]);
  const [machines, setMachines] = useState<DbBudgetItem[]>([]);
  const [production, setProduction] = useState<DbBudgetItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user's projects
  const loadProjects = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('budget_projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading projects:', error);
      toast({ title: 'Erro', description: 'Erro ao carregar projetos', variant: 'destructive' });
      return;
    }

    setProjects(data || []);
    
    // Auto-select first project or create one if none exists
    if (data && data.length > 0) {
      setCurrentProject(data[0]);
    } else {
      await createProject('Orçamento Principal');
    }
  }, [user]);

  // Create new project
  const createProject = useCallback(async (name: string, description?: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('budget_projects')
      .insert({
        user_id: user.id,
        name,
        description
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      toast({ title: 'Erro', description: 'Erro ao criar projeto', variant: 'destructive' });
      return null;
    }

    setProjects(prev => [data, ...prev]);
    setCurrentProject(data);
    toast({ title: 'Sucesso', description: 'Projeto criado com sucesso' });
    return data;
  }, [user]);

  // Update project config
  const updateProjectConfig = useCallback(async (config: Partial<DbBudgetProject>) => {
    if (!currentProject) return;

    const { error } = await supabase
      .from('budget_projects')
      .update(config)
      .eq('id', currentProject.id);

    if (error) {
      console.error('Error updating project:', error);
      toast({ title: 'Erro', description: 'Erro ao atualizar configurações', variant: 'destructive' });
      return;
    }

    setCurrentProject(prev => prev ? { ...prev, ...config } : null);
    setProjects(prev => prev.map(p => p.id === currentProject.id ? { ...p, ...config } : p));
  }, [currentProject]);

  // Load project items
  const loadProjectItems = useCallback(async () => {
    if (!currentProject) return;

    setLoading(true);

    const [materialsRes, machinesRes, productionRes] = await Promise.all([
      supabase.from('materials').select('*').eq('project_id', currentProject.id),
      supabase.from('machines').select('*').eq('project_id', currentProject.id),
      supabase.from('production').select('*').eq('project_id', currentProject.id)
    ]);

    if (materialsRes.error) console.error('Error loading materials:', materialsRes.error);
    if (machinesRes.error) console.error('Error loading machines:', machinesRes.error);
    if (productionRes.error) console.error('Error loading production:', productionRes.error);

    setMaterials(materialsRes.data || []);
    setMachines(machinesRes.data || []);
    setProduction(productionRes.data || []);
    setLoading(false);
  }, [currentProject]);

  // Add item
  const addItem = useCallback(async (type: 'materials' | 'machines' | 'production') => {
    if (!currentProject) return;

    const defaultImpostos = type === 'materials' ? 12 : type === 'machines' ? 15 : 8;

    const { data, error } = await supabase
      .from(type)
      .insert({
        project_id: currentProject.id,
        item: '',
        categoria: '',
        descricao: '',
        fornecedor: '',
        preco_unit: 0,
        quantidade: 0,
        frete: 0,
        impostos: defaultImpostos,
        aplicacao: '',
        custo_por_peca: 0,
        obs: ''
      })
      .select()
      .single();

    if (error) {
      console.error(`Error adding ${type}:`, error);
      toast({ title: 'Erro', description: 'Erro ao adicionar item', variant: 'destructive' });
      return;
    }

    if (type === 'materials') setMaterials(prev => [...prev, data]);
    if (type === 'machines') setMachines(prev => [...prev, data]);
    if (type === 'production') setProduction(prev => [...prev, data]);
  }, [currentProject]);

  // Update item
  const updateItem = useCallback(async (
    type: 'materials' | 'machines' | 'production',
    id: string,
    field: string,
    value: string | number
  ) => {
    const { error } = await supabase
      .from(type)
      .update({ [field]: value })
      .eq('id', id);

    if (error) {
      console.error(`Error updating ${type}:`, error);
      return;
    }

    const updateFn = (prev: DbBudgetItem[]) =>
      prev.map(item => item.id === id ? { ...item, [field]: value } : item);

    if (type === 'materials') setMaterials(updateFn);
    if (type === 'machines') setMachines(updateFn);
    if (type === 'production') setProduction(updateFn);
  }, []);

  // Remove item
  const removeItem = useCallback(async (type: 'materials' | 'machines' | 'production', id: string) => {
    const { error } = await supabase
      .from(type)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error removing ${type}:`, error);
      toast({ title: 'Erro', description: 'Erro ao remover item', variant: 'destructive' });
      return;
    }

    const filterFn = (prev: DbBudgetItem[]) => prev.filter(item => item.id !== id);

    if (type === 'materials') setMaterials(filterFn);
    if (type === 'machines') setMachines(filterFn);
    if (type === 'production') setProduction(filterFn);
  }, []);

  // Delete project
  const deleteProject = useCallback(async (projectId: string) => {
    const { error } = await supabase
      .from('budget_projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      console.error('Error deleting project:', error);
      toast({ title: 'Erro', description: 'Erro ao excluir projeto', variant: 'destructive' });
      return;
    }

    const remaining = projects.filter(p => p.id !== projectId);
    setProjects(remaining);
    
    if (currentProject?.id === projectId) {
      if (remaining.length > 0) {
        setCurrentProject(remaining[0]);
      } else {
        await createProject('Novo Orçamento');
      }
    }
    
    toast({ title: 'Sucesso', description: 'Projeto excluído' });
  }, [projects, currentProject, createProject]);

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated, loadProjects]);

  // Load items when project changes
  useEffect(() => {
    if (currentProject) {
      loadProjectItems();
    }
  }, [currentProject, loadProjectItems]);

  return {
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
    removeItem,
    loadProjects
  };
};
