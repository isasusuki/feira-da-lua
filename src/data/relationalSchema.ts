/**
 * Estrutura do Banco de Dados Relacional - Feira da Lua
 * Tabelas: usuarios, feirantes, feiras, presencas_pagamentos
 */

export interface TableColumnDef {
  name: string;
  type: string;
  constraints: string;
  description: string;
}

export interface TableDef {
  name: string;
  description: string;
  columns: TableColumnDef[];
}

export const RELATIONAL_TABLES: TableDef[] = [
  {
    name: 'usuarios',
    description: 'Armazena as contas de acesso ao sistema com controle de nível (Administrador / Feirante)',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()', description: 'Identificador único do usuário' },
      { name: 'nome', type: 'VARCHAR(150)', constraints: 'NOT NULL', description: 'Nome completo do usuário' },
      { name: 'email', type: 'VARCHAR(255)', constraints: 'NOT NULL UNIQUE', description: 'E-mail para login no sistema' },
      { name: 'senha_hash', type: 'VARCHAR(255)', constraints: 'NOT NULL', description: 'Hash criptografado da senha (ex: bcrypt/argon2)' },
      { name: 'nivel_acesso', type: 'VARCHAR(20)', constraints: 'NOT NULL CHECK (nivel_acesso IN (\'admin\', \'feirante\'))', description: 'Nível de privilégio no sistema' },
      { name: 'feirante_id', type: 'UUID', constraints: 'REFERENCES feirantes(id) ON DELETE SET NULL', description: 'Vínculo opcional com a barraca caso o nível seja feirante' },
      { name: 'ativo', type: 'BOOLEAN', constraints: 'DEFAULT TRUE NOT NULL', description: 'Indica se o login está liberado' },
      { name: 'criado_em', type: 'TIMESTAMPTZ', constraints: 'DEFAULT CURRENT_TIMESTAMP', description: 'Data de cadastro do usuário' },
      { name: 'atualizado_em', type: 'TIMESTAMPTZ', constraints: 'DEFAULT CURRENT_TIMESTAMP', description: 'Última modificação no registro' },
    ],
  },
  {
    name: 'feirantes',
    description: 'Cadastro dos expositores cadastrados na Feira da Lua, suas barracas e contatos',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()', description: 'Identificador único do expositor' },
      { name: 'nome_fantasia', type: 'VARCHAR(150)', constraints: 'NOT NULL', description: 'Nome comercial da barraca (ex: Doces da Vovó)' },
      { name: 'responsavel', type: 'VARCHAR(150)', constraints: 'NOT NULL', description: 'Nome da pessoa responsável pelo ponto' },
      { name: 'segmento', type: 'VARCHAR(80)', constraints: 'NOT NULL', description: 'Categoria comercial (Gastronomia, Artesanato, Moda, etc.)' },
      { name: 'numero_barraca', type: 'VARCHAR(20)', constraints: 'NOT NULL', description: 'Número ou código do espaço alocado (ex: B-08)' },
      { name: 'telefone', type: 'VARCHAR(25)', constraints: 'NOT NULL', description: 'Telefone e WhatsApp para contato e cobrança' },
      { name: 'chave_pix', type: 'VARCHAR(150)', constraints: 'NULL', description: 'Chave Pix cadastrada do feirante' },
      { name: 'status', type: 'VARCHAR(20)', constraints: 'NOT NULL DEFAULT \'ativo\' CHECK (status IN (\'ativo\', \'inativo\'))', description: 'Situação cadastral do feirante' },
      { name: 'criado_em', type: 'TIMESTAMPTZ', constraints: 'DEFAULT CURRENT_TIMESTAMP', description: 'Data de cadastro do feirante' },
    ],
  },
  {
    name: 'feiras',
    description: 'Registro de cada edição da Feira da Lua (datas, locais e taxa base da barraca)',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()', description: 'Identificador único da edição' },
      { name: 'nome', type: 'VARCHAR(120)', constraints: 'NOT NULL', description: 'Identificação da feira (ex: Edição Noturna Primavera)' },
      { name: 'data_realizacao', type: 'DATE', constraints: 'NOT NULL UNIQUE', description: 'Data em que a feira acontece' },
      { name: 'local', type: 'VARCHAR(200)', constraints: 'NOT NULL', description: 'Praça ou endereço da edição' },
      { name: 'taxa_padrao', type: 'NUMERIC(10, 2)', constraints: 'NOT NULL DEFAULT 55.00', description: 'Taxa diária cobrada de cada feirante (R$)' },
      { name: 'status', type: 'VARCHAR(20)', constraints: 'NOT NULL DEFAULT \'agendada\' CHECK (status IN (\'agendada\', \'em_andamento\', \'encerrada\'))', description: 'Situação operacional da feira' },
      { name: 'observacoes', type: 'TEXT', constraints: 'NULL', description: 'Notas sobre clima, atrações ou avisos' },
      { name: 'criado_em', type: 'TIMESTAMPTZ', constraints: 'DEFAULT CURRENT_TIMESTAMP', description: 'Data de criação do registro' },
    ],
  },
  {
    name: 'presencas_pagamentos',
    description: 'Tabela de ligação cruzada: rastreia presença física e status financeiro por feirante em cada edição',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()', description: 'Identificador único do lançamento' },
      { name: 'feira_id', type: 'UUID', constraints: 'NOT NULL REFERENCES feiras(id) ON DELETE CASCADE', description: 'Referência à feira específica' },
      { name: 'feirante_id', type: 'UUID', constraints: 'NOT NULL REFERENCES feirantes(id) ON DELETE CASCADE', description: 'Referência ao feirante participante' },
      { name: 'status_presenca', type: 'VARCHAR(25)', constraints: 'NOT NULL DEFAULT \'presente\' CHECK (status_presenca IN (\'presente\', \'ausente\', \'falta_justificada\', \'atestado\'))', description: 'Situação de presença na data' },
      { name: 'status_pagamento', type: 'VARCHAR(20)', constraints: 'NOT NULL DEFAULT \'pendente\' CHECK (status_pagamento IN (\'pago\', \'pendente\', \'cancelado\', \'isento\'))', description: 'Situação financeira da taxa diária' },
      { name: 'valor_cobrado', type: 'NUMERIC(10, 2)', constraints: 'NOT NULL DEFAULT 0.00', description: 'Valor estipulado da taxa diária' },
      { name: 'valor_pago', type: 'NUMERIC(10, 2)', constraints: 'NOT NULL DEFAULT 0.00', description: 'Valor efetivamente liquidado pelo feirante' },
      { name: 'forma_pagamento', type: 'VARCHAR(20)', constraints: 'NULL CHECK (forma_pagamento IN (\'dinheiro\', \'pix\', \'isento\'))', description: 'Método utilizado na quitação' },
      { name: 'data_pagamento', type: 'TIMESTAMPTZ', constraints: 'NULL', description: 'Data e hora do recebimento do valor' },
      { name: 'comprovante_pix', type: 'VARCHAR(255)', constraints: 'NULL', description: 'Código de autenticação ou chave E2E do Pix' },
      { name: 'observacao', type: 'TEXT', constraints: 'NULL', description: 'Anotações do organizador sobre o pagamento/presença' },
      { name: 'criado_em', type: 'TIMESTAMPTZ', constraints: 'DEFAULT CURRENT_TIMESTAMP', description: 'Data de geração da entrada' },
    ],
  },
];

