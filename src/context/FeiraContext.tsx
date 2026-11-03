import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Feira,
  Feirante,
  PresencaPagamento,
  User,
  UserRole,
  PendenteCobranca,
  PresencaStatus,
  PagamentoStatus,
  FormaPagamento,
  DespesaFeirante,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_FEIRANTES,
  DEMO_FEIRAS,
  DEMO_PRESENCAS_PAGAMENTOS,
} from '../data/mockData';

interface LoginResult {
  success: boolean;
  message?: string;
}

interface FeiraContextType {
  currentUser: User | null;
  users: User[];
  feiras: Feira[];
  feirantes: Feirante[];
  presencasPagamentos: PresencaPagamento[];
  activeRole: UserRole;
  
  // Auth & Roles - STRICT PASSWORD ENFORCEMENT
  login: (email: string, senha: string, preferredRole?: UserRole) => LoginResult;
  logout: () => void;
  
  despesas: DespesaFeirante[];
  adicionarDespesa: (despesa: Omit<DespesaFeirante, 'id' | 'criadoEm'>) => void;
  removerDespesa: (id: string) => void;

  // Fair & Stall Management
  cadastrarFeira: (novaFeira: Omit<Feira, 'id'>) => void;
  cadastrarFeirante: (novoFeirante: Omit<Feirante, 'id' | 'dataCadastro'>) => void;
  
  // Payment & Attendance (Admin actions)
  salvarPresencaPagamento: (registro: {
    id?: string;
    feiraId: string;
    feiranteId: string;
    statusPresenca: PresencaStatus;
    statusPagamento: PagamentoStatus;
    valorCobrado: number;
    valorPago: number;
    formaPagamento?: FormaPagamento;
    observacao?: string;
  }) => void;

  // Merchant self-service payment submission!
  enviarPagamentoFeirante: (dados: {
    feiraId: string;
    valor: number;
    forma: FormaPagamento;
    comprovanteTexto?: string;
  }) => boolean;

  // Stallholder desistência / saída da feira
  desistirEdicaoFeira: (feiraId: string, motivo?: string) => void;
  solicitarDesligamentoFeira: (motivo?: string) => void;

  // Zero-state & Demo loaders
  zerarHistoricoESaldo: () => void;
  carregarDadosDemonstracao: () => void;

  // Financial KPIs
  kpis: {
    totalFeiras: number;
    totalDinheiroLiquido: number;
    totalPixLiquido: number;
    totalCartaoLiquido: number;
    saldoLiquidoGeral: number;
    totalPendente: number;
  };

  // Reports
  relatorioPendentes: PendenteCobranca[];

  // Feirante logged-in specific data
  feiranteLogado: Feirante | null;
  feiranteExtrato: {
    presencas: number;
    totalPago: number;
    valorPendente: number;
    historico: Array<{
      feira: Feira;
      registro?: PresencaPagamento;
    }>;
  };
}

const STORAGE_KEYS = {
  CURRENT_USER: 'feiradalua_user',
  FEIRAS: 'feiradalua_feiras',
  FEIRANTES: 'feiradalua_feirantes',
  REGISTROS: 'feiradalua_registros',
};

const FeiraContext = createContext<FeiraContextType | undefined>(undefined);

