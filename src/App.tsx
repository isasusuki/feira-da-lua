import React, { useState } from 'react';
import { FeiraProvider, useFeira } from './context/FeiraContext';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/AdminDashboard';
import { FeiranteDashboard } from './components/FeiranteDashboard';
import { ModalSqlSchema } from './components/modals/ModalSqlSchema';
import { ModalNovaFeira } from './components/modals/ModalNovaFeira';
import { ModalNovoFeirante } from './components/modals/ModalNovoFeirante';
import { ModalRegistrarPagamento } from './components/modals/ModalRegistrarPagamento';
import { ModalCobranca } from './components/modals/ModalCobranca';
import { ModalExportStandalone } from './components/modals/ModalExportStandalone';
import { PendenteCobranca } from './types';
import { Database, Moon, Heart } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentUser, activeRole } = useFeira();
  const [currentTab, setCurrentTab] = useState('visao_geral');

  // Modals state
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isNovaFeiraOpen, setIsNovaFeiraOpen] = useState(false);
  const [isNovoFeiranteOpen, setIsNovoFeiranteOpen] = useState(false);
  const [registrarPagamentoState, setRegistrarPagamentoState] = useState<{
    isOpen: boolean;
    feiraId?: string;
    feiranteId?: string;
  }>({ isOpen: false });
  const [cobrancaAtiva, setCobrancaAtiva] = useState<PendenteCobranca | null>(null);

  // If user is not authenticated, display login
  if (!currentUser) {
    return (
      <>
        <LoginScreen />
        <ModalSqlSchema
          isOpen={isSqlModalOpen}
          onClose={() => setIsSqlModalOpen(false)}
        />
      </>
    );
  }

  const handleOpenRegistrarPagamento = (feiraId?: string, feiranteId?: string) => {
    setRegistrarPagamentoState({
      isOpen: true,
      feiraId,
      feiranteId,
    });
  };

  return (
    <div className="min-h-screen bg-[#0d0e15] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        onOpenNovaFeira={() => setIsNovaFeiraOpen(true)}
        onOpenNovoFeirante={() => setIsNovoFeiranteOpen(true)}
        onOpenExportStandalone={() => setIsExportModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeRole === 'admin' ? (
          <AdminDashboard
            currentTab={currentTab}
            onOpenNovaFeira={() => setIsNovaFeiraOpen(true)}
            onOpenNovoFeirante={() => setIsNovoFeiranteOpen(true)}
            onOpenRegistrarPagamento={handleOpenRegistrarPagamento}
            onOpenCobranca={(p) => setCobrancaAtiva(p)}
            onOpenSqlModal={() => setIsSqlModalOpen(true)}
          />
        ) : (
          <FeiranteDashboard />
        )}
      </main>

      {/* Quiet, Anti-Slop Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#090b12] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 font-semibold">Feira da Lua</span>
            <span>·</span>
            <span>Gestão de Feiras e Feirantes</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSqlModalOpen(true)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Estrutura do Banco de Dados (SQL)</span>
            </button>
            <span>·</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ModalSqlSchema
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      <ModalNovaFeira
        isOpen={isNovaFeiraOpen}
        onClose={() => setIsNovaFeiraOpen(false)}
      />

      <ModalNovoFeirante
        isOpen={isNovoFeiranteOpen}
        onClose={() => setIsNovoFeiranteOpen(false)}
      />

      <ModalRegistrarPagamento
        isOpen={registrarPagamentoState.isOpen}
        preSelectedFeiraId={registrarPagamentoState.feiraId}
        preSelectedFeiranteId={registrarPagamentoState.feiranteId}
        onClose={() => setRegistrarPagamentoState({ isOpen: false })}
      />

      <ModalCobranca
        pendente={cobrancaAtiva}
        onClose={() => setCobrancaAtiva(null)}
      />

      <ModalExportStandalone
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <FeiraProvider>
      <MainLayout />
    </FeiraProvider>
  );
}
