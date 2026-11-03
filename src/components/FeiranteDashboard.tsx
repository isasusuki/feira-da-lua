import React, { useState } from 'react';
import { useFeira } from '../context/FeiraContext';
import {
  Store,
  CalendarCheck,
  CheckCircle,
  AlertCircle,
  QrCode,
  Copy,
  Check,
  CreditCard,
  User,
  Phone,
  Send,
  ArrowRight,
  Receipt,
  FileCheck2,
  Plus,
  Trash2,
  DollarSign,
  TrendingDown,
  LogOut,
  AlertOctagon,
  Ban,
} from 'lucide-react';
import {
  formatCurrency,
  formatDateFull,
  getStatusPresencaBadge,
  getStatusPagamentoBadge,
} from '../utils/formatters';
import { Feira, FormaPagamento } from '../types';

export const FeiranteDashboard: React.FC = () => {
  const {
    feiranteLogado,
    feiranteExtrato,
    enviarPagamentoFeirante,
    despesas,
    adicionarDespesa,
    removerDespesa,
    desistirEdicaoFeira,
    solicitarDesligamentoFeira,
  } = useFeira();

  const [activeTab, setActiveTab] = useState<'pagamentos' | 'despesas' | 'desistir'>('pagamentos');
  const [copiadoPix, setCopiadoPix] = useState(false);
  const [feiraSelecionadaParaPagar, setFeiraSelecionadaParaPagar] = useState<Feira | null>(null);
  const [formaEscolhida, setFormaEscolhida] = useState<FormaPagamento>('pix');
  const [comprovanteInput, setComprovanteInput] = useState('');
  const [pagamentoSucessoMsg, setPagamentoSucessoMsg] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Form de nova despesa do feirante
  const [novaDespesaDesc, setNovaDespesaDesc] = useState('');
  const [novaDespesaCat, setNovaDespesaCat] = useState<'insumos' | 'transporte' | 'embalagens' | 'pessoal' | 'energia_gelo' | 'outros'>('insumos');
  const [novaDespesaValor, setNovaDespesaValor] = useState('');
  const [novaDespesaForma, setNovaDespesaForma] = useState<'dinheiro' | 'cartao' | 'pix'>('pix');
  const [novaDespesaData, setNovaDespesaData] = useState(() => new Date().toISOString().split('T')[0]);

  // Modal / Confirm de Desistência
  const [confirmarDesistenciaFeira, setConfirmarDesistenciaFeira] = useState<Feira | null>(null);
  const [motivoDesistencia, setMotivoDesistencia] = useState('');
  const [confirmarDesligamento, setConfirmarDesligamento] = useState(false);

  const chavePixOrganizacao = 'financeiro@feiradalua.com.br';

  if (!feiranteLogado) {
    return (
      <div className="p-8 text-center text-slate-400">
        Nenhum feirante associado à conta atual.
      </div>
    );
  }

  const { presencas, totalPago, valorPendente, historico } = feiranteExtrato;

  // Filtrar despesas exclusivas deste feirante
  const minhasDespesas = despesas.filter((d) => d.feiranteId === feiranteLogado.id);
  const totalMinhasDespesas = minhasDespesas.reduce((acc, curr) => acc + curr.valor, 0);

  // Feiras pendentes para quitação
  const feirasPendentes = historico.filter(
    (h) => h.registro && h.registro.statusPagamento === 'pendente'
  );

  const handleCopiarPix = (valor?: number) => {
    const pixCode = `00020126580014br.gov.bcb.pix0136${chavePixOrganizacao}520400005303986540${(valor || 55.0).toFixed(2)}5802BR5912FEIRA DA LUA6009SAO PAULO62070503***6304B76C`;
    navigator.clipboard.writeText(pixCode);
    setCopiadoPix(true);
    setTimeout(() => setCopiadoPix(false), 2500);
  };

  const handleExecutarPagamento = (feira: Feira, valor: number) => {
    setEnviando(true);
    setTimeout(() => {
      let comprovante = comprovanteInput.trim();
      if (!comprovante) {
        if (formaEscolhida === 'pix') comprovante = `E2E-PIX-${Date.now().toString().slice(-6)}`;
        else if (formaEscolhida === 'cartao') comprovante = `AUT-CARTAO-${Date.now().toString().slice(-4)}`;
        else comprovante = `REC-DINHEIRO-${Date.now().toString().slice(-4)}`;
      }

      const success = enviarPagamentoFeirante({
        feiraId: feira.id,
        valor,
        forma: formaEscolhida,
        comprovanteTexto: comprovante,
      });

      setEnviando(false);
      if (success) {
        setPagamentoSucessoMsg(
          `Pagamento de ${formatCurrency(valor)} via ${formaEscolhida.toUpperCase()} para a feira de ${formatDateFull(
            feira.data
          )} realizado com sucesso!`
        );
        setFeiraSelecionadaParaPagar(null);
        setComprovanteInput('');
        setTimeout(() => setPagamentoSucessoMsg(''), 5000);
      }
    }, 350);
  };

  const handleCadastrarDespesa = (e: React.FormEvent) => {
    e.preventDefault();
    const valorNum = parseFloat(novaDespesaValor);
    if (!novaDespesaDesc.trim() || isNaN(valorNum) || valorNum <= 0) return;

    adicionarDespesa({
      feiranteId: feiranteLogado.id,
      descricao: novaDespesaDesc.trim(),
      categoria: novaDespesaCat,
      data: novaDespesaData,
      valor: valorNum,
      formaPagamento: novaDespesaForma,
    });

    setNovaDespesaDesc('');
    setNovaDespesaValor('');
  };

  const handleConfirmarDesistencia = () => {
    if (!confirmarDesistenciaFeira) return;
    desistirEdicaoFeira(confirmarDesistenciaFeira.id, motivoDesistencia.trim() || undefined);
    setConfirmarDesistenciaFeira(null);
    setMotivoDesistencia('');
  };

  const handleConfirmarDesligamentoTotal = () => {
    solicitarDesligamentoFeira('Desligamento solicitado voluntariamente pelo feirante.');
    setConfirmarDesligamento(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Alerta de Sucesso após Envio de Pagamento */}
      {pagamentoSucessoMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-between gap-3 text-emerald-300 animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">{pagamentoSucessoMsg}</span>
          </div>
          <button
            onClick={() => setPagamentoSucessoMsg('')}
            className="text-xs text-emerald-400 hover:text-white"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Header com dados do expositor */}
      <div className="rounded-2xl bg-gradient-to-r from-[#141727] via-[#101322] to-[#0c0e18] border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20 shrink-0">
              <Store className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {feiranteLogado.nome}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs border border-cyan-500/40">
                  Barraca {feiranteLogado.numeroBarraca}
                </span>
                {feiranteLogado.status === 'inativo' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/40">
                    Barraca Desativada / Desistente
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  Responsável: <strong className="text-slate-300">{feiranteLogado.responsavel}</strong>
                </span>
                <span>·</span>
                <span>Segmento: {feiranteLogado.segmento}</span>
                <span>·</span>
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {feiranteLogado.telefone}
                </span>
              </div>
            </div>
          </div>

          {/* Status Financeiro Badge */}
          <div className="shrink-0 flex items-center gap-2">
            {valorPendente > 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Taxa Pendente de Pagamento
                  </div>
                  <div className="text-base font-extrabold font-mono-numbers">
                    {formatCurrency(valorPendente)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Taxas da Feira em Dia
                  </div>
                  <div className="text-xs text-emerald-300">
                    Nenhuma pendência financeira
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards do Expositor */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Card 1: Presenças */}
        <div className="rounded-2xl bg-gradient-to-br from-[#121422] to-[#0c0e18] border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Presenças
            </span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono-numbers">
              {presencas}
            </span>
            <span className="text-xs text-slate-400">feiras participadas</span>
          </div>
        </div>

        {/* Card 2: Taxas Pagas */}
        <div className="rounded-2xl bg-gradient-to-br from-[#121422] to-[#0c0e18] border border-emerald-500/20 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Taxas Pagas à Feira
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-emerald-300 font-mono-numbers">
              {formatCurrency(totalPago)}
            </span>
          </div>
        </div>

        {/* Card 3: Minhas Despesas de Operação */}
        <div className="rounded-2xl bg-gradient-to-br from-[#121422] to-[#0c0e18] border border-purple-500/20 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Minhas Despesas
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-purple-300 font-mono-numbers">
              {formatCurrency(totalMinhasDespesas)}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {minhasDespesas.length} despesas lançadas
          </div>
        </div>

        {/* Card 4: Taxa Pendente */}
        <div className="rounded-2xl bg-gradient-to-br from-[#121422] to-[#0c0e18] border border-amber-500/20 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Pendente de Quitação
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-amber-300 font-mono-numbers">
              {formatCurrency(valorPendente)}
            </span>
          </div>
        </div>
      </div>

      {/* Navegação por Abas do Feirante */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('pagamentos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'pagamentos'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Pagar Taxas da Feira (Dinheiro, Cartão ou Pix)</span>
        </button>

        <button
          onClick={() => setActiveTab('despesas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'despesas'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>Lançar Minhas Despesas</span>
        </button>

        <button
          onClick={() => setActiveTab('desistir')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ml-auto ${
            activeTab === 'desistir'
              ? 'bg-rose-900/60 text-rose-300 border border-rose-700'
              : 'text-slate-500 hover:text-rose-400 hover:bg-rose-950/20'
          }`}
        >
          <Ban className="w-4 h-4" />
          <span>Desistir da Feira / Sair</span>
        </button>
      </div>

      {/* ABA 1: PAGAR TAXAS DA FEIRA COM OPÇÕES: DINHEIRO, CARTÃO OU PIX */}
      {activeTab === 'pagamentos' && (
        <section className="space-y-6">
          {feirasPendentes.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Lista das taxas pendentes */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Selecione a Taxa Pendente para Pagar:
                </div>

                {feirasPendentes.map(({ feira, registro }) => {
                  const devido = registro ? registro.valorCobrado - registro.valorPago : feira.taxaPadrao;
                  const isSelected = feiraSelecionadaParaPagar?.id === feira.id;

                  return (
                    <div
                      key={feira.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-[#181c30] border-amber-400 shadow-lg shadow-amber-500/10'
                          : 'bg-[#121422] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-mono font-bold text-amber-400">
                            Feira de {formatDateFull(feira.data)}
                          </div>
                          <div className="text-sm font-bold text-white mt-0.5">{feira.nome}</div>
                          <div className="text-xs text-slate-400">{feira.local}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-slate-400">Valor a Pagar</div>
                          <div className="text-lg font-extrabold text-amber-300 font-mono-numbers">
                            {formatCurrency(devido)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmarDesistenciaFeira(feira);
                            setActiveTab('desistir');
                          }}
                          className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          Não vou comparecer nesta feira
                        </button>

                        <button
                          onClick={() => setFeiraSelecionadaParaPagar(feira)}
                          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 font-black'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                          }`}
                        >
                          <span>Pagar Agora</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Central de Pagamento do Feirante: Dinheiro, Cartão ou Pix */}
              <div className="p-6 rounded-2xl bg-[#141728] border border-amber-500/30 shadow-xl flex flex-col justify-between">
                {feiraSelecionadaParaPagar ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-xs text-amber-400 font-semibold uppercase">
                          Pagamento Direto pelo Feirante
                        </span>
                        <h3 className="text-base font-bold text-white">
                          {feiraSelecionadaParaPagar.nome}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400">Total a Pagar:</span>
                        <div className="text-xl font-black text-amber-400 font-mono-numbers">
                          {formatCurrency(feiraSelecionadaParaPagar.taxaPadrao)}
                        </div>
                      </div>
                    </div>

                    {/* 3 Opções de Pagamento: Dinheiro, Cartão ou Pix */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Escolha sua forma de pagamento:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormaEscolhida('pix')}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                            formaEscolhida === 'pix'
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                              : 'bg-[#0d0f19] border-slate-700 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          📱 Pix
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormaEscolhida('cartao')}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                            formaEscolhida === 'cartao'
                              ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-md shadow-purple-500/10'
                              : 'bg-[#0d0f19] border-slate-700 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          💳 Cartão
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormaEscolhida('dinheiro')}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                            formaEscolhida === 'dinheiro'
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                              : 'bg-[#0d0f19] border-slate-700 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          💵 Dinheiro
                        </button>
                      </div>
                    </div>

                    {/* Detalhe da forma de pagamento */}
                    {formaEscolhida === 'pix' && (
                      <div className="space-y-3 p-3.5 rounded-xl bg-[#0b0d16] border border-cyan-500/30">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Chave Pix da Organização:</span>
                          <span className="font-mono font-bold text-cyan-300">
                            {chavePixOrganizacao}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopiarPix(feiraSelecionadaParaPagar.taxaPadrao)}
                          className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiadoPix ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-400">
                                Código Pix Copia e Cola Copiado!
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-slate-300" />
                              <span>Copiar Código Pix Copia e Cola</span>
                            </>
                          )}
                        </button>
                        <div>
                          <input
                            type="text"
                            placeholder="Comprovante / ID Transação (Opcional)"
                            value={comprovanteInput}
                            onChange={(e) => setComprovanteInput(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#111322] border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>
                    )}

                    {formaEscolhida === 'cartao' && (
                      <div className="space-y-3 p-3.5 rounded-xl bg-[#0b0d16] border border-purple-500/30 text-xs text-slate-300">
                        <p className="font-bold text-purple-300 flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4" /> Pagamento com Cartão de Débito ou Crédito
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                          Ao confirmar, o pagamento de {formatCurrency(feiraSelecionadaParaPagar.taxaPadrao)} será debitado no seu cartão e o comprovante digital será registrado para a feira.
                        </p>
                        <input
                          type="text"
                          placeholder="Últimos 4 dígitos do cartão ou bandeira (ex: Visa 4421)"
                          value={comprovanteInput}
                          onChange={(e) => setComprovanteInput(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#111322] border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                    )}

                    {formaEscolhida === 'dinheiro' && (
                      <div className="space-y-2 p-3.5 rounded-xl bg-[#0b0d16] border border-amber-500/30 text-xs text-slate-300">
                        <p className="font-bold text-amber-300 flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4" /> Pagamento em Dinheiro Físico
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                          Você está entregando o valor de {formatCurrency(feiraSelecionadaParaPagar.taxaPadrao)} em espécie diretamente aos organizadores da Feira da Lua.
                        </p>
                      </div>
                    )}

                    {/* Botão de Envio do Pagamento */}
                    <div className="pt-2 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setFeiraSelecionadaParaPagar(null)}
                        className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                      >
                        Cancelar
                      </button>

                      <button
                        type="button"
                        disabled={enviando}
                        onClick={() =>
                          handleExecutarPagamento(
                            feiraSelecionadaParaPagar,
                            feiraSelecionadaParaPagar.taxaPadrao
                          )
                        }
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>
                          {enviando
                            ? 'Processando Pagamento...'
                            : `Pagar ${formatCurrency(feiraSelecionadaParaPagar.taxaPadrao)} via ${formaEscolhida.toUpperCase()}`}
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Central de Pagamentos</h3>
                      <p className="text-xs text-slate-400 max-w-xs mt-1">
                        Selecione uma feira pendente ao lado para pagar via <strong>Pix</strong>, <strong>Cartão</strong> ou <strong>Dinheiro</strong>.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#121422] border border-slate-800 text-center">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-white">Parabéns! Nenhuma taxa pendente.</h3>
              <p className="text-xs text-slate-400 mt-1">
                Todas as participações nas edições da Feira da Lua estão devidamente quitadas.
              </p>
            </div>
          )}

          {/* Histórico pessoal */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d0f19] overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 bg-[#121424] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Histórico de Taxas da Barraca
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#141727] text-slate-400">
                    <th className="py-3 px-4 font-bold">Data</th>
                    <th className="py-3 px-4 font-bold">Feira</th>
                    <th className="py-3 px-4 text-center">Presença</th>
                    <th className="py-3 px-4 text-right">Taxa</th>
                    <th className="py-3 px-4 text-right">Valor Pago</th>
                    <th className="py-3 px-4 text-center">Forma</th>
                    <th className="py-3 px-4 text-center">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono-numbers">
                  {historico.map(({ feira, registro }) => {
                    const statusPresenca = registro?.statusPresenca || 'presente';
                    const statusPagamento = registro?.statusPagamento || 'pendente';
                    const badgePresenca = getStatusPresencaBadge(statusPresenca);
                    const badgePagamento = getStatusPagamentoBadge(
                      statusPagamento,
                      registro?.formaPagamento,
                      registro?.valorPago
                    );

                    return (
                      <tr key={feira.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-cyan-300">
                          {formatDateFull(feira.data)}
                        </td>
                        <td className="py-3 px-4 font-sans text-slate-200 font-semibold">
                          {feira.nome}
                        </td>
                        <td className="py-3 px-4 text-center font-sans">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgePresenca.bg} ${badgePresenca.text} ${badgePresenca.border}`}
                          >
                            {badgePresenca.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-slate-300">
                          {formatCurrency(registro?.valorCobrado ?? feira.taxaPadrao)}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-400">
                          {formatCurrency(registro?.valorPago ?? 0)}
                        </td>
                        <td className="py-3 px-4 text-center font-sans capitalize text-slate-300">
                          {registro?.formaPagamento ? (
                            <span className="font-mono text-xs">
                              {registro.formaPagamento === 'pix'
                                ? '📱 Pix'
                                : registro.formaPagamento === 'cartao'
                                ? '💳 Cartão'
                                : '💵 Dinheiro'}
                            </span>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center font-sans">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-lg border text-[11px] font-bold ${badgePagamento.bg} ${badgePagamento.border} ${badgePagamento.text}`}
                          >
                            {badgePagamento.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ABA 2: LANÇAR MINHAS DESPESAS */}
      {activeTab === 'despesas' && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulário para Lançar Despesa */}
            <div className="lg:col-span-1 p-6 rounded-2xl bg-[#131524] border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Cadastrar Despesa da Barraca</h3>
                  <p className="text-xs text-slate-400">Controle seus custos operacionais</p>
                </div>
              </div>

              <form onSubmit={handleCadastrarDespesa} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Descrição da Despesa
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Pães, Embalagens, Combustível..."
                    value={novaDespesaDesc}
                    onChange={(e) => setNovaDespesaDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Categoria
                    </label>
                    <select
                      value={novaDespesaCat}
                      onChange={(e) => setNovaDespesaCat(e.target.value as any)}
                      className="w-full px-2.5 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-xs text-slate-200 focus:outline-none"
                    >
                      <option value="insumos">Insumos / Alimentos</option>
                      <option value="embalagens">Embalagens / Copos</option>
                      <option value="transporte">Transporte / Combustível</option>
                      <option value="pessoal">Diária de Ajudante</option>
                      <option value="energia_gelo">Gelo / Energia</option>
                      <option value="outros">Outros Custos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Valor (R$)
                    </label>
                    <input
                      type="number"
                      step="0.50"
                      min="0.10"
                      required
                      placeholder="0.00"
                      value={novaDespesaValor}
                      onChange={(e) => setNovaDespesaValor(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-xs text-slate-100 font-mono-numbers focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Data do Gasto
                    </label>
                    <input
                      type="date"
                      required
                      value={novaDespesaData}
                      onChange={(e) => setNovaDespesaData(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Forma de Pagto
                    </label>
                    <select
                      value={novaDespesaForma}
                      onChange={(e) => setNovaDespesaForma(e.target.value as any)}
                      className="w-full px-2.5 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-xs text-slate-200 focus:outline-none"
                    >
                      <option value="pix">Pix</option>
                      <option value="cartao">Cartão</option>
                      <option value="dinheiro">Dinheiro</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20 transition-all cursor-pointer mt-2"
                >
                  Salvar Despesa
                </button>
              </form>
            </div>

            {/* Lista e Extrato de Despesas */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-4 rounded-xl bg-[#0f111d] border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">
                    Total de Despesas Registradas
                  </span>
                  <div className="text-2xl font-black text-purple-300 font-mono-numbers">
                    {formatCurrency(totalMinhasDespesas)}
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <div>+ Taxas da Feira: {formatCurrency(totalPago)}</div>
                  <div className="text-amber-400 font-bold mt-0.5">
                    Custo Total: {formatCurrency(totalMinhasDespesas + totalPago)}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#0d0f19] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-[#141727] text-slate-400">
                        <th className="py-3 px-4 font-bold">Data</th>
                        <th className="py-3 px-4 font-bold">Descrição</th>
                        <th className="py-3 px-4 font-bold">Categoria</th>
                        <th className="py-3 px-4 font-bold text-right">Valor</th>
                        <th className="py-3 px-4 text-center">Pagamento</th>
                        <th className="py-3 px-4 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono-numbers">
                      {minhasDespesas.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500 font-sans">
                            Nenhuma despesa cadastrada ainda. Use o formulário ao lado para lançar.
                          </td>
                        </tr>
                      ) : (
                        minhasDespesas.map((desp) => (
                          <tr key={desp.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 px-4 font-mono text-slate-300">
                              {formatDateFull(desp.data)}
                            </td>
                            <td className="py-3 px-4 font-sans font-semibold text-white">
                              {desp.descricao}
                            </td>
                            <td className="py-3 px-4 font-sans capitalize text-slate-400">
                              {desp.categoria.replace('_', ' ')}
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-rose-400">
                              {formatCurrency(desp.valor)}
                            </td>
                            <td className="py-3 px-4 text-center font-sans uppercase text-[11px] text-slate-300">
                              {desp.formaPagamento}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => removerDespesa(desp.id)}
                                className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                                title="Excluir despesa"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ABA 3: DESISTIR DA FEIRA OU SAIR VOLUNTARIAMENTE */}
      {activeTab === 'desistir' && (
        <section className="space-y-6 max-w-2xl">
          <div className="p-6 rounded-2xl bg-[#141524] border border-rose-900/50 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Desistência ou Saída da Feira da Lua
                </h3>
                <p className="text-xs text-slate-400">
                  O feirante tem total liberdade para desistir de uma edição específica ou encerrar sua participação geral.
                </p>
              </div>
            </div>

            {/* Opção 1: Desistir de uma data específica */}
            <div className="p-4 rounded-xl bg-[#0e101a] border border-slate-800 space-y-3">
              <div className="font-bold text-sm text-slate-200">
                1. Desistir de uma Edição Específica
              </div>
              <p className="text-xs text-slate-400">
                Se você não puder comparecer a uma data da feira, selecione-a abaixo para cancelar sua participação com aviso prévio, evitando cobranças indevidas de ausência.
              </p>

              <div className="space-y-2">
                {historico.map(({ feira, registro }) => (
                  <div
                    key={feira.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#141728] border border-slate-800 text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-amber-300">
                        {formatDateFull(feira.data)}
                      </span>{' '}
                      <span className="text-slate-300 font-sans">· {feira.nome}</span>
                      {registro?.statusPresenca === 'desistente' && (
                        <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-purple-900/60 text-purple-300">
                          Desistência Registrada
                        </span>
                      )}
                    </div>

                    {registro?.statusPresenca !== 'desistente' && (
                      <button
                        onClick={() => setConfirmarDesistenciaFeira(feira)}
                        className="px-2.5 py-1 text-[11px] font-bold rounded bg-rose-950/60 text-rose-300 border border-rose-800/40 hover:bg-rose-900/60 transition-colors"
                      >
                        Desistir desta Data
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Opção 2: Desligamento geral da barraca */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-3">
              <div className="font-bold text-sm text-rose-300 flex items-center gap-1.5">
                <LogOut className="w-4 h-4" /> 2. Solicitar Saída / Desligamento da Feira da Lua
              </div>
              <p className="text-xs text-slate-400">
                Caso deseje encerrar definitivamente suas atividades na Feira da Lua e liberar o ponto da barraca para a organização, clique abaixo.
              </p>

              <button
                type="button"
                onClick={() => setConfirmarDesligamento(true)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                Solicitar Saída da Feira
              </button>
            </div>
          </div>

          {/* Modal confirmação de desistência da feira específica */}
          {confirmarDesistenciaFeira && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md p-6 rounded-2xl bg-[#131522] border border-slate-800 text-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-white">
                  Confirmar Desistência da Edição {formatDateFull(confirmarDesistenciaFeira.data)}?
                </h3>
                <p className="text-xs text-slate-400">
                  Ao desistir formalmente, a organização será avisada e a cobrança da taxa para esta data será cancelada.
                </p>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Motivo da Desistência (Opcional):
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Viagem, problema de saúde, chuva..."
                    value={motivoDesistencia}
                    onChange={(e) => setMotivoDesistencia(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0d0f19] border border-slate-700 text-xs text-slate-100 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setConfirmarDesistenciaFeira(null)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleConfirmarDesistencia}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white"
                  >
                    Confirmar Desistência
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal confirmação de saída total */}
          {confirmarDesligamento && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md p-6 rounded-2xl bg-[#131522] border border-rose-800/80 text-slate-100 space-y-4">
                <h3 className="text-base font-bold text-rose-400">
                  Confirmar Encerramento e Saída da Feira?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Esta ação alterará a sua barraca para o status de <strong>Inativa</strong>. Nenhuma nova taxa diária será lançada para você. Você poderá reativar seu cadastro no futuro entrando em contato com a organização.
                </p>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setConfirmarDesligamento(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmarDesligamentoTotal}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white"
                  >
                    Sim, Encerrar Participação
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
