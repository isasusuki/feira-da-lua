import React, { useState } from 'react';
import { PendenteCobranca } from '../../types';
import { useFeira } from '../../context/FeiraContext';
import { X, Send, Copy, Check, MessageSquare, QrCode, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatDateFull, createWhatsAppBillingUrl } from '../../utils/formatters';

interface ModalCobrancaProps {
  pendente: PendenteCobranca | null;
  onClose: () => void;
}

export const ModalCobranca: React.FC<ModalCobrancaProps> = ({ pendente, onClose }) => {
  const { salvarPresencaPagamento } = useFeira();
  const [copiadoPix, setCopiadoPix] = useState(false);
  const [copiadoMsg, setCopiadoMsg] = useState(false);
  const [baixarStatus, setBaixarStatus] = useState<'dinheiro' | 'pix'>('pix');

  if (!pendente) return null;

  const chavePixOrganizacao = 'financeiro@feiradalua.com.br';

  const waUrl = createWhatsAppBillingUrl(
    pendente.feiranteContato,
    pendente.feiranteResponsavel,
    pendente.feiraData,
    pendente.valorDevido,
    chavePixOrganizacao
  );

  const mensagemTexto = `Olá, ${pendente.feiranteResponsavel}! Tudo bem? 🌙\n\nAqui é da organização da Feira da Lua.\n\nConstatamos a pendência da taxa da feira realizada em ${formatDateFull(
    pendente.feiraData
  )}, no valor de ${formatCurrency(pendente.valorDevido)}.\n\nVocê pode quitar diretamente via Pix:\n🔑 Chave Pix: ${chavePixOrganizacao}\n\nAssim que efetuar, por gentileza nos envie o comprovante por aqui. Muito obrigado pela parceria! ✨`;

  const handleCopiarPix = () => {
    navigator.clipboard.writeText(chavePixOrganizacao);
    setCopiadoPix(true);
    setTimeout(() => setCopiadoPix(false), 2000);
  };

  const handleCopiarMsg = () => {
    navigator.clipboard.writeText(mensagemTexto);
    setCopiadoMsg(true);
    setTimeout(() => setCopiadoMsg(false), 2000);
  };

  const handleLiquidar = () => {
    salvarPresencaPagamento({
      id: pendente.id,
      feiraId: pendente.feiraId,
      feiranteId: pendente.feiranteId,
      statusPresenca: pendente.statusPresenca,
      statusPagamento: 'pago',
      formaPagamento: baixarStatus,
      valorCobrado: pendente.valorDevido,
      valorPago: pendente.valorDevido,
      observacao: `Quitado via cobrança em ${new Date().toLocaleDateString('pt-BR')}`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#131522] border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#171a29]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Cobrança de Pendência</h2>
              <p className="text-xs text-slate-400">Notificação via WhatsApp & Baixa de Pagamento</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Card Resumo do Devedor */}
          <div className="p-4 rounded-lg bg-[#0e101b] border border-amber-500/30 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{pendente.feiranteNome}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">
                  Barraca {pendente.feiranteBarraca}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Resp: {pendente.feiranteResponsavel} · {pendente.feiranteContato}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Feira: {formatDateFull(pendente.feiraData)} ({pendente.feiraNome})
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-amber-400 font-medium">Valor Pendente</span>
              <div className="text-xl font-bold text-amber-300 font-mono-numbers">
                {formatCurrency(pendente.valorDevido)}
              </div>
            </div>
          </div>

          {/* Chave Pix da Feira */}
          <div className="p-3 rounded-lg bg-[#0a0c14] border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-xs text-slate-400">Chave Pix da Organização (E-mail):</span>
                <p className="text-xs font-mono font-semibold text-cyan-300">{chavePixOrganizacao}</p>
              </div>
            </div>
            <button
              onClick={handleCopiarPix}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {copiadoPix ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Pix</span>
                </>
              )}
            </button>
          </div>

          {/* Mensagem WhatsApp Formatada */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Mensagem Padrão de Cobrança:
              </label>
              <button
                onClick={handleCopiarMsg}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                {copiadoMsg ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Mensagem Copiada
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Copy className="w-3 h-3" /> Copiar Texto
                  </span>
                )}
              </button>
            </div>
            <div className="p-3 rounded-lg bg-[#0d0f19] border border-slate-800 text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
              {mensagemTexto}
            </div>
          </div>

          {/* Ações de envio */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all text-center"
            >
              <Send className="w-4 h-4" />
              Abrir WhatsApp Web
            </a>

            <div className="flex items-center gap-1.5">
              <select
                value={baixarStatus}
                onChange={(e) => setBaixarStatus(e.target.value as 'dinheiro' | 'pix')}
                className="px-2 py-2.5 rounded-lg bg-[#0e101b] border border-slate-700 text-xs text-slate-200 focus:outline-none"
              >
                <option value="pix">Baixar Pix</option>
                <option value="dinheiro">Baixar Dinheiro</option>
              </select>
              <button
                type="button"
                onClick={handleLiquidar}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all text-center"
              >
                <CheckCircle2 className="w-4 h-4" />
                Dar Baixa
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-[#141724] flex items-center justify-between text-xs text-slate-400">
          <span>O comprovante pode ser anexado na edição manual.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
