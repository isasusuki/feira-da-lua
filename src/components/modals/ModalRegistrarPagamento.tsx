import React, { useState, useEffect } from 'react';
import { useFeira } from '../../context/FeiraContext';
import { PresencaStatus, PagamentoStatus, FormaPagamento } from '../../types';
import { X, CreditCard, DollarSign, Calendar, UserCheck, AlertCircle } from 'lucide-react';
import { formatDateFull } from '../../utils/formatters';

interface ModalRegistrarPagamentoProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedFeiraId?: string;
  preSelectedFeiranteId?: string;
}

export const ModalRegistrarPagamento: React.FC<ModalRegistrarPagamentoProps> = ({
  isOpen,
  onClose,
  preSelectedFeiraId,
  preSelectedFeiranteId,
}) => {
  const { feiras, feirantes, presencasPagamentos, salvarPresencaPagamento } = useFeira();

  const [feiraId, setFeiraId] = useState(preSelectedFeiraId || (feiras[0]?.id || ''));
  const [feiranteId, setFeiranteId] = useState(preSelectedFeiranteId || (feirantes[0]?.id || ''));
  const [statusPresenca, setStatusPresenca] = useState<PresencaStatus>('presente');
  const [statusPagamento, setStatusPagamento] = useState<PagamentoStatus>('pago');
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('pix');
  const [valorCobrado, setValorCobrado] = useState('55.00');
  const [valorPago, setValorPago] = useState('55.00');
  const [observacao, setObservacao] = useState('');

  // Update selection when props change
  useEffect(() => {
    if (preSelectedFeiraId) setFeiraId(preSelectedFeiraId);
    if (preSelectedFeiranteId) setFeiranteId(preSelectedFeiranteId);
  }, [preSelectedFeiraId, preSelectedFeiranteId]);

  // Load existing data if record exists
  useEffect(() => {
    if (feiraId && feiranteId) {
      const existing = presencasPagamentos.find(
        (p) => p.feiraId === feiraId && p.feiranteId === feiranteId
      );
      const feira = feiras.find((f) => f.id === feiraId);
      const taxaFeira = feira ? feira.taxaPadrao.toFixed(2) : '55.00';

      if (existing) {
        setStatusPresenca(existing.statusPresenca);
        setStatusPagamento(existing.statusPagamento);
        setFormaPagamento(existing.formaPagamento || 'pix');
        setValorCobrado(existing.valorCobrado.toString());
        setValorPago(existing.valorPago.toString());
        setObservacao(existing.observacao || '');
      } else {
        setStatusPresenca('presente');
        setStatusPagamento('pago');
        setFormaPagamento('pix');
        setValorCobrado(taxaFeira);
        setValorPago(taxaFeira);
        setObservacao('');
      }
    }
  }, [feiraId, feiranteId, presencasPagamentos, feiras]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feiraId || !feiranteId) return;

    salvarPresencaPagamento({
      feiraId,
      feiranteId,
      statusPresenca,
      statusPagamento,
      formaPagamento: statusPagamento === 'pago' ? formaPagamento : undefined,
      valorCobrado: parseFloat(valorCobrado) || 0,
      valorPago: statusPagamento === 'pago' ? parseFloat(valorPago) || 0 : 0,
      observacao: observacao.trim() || undefined,
    });

    onClose();
  };

  const feiraSelecionada = feiras.find((f) => f.id === feiraId);
  const feiranteSelecionado = feirantes.find((f) => f.id === feiranteId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#131522] border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#171a29]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Registrar Presença & Pagamento</h2>
              <p className="text-xs text-slate-400">Controle financeiro diário da barraca</p>
            </div>
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
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Data da Feira
              </label>
              <select
                value={feiraId}
                onChange={(e) => setFeiraId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-emerald-400 transition-colors"
              >
                {feiras.map((f) => (
                  <option key={f.id} value={f.id} className="bg-[#121422]">
                    {formatDateFull(f.data)} - {f.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                Feirante / Barraca
              </label>
              <select
                value={feiranteId}
                onChange={(e) => setFeiranteId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-emerald-400 transition-colors"
              >
                {feirantes.map((ft) => (
                  <option key={ft.id} value={ft.id} className="bg-[#121422]">
                    [{ft.numeroBarraca}] {ft.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Details badge */}
          {feiraSelecionada && feiranteSelecionado && (
            <div className="p-2.5 rounded-lg bg-[#0b0d16] border border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div>
                <span className="font-semibold text-white">{feiranteSelecionado.nome}</span>{' '}
                <span className="text-slate-500">· {feiranteSelecionado.responsavel}</span>
              </div>
              <div className="font-mono text-cyan-400">
                Taxa Base: R$ {feiraSelecionada.taxaPadrao.toFixed(2)}
              </div>
            </div>
          )}

          {/* Status da Presença */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Status de Presença
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'presente', label: 'Presente', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30' },
                { id: 'ausente', label: 'Ausente', color: 'text-rose-400 border-rose-500/40 bg-rose-950/30' },
                { id: 'falta_justificada', label: 'Justificada', color: 'text-amber-400 border-amber-500/40 bg-amber-950/30' },
                { id: 'atestado', label: 'Atestado', color: 'text-sky-400 border-sky-500/40 bg-sky-950/30' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setStatusPresenca(item.id as PresencaStatus)}
                  className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-colors ${
                    statusPresenca === item.id
                      ? `${item.color} ring-1 ring-white/20 font-bold`
                      : 'border-slate-800 bg-[#0e101b] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status do Pagamento */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Status do Pagamento
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'pago', label: 'Pago', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30' },
                { id: 'pendente', label: 'Pendente', color: 'text-amber-400 border-amber-500/40 bg-amber-950/30' },
                { id: 'isento', label: 'Isento', color: 'text-slate-300 border-slate-600 bg-slate-900' },
                { id: 'cancelado', label: 'Cancelado', color: 'text-rose-400 border-rose-500/40 bg-rose-950/30' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setStatusPagamento(item.id as PagamentoStatus);
                    if (item.id === 'pendente') {
                      setValorPago('0');
                    } else if (item.id === 'pago') {
                      setValorPago(valorCobrado);
                    }
                  }}
                  className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-colors ${
                    statusPagamento === item.id
                      ? `${item.color} ring-1 ring-white/20 font-bold`
                      : 'border-slate-800 bg-[#0e101b] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Se status for 'pago', selecionar forma: Dinheiro ou Pix */}
          {statusPagamento === 'pago' && (
            <div className="p-3 rounded-lg bg-[#0e101b] border border-slate-800 space-y-3">
              <label className="block text-xs font-medium text-slate-300">
                Forma de Pagamento Recebida
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormaPagamento('pix')}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                    formaPagamento === 'pix'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-sm'
                      : 'border-slate-800 bg-[#121422] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📱 Pix
                </button>
                <button
                  type="button"
                  onClick={() => setFormaPagamento('cartao')}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                    formaPagamento === 'cartao'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-400/50 shadow-sm'
                      : 'border-slate-800 bg-[#121422] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  💳 Cartão
                </button>
                <button
                  type="button"
                  onClick={() => setFormaPagamento('dinheiro')}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                    formaPagamento === 'dinheiro'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-sm'
                      : 'border-slate-800 bg-[#121422] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  💵 Dinheiro
                </button>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Valor Pago (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-slate-500">R$</span>
                  <input
                    type="number"
                    step="0.50"
                    min="0"
                    value={valorPago}
                    onChange={(e) => setValorPago(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#141726] border border-slate-700 text-sm text-slate-100 font-mono-numbers focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>
          )}

          {statusPagamento === 'pendente' && (
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-xs text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>
                Este feirante constará automaticamente no <strong>Relatório de Pendentes para Cobrança</strong> até a confirmação do pagamento.
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Observação Interna (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Comprovante enviado no WhatsApp, promessa para 20/10..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-emerald-400 transition-colors"
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
              className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-colors"
            >
              Confirmar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
