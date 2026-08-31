# 💻 08 - Guia do Desenvolvedor, Setup e Deploy
> Instruções para configuração de ambiente local, variáveis de ambiente, compilação de produção e deploy.

---

## 🛠️ Pré-requisitos
- **Node.js:** Versão 18.x ou superior (recomendado 20 LTS).
- **Gerenciador de Pacotes:** npm (incluso com o Node.js) ou yarn/pnpm.
- **Git:** Instalado e configurado.
- **Conta no Supabase:** Projeto criado para banco de dados e Realtime.

---

## 🚀 Execução Local (Passo a Passo)

### 1. Clonar o Repositório
```bash
git clone https://github.com/jeanrj987/MapaControl.git
cd MapaControl
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente (`.env`)
Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica-aqui
```

> **Nota:** A aplicação possui valores de fallback embutidos em `src/services/supabase.ts`, permitindo inicialização rápida mesmo sem `.env` configurado localmente.

### 4. Executar em Modo de Desenvolvimento
```bash
npm run dev
```
O servidor de desenvolvimento do Vite iniciará em `http://localhost:5173`.

---

## 📦 Scripts Disponíveis no `package.json`

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento com Hot Module Replacement (HMR). |
| `npm run build` | Executa o verificador de tipos TypeScript (`tsc`) e compila o bundle de produção com o Vite para a pasta `dist/`. |
| `npm run preview` | Serve o bundle compilado da pasta `dist/` localmente para validação pré-deploy. |

---

## 🗄️ Setup do Banco de Dados no Supabase

Para recriar a tabela e as políticas de segurança no seu próprio projeto Supabase:
1. Acesse o **SQL Editor** do seu painel Supabase.
2. Execute o conteúdo do arquivo `supabase/schema.sql`:

```sql
-- Criar a tabela de configurações
CREATE TABLE IF NOT EXISTS public.mapa_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ativar RLS
ALTER TABLE public.mapa_config ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público
CREATE POLICY "Permitir leitura pública mapa_config"
  ON public.mapa_config FOR SELECT USING (true);

CREATE POLICY "Permitir atualização pública mapa_config"
  ON public.mapa_config FOR ALL USING (true) WITH CHECK (true);

-- Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.mapa_config;
```

---

## 🌐 Deploy em Produção (Vercel / Netlify / VPS)

### Opção 1: Deploy na Vercel (Recomendado)
O projeto já conta com o arquivo de configuração `vercel.json` configurado para Single Page Applications (SPA):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
1. Importe o repositório GitHub na plataforma Vercel.
2. Configure as variáveis de ambiente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
3. O build será automático via comando `npm run build` com saída em `dist`.

---

## ➕ Como Adicionar Novas Cidades ou Alterar Equipes

1. **Adicionar/Alterar Município:**
   - Abra `src/data/cidadesExcel.ts` e insira o objeto com `id`, `name`, `uf`, `lat`, `lon`, `regionId`, `consultor`, `comercial`.
   - Adicione o nome da cidade no array correspondente do estado em `src/data/regions.ts` (`REGIONS_DATA`).
2. **Alterar Membros da Equipe:**
   - Abra `src/data/regions.ts` e edite os campos `consultor`, `comercial` ou `atendentes` da respectiva região.

---

*Voltar para o [[00 - Visão Geral do Projeto|Índice Geral]]*
