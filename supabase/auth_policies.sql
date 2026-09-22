-- =========================================================================
-- RESTRINGE ESCRITA NA TABELA mapa_config A USUÁRIOS AUTENTICADOS
-- Execute este script no SQL Editor do seu projeto no Supabase, DEPOIS de:
--   1. Criar as contas de acesso em Authentication > Users > Add user
--      (uma para você, uma para sua gestora).
--   2. Desativar "Allow new users to sign up" em Authentication > Providers > Email,
--      para que ninguém além dessas contas consiga se cadastrar.
-- =========================================================================

-- Remove a política antiga que permitia escrita pública (qualquer visitante do site)
DROP POLICY IF EXISTS "Permitir atualização pública mapa_config" ON public.mapa_config;

-- Nova política: apenas usuários autenticados (logados via Supabase Auth) podem
-- inserir, atualizar ou apagar linhas. A leitura pública (SELECT) continua liberada,
-- pois a TV e qualquer navegador precisam visualizar o mapa sem login.
CREATE POLICY "Permitir escrita apenas para autenticados"
  ON public.mapa_config
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
