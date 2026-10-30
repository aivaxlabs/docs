Source: https://docs.aivax.net/pt-br/docs/tools/builtin-tools.html

# Ferramentas Integradas

As ferramentas integradas são capacidades mantidas pela AIVAX, como pesquisa na web, leitura de URLs, execução de código, memória e geração de arquivos, que você pode habilitar para um modelo sem precisar escrever seu próprio callback. Você pode combiná-las com suas próprias [funções de protocolo](https://docs.aivax.net/pt-br/docs/tools/protocol-functions.md) e ferramentas [MCP](https://docs.aivax.net/pt-br/docs/tools/mcp.md).

Algumas ferramentas têm custos de uso. Consulte [Preços e limites](#preços-e-limites) antes de habilitá-las em um fluxo de produção.

O modelo decide qual ferramenta chamar e quais argumentos enviar. Nem todos os modelos seguem as regras de chamada de ferramentas de forma confiável.

## Como Escolher e Combinar Ferramentas

As ferramentas integradas devem ser habilitadas como capacidades de trabalho, não como decoração de agente. Cada ferramenta adiciona uma decisão ao modelo: ele precisa perceber que a ferramenta existe, entender quando usá-la, montar argumentos válidos, esperar pelo resultado e continuar a resposta. Quanto mais ferramentas semelhantes estiverem disponíveis ao mesmo tempo, maior a chance de uso redundante ou escolha inadequada. Comece com o menor conjunto possível que resolva o caso de uso e escreva instruções claras sobre quando usar cada uma.

Escolha cada ferramenta com base no tipo de necessidade que ela cobre:

- `WebSearch`: a resposta depende de informações públicas, recentes ou em mudança.
- `OpenUrl`: o usuário já forneceu um URL e deseja que o assistente analise esse conteúdo específico.
- `Code`: cálculos, transformações de dados e pequenas tarefas algorítmicas.
- `Request`: o modelo deve chamar uma API HTTP com um método, cabeçalhos ou corpo específicos.
- `Remember`: apenas em clientes de chat ou chamadas com um usuário identificável, porque as ferramentas de memória armazenam e recuperam informações persistentes para esse usuário.
- `AdvancedWebUsage`: desativado; retorna uma resposta de indisponibilidade. Consulte [Registros de Alterações](https://docs.aivax.net/pt-br/docs/legal/changelogs.md).

Trate as ferramentas de geração (imagem, documento e página da web) como ações de saída. Elas fazem mais do que melhorar uma resposta: elas criam artefatos que são hospedados ou anexados à conversa. Diga ao modelo quando gerar um artefato e quando responder em texto. No suporte, por exemplo, um documento se adequa a uma cotação, proposta ou resumo formal; uma página da web se adequa a um relatório visual; uma imagem se adequa à ideação criativa. Quando o usuário pede apenas uma explicação, o texto simples geralmente é suficiente.

Você pode habilitar ferramentas em dois lugares:

- **Na solicitação**, através de `builtin_tools`. O aplicativo chamador escolhe a lista para cada inferência. Use isso para testes, rotinas internas e fluxos onde o aplicativo realmente precisa escolher ferramentas dinamicamente.
- **No [AI Gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md)**. A lista é centralizada e pode ser combinada com habilidades, workers, MCP, funções de protocolo e shell. Prefira o gateway para políticas permanentes de produção, pois ele impede que diferentes clientes habilitem ferramentas diferentes sem controle.

Os valores em `builtin_tools.tools` são sinalizadores de configuração, como `WebSearch`, `Code` e `OpenUrl`. O modelo vê nomes de função em tempo de execução, como `web_search`, `evaluate_code` e `open_url`. Use os nomes de função em tempo de execução ao configurar listas permitidas de ferramentas de habilidade ou listas permitidas de ferramentas de shell.

## Data e Hora Atuais

Habilite `DateTime` para expor `get_date_time`. Esta ferramenta não aceita argumentos e lê a hora atual quando é chamada. Ela retorna a data, a hora, o dia da semana, o fuso horário, o deslocamento UTC e um carimbo de data/hora ISO 8601.

A ferramenta relata o fuso horário do gateway, definido em `parameters.timeZone` do gateway com um identificador IANA. O padrão é `America/Sao_Paulo`, e as alterações de horário de verão são aplicadas automaticamente. No painel, edite **Fuso horário** em **Data e hora** na aba **Parâmetros + Ajuste** do gateway. O mesmo fuso horário é usado por ferramentas de agendamento e pela ferramenta Bash, então toda data que o modelo lê ou grava usa um único fuso horário. O fuso horário do navegador ou do contexto do usuário não o altera.

Para usar outro fuso horário para uma única solicitação para `/v1/chat/completions`, envie `time_zone`, como `"time_zone": "Asia/Tokyo"`. Identificadores inválidos são rejeitados. Fluxos de lote usam o fuso horário do AI Gateway em que são executados, ou `America/Sao_Paulo` quando nomeiam um modelo diretamente.

Ativação via `builtin_tools`:

```json
{
    "tools": ["DateTime"]
}
```

Para um gateway salvo, inclua `DateTime` em `parameters.sentinelOptions.enabledFunctions`. Para um fluxo de Batch, use `enabledTools.enabledFunctions`.

Exemplo de resultado da ferramenta (ilustrativo, não uma leitura ao vivo):

```json
{
    "date": "2026-07-15",
    "time": "09:30:00",
    "day_of_week": "Wednesday",
    "time_zone": "America/Los_Angeles",
    "utc_offset": "-07:00",
    "date_time": "2026-07-15T09:30:00-07:00"
}
```

A data usa `yyyy-MM-dd`, a hora usa 24 horas `HH:mm:ss` e os nomes dos dias da semana são retornados em inglês. Todos os campos descrevem o mesmo instante.

## Pesquisa na Internet

Habilite `WebSearch` para permitir que o modelo pesquise na internet informações específicas ou em tempo real, como clima, notícias ou resultados de jogos.

A AIVAX executa pesquisas por meio de uma mistura de provedores, escolhidos pela disponibilidade de rede e latência.

Você pode escolher entre dois modos de pesquisa no painel:

- **Completo**: insere todo o conteúdo de cada resultado no contexto da conversa.
- **Resumido**: insere um resumo gerado por IA dos resultados, produzido pelo provedor de pesquisa.

O modo `Completo` pode fornecer resultados mais precisos, mas pode consumir mais tokens de entrada. Consulte [Preços e limites](#preços-e-limites) antes de habilitar a pesquisa na internet em produção.

> [!NOTE]
>
> O modo `Completo` nem sempre está disponível.

Ativação via `builtin_tools`:

```json
{
    "tools": [
        "WebSearch"
    ],
    "options": {
        "web_search_max_results": 10,
        "web_search_mode": "full"
    }
}
```

## Pesquisa Avançada na Internet

`AdvancedWebUsage` está desativado e retorna uma resposta de indisponibilidade. Consulte [Registros de Alterações](https://docs.aivax.net/pt-br/docs/legal/changelogs.md) para detalhes.

## Execução de Código

Habilite `Code` para permitir que o modelo execute JavaScript e inspecione o resultado. Use-o para expressões matemáticas e outros problemas que são mais fáceis de resolver com código do que com texto.

O código é executado em um ambiente JavaScript protegido. Destina-se a cálculos e pequenas transformações, não para E/S de arquivos, acesso à rede ou importação de scripts externos.

Ativação via `builtin_tools`:

```json
{
    "tools": [
        "Code"
    ],
    "options": {
    }
}
```

## Contexto de URL

Habilite `OpenUrl` para permitir que o modelo leia o conteúdo de URLs e links fornecidos pelo usuário.

A ferramenta envia uma solicitação `GET` simples ao destino; ela não faz raspagem (crawling). Alguns sites podem identificar o acesso como um bot e bloqueá-lo.

A AIVAX lida com o conteúdo retornado por tipo:

- **HTML**: tags, scripts, CSS e outros ruídos são removidos, mantendo apenas o texto simples da página.
- **Outro texto**: o conteúdo é lido conforme está.
- **Conteúdo não textual**: quando a resposta indica um nome de arquivo (no caminho ou no cabeçalho `Content-Disposition`), a AIVAX tenta converter o arquivo baixado para texto.

Ativação via `builtin_tools`:

```json
{
    "tools": [
        "OpenUrl"
    ],
    "options": {
    }
}
```

## Memória

Habilite `Remember` quando o assistente precisar salvar informações entre conversas e recuperá-las quando relevante. Ele expõe exatamente duas ferramentas: `memory_save` e `memory_search`.

Ambas as ferramentas exigem um usuário identificado: defina um `tag` estável em um [cliente de chat](https://docs.aivax.net/pt-br/docs/inference/chat-clients.md) ou `$.user` em uma solicitação chat/completions. Sem esse identificador, as ferramentas retornam um erro. As pesquisas de memória são automaticamente restritas ao usuário atual. Cada memória registra o gateway que a salvou, e `parameters.builtinFunctionsOptions.allowSharedMemory` controla a visibilidade:

| `allowSharedMemory` | Comportamento |
| --- | --- |
| `true` (padrão) | O gateway lê, substitui e exclui as memórias do usuário salvas por qualquer gateway na conta. |
| `false` | O gateway apenas lê, substitui e exclui as memórias do usuário que ele mesmo salvou. |

No painel, esta é a opção **Visibilidade da Memória** nas configurações de ferramentas do gateway. Memórias salvas fora de um gateway salvo e memórias migradas das ferramentas de memória anteriores não têm gateway e são visíveis apenas para gateways com memória compartilhada.

Ativação via `builtin_tools`:

```json
{
    "tools": [
        "Remember"
    ]
}
```

As memórias **não são adicionadas automaticamente às instruções do sistema**. Diga ao modelo quando chamar `memory_search`, como antes de responder a uma pergunta sobre uma preferência salva. A opção removida `include_all_memory_context`, incluindo sua grafia `IncludeAllMemoryContext`, é ignorada se enviada.

### Salvar, Substituir ou Excluir uma Memória

`memory_save(id?, content?, expiresInDays?)` combina criação, substituição e exclusão. `id` é o ID da memória; `content` é o texto a ser salvo, limitado a 10 KB por memória salva; `expiresInDays` é um número inteiro opcional de dias, de 1 a 365, após o qual a memória é excluída automaticamente.

| Argumentos | Resultado |
| --- | --- |
| `content`, com `id` omitido ou `null` | Cria uma memória e retorna seu ID. Sem `expiresInDays`, ela nunca expira. |
| `id` e `content` | Substitui o conteúdo dessa memória. Sem `expiresInDays`, a expiração atual é mantida. |
| `id` e `expiresInDays`, com `content` omitido ou `null` | Altera apenas a expiração dessa memória, contada a partir de agora. |
| Apenas `id` | Exclui essa memória. |
| `id` e `content` ambos omitidos ou `null` | Retorna um erro. |

Apenas memórias pertencentes ao usuário atual podem ser substituídas ou excluídas. As ferramentas anteriores `memory_update`, `memory_remove` e `memory_clear` não estão mais disponíveis; atualize as instruções e o tratamento de chamadas de ferramentas para usar `memory_save` para alterações individuais.

### Pesquisar Memórias

`memory_search(query?, filter?)` requer **exatamente um** argumento: `query` ou `filter`. Enviar ambos, ou nenhum, retorna um erro.

| Argumento | Comportamento |
| --- | --- |
| `query` | Uma consulta de texto para busca semântica sobre as memórias do usuário atual, reranked com `rrf` (Reciprocal Rank Fusion). Retorna até 10 resultados. |
| `filter` | Uma string usando [sintaxe de filtro de documentos da AIVAX](https://docs.aivax.net/pt-br/docs/rag/document-filters.md). Retorna até 10 memórias correspondentes, mais recentes primeiro, sem gerar embeddings de consulta. |

Cada resultado contém `id`, `content`, `createdAt`, `updatedAt` e `expiresAt` (`null` quando a memória nunca expira). Memórias expiradas nunca são retornadas. Use `query` para encontrar significado; use `filter` para texto exato, metadados ou datas de criação e atualização:

| Objetivo | `filter` |
| --- | --- |
| Criado nos últimos 7 dias | `createdAt >= now-7d` |
| Alterado nas últimas 24 horas | `updatedAt >= now-24h` |
| Criado em outubro de 2026 | `createdAt >= "2026-10-01" and createdAt < "2026-11-01"` |
| Não atualizado há 90 dias, por exemplo, candidatos obsoletos para revisão | `updatedAt < now-90d` |
| Menciona um aniversário e foi criado nos últimos 30 dias | `content contains "birthday" and createdAt >= now-30d` |
| Salvo em uma conversa específica | `metadata.conversation_token = "<token da conversa>"` |

Datas e carimbos de data/hora sem um deslocamento usam o fuso horário de referência do servidor descrito em [Filtros de Documentos — Datas](https://docs.aivax.net/pt-br/docs/rag/document-filters.md#dates). A data de criação ou atualização de uma memória não é a data de um evento mencionado em seu texto.

### Armazenamento e Gerenciamento

As memórias são documentos na coleção RAG `@memories` na sua conta AIVAX. A coleção é criada automaticamente na primeira salvamento. O conteúdo de cada documento é o texto da memória, e seus metadados identificam o usuário e a conversa de origem:

```json
{
    "external_user_id": "<tag do usuário>",
    "conversation_token": "<token da conversa>",
    "gateway_id": "<ID do gateway>",
    "expires_at": 1791580376
}
```

Quando nenhum token de conversa está disponível, `conversation_token` é JSON `null`, não uma string. `gateway_id` é o ID do gateway que salvou a memória, ou `null` quando não foi salvo por um gateway salvo. `expires_at` é um timestamp Unix em segundos, ou `null` quando a memória nunca expira. Memórias recém-salvas ou atualizadas tornam-se pesquisáveis após a conclusão da indexação, geralmente dentro de alguns segundos.

Memórias salvas com `expiresInDays` são excluídas em uma limpeza periódica após expirarem; até lá, elas ficam ocultas para `memory_search`. Memórias sem expiração são mantidas até serem excluídas. Ao gerenciar a coleção diretamente, defina ou remova `metadata.expires_at` para controlar a expiração. Inspecione e gerencie-as nas páginas Coleções e Documentos do painel ou por meio das [APIs de Coleções e Documentos](https://docs.aivax.net/pt-br/docs/rag/collections.md). A API dedicada de Memórias e a página de Memórias do painel foram removidas. **Excluir a coleção `@memories` apaga todas as memórias de todos os usuários na conta**; a coleção é recriada na próxima salvamento.

A restrição automática de usuário aplica-se às ferramentas de memória. Ao gerenciar a coleção diretamente, use `metadata.external_user_id` para selecionar os registros do usuário pretendido e preservar os metadados do usuário.

### Faturamento, Limites e Erros

Salvar ou substituir o conteúdo da memória indexa-o como qualquer documento de coleção, com cobranças de embedding de documento. Uma pesquisa `query` é cobrada como um embedding de consulta RAG. Uma pesquisa `filter` não tem custo de embedding, e o reranker `rrf` não tem custo de reranking. A memória não tem cobrança separada de ferramenta; consulte [Preços e limites](#preços-e-limites).

Ambas as ferramentas de memória usam os [limites de taxa RAG](https://docs.aivax.net/pt-br/docs/rag/collections.md#preços-e-limites) da conta. Se a conta não tiver saldo ou atingir um limite de taxa, a ferramenta retorna um erro ao modelo. Instrua o modelo a relatar a falha em vez de afirmar que salvou ou recuperou informações. Para um salvamento recente que ainda não foi encontrado, permita que a indexação termine antes de pesquisar novamente.

### Migração de Anteriores Ferramentas de Memória e Calendário

As memórias não expiradas existentes foram movidas para a coleção `@memories` de cada conta, preservando seus IDs originais, identificadores de usuário em `external_user_id`, datas de criação e datas de expiração em `expires_at`. Registros migrados têm `conversation_token: null`. Eles são reindexados, o que é cobrado como embedding de documento.

A ferramenta integrada `Calendar` e suas ferramentas de compromisso foram removidas da API e do painel. Gateways e fluxos de Batch existentes têm o sinalizador removido automaticamente, mas solicitações que ainda incluem `Calendar` em `builtin_tools.tools` falham: remova-o de suas solicitações. Lembretes de calendário não expirados foram migrados para memórias de texto na forma `Lembrete em <data> (<n> minutos): <descrição>`. Estes são textos armazenados, não lembretes agendados ou um serviço de calendário substituto.

A antiga API de Memórias, incluindo listagem, obtenção, exclusão e geração de prompt de migração, não está mais disponível. Mova o gerenciamento de memória em nível de aplicativo para as APIs de Coleções e Documentos. Atualize as instruções do gateway para pesquisar explicitamente. Gateways com memória privada não veem memórias migradas, porque os registros migrados não têm `gateway_id`. O argumento anterior `retentionDays` agora é `expiresInDays`; omiti-lo cria uma memória que nunca expira, onde o antigo padrão era 30 dias.

Para controles em nível de aplicativo em torno de gravações de memória, políticas de exclusão e revisão, consulte [Como proteger a memória de agentes LLM contra envenenamento](https://aivax.net/blog/persistent-memory-is-a-write-path/).

## Geração de Imagens

Habilite `ImageGeneration` para permitir que o modelo crie imagens. Os modelos de geração de imagens disponíveis estão listados no console da AIVAX.

As imagens geradas são anexadas ao contexto da conversa, mas o assistente não pode vê-las diretamente. Elas são armazenadas nos servidores da AIVAX por alguns meses antes de serem removidas permanentemente.

A geração de imagens pode incorrer em custos de uso. Consulte [Preços e limites](#preços-e-limites) antes de habilitá-la em produção.

Você também pode permitir imagens explícitas e adultas com `image_generation_allow_mature_content`. Quando este recurso está habilitado, o modelo será permitido gerar material adulto. Para que isso aconteça, o modelo também deve “concordar” em gerar tal conteúdo. Alguns modelos têm um filtro de segurança mais baixo do que outros. Por exemplo, os modelos Gemini têm o filtro de segurança mais baixo, tornando-os uma opção viável para role-play e geração de tal material.

Você é sempre responsável pelo [material que gera](https://docs.aivax.net/pt-br/docs/legal/terms-of-service.md), e ele deve estar em conformidade com nossos termos de serviço.

Ativação via `builtin_tools`:

```json
{
    "tools": [
        "ImageGeneration"
    ],
    "options": {
        "image_generation_model_name": "grok-imagine",
        "image_generation_allow_reference_usage": true,
        "image_generation_quality": "high",
        "image_generation_max_results": 2,
        "image_generation_allow_mature_content": false
    }
}
```

## Pesquisa de Posts no X

Habilite `XPostsSearch` para permitir que o modelo pesquise posts no X (antigo Twitter) e leia um post específico quando tiver o ID do post.

É uma alternativa direta à [pesquisa na internet](#pesquisa-na-internet) (`web_search`) para informações em tempo real, como notícias ou resultados de jogos, e retorna resultados muito mais recentes. Evite habilitar ambas as ferramentas juntas, pois elas atendem ao mesmo propósito.

Esta função pode incorrer em custos de uso. Consulte [Preços e limites](#preços-e-limites) antes de habilitá-la em produção.

Ativação via `builtin_tools`:

```json
{
    "tools": [
        "XPostsSearch"
    ],
    "options": {
    }
}
```

## Geração de Documentos

Habilite `GenerateDocument` para permitir que o modelo crie PDFs a partir de HTML.

A AIVAX hospeda os arquivos criados e o assistente os compartilha na conversa. Eles são mantidos por alguns meses antes de serem excluídos permanentemente.

Ativação via `builtin_tools`:

```json
{
    "tools": [
        "GenerateDocument"
    ],
    "options": {
    }
}
```

## Geração de Páginas da Web

Habilite `GenerateWebPage` para permitir que o modelo hospede páginas HTML nos servidores da AIVAX, como relatórios, landing pages e infográficos.

As páginas são mantidas por alguns meses antes de serem excluídas permanentemente.

Ativação via `builtin_tools`:

```json
{
    "tools": [
        "GenerateWebPage"
    ],
    "options": {
    }
}
```

## Solicitação Avançada

Habilite `Request` para dar ao modelo uma ferramenta completa de solicitação HTTP. O modelo pode definir o método, cabeçalhos, campos de formulário e corpo de cada solicitação.

As respostas de texto são lidas até o limite de conteúdo da plataforma. Respostas binárias não são expandidas no contexto; a ferramenta retorna um marcador de conteúdo binário curto com o tipo de conteúdo e tamanho quando disponível.

Ativação via `builtin_tools`:

```json
{
    "tools": [
        "Request"
    ],
    "options": {
    }
}
```

## Preços e Limites

Pesquisas na web e no X são cobradas por pesquisa. O [multiplicador de plano](https://docs.aivax.net/pt-br/docs/pricing.md#plan-multipliers) aplica-se a cobranças baseadas em tokens. A inferência do modelo usada para invocar uma ferramenta ainda é cobrada em sua taxa regular. A geração de imagens é cobrada nas taxas do modelo selecionado; consulte [Geração de Imagens](https://docs.aivax.net/pt-br/docs/generations/images.md).

| Descrição | Preço |
| --- | ---: |
| Pesquisa na Web | **$5/1k pesquisas** |
| Pesquisa no X (Twitter) | **$5/1k pesquisas** |
| [Memória](#memória) | Salvar ou substituir conteúdo: embedding de documento; pesquisa semântica `query`: embedding de consulta RAG; pesquisa `filter`: sem custo de embedding; reranking `rrf`: sem custo |
| Solicitações avançadas | Sem cobrança separada |
| Geração de Documentos | Sem cobrança separada |
| Geração de Páginas da Web | Sem cobrança separada |

Um travessão (`—`) significa que o plano não impõe um limite, e `Não disponível` significa que a ferramenta não está disponível no plano.

| Limite | Grátis | Pro | Max |
| --- | --- | --- | --- |
| Pesquisa na Web | 15/dia | 1.000/dia | 10.000/dia |
| Pesquisa X/Twitter | Não disponível | 1.000/dia | 10.000/dia |
| Geração de Documentos e Páginas da Web | 5/dia | 1.000/dia | 50.000/dia |
| Geração e edição de Imagens | 5/dia | 500/dia | 5.000/dia |
| Ações gerais de serviço | 30/dia | 5.000/dia | 100.000/dia |
| [Comandos Bash](https://docs.aivax.net/pt-br/docs/tools/shell.md#preços-e-limites) | 300/hora | 30.000/hora | — |

As ações gerais de serviço compartilham uma cota diária de ações de serviço. O conteúdo de cada memória é limitado a 10 KB.

## Diagnóstico de Ferramentas

Use estas verificações quando uma ferramenta não for chamada, for chamada com muita frequência ou falhar.

### A ferramenta não é chamada

1. Confirme que a ferramenta está habilitada no gateway ou no campo `builtin_tools` da solicitação.
2. Verifique se o modelo selecionado suporta chamadas de função ou se um manipulador de ferramentas está configurado para modelos sem suporte nativo.
3. Revise as instruções. Se elas não disserem quando pesquisar, abrir uma URL, gerar uma imagem ou consultar a memória, o modelo pode responder apenas com seu próprio conhecimento.
4. Teste uma pergunta direta que claramente exige a ferramenta, como pedir um artigo de notícias recentes para `WebSearch` ou pedir para abrir uma URL específica para `OpenUrl`.

### A ferramenta é chamada com muita frequência

Reduza a ambiguidade. Ferramentas como `WebSearch`, `AdvancedWebUsage` e `XPostsSearch` competem por informações recentes; `OpenUrl` e `Request` podem parecer semelhantes quando o usuário envia um link. Para `Remember`, distinga um pedido para salvar informações de uma pergunta que requer recuperar uma memória existente. Remova ferramentas desnecessárias, torne as descrições das instruções do gateway mais restritivas e, quando possível, use [workers](https://docs.aivax.net/pt-br/docs/inference/workers.md) para bloquear ou substituir chamadas em cenários específicos.

### A ferramenta falha

Trate falhas de ferramentas como parte normal da experiência. Pesquisas podem retornar pouco conteúdo, URLs podem bloquear bots, APIs podem negar autorização, geração de imagens pode recusar conteúdo e execução de código pode receber entrada ambígua. Instrua o modelo a explicar a limitação objetivamente e oferecer o próximo passo, como solicitar outro link, tentar uma consulta mais específica, pedir autorização ou responder com base apenas no contexto disponível. Não dependa de uma ferramenta externa como a única maneira de concluir uma conversa crítica sem um fallback de experiência.
