# 🧪 10 - Testes Automatizados (Vitest)
> Setup de testes do projeto, o que está coberto hoje e como estender a suíte.

---

## 📌 Por que Vitest

O projeto já usa Vite como bundler, e o Vitest é a ferramenta de testes nativa do ecossistema Vite: reaproveita a mesma configuração (`vite.config.ts`), roda em milissegundos e tem API compatível com Jest (`describe`, `it`, `expect`, `vi.mock`), então não exige aprender uma ferramenta nova. Junto dele vêm `@testing-library/react` (renderiza componentes e testa pelo que o usuário vê/clica, não por detalhes de implementação) e `@testing-library/jest-dom` (matchers como `toBeInTheDocument`).

---

## ⚙️ Configuração

- `vite.config.ts` tem um bloco `test` com `environment: 'jsdom'` (simula um DOM de navegador em Node), `globals: true` (habilita limpeza automática do DOM entre testes via `@testing-library/react`, essencial para não vazar elementos de um teste pro outro) e `setupFiles` apontando para `src/test/setup.ts`.
- `src/test/setup.ts` importa `@testing-library/jest-dom/vitest`, habilitando os matchers extras globalmente.
- Scripts: `npm run test` (roda uma vez, usado em CI/antes de commit) e `npm run test:watch` (modo observador para desenvolvimento).
- Arquivos de teste ficam ao lado do código que testam, com sufixo `.test.ts`/`.test.tsx` (convenção padrão do Vitest, não precisa de configuração extra de path).

---

## 🎯 O que está coberto hoje

A cobertura inicial focou nas partes com maior risco de regressão silenciosa — lógica que não aparece quebrada visualmente até alguém notar meses depois:

| Arquivo de teste | O que valida |
|---|---|
| `src/utils/geometry.test.ts` | `findClosestPointIndex` (usado pra achar o vértice de junção entre as divisórias Norte/Oeste/Leste e pro "snap" magnético) e `getNextInRotation` (avanço cíclico do Modo TV entre as regiões). |
| `src/services/weatherService.test.ts` | `parseWmoCode` — mapeamento de cada faixa de código WMO do Open-Meteo pro ícone/texto em português exibido na UI. |
| `src/services/mapConfigService.test.ts` | Comportamento de fallback quando o Supabase não está configurado (mock de `./supabase`): `loadDividers` cai pros valores padrão/localStorage, `saveDividers` grava local e não quebra mesmo sem nuvem. |
| `src/components/RegionSelector/RegionSelector.test.tsx` | O gate de autenticação: o botão de editar divisas (✂️) fica ausente do DOM quando `isAuthenticated={false}` e aparece (e funciona) quando `isAuthenticated={true}` — teste de regressão direto pra correção de segurança feita em [[09 - Autenticação e Controle de Acesso]]. |

Note que `findClosestPointIndex` e `getNextInRotation` foram **extraídos** de dentro de `RegionMap.tsx`/`App.tsx` para `src/utils/geometry.ts` especificamente para virarem testáveis como funções puras — antes viviam embutidos em `useMemo`/`useCallback` dentro dos componentes, sem como testar isoladamente sem renderizar o mapa inteiro.

---

## 🚧 O que ainda não está coberto (próximos candidatos)

- **Construção dos paths SVG das divisórias** (`mtPaths`/`paPaths` em `RegionMap.tsx`) — ainda embutida no componente; testar exigiria ou extrair a lógica de montagem de string `d=` pra uma função pura, ou testar via render + inspeção do DOM.
- **Fluxo de login completo** (`authService.ts` + `LoginModal.tsx`) — hoje só o efeito colateral (esconder/mostrar botões) é testado; o `signIn` em si não tem teste porque depende do client real do Supabase.
- **App.tsx como um todo** — não tem teste de integração porque monta várias assinaturas (Supabase Realtime, timers, fetch de clima) que exigiriam mocks extensos; os pedaços de lógica que valiam a pena foram extraídos e testados isoladamente em vez disso.

---

*Voltar para o [[00 - Visão Geral do Projeto|Índice Geral]]*
