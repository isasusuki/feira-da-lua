import React, { useState } from 'react';
import { useFeira } from '../context/FeiraContext';
import { UserRole } from '../types';
import { Moon, ShieldCheck, Store, Lock, Mail, ArrowRight, AlertCircle, Key } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useFeira();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [erroMsg, setErroMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErroMsg('');

    if (!email.trim() || !senha.trim()) {
      setErroMsg('Por favor, preencha o e-mail e a senha para entrar.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = login(email, senha, selectedRole);
      if (!result.success) {
        setErroMsg(result.message || 'Erro ao realizar login.');
      }
      setLoading(false);
    }, 200);
  };

  const fillCredentials = (role: UserRole) => {
    setSelectedRole(role);
    setErroMsg('');
    if (role === 'admin') {
      setEmail('admin@feiradalua.com.br');
      setSenha('admin');
    } else {
      setEmail('cachorroquente@feiradalua.com.br');
      setSenha('feira');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e15] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient night glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header matching image_a114878d.png */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#161a2b] to-[#252c4a] border border-amber-500/40 shadow-xl shadow-amber-500/10 mb-3 text-amber-400">
            <Moon className="w-8 h-8 fill-amber-400 text-amber-400" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            <span>FEIRA DA</span>
            <span className="text-[#facc15]">LUA</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
            <span className="text-amber-400">●</span> Controle Cósmico de Feiras
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-[#121422] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Alerta de erro de senha */}
          {erroMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{erroMsg}</span>
            </div>
          )}

          {/* Seletor de Perfil */}
          <div className="mb-5">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Selecione seu Perfil de Acesso
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#0b0d16] border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setErroMsg('');
                  if (email.includes('feirante') || email.includes('cachorro')) {
                    setEmail('');
                    setSenha('');
                  }
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-[#facc15] text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Organizador (Admin)
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('feirante');
                  setErroMsg('');
                  if (email.includes('admin')) {
                    setEmail('');
                    setSenha('');
                  }
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  selectedRole === 'feirante'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Store className="w-4 h-4" />
                Feirante (Expositor)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                <span>E-mail do {selectedRole === 'admin' ? 'Administrador' : 'Feirante'}</span>
                <span className="text-[11px] text-slate-500">
                  {selectedRole === 'admin' ? 'Acesso restrito' : 'Acesso com senha'}
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder={
                    selectedRole === 'admin'
                      ? 'admin@feiradalua.com.br'
                      : 'cachorroquente@feiradalua.com.br'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#0d0f19] border border-slate-700 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Senha de Acesso</span>
                <span className="text-[11px] text-rose-400 font-semibold">* Obrigatória</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Digite sua senha..."
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#0d0f19] border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-[#facc15] hover:bg-[#eab308] text-slate-950 shadow-amber-500/25'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25'
              }`}
            >
              <span>{loading ? 'Verificando senha...' : 'Entrar no Sistema'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Credenciais para teste rápido (preenche para conferência) */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-2 font-semibold text-center flex items-center justify-center gap-1">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Contas & Senhas de Demonstração</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className="p-2.5 rounded-xl bg-[#0b0d16] hover:bg-[#151829] border border-slate-800 text-left transition-all group"
              >
                <div className="font-bold text-amber-400 group-hover:text-amber-300">
                  Admin (Organizador)
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  admin@feiradalua.com.br
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5 font-bold">
                  Senha: admin
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('feirante')}
                className="p-2.5 rounded-xl bg-[#0b0d16] hover:bg-[#151829] border border-slate-800 text-left transition-all group"
              >
                <div className="font-bold text-cyan-400 group-hover:text-cyan-300">
                  Feirante (Cachorro Quente)
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  cachorroquente@feiradalua.com.br
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5 font-bold">
                  Senha: feira
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-slate-500">
          Nenhum feirante ou organizador pode acessar sem autenticação com senha.
        </div>
      </div>
    </div>
  );
};
