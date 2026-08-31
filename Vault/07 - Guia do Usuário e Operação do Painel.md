# 🖥️ 07 - Guia do Usuário e Operação do Painel
> Manual prático passo a passo para consultores, gestores comerciais e operadores do painel.

---

## 🎯 Controles e Elementos da Interface

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [Logo ControlSoft]   [Modo TV: ON/OFF] [⚙️ Tempos TV] [✂️ Divisas] [☁️ Nuvem]  │
│  [Norte MT/PA/RR]   [Leste MT/GO/TO]   [Oeste MT/RO/AC]   [Sorriso]   [Todas]  │
├──────────────────────────────────────┬─────────────────────────────────────────┤
│                                      │  NORTE MT A PA/RR  ☀️ 32°C (A. Floresta)│
│                                      │  Consultor: Wanderson • Comercial: Sid. │
│                                      │  Atendentes: Jéssica e Marcos           │
│             MAPA SVG                 │ ─────────────────────────────────────── │
│        INTERATIVO DO BRASIL          │  MATO GROSSO (15 cid.)                  │
│       E MATO GROSSO COM              │  • Alta Floresta ☀️ 32°                 │
│         DIVISAS REAIS                │  • Guarantã do Norte ⛅ 30°             │
│                                      │  PARÁ (9 cid.) • RORAIMA (2 cid.)       │
└──────────────────────────────────────┴─────────────────────────────────────────┘
```

---

## 🧭 Como Utilizar o Painel no Dia a Dia

### 1. Navegação Entre Regiões
- Clique nos botões coloridos no topo da tela ou diretamente sobre os territórios no mapa.
- A região selecionada ganha destaque visual imediato com brilho neon (*glow*) e borda ativa.
- O painel lateral direito carrega automaticamente os nomes dos consultores, comerciais, atendentes e a lista completa de cidades agrupadas por estado.

### 2. Destaque de Cidades no Mapa
- Ao clicar no nome de qualquer cidade na lista lateral direita:
  - O ponto geográfico exato da cidade no mapa pulsa e se destaca com anel azul celeste (`📍 No Mapa`).
  - O cursor do mapa foca na localização precisa do município.
  - Para remover o destaque, basta clicar novamente na cidade selecionada.

### 3. Configurar os Tempos do Modo TV
1. Clique no botão **⚙️ Configurações** (ou ícone de engrenagem) no cabeçalho.
2. O modal de tempos será aberto exibindo os sliders/campos numéricos para cada região:
   - *Tempo Norte (segundos)*
   - *Tempo Leste (segundos)*
   - *Tempo Oeste (segundos)*
   - *Tempo Sorriso (segundos)*
   - *Tempo Visão Geral (segundos)*
3. Ajuste os segundos desejados (ex.: 20s para o Leste que tem mais cidades) e clique em **Salvar na Nuvem**.
4. Imediatamente todas as TVs da empresa sincronizarão o novo ciclo.

### 4. Ajustar as Divisas Territoriais do MT (✂️)
1. Clique no botão com ícone de tesoura **✂️** no cabeçalho.
2. O mapa entrará no **Modo Editor de Divisas**:
   - **Mover Ponto:** Clique sobre uma bolinha numerada e arraste para o local desejado.
   - **Inserir Ponto:** Ative o botão `➕ Inserir` no painel de ferramentas e clique sobre a linha para adicionar uma nova curva.
   - **Excluir Ponto:** Ative o botão `🗑️ Excluir` e clique sobre o nó que deseja remover.
3. Ao finalizar, clique no botão verde **✓ Concluir**. As coordenadas serão salvas no Supabase e transmitidas a todos os usuários.

---

## 💡 Dicas para Exibição em Telas de TV

- **Modo Tela Cheia:** Pressione `F11` no teclado do computador/mini-PC conectado à TV para ocultar as barras de navegação do browser.
- **Resolução Ideal:** O design é otimizado com fontes dimensionadas em `clamp()` para funcionar perfeitamente em 1080p (Full HD) e 4K (Ultra HD).
- **Sem Barra de Rolagem:** A interface possui regras globais CSS que suprimem qualquer scrollbar, garantindo uma estética 100% limpa de dashboard profissional.

---

*Voltar para o [[00 - Visão Geral do Projeto|Índice Geral]]*
