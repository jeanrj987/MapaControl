-- =========================================================================
-- TABELA DE CONFIGURAÇÕES DO MAPA COMERCIAL (DIVISAS E TEMPOS DA TV)
-- Execute este script no SQL Editor do seu projeto no Supabase:
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.mapa_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.mapa_config ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública para que a TV e os navegadores possam ler as divisas
CREATE POLICY "Permitir leitura pública mapa_config"
  ON public.mapa_config
  FOR SELECT
  USING (true);

-- Permitir gravação/atualização apenas para usuários autenticados (login restrito).
-- Contas são criadas manualmente em Authentication > Users; não há tela de cadastro no app.
-- Ver Vault/09 - Autenticação e Controle de Acesso.md para o fluxo completo.
CREATE POLICY "Permitir escrita apenas para autenticados"
  ON public.mapa_config
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Habilitar Realtime para a tabela mapa_config
ALTER PUBLICATION supabase_realtime ADD TABLE public.mapa_config;
