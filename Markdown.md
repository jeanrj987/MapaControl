DESENVOLVIMENTO DE MAPA COMERCIAL INTERATIVO

1\. PAPEL / PERSONA



Atue como um Desenvolvedor Frontend Sênior / Arquiteto de Software, especialista em:



React;

TypeScript;

SVG;

Vite;

Tailwind CSS;

arquitetura frontend;

componentização;

gerenciamento de estado;

acessibilidade;

UI/UX;

responsividade;

modelagem de dados;

manutenção e evolução de aplicações.



Escreva código real, executável, tipado, modular, legível e preparado para evolução.



Priorize:



Correção funcional.

Fidelidade à referência visual.

Arquitetura limpa.

Acessibilidade.

Responsividade.

Manutenibilidade.

Simplicidade.



Não introduza complexidade desnecessária.



Quando existir mais de uma solução tecnicamente válida, escolha a solução mais simples que atenda aos requisitos e explique brevemente a decisão.



2\. OBJETIVO DA APLICAÇÃO



Criar uma aplicação web para visualizar as regiões de atendimento comercial da empresa, permitindo visualizar as equipes associadas a cada região.



A aplicação terá um mapa visual dividido em:



NORTE;

LESTE;

OESTE;

SORRISO E REGIÃO.



A imagem fornecida pelo usuário representa a referência visual da aplicação.



REGRA FUNDAMENTAL



A imagem é EXCLUSIVAMENTE uma referência visual e estrutural.



Ela:



NÃO é o mapa final;

NÃO deve ser utilizada como <img> para representar o mapa;

NÃO deve ser utilizada como background-image;

NÃO deve ser transformada em uma imagem clicável;

NÃO deve receber hotspots sobrepostos para simular regiões;

NÃO deve ser utilizada como camada interativa;

NÃO deve ser necessária para a aplicação funcionar depois de implementada.



O mapa deve ser reconstruído em SVG.



3\. HIERARQUIA DAS REGIÕES



Existe uma característica importante na referência:



SORRISO E REGIÃO é visualmente apresentada dentro da área do NORTE.



Portanto, trate a estrutura visual da seguinte maneira:



Mapa

├── Norte

│   └── Sorriso e Região

├── Leste

└── Oeste



Isso significa que:



Norte é uma região territorial/base;

Leste é uma região territorial/base;

Oeste é uma região territorial/base;

Sorriso e Região é uma sub-região visual e interativa localizada dentro do Norte.

Importante



Mesmo sendo uma sub-região, Sorriso e Região deve possuir seu próprio ID, seus próprios dados, sua própria geometria SVG e seus próprios eventos de interação.



Portanto, a aplicação deverá possuir 4 entidades de dados interativas, mas respeitando a hierarquia espacial acima.



Não trate Sorriso como uma região geográfica independente fora do Norte.



4\. STACK OBRIGATÓRIA



Utilize obrigatoriamente:



React + TypeScript



Para:



componentes;

estrutura da aplicação;

tipagem;

estado;

lógica de interação.

SVG



Para:



mapa;

regiões;

limites;

marcadores;

elementos interativos.



Cada região deve ser representada como elemento SVG independente, preferencialmente <path> quando apropriado.



Tailwind CSS



Para:



layout;

responsividade;

tipografia;

espaçamento;

estados visuais;

transições;

componentes da interface.



Não utilize CSS puro, CSS Modules ou styled-components.



React State



Utilize o estado nativo do React:



useState;

useMemo;

useCallback;



somente quando necessário.



Não utilize:



Redux;

Zustand;

MobX;

Context global para estados simples;

outros gerenciadores de estado.

Vite



Utilize Vite como ferramenta de criação, desenvolvimento e build.



Leaflet



NÃO utilizar nesta implementação.



Leaflet fica reservado exclusivamente para uma futura evolução caso o projeto passe a trabalhar com:



mapas geográficos reais;

latitude/longitude;

zoom geográfico;

pan;

tiles;

GeoJSON;

OpenStreetMap;

coordenadas reais.



Neste projeto, o mapa é uma representação visual personalizada, portanto SVG é a solução correta.



5\. PROIBIÇÕES ABSOLUTAS



Não utilize:



Leaflet;

Canvas;

Vue;

Angular;

Svelte;

Next.js;

bibliotecas de mapas;

bibliotecas de gráficos;

bibliotecas de UI;

bibliotecas de gerenciamento global de estado;

