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

-- Permitir gravação/atualização para salvar novas divisas e tempos
CREATE POLICY "Permitir atualização pública mapa_config"
  ON public.mapa_config
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Habilitar Realtime para a tabela mapa_config
ALTER PUBLICATION supabase_realtime ADD TABLE public.mapa_config;
