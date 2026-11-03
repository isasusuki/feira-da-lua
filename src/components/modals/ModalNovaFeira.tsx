import React, { useState } from 'react';
import { useFeira } from '../../context/FeiraContext';
import { X, Calendar, MapPin, DollarSign, FileText } from 'lucide-react';

interface ModalNovaFeiraProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalNovaFeira: React.FC<ModalNovaFeiraProps> = ({ isOpen, onClose }) => {
  const { cadastrarFeira } = useFeira();

  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [local, setLocal] = useState('Praça Central da Matriz');
  const [taxaPadrao, setTaxaPadrao] = useState('55.00');
  const [observacoes, setObservacoes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !data) return;

    cadastrarFeira({
      nome: nome.trim(),
      data,
      local: local.trim() || 'Praça Central',
      taxaPadrao: parseFloat(taxaPadrao) || 55.0,
      status: 'encerrada',
      observacoes: observacoes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#131522] border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#171a29]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-100">Cadastrar Nova Edição da Feira</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Nome da Edição
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Feira da Lua - Edição Especial"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d0f19] border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Data da Feira
              </label>
              <input
                type="date"
                required
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                Taxa Padrão (R$)
              </label>
              <input
                type="number"
                step="0.50"
                min="0"
                required
                value={taxaPadrao}
                onChange={(e) => setTaxaPadrao(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-sm text-slate-100 font-mono-numbers focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Local / Endereço
            </label>
            <input
              type="text"
              required
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Observações (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Atrações musicais, avisos meteorológicos..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-400 transition-colors resize-none"
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
              className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-colors"
            >
              Cadastrar Feira
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
