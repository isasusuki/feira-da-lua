export type UserRole = 'admin' | 'feirante';

export interface User {
  id: string;
  name: string;
  email: string;
  senha: string;
  role: UserRole;
  feiranteId?: string; // associado se for feirante
  avatar?: string;
}

export interface Feira {
  id: string;
  nome: string;
  data: string; // formato YYYY-MM-DD
  local: string;
  taxaPadrao: number; // ex: 55.00
  status: 'agendada' | 'em_andamento' | 'encerrada';
  observacoes?: string;
}

export interface Feirante {
  id: string;
  nome: string;
  responsavel: string;
  segmento: string; // ex: Gastronomia, Artesanato, Moda & Vestuário, Doces & Confeitaria, Bebidas Artesanais, Acessórios
  numeroBarraca: string; // ex: B-12
  telefone: string; // ex: (11) 98765-4321
  email: string;
  pixChave: string;
  status: 'ativo' | 'inativo';
  dataCadastro: string;
}

export type PresencaStatus = 'presente' | 'ausente' | 'falta_justificada' | 'atestado' | 'desistente';
export type PagamentoStatus = 'pago' | 'pendente' | 'cancelado' | 'isento';
export type FormaPagamento = 'dinheiro' | 'pix' | 'cartao' | 'isento';

export interface DespesaFeirante {
  id: string;
  feiranteId: string;
  feiraId?: string; // associada a uma feira específica
  data: string;
  descricao: string;
  categoria: 'insumos' | 'transporte' | 'embalagens' | 'pessoal' | 'energia_gelo' | 'taxa_feira' | 'outros';
  valor: number;
  formaPagamento: 'dinheiro' | 'cartao' | 'pix';
  criadoEm: string;
}

export interface PresencaPagamento {
  id: string;
  feiraId: string;
  feiranteId: string;
  statusPresenca: PresencaStatus;
  statusPagamento: PagamentoStatus;
  valorCobrado: number;
  valorPago: number;
  formaPagamento?: FormaPagamento;
  dataPagamento?: string;
  comprovantePix?: string;
  observacao?: string;
  dataRegistro: string;
}

export interface PendenteCobranca {
  id: string; // id do registro de presenca_pagamento
  feiraId: string;
  feiraNome: string;
  feiraData: string;
  feiranteId: string;
  feiranteNome: string;
  feiranteResponsavel: string;
  feiranteBarraca: string;
  feiranteContato: string;
  feirantePix: string;
  statusPresenca: PresencaStatus;
  valorDevido: number;
  diasAtraso: number;
}
