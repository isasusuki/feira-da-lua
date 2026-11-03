import React, { useState } from 'react';
import { RELATIONAL_TABLES, SQL_DDL_SCRIPT } from '../../data/relationalSchema';
import { X, Copy, Check, Database, Table, Key, Code } from 'lucide-react';

interface ModalSqlSchemaProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalSqlSchema: React.FC<ModalSqlSchemaProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'tables' | 'sql'>('tables');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_DDL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#121420] border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#161928]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Estrutura do Banco de Dados Relacional
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  PostgreSQL / MySQL
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Tabelas: usuarios, feirantes, feiras, presencas_pagamentos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-[#0e101a] border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tables')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'tables'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Table className="w-4 h-4" />
              Visão Esquema das Tabelas
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'sql'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Code className="w-4 h-4" />
              Script DDL SQL Completo
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiado com sucesso!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-300" />
                <span>Copiar Script SQL</span>
              </>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'tables' ? (
            <div className="space-y-6">
              {RELATIONAL_TABLES.map((table) => (
                <div
                  key={table.name}
                  className="rounded-lg border border-slate-800 bg-[#0d0f18] overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 bg-[#171a29] border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {table.name}
                      </span>
                      <span className="text-xs text-slate-400">· {table.description}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                      {table.columns.length} colunas
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 bg-[#121422]">
                          <th className="py-2 px-3 font-semibold w-1/4">Coluna</th>
                          <th className="py-2 px-3 font-semibold w-1/5">Tipo</th>
                          <th className="py-2 px-3 font-semibold w-1/4">Restrições / Chaves</th>
                          <th className="py-2 px-3 font-semibold">Descrição</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono-numbers">
                        {table.columns.map((col) => {
                          const isPk = col.constraints.includes('PRIMARY KEY');
                          const isFk = col.constraints.includes('REFERENCES');
                          return (
                            <tr key={col.name} className="hover:bg-slate-800/30 transition-colors">
                              <td className="py-2 px-3 font-mono font-semibold text-slate-200 flex items-center gap-1.5">
                                {isPk && <Key className="w-3 h-3 text-amber-400" />}
                                {col.name}
                              </td>
                              <td className="py-2 px-3 text-cyan-400 font-mono">{col.type}</td>
                              <td className="py-2 px-3 text-slate-300 font-mono text-[11px]">
                                <span
                                  className={
                                    isPk
                                      ? 'text-amber-300'
                                      : isFk
                                      ? 'text-purple-300'
                                      : 'text-slate-400'
                                  }
                                >
                                  {col.constraints}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-slate-400 font-sans">{col.description}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative rounded-lg border border-slate-800 bg-[#090b12] p-4">
              <pre className="font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
                {SQL_DDL_SCRIPT}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#141724] flex items-center justify-between text-xs text-slate-400">
          <div>
            Pronto para migrações no PostgreSQL, MySQL, Supabase, Neon ou Cloud SQL.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
