import { useState, useMemo } from 'react';
import { BudgetItem, Config } from '@/types/budget';
import { initialMateriais, initialMaquinas, initialProducao, initialConfig } from '@/data/initialData';

export const calcularSubtotal = (preco: number, qtd: number) => preco * qtd;
export const calcularImpostos = (subtotal: number, percImpostos: number) => subtotal * (percImpostos / 100);
export const calcularCustoFinal = (subtotal: number, impostos: number, frete: number) => subtotal + impostos + frete;

export const useBudget = () => {
  const [materiais, setMateriais] = useState<BudgetItem[]>(initialMateriais);
  const [maquinas, setMaquinas] = useState<BudgetItem[]>(initialMaquinas);
  const [producao, setProducao] = useState<BudgetItem[]>(initialProducao);
  const [config, setConfig] = useState<Config>(initialConfig);

  const calcularTotais = (lista: BudgetItem[]) => {
    return lista.reduce((acc, item) => {
      const subtotal = calcularSubtotal(item.precoUnit, item.quantidade);
      const impostosValor = calcularImpostos(subtotal, item.impostos);
      const custoFinal = calcularCustoFinal(subtotal, impostosValor, item.frete);
      return acc + custoFinal;
    }, 0);
  };

  const totais = useMemo(() => ({
    materiais: calcularTotais(materiais),
    maquinas: calcularTotais(maquinas),
    producao: calcularTotais(producao)
  }), [materiais, maquinas, producao]);

  const custoFixoPorPeca = useMemo(() => 
    (totais.maquinas / 24 / config.producaoMensal) + 
    (config.custoOperacional / config.producaoMensal) + 
    (config.maoObraInterna / config.producaoMensal),
    [totais.maquinas, config]
  );

  const custoVariavelPorPeca = useMemo(() => 
    totais.producao / config.producaoMensal,
    [totais.producao, config.producaoMensal]
  );

  const custoMaterialMedioPorPeca = 67.85; // Fixed material cost per piece

  const custoTotalPorPeca = custoFixoPorPeca + custoVariavelPorPeca + custoMaterialMedioPorPeca;

  const precos = useMemo(() => ({
    atacado: custoTotalPorPeca * 2,
    varejoMinimo: custoTotalPorPeca * 3,
    varejoIdeal: custoTotalPorPeca * 4
  }), [custoTotalPorPeca]);

  const adicionarItem = (tipo: 'materiais' | 'maquinas' | 'producao') => {
    const novoItem: BudgetItem = {
      id: Date.now(),
      item: '',
      categoria: '',
      descricao: '',
      fornecedor: '',
      precoUnit: 0,
      quantidade: 0,
      frete: 0,
      impostos: config.impostosDefault,
      aplicacao: '',
      custoPorPeca: 0,
      obs: ''
    };

    if (tipo === 'materiais') setMateriais([...materiais, novoItem]);
    if (tipo === 'maquinas') setMaquinas([...maquinas, novoItem]);
    if (tipo === 'producao') setProducao([...producao, novoItem]);
  };

  const removerItem = (tipo: 'materiais' | 'maquinas' | 'producao', id: number) => {
    if (tipo === 'materiais') setMateriais(materiais.filter(m => m.id !== id));
    if (tipo === 'maquinas') setMaquinas(maquinas.filter(m => m.id !== id));
    if (tipo === 'producao') setProducao(producao.filter(p => p.id !== id));
  };

  const atualizarItem = (
    tipo: 'materiais' | 'maquinas' | 'producao',
    id: number,
    campo: keyof BudgetItem,
    valor: string | number
  ) => {
    const atualizar = (lista: BudgetItem[]) =>
      lista.map(item => (item.id === id ? { ...item, [campo]: valor } : item));

    if (tipo === 'materiais') setMateriais(atualizar(materiais));
    if (tipo === 'maquinas') setMaquinas(atualizar(maquinas));
    if (tipo === 'producao') setProducao(atualizar(producao));
  };

  return {
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
  };
};