<img> como mapa;

imagem como background do mapa;

hotspots sobre uma imagem;

DOM manipulation manual desnecessária;

clientes fictícios;

regiões fictícias;

cidades fictícias;

coordenadas geográficas inventadas;

latitude/longitude inventadas;

retângulos genéricos para representar regiões;

pseudocódigo;

componentes monolíticos;

dados de negócio misturados com geometria SVG.



Não instale dependências que não sejam necessárias.



6\. REFERÊNCIA VISUAL



Antes da implementação, analise a imagem fornecida.



Identifique:



regiões;

posição relativa;

limites;

agrupamentos;

proporções;

cores;

textos;

labels;

marcadores;

hierarquia;

espaçamentos;

orientação;

relação entre Norte e Sorriso;

elementos decorativos;

elementos interativos.



A reconstrução deve reproduzir o conceito visual da referência, não simplesmente criar um mapa genérico.



7\. CORES OBRIGATÓRIAS



Utilize exatamente estas cores:



Região	Cor

Norte	#0091FF

Leste	#FF7F27

Oeste	#22B14C

Sorriso e Região	#FFF200

Textos / labels	#000000

Regras



Norte:



\#0091FF



Leste:



\#FF7F27



Oeste:



\#22B14C



Sorriso e Região:



\#FFF200



A região Sorriso deve aparecer visualmente como uma área amarela sobre a região azul do Norte.



Não substitua essas cores por tonalidades aproximadas.



8\. MARCADORES



Caso existam marcadores de localização na referência:



reproduza o conceito visual;

mantenha os marcadores como elementos SVG independentes;

utilize a cor correspondente à região;

não invente marcadores que não estejam presentes ou não tenham sido solicitados.



Não invente localizações geográficas reais.



9\. DADOS REAIS DAS EQUIPES



Estes são dados fornecidos explicitamente pelo usuário.



Utilize-os exatamente como informados.



NORTE



Área:



MT a PA/RR



Equipe:



Consultor: Wanderson

Comercial: Sidnei

Atendentes:

\- Marcos

\- Cauê

LESTE



Área:



MT a TO/GO/MG



Equipe:



Consultor: André

Comercial: Gilberto

Atendentes:

\- Jéssica

\- Samuel

OESTE



Área:



MT a RO/AC



Equipe:



Consultor: André

Comercial: Pablo

Atendentes:

\- Gabriel

\- Jean

SORRISO E REGIÃO



Equipe:



Consultor: Cledinei

Comercial: Sidnei

Atendentes:

\- Amanda

\- Maria

Regra



Esses dados são reais e fornecidos pelo usuário.



Não:



altere nomes;

invente pessoas;

adicione cargos;

remova pessoas;

crie clientes;

altere informações.

10\. MODELAGEM DE DADOS



Separe completamente:



Dados de negócio

&#x20;       ≠

Geometria SVG

&#x20;       ≠

Estado da interface

&#x20;       ≠

Configuração visual



Crie tipos TypeScript adequados.



Exemplo conceitual:



type Pessoa = {

&#x20; nome: string;

};



type Equipe = {

&#x20; consultor: Pessoa;

&#x20; comercial: Pessoa;

&#x20; atendentes: Pessoa\[];

};



type Regiao = {

&#x20; id: string;

&#x20; nome: string;

&#x20; cor: string;

&#x20; equipe: Equipe;

&#x20; tipo: "principal" | "sub-regiao";

&#x20; regiaoPai?: string;

};



A estrutura pode ser adaptada caso exista uma solução melhor, mas deve manter essa separação conceitual.



11\. GEOMETRIA SVG



As geometrias devem ficar separadas dos dados.



Exemplo conceitual:



const geometries = {

&#x20; norte: "...",

&#x20; leste: "...",

&#x20; oeste: "...",

&#x20; sorriso: "..."

};



Cada geometria deve ser associada por ID.



Exemplo:



regiao.id

&#x20;     ↓

geometries\[regiao.id]



Não coloque:



nome da equipe

consultor

comercial

atendentes



dentro da definição geométrica.



12\. QUALIDADE DAS GEOMETRIAS



As regiões devem ser representadas por formas reconhecíveis e visualmente coerentes com a imagem.



É proibido representar as regiões apenas com:



retângulos;

círculos genéricos;

quadrados;

formas abstratas sem relação visual com a referência.



