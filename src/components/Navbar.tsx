import React from 'react';
import { useFeira } from '../context/FeiraContext';
import {
  Moon,
  Store,
  Users,
  PieChart,
  LogOut,
  Database,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenSqlModal: () => void;
  onOpenNovaFeira?: () => void;
  onOpenNovoFeirante?: () => void;
  onOpenExportStandalone?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSqlModal,
  onOpenNovaFeira,
  onOpenNovoFeirante,
  onOpenExportStandalone,
}) => {
  const {
    currentUser,
    activeRole,
    logout,
    zerarHistoricoESaldo,
    carregarDadosDemonstracao,
    feiras,
  } = useFeira();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d0e15]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          {/* Brand Logo & Wordmark matching image_a114878d.png */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#161a2b] to-[#252c4a] border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <Moon className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>

            <div>
              <div className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                <span>FEIRA DA</span>
                <span className="text-[#facc15]">LUA</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                <span className="text-amber-400">●</span>
                <span>Controle Cósmico de Feiras</span>
              </div>
            </div>
          </div>

          {/* Navigation Links strictly styled as in image_a114878d.png */}
          <div className="flex items-center gap-2 sm:gap-3">
            {activeRole === 'admin' ? (
              <>
                <button
                  onClick={() => {
                    setCurrentTab('feiras');
                    if (onOpenNovaFeira) onOpenNovaFeira();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentTab === 'feiras'
                      ? 'text-white bg-slate-800'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Store className="w-4 h-4 text-slate-400" />
                  <span>Feiras</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentTab('feirantes');
                    if (onOpenNovoFeirante) onOpenNovoFeirante();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentTab === 'feirantes'
                      ? 'text-white bg-slate-800'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Feirantes</span>
                </button>

                <button
                  onClick={() => setCurrentTab('relatorios')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#facc15] hover:bg-[#eab308] text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <PieChart className="w-4 h-4 text-slate-950" />
                  <span>Relatórios</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 px-3 py-1.5 rounded-xl">
                <Store className="w-4 h-4 text-cyan-400" />
                <span>Portal do Feirante</span>
              </div>
            )}

            {/* Sair Button matching image_a114878d.png */}
            <button
              onClick={logout}
              title="Encerrar sessão"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-rose-900/60 bg-rose-950/30 text-rose-300 hover:bg-rose-900/40 hover:text-rose-200 transition-colors ml-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-bar with state management controls & user info */}
      <div className="bg-[#10121d] border-t border-slate-800/60 px-4 sm:px-6 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-slate-500">Usuário Autenticado:</span>
          <span className="font-semibold text-slate-200">{currentUser?.name}</span>
          <span className="text-slate-600">·</span>
          <span
            className={
              activeRole === 'admin'
                ? 'text-amber-400 font-mono text-[11px]'
                : 'text-cyan-400 font-mono text-[11px]'
            }
          >
            {activeRole === 'admin' ? 'Perfil Administrador' : 'Perfil Feirante (Autenticado)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenExportStandalone && (
            <button
              onClick={onOpenExportStandalone}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-[#facc15] border border-amber-500/40 text-[11px] font-bold transition-colors cursor-pointer mr-2"
            >
              <span>💾 Baixar index.html Autônomo</span>
            </button>
          )}

          <button
            onClick={onOpenSqlModal}
            className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 text-[11px] font-medium mr-2 transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Banco Relacional (SQL)</span>
          </button>

          {feiras.length === 0 ? (
            <button
              onClick={carregarDadosDemonstracao}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Carregar Dados Reais da Planilha
            </button>
          ) : (
            <button
              onClick={zerarHistoricoESaldo}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-[11px] font-medium transition-colors cursor-pointer"
              title="Reiniciar para o estado padrão com R$ 0,00 e 0 feiras"
            >
              <RefreshCw className="w-3 h-3" />
              Zerar Histórico (R$ 0,00)
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