export const FeiraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current authenticated user (null initially)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Feiras: Default ZERO history as requested
  const [feiras, setFeiras] = useState<Feira[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FEIRAS);
      if (saved) return JSON.parse(saved);
      return []; // Starts zeroed
    } catch {
      return [];
    }
  });

  // Feirantes: Directory of stallholders
  const [feirantes, setFeirantes] = useState<Feirante[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FEIRANTES);
      if (saved) return JSON.parse(saved);
      return INITIAL_FEIRANTES;
    } catch {
      return INITIAL_FEIRANTES;
    }
  });

  // Presenças e Pagamentos: Default ZERO transactions
  const [presencasPagamentos, setPresencasPagamentos] = useState<PresencaPagamento[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTROS);
      if (saved) return JSON.parse(saved);
      return []; // Starts zeroed
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FEIRAS, JSON.stringify(feiras));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [feiras]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FEIRANTES, JSON.stringify(feirantes));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [feirantes]);

  // Despesas do Feirante
  const [despesas, setDespesas] = useState<DespesaFeirante[]>(() => {
    try {
      const saved = localStorage.getItem('feiradalua_despesas');
      if (saved) return JSON.parse(saved);
      // Sample initial expense for demonstration
      return [
        {
          id: 'desp-1',
          feiranteId: 'ft-cq',
          feiraId: 'feira-13',
          data: '2026-10-15',
          descricao: 'Pães de Hot Dog e Salsichas Especiais',
          categoria: 'insumos',
          valor: 180.0,
          formaPagamento: 'pix',
          criadoEm: '2026-10-15T15:00:00Z',
        },
        {
          id: 'desp-2',
          feiranteId: 'ft-cq',
          feiraId: 'feira-13',
          data: '2026-10-15',
          descricao: 'Embalagens térmicas e guardanapos',
          categoria: 'embalagens',
          valor: 45.0,
          formaPagamento: 'dinheiro',
          criadoEm: '2026-10-15T16:00:00Z',
        },
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('feiradalua_despesas', JSON.stringify(despesas));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [despesas]);

  const adicionarDespesa = (d: Omit<DespesaFeirante, 'id' | 'criadoEm'>) => {
    const nova: DespesaFeirante = {
      ...d,
      id: `desp-${Date.now()}`,
      criadoEm: new Date().toISOString(),
    };
    setDespesas((prev) => [nova, ...prev]);
  };

  const removerDespesa = (id: string) => {
    setDespesas((prev) => prev.filter((d) => d.id !== id));
  };

  // STRICT AUTHENTICATION: Requires correct password for both Admin and Feirante!
  const login = (email: string, senha: string, preferredRole?: UserRole): LoginResult => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedSenha = senha.trim();

    if (!trimmedEmail) {
      return { success: false, message: 'Por favor, informe seu e-mail de acesso.' };
    }
    if (!trimmedSenha) {
      return { success: false, message: 'A senha é obrigatória para acessar o sistema.' };
    }

    // Check predefined users first
    const matched = INITIAL_USERS.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (matched) {
      if (matched.senha !== trimmedSenha) {
        return {
          success: false,
          message: 'Senha incorreta para esta conta. Verifique os dados digitados.',
        };
      }
      setCurrentUser(matched);
      return { success: true };
    }

    // Check feirantes list by email
    const ftMatch = feirantes.find((f) => f.email.toLowerCase() === trimmedEmail);
    if (ftMatch) {
      // Default stallholder password is 'feira'
      if (trimmedSenha !== 'feira' && trimmedSenha !== '123456') {
        return {
          success: false,
          message: 'Senha incorreta para a conta do feirante (padrão: feira).',
        };
      }
      const feiranteUser: User = {
        id: `user-${ftMatch.id}`,
        name: `${ftMatch.responsavel} (${ftMatch.nome})`,
        email: ftMatch.email,
        senha: trimmedSenha,
        role: 'feirante',
        feiranteId: ftMatch.id,
      };
      setCurrentUser(feiranteUser);
      return { success: true };
    }

    // Dynamic admin fallback if email starts with admin
    if (trimmedEmail.startsWith('admin')) {
      if (trimmedSenha !== 'admin' && trimmedSenha !== 'admin123') {
        return {
          success: false,
          message: 'Senha incorreta para o perfil de Administrador (padrão: admin).',
        };
      }
      const adminUser: User = {
        id: 'user-admin-dyn',
        name: 'Administrador da Feira',
        email: trimmedEmail,
        senha: trimmedSenha,
        role: 'admin',
      };
      setCurrentUser(adminUser);
      return { success: true };
    }

    return {
      success: false,
      message: 'Usuário não encontrado. Use admin@feiradalua.com.br ou o e-mail do feirante.',
    };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Reset all data back to R$ 0,00 and 0 history
  const zerarHistoricoESaldo = () => {
    setFeiras([]);
    setPresencasPagamentos([]);
    localStorage.setItem(STORAGE_KEYS.FEIRAS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.REGISTROS, JSON.stringify([]));
  };

  // Load demo data based on real user spreadsheet
  const carregarDadosDemonstracao = () => {
    setFeiras(DEMO_FEIRAS);
    setPresencasPagamentos(DEMO_PRESENCAS_PAGAMENTOS);
    setFeirantes(INITIAL_FEIRANTES);
  };

  // Add new fair
  const cadastrarFeira = (nova: Omit<Feira, 'id'>) => {
    const id = `feira-${Date.now()}`;
    const feiraCriada: Feira = { ...nova, id };
    setFeiras((prev) => [feiraCriada, ...prev]);

    // Pre-populate default pending attendance records for active stallholders
    const novosRegistros: PresencaPagamento[] = feirantes
      .filter((ft) => ft.status === 'ativo')
      .map((ft) => ({
        id: `pp-${id}-${ft.id}`,
        feiraId: id,
        feiranteId: ft.id,
        statusPresenca: 'presente',
        statusPagamento: 'pendente',
        valorCobrado: nova.taxaPadrao,
        valorPago: 0,
        dataRegistro: new Date().toISOString(),
      }));

    setPresencasPagamentos((prev) => [...novosRegistros, ...prev]);
  };

  // Add new stallholder
  const cadastrarFeirante = (novo: Omit<Feirante, 'id' | 'dataCadastro'>) => {
    const id = `ft-${Date.now()}`;
    const novoFeirante: Feirante = {
      ...novo,
      id,
      dataCadastro: new Date().toISOString().split('T')[0],
    };
    setFeirantes((prev) => [...prev, novoFeirante]);
  };

  // Admin registers/updates payment and attendance
  const salvarPresencaPagamento = (dados: {
    id?: string;
    feiraId: string;
    feiranteId: string;
    statusPresenca: PresencaStatus;
    statusPagamento: PagamentoStatus;
    valorCobrado: number;
    valorPago: number;
    formaPagamento?: FormaPagamento;
    observacao?: string;
  }) => {
    setPresencasPagamentos((prev) => {
      const existingIdx = prev.findIndex(
        (p) =>
          (dados.id && p.id === dados.id) ||
          (p.feiraId === dados.feiraId && p.feiranteId === dados.feiranteId)
      );

      const novoOuAtualizado: PresencaPagamento = {
        id: dados.id || (existingIdx >= 0 ? prev[existingIdx].id : `pp-${Date.now()}`),
        feiraId: dados.feiraId,
        feiranteId: dados.feiranteId,
        statusPresenca: dados.statusPresenca,
        statusPagamento: dados.statusPagamento,
        valorCobrado: dados.valorCobrado,
        valorPago: dados.statusPagamento === 'pago' ? (dados.valorPago > 0 ? dados.valorPago : dados.valorCobrado) : dados.valorPago,
        formaPagamento: dados.formaPagamento,
        dataPagamento: dados.statusPagamento === 'pago' ? new Date().toISOString() : undefined,
        comprovantePix: dados.formaPagamento === 'pix' ? `PIX-${Date.now().toString().slice(-6)}` : undefined,
        observacao: dados.observacao,
        dataRegistro: existingIdx >= 0 ? prev[existingIdx].dataRegistro : new Date().toISOString(),
      };

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = novoOuAtualizado;
        return copy;
      }
      return [novoOuAtualizado, ...prev];
    });
  };

  // Feirante self-service payment submission!
  const enviarPagamentoFeirante = (dados: {
    feiraId: string;
    valor: number;
    forma: FormaPagamento;
    comprovanteTexto?: string;
  }): boolean => {
    if (!currentUser || currentUser.role !== 'feirante' || !currentUser.feiranteId) {
      return false;
    }

    const feiranteId = currentUser.feiranteId;
    const feira = feiras.find((f) => f.id === dados.feiraId);
    const taxa = feira ? feira.taxaPadrao : dados.valor;

    setPresencasPagamentos((prev) => {
      const existingIdx = prev.findIndex(
        (p) => p.feiraId === dados.feiraId && p.feiranteId === feiranteId
      );

      const novoRegistro: PresencaPagamento = {
        id: existingIdx >= 0 ? prev[existingIdx].id : `pp-${Date.now()}`,
        feiraId: dados.feiraId,
        feiranteId: feiranteId,
        statusPresenca: 'presente',
        statusPagamento: 'pago',
        valorCobrado: existingIdx >= 0 ? prev[existingIdx].valorCobrado : taxa,
        valorPago: dados.valor,
        formaPagamento: dados.forma,
        dataPagamento: new Date().toISOString(),
        comprovantePix: dados.comprovanteTexto || `E2E-${Date.now()}`,
        observacao: `Liquidado pelo expositor via ${dados.forma.toUpperCase()} em ${new Date().toLocaleDateString('pt-BR')}`,
        dataRegistro: existingIdx >= 0 ? prev[existingIdx].dataRegistro : new Date().toISOString(),
      };

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = novoRegistro;
        return copy;
      }
      return [novoRegistro, ...prev];
    });

    return true;
  };

  // Stallholder desistência de uma feira específica
  const desistirEdicaoFeira = (feiraId: string, motivo?: string) => {
    if (!currentUser || currentUser.role !== 'feirante' || !currentUser.feiranteId) return;
    const feiranteId = currentUser.feiranteId;

    setPresencasPagamentos((prev) => {
      const idx = prev.findIndex((p) => p.feiraId === feiraId && p.feiranteId === feiranteId);
      const novoRegistro: PresencaPagamento = {
        id: idx >= 0 ? prev[idx].id : `pp-${Date.now()}`,
        feiraId,
        feiranteId,
        statusPresenca: 'desistente',
        statusPagamento: 'cancelado',
        valorCobrado: 0,
        valorPago: 0,
        formaPagamento: 'isento',
        observacao: motivo || 'Expositor desistiu da participação nesta edição com aviso prévio.',
        dataRegistro: new Date().toISOString(),
      };
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = novoRegistro;
        return copy;
      }
      return [novoRegistro, ...prev];
    });
  };

  // Stallholder solicitação de desligamento / sair da feira
  const solicitarDesligamentoFeira = (motivo?: string) => {
    if (!currentUser || currentUser.role !== 'feirante' || !currentUser.feiranteId) return;
    const feiranteId = currentUser.feiranteId;

    setFeirantes((prev) =>
      prev.map((f) =>
        f.id === feiranteId ? { ...f, status: 'inativo' as const } : f
      )
    );
  };

  // KPI Calculations
  const kpis = useMemo(() => {
    const totalFeiras = feiras.length;

    let totalDinheiroLiquido = 0;
    let totalPixLiquido = 0;
    let totalCartaoLiquido = 0;
    let totalPendente = 0;

    presencasPagamentos.forEach((p) => {
      if (p.statusPagamento === 'pago') {
        if (p.formaPagamento === 'dinheiro') {
          totalDinheiroLiquido += p.valorPago;
        } else if (p.formaPagamento === 'pix') {
          totalPixLiquido += p.valorPago;
        } else if (p.formaPagamento === 'cartao') {
          totalCartaoLiquido += p.valorPago;
        } else {
          totalPixLiquido += p.valorPago;
        }
      } else if (p.statusPagamento === 'pendente') {
        const devido = Math.max(0, p.valorCobrado - p.valorPago);
        totalPendente += devido;
      }
    });

    const saldoLiquidoGeral = totalDinheiroLiquido + totalPixLiquido + totalCartaoLiquido;

    return {
      totalFeiras,
      totalDinheiroLiquido,
      totalPixLiquido,
      totalCartaoLiquido,
      saldoLiquidoGeral,
      totalPendente,
    };
  }, [feiras, presencasPagamentos]);

  // Pending Collections Report
  const relatorioPendentes = useMemo<PendenteCobranca[]>(() => {
    const lista: PendenteCobranca[] = [];

    presencasPagamentos.forEach((p) => {
      const valorDevido = Math.max(0, p.valorCobrado - p.valorPago);
      if (p.statusPagamento === 'pendente' && valorDevido > 0) {
        const feira = feiras.find((f) => f.id === p.feiraId);
        const feirante = feirantes.find((ft) => ft.id === p.feiranteId);

        if (feira && feirante && feirante.status !== 'inativo') {
          const diffMs = Date.now() - new Date(feira.data).getTime();
          const diasAtraso = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

          lista.push({
            id: p.id,
            feiraId: feira.id,
            feiraNome: feira.nome,
            feiraData: feira.data,
            feiranteId: feirante.id,
            feiranteNome: feirante.nome,
            feiranteResponsavel: feirante.responsavel,
            feiranteBarraca: feirante.numeroBarraca,
            feiranteContato: feirante.telefone,
            feirantePix: feirante.pixChave,
            statusPresenca: p.statusPresenca,
            valorDevido,
            diasAtraso,
          });
        }
      }
    });

    return lista.sort((a, b) => new Date(b.feiraData).getTime() - new Date(a.feiraData).getTime());
  }, [presencasPagamentos, feiras, feirantes]);

  // Feirante logged-in view data
  const feiranteLogado = useMemo(() => {
    if (!currentUser || currentUser.role !== 'feirante') return null;
    return feirantes.find((f) => f.id === currentUser.feiranteId) || feirantes[0] || null;
  }, [currentUser, feirantes]);

  const feiranteExtrato = useMemo(() => {
    if (!feiranteLogado) {
      return { presencas: 0, totalPago: 0, valorPendente: 0, historico: [] };
    }

    const ftId = feiranteLogado.id;
    let presencas = 0;
    let totalPago = 0;
    let valorPendente = 0;

    const historico = feiras.map((feira) => {
      const registro = presencasPagamentos.find(
        (p) => p.feiraId === feira.id && p.feiranteId === ftId
      );

      if (registro) {
        if (registro.statusPresenca === 'presente') {
          presencas += 1;
        }
        if (registro.statusPagamento === 'pago') {
          totalPago += registro.valorPago;
        } else if (registro.statusPagamento === 'pendente') {
          valorPendente += Math.max(0, registro.valorCobrado - registro.valorPago);
        }
      }

      return {
        feira,
        registro,
      };
    });

    return {
      presencas,
      totalPago,
      valorPendente,
      historico,
    };
  }, [feiranteLogado, feiras, presencasPagamentos]);

  return (
    <FeiraContext.Provider
      value={{
        currentUser,
        users: INITIAL_USERS,
        feiras,
        feirantes,
        presencasPagamentos,
        despesas,
        adicionarDespesa,
        removerDespesa,
        activeRole: currentUser?.role || 'admin',
        login,
        logout,
        cadastrarFeira,
        cadastrarFeirante,
        salvarPresencaPagamento,
        enviarPagamentoFeirante,
        desistirEdicaoFeira,
        solicitarDesligamentoFeira,
        zerarHistoricoESaldo,
        carregarDadosDemonstracao,
        kpis,
        relatorioPendentes,
        feiranteLogado,
        feiranteExtrato,
      }}
    >
      {children}
    </FeiraContext.Provider>
  );
};

export const useFeira = () => {
  const context = useContext(FeiraContext);
  if (!context) {
    throw new Error('useFeira must be used within a FeiraProvider');
  }
  return context;
};