As geometrias não precisam representar fronteiras geográficas reais.



Elas devem ser:



aproximações visuais da composição apresentada na imagem.



Se a imagem não permitir precisão suficiente:



faça uma aproximação visual;

preserve a posição relativa;

preserve o tamanho relativo;

preserve a relação entre as regiões;

preserve a sobreposição de Sorriso dentro do Norte.



Não transforme a aproximação em dado geográfico real.



13\. VIEWBOX E ESCALA



Utilize um viewBox consistente para todo o mapa.



O SVG deve:



manter proporção;

ser escalável;

funcionar em diferentes tamanhos;

não sofrer distorção;

não depender de coordenadas fixas de tela.



Evite definir largura/altura que causem deformação da geometria.



14\. COMPONENTIZAÇÃO



Organize a aplicação em componentes com responsabilidades claras.



Estrutura sugerida:



src/

├── components/

│   ├── Map/

│   │   ├── RegionMap.tsx

│   │   └── Region.tsx

│   │

│   ├── RegionDetails/

│   │   └── RegionDetails.tsx

│   │

│   ├── RegionSelector/

│   │   └── RegionSelector.tsx

│   │

│   └── UI/

│       ├── Header.tsx

│       └── ViewToggle.tsx

│

├── data/

│   ├── regions.ts

│   └── geometries.ts

│

├── types/

│   └── region.ts

│

├── App.tsx

├── main.tsx

└── index.css



Essa estrutura é uma referência.



Você pode alterá-la se houver uma arquitetura melhor, desde que mantenha as responsabilidades separadas.



15\. ESTADOS DA APLICAÇÃO



A aplicação deve possuir dois modos principais.



MODO 1 — VER TODAS



Este é o estado inicial.



Todas as regiões devem:



estar visíveis;

utilizar suas cores;

possuir seus labels;

estar disponíveis para interação.



O painel deve apresentar um resumo geral.



Exemplo:



Todas as regiões



Norte

4 membros



Leste

4 membros



Oeste

4 membros



Sorriso e Região

4 membros



A quantidade deve ser calculada a partir dos dados reais, e não escrita manualmente.



16\. MODO 2 — REGIÃO SELECIONADA



Quando o usuário selecionar uma região:



ela recebe destaque;

as demais ficam visualmente atenuadas;

o painel apresenta os detalhes da equipe;

a região selecionada permanece claramente identificável.



Exemplo conceitual:



Região selecionada:

NORTE



Consultor

Wanderson



Comercial

Sidnei



Atendentes

Marcos

Cauê

17\. HOVER NÃO DEVE SELECIONAR



Por padrão:



hover ≠ selected



Passar o mouse sobre uma região deve apenas alterar o estado visual temporário.



A seleção persistente deve acontecer através de:



clique;

Enter quando a região estiver focada;

seleção pelo componente de regiões.



Não altere a seleção definitiva somente porque o mouse passou sobre a região.



18\. FOCO E TECLADO



Cada região interativa deve poder receber foco.



O usuário deve conseguir:



Tab

&#x20;↓

Região

&#x20;↓

Enter

&#x20;↓

Selecionar



Também considere:



Escape

&#x20;↓

Voltar para "Ver Todas"



quando isso melhorar a experiência.



Cada região deve possuir:



role apropriado

aria-label

tabIndex



O aria-label deve conter informação útil.



Exemplo:



"Norte — Consultor Wanderson, Comercial Sidnei"



Não use somente:



aria-label="região"

19\. ESTADOS VISUAIS



Implemente visualmente:



Normal



Aparência padrão.



Hover



Destaque temporário.



Focus



Indicador de foco claramente visível.



Selected



Destaque persistente.



Dimmed



Regiões não selecionadas no modo selecionado.



A diferenciação não pode depender apenas de cor.



Utilize uma combinação de:



opacidade;

espessura da borda;

contorno;

sombra;

contraste;

indicadores;

transições.

20\. SELETOR DE REGIÕES



Além do mapa, forneça um mecanismo para selecionar uma região diretamente.



Pode ser:



grupo de botões;

lista;

segmented control.



Deve conter:



Ver Todas

Norte

Leste

Oeste

Sorriso e Região



Ao selecionar uma região pelo seletor:



o mapa deve atualizar;

o painel deve atualizar;

o estado do React deve ser sincronizado.



Não crie dois estados independentes que possam ficar inconsistentes.



