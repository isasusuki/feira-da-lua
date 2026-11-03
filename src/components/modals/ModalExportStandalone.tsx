import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode, Monitor, Sparkles } from 'lucide-react';

interface ModalExportStandaloneProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalExportStandalone: React.FC<ModalExportStandaloneProps> = ({ isOpen, onClose }) => {
  const [copiado, setCopiado] = useState(false);
  const [baixando, setBaixando] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setBaixando(true);
    try {
      const response = await fetch('/standalone-index.html');
      let text = '';
      if (response.ok) {
        text = await response.text();
      } else {
        // Fallback fetch
        const resp2 = await fetch('/public/standalone.html');
        text = await resp2.text();
      }

      const blob = new Blob([text], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'index.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setBaixando(false);
    }
  };

  const handleCopy = async () => {
    try {
      const response = await fetch('/standalone-index.html');
      const text = await response.text();
      navigator.clipboard.writeText(text);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#131522] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#171a29]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Arquivo index.html Autônomo</h2>
              <p className="text-xs text-slate-400">Rode direto em qualquer navegador sem instalar nada</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-[#0b0d16] border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Monitor className="w-4 h-4" />
              100% Autônomo (Single-File)
            </div>
            <p className="text-slate-400 leading-relaxed">
              O arquivo <strong>index.html</strong> contém todo o sistema integrado em um único arquivo:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-300">
              <li>Estilização completa com <strong>Tailwind CSS</strong> e tema escuro</li>
              <li>Lançamento de <strong>despesas pelo feirante</strong></li>
              <li>Pagamento com <strong>Dinheiro, Cartão ou Pix</strong></li>
              <li>Opção do feirante <strong>desistir da feira ou sair</strong></li>
              <li>Relatório de Pendentes, Matriz de Feiras e Impressão</li>
              <li>Dados salvos localmente via <strong>LocalStorage</strong></li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDownload}
              disabled={baixando}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-[#facc15] hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>{baixando ? 'Baixando...' : 'Baixar index.html'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
            >
              {copiado ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Código Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copiar Código HTML</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-[#10121d] flex items-center justify-between text-xs text-slate-500">
          <span>Basta dar dois cliques no index.html baixado para abrir.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs rounded bg-slate-800 text-slate-300 hover:text-white"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
