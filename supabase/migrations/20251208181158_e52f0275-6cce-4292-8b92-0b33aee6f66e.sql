-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create budget_projects table (users can have multiple budgets)
CREATE TABLE public.budget_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Novo Orçamento',
  description TEXT,
  impostos_default NUMERIC(5,2) NOT NULL DEFAULT 12,
  margem_lucro NUMERIC(5,2) NOT NULL DEFAULT 200,
  frete_medio NUMERIC(10,2) NOT NULL DEFAULT 35,
  custo_operacional NUMERIC(10,2) NOT NULL DEFAULT 2500,
  mao_obra_interna NUMERIC(10,2) NOT NULL DEFAULT 3500,
  producao_mensal INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create materials table
CREATE TABLE public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.budget_projects(id) ON DELETE CASCADE,
  item TEXT NOT NULL DEFAULT '',
  categoria TEXT NOT NULL DEFAULT '',
  descricao TEXT DEFAULT '',
  fornecedor TEXT DEFAULT '',
  preco_unit NUMERIC(10,2) NOT NULL DEFAULT 0,
  quantidade NUMERIC(10,2) NOT NULL DEFAULT 0,
  frete NUMERIC(10,2) NOT NULL DEFAULT 0,
  impostos NUMERIC(5,2) NOT NULL DEFAULT 12,
  aplicacao TEXT DEFAULT '',
  custo_por_peca NUMERIC(10,2) NOT NULL DEFAULT 0,
  obs TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create machines table
CREATE TABLE public.machines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.budget_projects(id) ON DELETE CASCADE,
  item TEXT NOT NULL DEFAULT '',
  categoria TEXT NOT NULL DEFAULT '',
  descricao TEXT DEFAULT '',
  fornecedor TEXT DEFAULT '',
  preco_unit NUMERIC(10,2) NOT NULL DEFAULT 0,
  quantidade NUMERIC(10,2) NOT NULL DEFAULT 0,
  frete NUMERIC(10,2) NOT NULL DEFAULT 0,
  impostos NUMERIC(5,2) NOT NULL DEFAULT 15,
  aplicacao TEXT DEFAULT '',
  custo_por_peca NUMERIC(10,2) NOT NULL DEFAULT 0,
  obs TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create production table
CREATE TABLE public.production (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.budget_projects(id) ON DELETE CASCADE,
  item TEXT NOT NULL DEFAULT '',
  categoria TEXT NOT NULL DEFAULT '',
  descricao TEXT DEFAULT '',
  fornecedor TEXT DEFAULT '',
  preco_unit NUMERIC(10,2) NOT NULL DEFAULT 0,
  quantidade NUMERIC(10,2) NOT NULL DEFAULT 0,
  frete NUMERIC(10,2) NOT NULL DEFAULT 0,
  impostos NUMERIC(5,2) NOT NULL DEFAULT 8,
  aplicacao TEXT DEFAULT '',
  custo_por_peca NUMERIC(10,2) NOT NULL DEFAULT 0,
  obs TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for budget_projects
CREATE POLICY "Users can view their own projects"
  ON public.budget_projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON public.budget_projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.budget_projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.budget_projects FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for materials (via project ownership)
CREATE POLICY "Users can view materials of their projects"
  ON public.materials FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.budget_projects
    WHERE budget_projects.id = materials.project_id
    AND budget_projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create materials in their projects"
  ON public.materials FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.budget_projects
    WHERE budget_projects.id = materials.project_id
    AND budget_projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update materials in their projects"
  ON public.materials FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.budget_projects
    WHERE budget_projects.id = materials.project_id
    AND budget_projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete materials from their projects"
  ON public.materials FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.budget_projects
    WHERE budget_projects.id = materials.project_id
    AND budget_projects.user_id = auth.uid()
  ));

-- Create RLS policies for machines (via project ownership)
CREATE POLICY "Users can view machines of their projects"
  ON public.machines FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.budget_projects
    WHERE budget_projects.id = machines.project_id
    AND budget_projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create machines in their projects"
  ON public.machines FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.budget_projects
    WHERE budget_projects.id = machines.project_id
    AND budget_projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update machines in their projects"
  ON public.machines FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.budget_projects
    WHERE budget_projects.id = machines.project_id
    AND budget_projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete machines from their projects"
  ON public.machines FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.budget_projects
    WHERE budget_projects.id = machines.project_id
    AND budget_projects.user_id = auth.uid()
  ));

-- Create RLS policies for production (via project ownership)
CREATE POLICY "Users can view production of their projects"
  ON public.production FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.budget_projects
    WHERE budget_projects.id = production.project_id
    AND budget_projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create production in their projects"
  ON public.production FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.budget_projects
    WHERE budget_projects.id = production.project_id
    AND budget_projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update production in their projects"
  ON public.production FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.budget_projects
    WHERE budget_projects.id = production.project_id
    AND budget_projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete production from their projects"
  ON public.production FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.budget_projects
    WHERE budget_projects.id = production.project_id
    AND budget_projects.user_id = auth.uid()
  ));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budget_projects_updated_at
  BEFORE UPDATE ON public.budget_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_materials_updated_at
  BEFORE UPDATE ON public.materials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_machines_updated_at
  BEFORE UPDATE ON public.machines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_production_updated_at
  BEFORE UPDATE ON public.production
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_budget_projects_user_id ON public.budget_projects(user_id);
CREATE INDEX idx_materials_project_id ON public.materials(project_id);
CREATE INDEX idx_machines_project_id ON public.machines(project_id);
CREATE INDEX idx_production_project_id ON public.production(project_id);