Deve existir uma única fonte de verdade para a região selecionada.



21\. BOTÃO "VER TODAS"



O botão:



Ver Todas



deve:



limpar a região selecionada;

retornar ao modo geral;

restaurar a opacidade normal;

atualizar o painel;

manter todas as regiões visíveis.



Conceitualmente:



selectedRegionId = null



O modo pode ser derivado desse estado, evitando estados redundantes.



22\. PAINEL LATERAL

Ver Todas



Mostrar:



todas as regiões;

cor;

nome;

quantidade de membros;

resumo das equipes.

Região selecionada



Mostrar:



nome;

cor;

Consultor;

Comercial;

Atendentes;

informações disponíveis.



Não invente informações adicionais.



23\. RESPONSIVIDADE



Desktop:



┌───────────────────────────────────────┐

│ Header                                │

├───────────────────────┬───────────────┤

│                       │               │

│         MAPA          │    PAINEL     │

│                       │               │

│                       │               │

└───────────────────────┴───────────────┘



Mobile:



┌───────────────────────┐

│ Header                │

├───────────────────────┤

│ Seletor               │

├───────────────────────┤

│                       │

│        MAPA           │

│                       │

├───────────────────────┤

│       PAINEL          │

└───────────────────────┘



A composição final pode ser adaptada conforme a melhor solução visual.



O SVG nunca deve ser distorcido.



24\. ACESSIBILIDADE



Implemente:



navegação por teclado;

foco visível;

aria-label;

semântica adequada;

contraste;

estados perceptíveis sem depender exclusivamente de cor;

áreas interativas suficientemente grandes;

feedback visual claro.



A acessibilidade deve fazer parte da implementação, não ser adicionada apenas no final.



25\. DADOS FUTUROS



A arquitetura deve permitir futuramente adicionar clientes.



Exemplo:



type Cliente = {

&#x20; id: string;

&#x20; nome: string;

};



E:



type Regiao = {

&#x20; ...

&#x20; clientes: Cliente\[];

};



Inicialmente:



clientes: \[]



Não crie clientes fictícios.



No futuro, os dados poderão vir de:



JSON;

API;

backend;

banco de dados.



A interface não deve precisar ser reconstruída para essa evolução.



26\. SETUP DO PROJETO



Crie um projeto completo utilizando Vite + React + TypeScript.



Use a configuração de Tailwind CSS compatível com a versão atualmente instalada.



Não presuma que comandos de uma versão antiga do Tailwind continuam válidos.



Antes de fornecer os comandos, determine a configuração correta para a versão escolhida.



O projeto deve possuir comandos claros para:



criação

instalação

desenvolvimento

build



Não misture instruções de Tailwind v3 e v4.



Se a versão atual do Tailwind utilizar uma configuração diferente da configuração clássica:



tailwind.config.js

postcss.config.js



utilize a configuração correta para a versão instalada e explique brevemente a diferença.



27\. IMPLEMENTAÇÃO COMPLETA



Não entregue:



pseudocódigo;

código incompleto;

TODO;

comentários dizendo "implemente aqui";

...;

arquivos omitidos;

componentes fictícios;

imports inexistentes.



Todos os arquivos necessários devem ser fornecidos.



Cada arquivo deve aparecer separadamente:



src/App.tsx



seguido pelo respectivo código.



O projeto deve ser executável após seguir o setup.



28\. VALIDAÇÃO TÉCNICA



Antes de finalizar, verifique:



Build

TypeScript compila;

imports estão corretos;

componentes existem;

caminhos estão corretos;

dependências estão instaladas;

não existem erros de compilação.

React

estado funciona;

seleção funciona;

hover funciona;

foco funciona;

seletor funciona;

"Ver Todas" funciona;

painel acompanha o estado.

SVG

cada região possui ID;

paths são independentes;

Sorriso está dentro do Norte;

geometria não é retangular/genérica;

viewBox está correto;

SVG é responsivo.

Visual

cores exatas;

composição coerente;

labels legíveis;

estados visuais claros;

mapa é o elemento principal.

Acessibilidade

teclado funciona;

foco é visível;

aria-label existe;

estados não dependem apenas de cor.

Arquitetura

dados separados;

geometria separada;

componentes separados;

tipos definidos;

sem estado global desnecessário.

29\. CHECKLIST FINAL OBRIGATÓRIO



Antes de apresentar a resposta final, confirme internamente cada item:



Imagem utilizada somente como referência.



