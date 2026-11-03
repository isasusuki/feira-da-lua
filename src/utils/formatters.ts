export const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(val || 0);
};

export const formatDateShort = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    // parts[2] = dia, parts[1] = mes
    return `${parts[2]}/${parts[1]}`;
  }
  return dateStr;
};

export const formatDateFull = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

export const getStatusPresencaBadge = (status: string) => {
  switch (status) {
    case 'presente':
      return {
        label: 'Presente',
        bg: 'bg-emerald-950/60',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
      };
    case 'ausente':
      return {
        label: 'Ausente',
        bg: 'bg-rose-950/60',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
      };
    case 'falta_justificada':
      return {
        label: 'Justificada',
        bg: 'bg-amber-950/60',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
      };
    case 'atestado':
      return {
        label: 'Atestado',
        bg: 'bg-sky-950/60',
        text: 'text-sky-400',
        border: 'border-sky-500/30',
      };
    case 'desistente':
      return {
        label: 'Desistente',
        bg: 'bg-purple-950/60',
        text: 'text-purple-300',
        border: 'border-purple-500/30',
      };
    default:
      return {
        label: status || 'Indefinido',
        bg: 'bg-slate-900',
        text: 'text-slate-400',
        border: 'border-slate-700',
      };
  }
};

export const getStatusPagamentoBadge = (status: string, forma?: string, valor?: number) => {
  switch (status) {
    case 'pago': {
      let formaLabel = 'Pago';
      if (forma === 'pix') formaLabel = 'Pago (Pix)';
      else if (forma === 'cartao') formaLabel = 'Pago (Cartão)';
      else if (forma === 'dinheiro') formaLabel = 'Pago (Dinheiro)';
      return {
        label: formaLabel,
        bg: 'bg-emerald-950/40 hover:bg-emerald-950/70',
        text: 'text-emerald-300 font-semibold',
        border: 'border-emerald-500/40',
        valorText: valor !== undefined ? formatCurrency(valor) : '',
      };
    }
    case 'pendente':
      return {
        label: 'Pendente',
        bg: 'bg-amber-950/40 hover:bg-amber-950/70',
        text: 'text-amber-300 font-semibold',
        border: 'border-amber-500/40',
        valorText: valor !== undefined ? formatCurrency(valor) : '',
      };
    case 'atestado':
      return {
        label: 'Atestado',
        bg: 'bg-sky-950/40 hover:bg-sky-950/70',
        text: 'text-sky-300 font-semibold',
        border: 'border-sky-500/40',
        valorText: 'Isento',
      };
    case 'cancelado':
      return {
        label: 'Cancelado',
        bg: 'bg-rose-950/40 hover:bg-rose-950/70',
        text: 'text-rose-400 font-medium',
        border: 'border-rose-500/30',
        valorText: 'Cancelado',
      };
    case 'isento':
      return {
        label: 'Isento',
        bg: 'bg-slate-900/60 hover:bg-slate-800',
        text: 'text-slate-300',
        border: 'border-slate-700',
        valorText: 'R$ 0,00',
      };
    default:
      return {
        label: '-',
        bg: 'bg-slate-900/20 hover:bg-slate-800/40',
        text: 'text-slate-500',
        border: 'border-slate-800',
        valorText: '-',
      };
  }
};

export const createWhatsAppBillingUrl = (
  phone: string,
  feiranteNome: string,
  dataFeira: string,
  valor: number,
  chavePix: string
) => {
  // Limpar telefone deixando apenas digitos
  const cleanPhone = phone.replace(/\D/g, '');
  const internationalPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  
  const mensagem = `Olá, ${feiranteNome}! Tudo bem? 🌙\n\nAqui é da organização da *Feira da Lua*.\n\nConstatamos a pendência da taxa da feira realizada em *${formatDateFull(dataFeira)}*, no valor de *${formatCurrency(valor)}*.\n\nVocê pode quitar diretamente via Pix:\n🔑 *Chave Pix:* ${chavePix}\n\nAssim que efetuar, por gentileza nos envie o comprovante por aqui. Muito obrigado pela parceria! ✨`;

  return `https://wa.me/${internationalPhone}?text=${encodeURIComponent(mensagem)}`;
};