export const SQL_DDL_SCRIPT = `-- ============================================================================
-- BANCO DE DADOS RELACIONAL: FEIRA DA LUA
-- Dialeto: PostgreSQL (compatível com MySQL 8+ com pequenas adaptações de tipo)
-- ============================================================================

-- Habilitar extensão para geração de UUID (se PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. TABELA DE FEIRANTES (Expositores)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS feirantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_fantasia VARCHAR(150) NOT NULL,
    responsavel VARCHAR(150) NOT NULL,
    segmento VARCHAR(80) NOT NULL,
    numero_barraca VARCHAR(20) NOT NULL,
    telefone VARCHAR(25) NOT NULL,
    chave_pix VARCHAR(150),
    status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. TABELA DE USUÁRIOS (Controle de Acesso e Autenticação)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    nivel_acesso VARCHAR(20) NOT NULL CHECK (nivel_acesso IN ('admin', 'feirante')),
    feirante_id UUID REFERENCES feirantes(id) ON DELETE SET NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. TABELA DE FEIRAS (Edições e Datas)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS feiras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(120) NOT NULL,
    data_realizacao DATE NOT NULL UNIQUE,
    local VARCHAR(200) NOT NULL,
    taxa_padrao NUMERIC(10, 2) NOT NULL DEFAULT 55.00,
    status VARCHAR(20) NOT NULL DEFAULT 'agendada' CHECK (status IN ('agendada', 'em_andamento', 'encerrada')),
    observacoes TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 4. TABELA DE PRESENÇAS E PAGAMENTOS (Matriz Cruzada Diária)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS presencas_pagamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feira_id UUID NOT NULL REFERENCES feiras(id) ON DELETE CASCADE,
    feirante_id UUID NOT NULL REFERENCES feirantes(id) ON DELETE CASCADE,
    status_presenca VARCHAR(25) NOT NULL DEFAULT 'presente' 
        CHECK (status_presenca IN ('presente', 'ausente', 'falta_justificada', 'atestado')),
    status_pagamento VARCHAR(20) NOT NULL DEFAULT 'pendente' 
        CHECK (status_pagamento IN ('pago', 'pendente', 'cancelado', 'isento')),
    valor_cobrado NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    valor_pago NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    forma_pagamento VARCHAR(20) 
        CHECK (forma_pagamento IN ('dinheiro', 'pix', 'isento')),
    data_pagamento TIMESTAMP WITH TIME ZONE,
    comprovante_pix VARCHAR(255),
    observacao TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Garante apenas 1 registro por feirante por edição da feira
    CONSTRAINT uk_feira_feirante UNIQUE (feira_id, feirante_id)
);

-- ----------------------------------------------------------------------------
-- ÍNDICES PARA OTIMIZAÇÃO DE CONSULTAS E RELATÓRIOS
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_presencas_pag_feira ON presencas_pagamentos(feira_id);
CREATE INDEX IF NOT EXISTS idx_presencas_pag_feirante ON presencas_pagamentos(feirante_id);
CREATE INDEX IF NOT EXISTS idx_presencas_pag_status ON presencas_pagamentos(status_pagamento);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_feiras_data ON feiras(data_realizacao DESC);

-- ----------------------------------------------------------------------------
-- VIEW PARA O DASHBOARD DO ADMINISTRADOR: RELATÓRIO GERAL FINANCEIRO
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_relatorio_geral_feiras AS
SELECT 
    COUNT(DISTINCT f.id) AS total_feiras,
    COALESCE(SUM(CASE WHEN pp.forma_pagamento = 'dinheiro' AND pp.status_pagamento = 'pago' THEN pp.valor_pago ELSE 0 END), 0.00) AS total_dinheiro_liquido,
    COALESCE(SUM(CASE WHEN pp.forma_pagamento = 'pix' AND pp.status_pagamento = 'pago' THEN pp.valor_pago ELSE 0 END), 0.00) AS total_pix_liquido,
    COALESCE(SUM(CASE WHEN pp.status_pagamento = 'pago' THEN pp.valor_pago ELSE 0 END), 0.00) AS saldo_liquido_geral,
    COALESCE(SUM(CASE WHEN pp.status_pagamento = 'pendente' THEN pp.valor_cobrado ELSE 0 END), 0.00) AS total_pendente_cobranca
FROM feiras f
LEFT JOIN presencas_pagamentos pp ON f.id = pp.feira_id;

-- ----------------------------------------------------------------------------
-- VIEW PARA RELATÓRIO DE PENDENTES PARA COBRANÇA
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_relatorio_pendentes AS
SELECT 
    pp.id AS presenca_id,
    f.data_realizacao AS data_feira,
    f.nome AS nome_feira,
    ft.nome_fantasia AS nome_feirante,
    ft.responsavel,
    ft.telefone AS contato,
    ft.numero_barraca,
    pp.status_presenca,
    (pp.valor_cobrado - pp.valor_pago) AS valor_pendente
FROM presencas_pagamentos pp
JOIN feiras f ON pp.feira_id = f.id
JOIN feirantes ft ON pp.feirante_id = ft.id
WHERE pp.status_pagamento = 'pendente' AND (pp.valor_cobrado - pp.valor_pago) > 0
ORDER BY f.data_realizacao DESC, ft.nome_fantasia ASC;
`;
