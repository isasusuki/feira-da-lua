import React, { useState } from 'react';
import { useFeira } from '../context/FeiraContext';
import {
  Calendar,
  Banknote,
  QrCode,
  Wallet,
  Printer,
  Plus,
  Send,
  Search,
  CheckCircle,
  Sparkles,
  RefreshCw,
  Store,
  Moon,
  Coins,
} from 'lucide-react';
import {
  formatCurrency,
  formatDateShort,
  formatDateFull,
  getStatusPresencaBadge,
} from '../utils/formatters';
import { PendenteCobranca } from '../types';

interface AdminDashboardProps {
  currentTab: string;
  onOpenNovaFeira: () => void;
  onOpenNovoFeirante: () => void;
  onOpenRegistrarPagamento: (feiraId?: string, feiranteId?: string) => void;
  onOpenCobranca: (pendente: PendenteCobranca) => void;
  onOpenSqlModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenNovaFeira,
  onOpenNovoFeirante,
  onOpenRegistrarPagamento,
  onOpenCobranca,
}) => {
  const {
    feiras,
    feirantes,
    presencasPagamentos,
    kpis,
    relatorioPendentes,
    carregarDadosDemonstracao,
  } = useFeira();

  const [buscaFeirante, setBuscaFeirante] = useState('');

  const handleImprimir = () => {
    window.print();
  };

  const feirantesFiltrados = feirantes.filter((f) => {
    return (
      f.nome.toLowerCase().includes(buscaFeirante.toLowerCase()) ||
      f.responsavel.toLowerCase().includes(buscaFeirante.toLowerCase()) ||
      f.numeroBarraca.toLowerCase().includes(buscaFeirante.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 pb-16">
      {/* 1. SEÇÃO RELATÓRIO GERAL DE FEIRAS matching image_a114878d.png */}
      <section className="rounded-2xl bg-gradient-to-r from-[#121424] via-[#101220] to-[#0c0e18] border border-slate-800/90 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
              <Moon className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                Relatório Geral de Feiras
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Prestação de contas consolidada das feiras realizadas, saldos em Pix, Dinheiro e cobranças.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleImprimir}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#facc15] hover:bg-[#eab308] text-slate-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>Imprimir Relatório</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. 4 KPI CARDS strictly matching image_a114878d.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL DE FEIRAS */}
        <div className="rounded-2xl bg-[#0f111d] border border-slate-800/80 p-5 shadow-lg">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            TOTAL DE FEIRAS
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white font-mono-numbers">
            {kpis.totalFeiras}
          </div>
        </div>

        {/* TOTAL DINHEIRO (LIQ) */}
        <div className="rounded-2xl bg-[#0f111d] border border-slate-800/80 p-5 shadow-lg">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            <Banknote className="w-4 h-4" />
            <span>TOTAL DINHEIRO (LIQ)</span>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-emerald-400 font-mono-numbers">
            {formatCurrency(kpis.totalDinheiroLiquido)}
          </div>
        </div>

        {/* TOTAL PIX (LIQ) */}
        <div className="rounded-2xl bg-[#0f111d] border border-slate-800/80 p-5 shadow-lg">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-400">
            <QrCode className="w-4 h-4" />
            <span>TOTAL PIX (LIQ)</span>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-cyan-400 font-mono-numbers">
            {formatCurrency(kpis.totalPixLiquido)}
          </div>
        </div>

        {/* SALDO LÍQUIDO GERAL */}
        <div className="rounded-2xl bg-[#0f111d] border border-slate-800/80 p-5 shadow-lg">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#facc15]">
            SALDO LÍQUIDO GERAL
          </div>
          <div className="mt-3 text-3xl font-extrabold text-[#facc15] font-mono-numbers">
            {formatCurrency(kpis.saldoLiquidoGeral)}
          </div>
        </div>
      </div>

      {/* Botões de Ação Rápida Operacional */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0f111d] border border-slate-800/80">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNovaFeira}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Cadastrar Nova Feira
          </button>
          <button
            onClick={onOpenNovoFeirante}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <Store className="w-3.5 h-3.5 text-cyan-400" />
            Cadastrar Novo Feirante
          </button>
          <button
            onClick={() => onOpenRegistrarPagamento()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <Banknote className="w-3.5 h-3.5 text-emerald-400" />
            Lançar Pagamento / Presença
          </button>
        </div>

        {feiras.length === 0 && (
          <div className="text-xs text-amber-300 flex items-center gap-2">
            <span>Sistema iniciado zerado (R$ 0,00).</span>
            <button
              onClick={carregarDadosDemonstracao}
              className="text-xs font-bold underline hover:text-white"
            >
              Carregar dados da planilha
            </button>
          </div>
        )}
      </div>

      {/* 3. RELATÓRIO DE PENDENTES PARA COBRANÇA strictly matching image_a114878d.png */}
      <section className="rounded-2xl border border-slate-800/80 bg-[#0d0f19] p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="text-rose-400 p-1.5 rounded-lg bg-rose-950/40 border border-rose-900/40">
              <Coins className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                Relatório de Pendentes para Cobrança
              </h2>
              <p className="text-xs text-slate-400">
                Lista consolidada de feirantes com pagamento pendente para cobrança imediata.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <span className="px-3.5 py-1.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800/40 font-mono text-xs font-bold">
              Total Pendente: {formatCurrency(kpis.totalPendente)}
            </span>
          </div>
        </div>

        {/* Table strictly matching columns from image_a114878d.png */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#090b12]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-[#0f111d] font-semibold tracking-wider uppercase text-[11px]">
                <th className="py-3 px-4">FEIRA (DATA)</th>
                <th className="py-3 px-4">FEIRANTE</th>
                <th className="py-3 px-4">CONTATO</th>
                <th className="py-3 px-4 text-center">PRESENÇA</th>
                <th className="py-3 px-4 text-right">VALOR PENDENTE</th>
                <th className="py-3 px-4 text-center">AÇÕES / COBRANÇA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono-numbers">
              {relatorioPendentes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-sans">
                    <CheckCircle className="w-6 h-6 text-emerald-500/50 mx-auto mb-1" />
                    <span>Nenhum pagamento pendente no momento.</span>
                  </td>
                </tr>
              ) : (
                relatorioPendentes.map((pendente) => {
                  const badgePresenca = getStatusPresencaBadge(pendente.statusPresenca);
                  return (
                    <tr
                      key={pendente.id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      {/* FEIRA (DATA) */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                        {formatDateFull(pendente.feiraData)}
                      </td>

                      {/* FEIRANTE */}
                      <td className="py-3.5 px-4 font-sans font-bold text-slate-100">
                        {pendente.feiranteNome}
                      </td>

                      {/* CONTATO */}
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {pendente.feiranteContato || '-'}
                      </td>

                      {/* PRESENÇA */}
                      <td className="py-3.5 px-4 text-center font-sans">
                        <span className="inline-block px-2.5 py-0.5 rounded bg-[#201c14] border border-amber-500/30 text-amber-300 font-semibold text-[11px]">
                          {badgePresenca.label}
                        </span>
                      </td>

                      {/* VALOR PENDENTE */}
                      <td className="py-3.5 px-4 text-right font-bold text-rose-400 text-sm">
                        {formatCurrency(pendente.valorDevido)}
                      </td>

                      {/* AÇÕES / COBRANÇA */}
                      <td className="py-3.5 px-4 text-center">
                        {pendente.feiranteContato ? (
                          <button
                            onClick={() => onOpenCobranca(pendente)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Cobrar WhatsApp</span>
                          </button>
                        ) : (
                          <span className="text-slate-500 text-xs">Sem telefone</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. TABELA MATRIZ ESTILO PLANILHA (HISTÓRICO) matching image_fb6ee6c9.png */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              Planilha Matriz de Controle de Feirantes & Pagamentos
            </h2>
            <p className="text-xs text-slate-400">
              Histórico idêntico à planilha oficial. Clique em qualquer célula para alterar presença ou liquidar valor.
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar barraca..."
              value={buscaFeirante}
              onChange={(e) => setBuscaFeirante(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[#111320] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-400 w-48"
            />
          </div>
        </div>

        {/* Spreadsheet Matrix with faithful colors from image_fb6ee6c9.png */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d0f19] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#16192c] text-slate-200">
                  <th className="py-2.5 px-3 font-bold w-12 text-center border-r border-slate-800">
                    Nº
                  </th>
                  <th className="py-2.5 px-4 font-bold min-w-[200px] border-r border-slate-800">
                    Barraca / Feirante
                  </th>

                  {/* Columns matching spreadsheet dates */}
                  {feiras.map((feira) => {
                    const isCancelado = feira.observacoes?.includes('CANCELADO');
                    return (
                      <th
                        key={feira.id}
                        className={`py-2 px-2 text-center font-bold border-r border-slate-800 min-w-[95px] ${
                          isCancelado
                            ? 'bg-rose-950/80 text-rose-300'
                            : 'bg-[#181c33] text-amber-300'
                        }`}
                      >
                        <div className="text-xs font-mono font-bold">
                          {formatDateShort(feira.data)}
                        </div>
                        {isCancelado && (
                          <div className="text-[9px] text-rose-400 font-normal">Chuva</div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60 font-mono-numbers">
                {feirantesFiltrados.map((feirante) => {
                  return (
                    <tr
                      key={feirante.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="py-2.5 px-3 text-center font-bold text-slate-400 border-r border-slate-800">
                        {feirante.numeroBarraca}
                      </td>

                      <td className="py-2.5 px-4 font-sans border-r border-slate-800">
                        <div className="font-bold text-slate-100 group-hover:text-amber-300">
                          {feirante.nome}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {feirante.responsavel}
                        </div>
                      </td>

                      {/* Matrix cells matching spreadsheet colors */}
                      {feiras.map((feira) => {
                        const isFeiraCancelada = feira.observacoes?.includes('CANCELADO');
                        const registro = presencasPagamentos.find(
                          (p) => p.feiraId === feira.id && p.feiranteId === feirante.id
                        );

                        // If fair was cancelled (like 24/09 or 10/09)
                        if (isFeiraCancelada) {
                          return (
                            <td
                              key={feira.id}
                              className="py-2 px-2 text-center border-r border-slate-800 bg-[#dc2626] text-white font-black text-[11px] tracking-tight uppercase select-none"
                            >
                              CANCELADO
                            </td>
                          );
                        }

                        const status = registro?.statusPagamento || 'pendente';
                        const valor = registro?.valorCobrado || feira.taxaPadrao;

                        // Color styles strictly inspired by image_fb6ee6c9.png
                        let cellStyle = 'bg-[#101322] text-slate-400';
                        let displayText = formatCurrency(valor);

                        if (status === 'pago') {
                          if (registro?.formaPagamento === 'dinheiro') {
                            cellStyle = 'bg-[#052e16] text-[#4ade80] font-bold'; // Dark green
                            displayText = 'PAGO';
                          } else {
                            cellStyle = 'bg-[#083344] text-[#38bdf8] font-bold'; // Cyan
                            displayText = formatCurrency(registro?.valorPago || valor);
                          }
                        } else if (status === 'pendente') {
                          cellStyle = 'bg-[#422006] text-[#facc15] font-bold'; // Amber/Yellow
                          displayText = formatCurrency(valor);
                        } else if (status === 'cancelado') {
                          cellStyle = 'bg-[#dc2626] text-white font-bold';
                          displayText = 'CANCELADO';
                        }

                        return (
                          <td
                            key={feira.id}
                            onClick={() => onOpenRegistrarPagamento(feira.id, feirante.id)}
                            title={`Clique para editar presença ou pagamento de ${feirante.nome} em ${formatDateShort(feira.data)}`}
                            className={`py-2 px-2 text-center border-r border-slate-800 cursor-pointer hover:brightness-125 transition-all text-xs ${cellStyle}`}
                          >
                            {displayText}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {/* Subtotal row as in image_fb6ee6c9.png */}
                <tr className="bg-[#052e16] text-white font-extrabold border-t-2 border-emerald-500">
                  <td colSpan={2} className="py-2.5 px-4 font-sans text-xs uppercase tracking-wider text-emerald-200 border-r border-slate-800">
                    Total Arrecadado por Feira
                  </td>
                  {feiras.map((feira) => {
                    const isFeiraCancelada = feira.observacoes?.includes('CANCELADO');
                    if (isFeiraCancelada) {
                      return (
                        <td
                          key={feira.id}
                          className="py-2.5 px-2 text-center text-xs border-r border-slate-800 font-mono text-emerald-300"
                        >
                          R$ 0,00
                        </td>
                      );
                    }
                    const totalFeira = presencasPagamentos
                      .filter((p) => p.feiraId === feira.id && p.statusPagamento === 'pago')
                      .reduce((acc, curr) => acc + curr.valorPago, 0);

                    return (
                      <td
                        key={feira.id}
                        className="py-2.5 px-2 text-center text-xs border-r border-slate-800 font-mono text-emerald-300"
                      >
                        {formatCurrency(totalFeira)}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
