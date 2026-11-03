import React, { useState } from 'react';
import { useFeira } from '../../context/FeiraContext';
import { X, Store, User, Phone, Mail, QrCode, Tag } from 'lucide-react';

interface ModalNovoFeiranteProps {
  isOpen: boolean;
  onClose: () => void;
}

const SEGMENTOS = [
  'Gastronomia',
  'Doces & Confeitaria',
  'Bebidas Artesanais',
  'Empório & Queijaria',
  'Artesanato & Joias',
  'Vestuário & Moda',
  'Plantas & Decoração',
  'Cosméticos & Bem-estar',
  'Outros',
];

export const ModalNovoFeirante: React.FC<ModalNovoFeiranteProps> = ({ isOpen, onClose }) => {
  const { cadastrarFeirante } = useFeira();

  const [nome, setNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [segmento, setSegmento] = useState('Gastronomia');
  const [numeroBarraca, setNumeroBarraca] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [pixChave, setPixChave] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !responsavel.trim() || !numeroBarraca.trim()) return;

    cadastrarFeirante({
      nome: nome.trim(),
      responsavel: responsavel.trim(),
      segmento,
      numeroBarraca: numeroBarraca.trim().toUpperCase(),
      telefone: telefone.trim() || '(11) 90000-0000',
      email: email.trim() || `${nome.toLowerCase().replace(/\s+/g, '')}@feiradalua.com.br`,
      pixChave: pixChave.trim() || telefone.trim(),
      status: 'ativo',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#131522] border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#171a29]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Store className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-100">Cadastrar Novo Feirante (Expositor)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-slate-400" />
                Nome da Barraca / Marca
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Pastel & Cia"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Nome do Responsável
              </label>
              <input
                type="text"
                required
                placeholder="Ex: João da Silva"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Segmento Comercial
              </label>
              <select
                value={segmento}
                onChange={(e) => setSegmento(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-sky-400 transition-colors"
              >
                {SEGMENTOS.map((seg) => (
                  <option key={seg} value={seg} className="bg-[#121422]">
                    {seg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nº / Código da Barraca
              </label>
              <input
                type="text"
                required
                placeholder="Ex: B-12"
                value={numeroBarraca}
                onChange={(e) => setNumeroBarraca(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                WhatsApp para Cobrança
              </label>
              <input
                type="text"
                required
                placeholder="(11) 98765-4321"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-sm text-slate-100 font-mono-numbers focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                E-mail de Acesso
              </label>
              <input
                type="email"
                placeholder="feirante@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-slate-400" />
              Chave Pix do Feirante
            </label>
            <input
              type="text"
              placeholder="Chave Pix (CPF, CNPJ, Telefone ou E-mail)"
              value={pixChave}
              onChange={(e) => setPixChave(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-sm text-slate-100 font-mono text-xs focus:outline-none focus:border-sky-400 transition-colors"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/20 transition-colors"
            >
              Salvar Feirante
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