Imagem não utilizada como <img>.



Imagem não utilizada como background.



SVG independente implementado.



Norte possui geometria própria.



Leste possui geometria própria.



Oeste possui geometria própria.



Sorriso possui geometria própria.



Sorriso está visualmente dentro do Norte.



Paths não são retângulos genéricos.



Cores exatas utilizadas.



Dados reais utilizados sem alterações.



Nenhum cliente fictício criado.



Dados separados das geometrias.



Tipos TypeScript definidos.



Hover implementado.



Focus implementado.



Selected implementado.



Dimmed implementado.



Teclado funciona.



Enter seleciona.



Seletor de regiões funciona.



"Ver Todas" funciona.



Estado inicial é "Ver Todas".



Painel geral funciona.



Painel detalhado funciona.



Desktop funciona.



Mobile funciona.



SVG não é distorcido.



Tailwind utilizado.



React State utilizado.



Leaflet não utilizado.



Nenhuma biblioteca desnecessária adicionada.



Código está modular.



Código está tipado.



Não há pseudocódigo.



Não há placeholders.



Não há imports inexistentes.



Projeto está preparado para clientes futuros.



Projeto está preparado para futura integração com API.



Build pode ser executado sem erros.



Se algum item falhar, corrija antes de finalizar.



30\. FORMATO OBRIGATÓRIO DA RESPOSTA



Responda nesta ordem:



1\. Setup do Projeto



Informe:



comandos de criação;

instalação;

configuração;

execução;

build;

arquivos de configuração necessários.



Utilize a configuração correta para a versão atual do Tailwind escolhida.



2\. Análise da Imagem



Informe objetivamente:



regiões;

cores;

posição relativa;

hierarquia;

relação Norte → Sorriso;

elementos visuais;

incertezas.



Não invente informações que não possam ser identificadas.



3\. Estratégia Técnica



Explique resumidamente:



arquitetura React;

SVG;

modelagem de dados;

React State;

Tailwind;

Vite;

acessibilidade;

dois modos de visualização;

motivo de Leaflet não ser utilizado.

4\. Estrutura do Projeto



Apresente a árvore de arquivos.



5\. Implementação



Forneça todos os arquivos necessários, cada um em seu próprio bloco de código, com o caminho claramente identificado.



6\. Execução



Informe exatamente como executar:



npm install

npm run dev



e como gerar o build:



npm run build

7\. Validação



Apresente o checklist final e informe o resultado de cada grupo de validação.



31\. REGRA DE AUTONOMIA



Não interrompa a implementação para pedir confirmação sobre decisões que possam ser resolvidas tecnicamente.



Se houver uma pequena incerteza visual:



escolha a solução mais coerente com a referência;

implemente;

informe a aproximação na seção de análise.



Somente peça esclarecimento se faltar uma informação essencial e impossível de inferir sem inventar dados.



Nunca invente uma informação para evitar uma dúvida.



32\. REGRA DE QUALIDADE FINAL



Não entregue uma aplicação apenas porque ela "parece funcionar".



O resultado deve ser:



Visualmente coerente

&#x20;       +

Tecnicamente correto

&#x20;       +

Interativo

&#x20;       +

Acessível

&#x20;       +

Responsivo

&#x20;       +

Tipado

&#x20;       +

Modular

&#x20;       +

Manutenível

&#x20;       +

Preparado para dados futuros



A imagem é a referência.



O SVG é o mapa real da aplicação.



O React é responsável pela interface e comportamento.



O TypeScript é responsável pela segurança e organização dos dados.



O Tailwind é responsável pela apresentação e responsividade.



O React State é responsável pelos estados de interação.



O Vite é responsável pelo ambiente de desenvolvimento e build.



O Leaflet não faz parte desta versão.



INSTRUÇÃO FINAL



Analise primeiro a imagem fornecida.



Depois:



interprete sua estrutura;

identifique as regiões;

reconstrua visualmente o mapa em SVG;

modele os dados em TypeScript;

implemente os componentes React;

implemente os estados de interação;

implemente os dois modos de visualização;

implemente o seletor de regiões;

implemente o painel de informações;

implemente responsividade;

implemente acessibilidade;

valide o projeto;

corrija qualquer problema encontrado;

somente então apresente a implementação final.



Não exponha seu raciocínio interno passo a passo. Apresente apenas as conclusões técnicas necessárias, a implementação e a validação final.

