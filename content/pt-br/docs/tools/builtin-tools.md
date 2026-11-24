---
{title: Ferramentas integradas,linkTitle: Ferramentas integradas,weight: 10,group: Tools,aliases: [/docs/pt-br/platform/memories.html,/docs/pt-br/tools/builtin-tools.html],sourceHash: 9854d97b0071b76f}
---

# Ferramentas Integradas

As ferramentas integradas são capacidades mantidas pela AIVAX, como busca na web, leitura de URLs, execução de código, memória e geração de arquivos, que você pode ativar para um modelo sem precisar escrever seu próprio callback. Você pode combiná-las com suas próprias [funções de protocolo](/docs/pt-br/tools/protocol-functions) e ferramentas [MCP](/docs/pt-br/tools/mcp).

Algumas ferramentas têm custos de uso. Consulte [Preços e limites](#precos-e-limites) antes de ativá-las em um fluxo de produção.

O modelo decide qual ferramenta chamar e quais argumentos enviar.

## Como Escolher e Combinar Ferramentas

Ative apenas as ferramentas necessárias para o seu caso de uso. Cada ferramenta adiciona uma decisão para o modelo, e ferramentas semelhantes habilitadas juntas podem levar a escolhas redundantes ou ruins. Comece com o menor conjunto que resolva o caso de uso e escreva instruções claras sobre quando usar cada uma.

Escolha cada ferramenta pelo tipo de necessidade que ela cobre:

- `WebSearch`: a resposta depende de informações públicas, recentes ou em mudança.
- `OpenUrl`: o usuário já forneceu uma URL e deseja que o assistente analise esse conteúdo específico.
- `Code`: cálculos, transformações de dados e pequenas tarefas algorítmicas.
- `Request`: o modelo deve chamar uma API HTTP com um método, cabeçalhos ou corpo específicos.
- `Remember`: apenas em clientes de chat ou chamadas com um usuário identificável, porque as ferramentas de memória armazenam e recuperam informações persistentes para esse usuário.

Trate as ferramentas de geração (imagem, documento e página da web) como ações de saída. Elas fazem mais do que melhorar uma resposta: elas criam artefatos que são hospedados ou anexados à conversa. Diga ao modelo quando gerar um artefato e quando responder em texto. No suporte, por exemplo, um documento se adequa a uma cotação, proposta ou resumo formal; uma página da web se adequa a um relatório visual; uma imagem se adequa à ideação criativa. Quando o usuário pede apenas uma explicação, o texto simples geralmente é suficiente.

Você pode ativar ferramentas em dois locais:

- **Na solicitação**, por meio de `builtin_tools`. O aplicativo chamador escolhe a lista para cada inferência. Use isso para testes, rotinas internas e fluxos nos quais o aplicativo precisa realmente escolher ferramentas dinamicamente.
- **No [AI Gateway](/docs/pt-br/inference/ai-gateways/concepts.md)**. A lista é centralizada e pode ser combinada com habilidades, workers, MCP, funções de protocolo e shell. Prefira o gateway para políticas permanentes de produção, pois ele impede que diferentes clientes habilitem ferramentas diferentes sem controle.

Os valores em `builtin_tools.tools` são sinalizadores de configuração, como `WebSearch`, `Code` e `OpenUrl`. O modelo vê nomes de função em tempo de execução, como `web_search`, `evaluate_code` e `open_url`. Use os nomes de função em tempo de execução ao configurar listas de permissão de ferramentas de skill ou listas de permissão de ferramentas de shell.

## Data e Hora Atual

Ative `DateTime` para expor `get_date_time`. Esta ferramenta não aceita argumentos e lê a hora atual quando é chamada. Ela retorna a data, a hora, o dia da semana, o fuso horário, o deslocamento UTC e um carimbo de data/hora ISO 8601.

A ferramenta relata o fuso horário do gateway, definido no `parameters.timeZone` do gateway com um identificador IANA. O padrão é `America/Sao_Paulo`. No painel, edite **Fuso horário** em **Data e hora** na aba **Parâmetros + Ajuste** do gateway. As ferramentas de agendamento e a ferramenta Bash usam o mesmo fuso.

Para usar outro fuso para uma única solicitação para `/v1/chat/completions`, envie `time_zone`, como `"time_zone": "Asia/Tokyo"`. Os fluxos em lote usam o fuso horário do AI Gateway em que são executados, ou `America/Sao_Paulo` quando nomeiam um modelo diretamente.

Ativação via `builtin_tools`:

```json
{
    "tools": ["DateTime"]
}
```

Para um gateway salvo, inclua `DateTime` em `parameters.sentinelOptions.enabledFunctions`. Para um fluxo em lote, use `enabledTools.enabledFunctions`.

Exemplo de resultado da ferramenta:

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

A data usa `yyyy-MM-dd`, a hora usa 24 horas `HH:mm:ss` e os nomes dos dias da semana são retornados em inglês.

## Busca na Internet

Ative `WebSearch` para permitir que o modelo pesquise na internet informações específicas ou em tempo real, como clima, notícias ou resultados de jogos.

Você pode escolher entre dois modos de pesquisa no painel:

- **Completo**: insere todo o conteúdo de cada resultado no contexto da conversa.
- **Resumido**: insere um resumo gerado por IA dos resultados.

O modo `Completo` pode fornecer resultados mais precisos, mas pode consumir mais tokens de entrada. Consulte [Preços e limites](#precos-e-limites) antes de ativar a busca na internet em produção.

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

## Execução de Código

Ative `Code` para permitir que o modelo execute JavaScript e inspecione o resultado. Use-o para expressões matemáticas e outros problemas que são mais fáceis de resolver com código do que com texto.

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

Ative `OpenUrl` para permitir que o modelo leia o conteúdo de URLs e links fornecidos pelo usuário.

A ferramenta envia uma solicitação `GET` simples ao destino; ela não faz rastreamento. Alguns sites bloqueiam o acesso automatizado.

Páginas HTML são reduzidas ao seu texto puro, outros textos são lidos conforme estão e arquivos, como documentos, são convertidos em texto quando possível.

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

Ative `Remember` quando o assistente precisar salvar informações entre conversas e recuperá-las quando relevante. Ele expõe exatamente duas ferramentas: `memory_save` e `memory_search`.

Ambas as ferramentas exigem um usuário identificado: defina um `tag` estável em um [cliente de chat](/docs/pt-br/inference/chat-clients/managing-sessions.md#identify-users-with-a-tag) ou `$.user` em uma solicitação chat/completions. Sem esse identificador, as ferramentas retornam um erro. As pesquisas de memória são automaticamente restritas ao usuário atual. Cada memória registra o gateway que a salvou, e `parameters.builtinFunctionsOptions.allowSharedMemory` controla a visibilidade:

| `allowSharedMemory` | Comportamento |
| --- | --- |
| `true` (padrão) | O gateway lê, substitui e exclui as memórias do usuário salvas por qualquer gateway na conta. |
| `false` | O gateway apenas lê, substitui e exclui as memórias do usuário que ele mesmo salvou. |

No painel, esta é a opção **Visibilidade da Memória** nas configurações de ferramentas do gateway. Memórias salvas fora de um gateway salvo são visíveis apenas para gateways com memória compartilhada.

Ativação via `builtin_tools`:

```json
{
    "tools": [
        "Remember"
    ]
}
```

As memórias **não são adicionadas automaticamente às instruções do sistema**. Diga ao modelo quando chamar `memory_search`, como antes de responder a uma pergunta sobre uma preferência salva.

### Salvar, Substituir ou Excluir uma Memória

`memory_save(id?, content?, expiresInDays?)` combina criação, substituição e exclusão. `id` é o ID da memória; `content` é o texto a ser salvo, dentro do limite de tamanho da memória em [Preços e limites](#precos-e-limites); `expiresInDays` é um número inteiro opcional de dias, de 1 a 365, após o qual a memória é excluída automaticamente.

| Argumentos | Resultado |
| --- | --- |
| `content`, com `id` omitido ou `null` | Cria uma memória e retorna seu ID. Sem `expiresInDays`, ela nunca expira. |
| `id` e `content` | Substitui o conteúdo dessa memória. Sem `expiresInDays`, a expiração atual é mantida. |
| `id` e `expiresInDays`, com `content` omitido ou `null` | Altera apenas a expiração dessa memória, contada a partir de agora. |
| Apenas `id` | Exclui essa memória. |
| `id` e `content` ambos omitidos ou `null` | Retorna um erro. |

Apenas memórias pertencentes ao usuário atual podem ser substituídas ou excluídas. As antigas ferramentas `memory_update`, `memory_remove` e `memory_clear` não estão mais disponíveis; use `memory_save` em vez disso.

### Pesquisar Memórias

`memory_search(query?, filter?)` requer **exatamente um** argumento: `query` ou `filter`. Enviar ambos, ou nenhum, retorna um erro.

| Argumento | Comportamento |
| --- | --- |
| `query` | Uma consulta de texto para busca semântica sobre as memórias do usuário atual. Retorna até 10 resultados. |
| `filter` | Uma string usando a [sintaxe de filtro de documentos da AIVAX](/docs/pt-br/rag/document-filters). Retorna até 10 memórias correspondentes, das mais recentes para as mais antigas. |

Cada resultado contém `id`, `content`, `createdAt`, `updatedAt` e `expiresAt` (`null` quando a memória nunca expira). Memórias expiradas nunca são retornadas. Use `query` para encontrar significado; use `filter` para texto exato, metadados ou datas de criação e atualização:

| Objetivo | `filter` |
| --- | --- |
| Criado nos últimos 7 dias | `createdAt >= now-7d` |
| Alterado nas últimas 24 horas | `updatedAt >= now-24h` |
| Criado em outubro de 2026 | `createdAt >= "2026-10-01" and createdAt < "2026-11-01"` |
| Não atualizado há 90 dias, por exemplo, candidatos obsoletos para revisão | `updatedAt < now-90d` |
| Menciona um aniversário e foi criado nos últimos 30 dias | `content contains "birthday" and createdAt >= now-30d` |
| Salvo em uma conversa específica | `metadata.conversation_token = "<token da conversa>"` |

Para saber como as datas sem deslocamento são interpretadas, consulte [Filtros de Documentos — Datas](/docs/pt-br/rag/document-filters#dates).

### Armazenamento e Gerenciamento

As memórias são documentos na coleção RAG `@memories` na sua conta AIVAX. A coleção é criada automaticamente no primeiro salvamento. O conteúdo de cada documento é o texto da memória, e seus metadados identificam o usuário e a conversa de origem:

```json
{
    "external_user_id": "<tag do usuário>",
    "conversation_token": "<token da conversa>",
    "gateway_id": "<ID do gateway>",
    "expires_at": 1791580376
}
```

`gateway_id` é `null` quando a memória não foi salva por um gateway salvo, e `expires_at` é um timestamp Unix em segundos, ou `null` quando a memória nunca expira. Memórias novas ou atualizadas tornam-se pesquisáveis em alguns segundos.

Memórias expiradas são ocultadas da `memory_search` e removidas automaticamente. Memórias sem expiração são mantidas até serem excluídas. Inspecione e gerencie memórias nas páginas Coleções e Documentos do painel ou por meio das [APIs de Coleções e Documentos](../rag/collections.md). **Excluir a coleção `@memories` apaga todas as memórias de todos os usuários na conta**; a coleção é recriada no próximo salvamento.

A restrição automática de usuário aplica-se apenas às ferramentas de memória. Ao gerenciar a coleção diretamente, use `metadata.external_user_id` para selecionar os registros do usuário pretendido e preservar os metadados do usuário.

### Faturamento, Limites e Erros

A memória não tem cobrança separada de ferramenta; consulte [Preços e limites](#precos-e-limites). Ambas as ferramentas de memória usam os [limites de taxa RAG da conta](../rag/collections.md#pricing-and-limits). Se a conta não tiver saldo ou atingir um limite de taxa, a ferramenta retornará um erro ao modelo. Instrua o modelo a relatar a falha em vez de afirmar que salvou ou recuperou informações.

### Migração de Antigas Ferramentas de Memória e Calendário

As memórias não expiradas existentes foram movidas para a coleção `@memories` de cada conta, mantendo seus IDs, identificadores de usuário, datas de criação e datas de expiração. Gateways com memória privada não os veem, porque as memórias migradas não pertencem a nenhum gateway.

A ferramenta integrada `Calendar` foi removida. Solicitações que ainda incluem `Calendar` em `builtin_tools.tools` falham: remova-a de suas solicitações. Lembretes de calendário existentes foram migrados para memórias de texto.

A antiga API de Memórias não está mais disponível. Mova o gerenciamento de memória em nível de aplicativo para as APIs de Coleções e Documentos e atualize as instruções do gateway para pesquisar explicitamente. O antigo argumento `retentionDays` agora é `expiresInDays`; omiti-lo cria uma memória que nunca expira, onde o antigo padrão era 30 dias.

Para controles em nível de aplicativo em torno de gravações de memória, políticas de exclusão e revisão, consulte [Como proteger a memória do agente LLM contra envenenamento](https://aivax.net/blog/persistent-memory-is-a-write-path/).

## Geração de Imagem

Ative `ImageGeneration` para permitir que o modelo crie imagens. Os modelos de geração de imagem disponíveis estão listados no console AIVAX.

As imagens geradas são anexadas ao contexto da conversa, mas o assistente não pode vê-las diretamente. Elas são armazenadas nos servidores da AIVAX por alguns meses antes de serem removidas permanentemente.

A geração de imagem pode incorrer em custos de uso. Consulte [Preços e limites](#precos-e-limites) antes de ativá-la em produção.

Você pode permitir imagens adultas com `image_generation_allow_mature_content`. O modelo selecionado também deve aceitar gerar esse tipo de conteúdo.

Você é sempre responsável pelo [material que gera](/docs/pt-br/legal/terms-of-service), e ele deve estar em conformidade com nossos termos de serviço.

Ativação via `builtin_tools`:

```json
{
    "tools": [
        "ImageGeneration"
    ],
    "options": {
        "image_generation_model_name": "@x-ai/grok-imagine",
        "image_generation_allow_reference_usage": true,
        "image_generation_quality": "high",
        "image_generation_max_results": 2,
        "image_generation_allow_mature_content": false
    }
}
```

## Pesquisa de Posts no X

Ative `XPostsSearch` para permitir que o modelo pesquise posts no X (antigo Twitter) e leia um post específico quando tiver o ID do post.

É uma alternativa direta à [busca na internet](#busca-na-internet) (`web_search`) para informações em tempo real, como notícias ou resultados de jogos, e retorna resultados muito mais recentes. Evite ativar ambas as ferramentas juntas, pois elas atendem ao mesmo propósito.

Esta função pode incorrer em custos de uso. Consulte [Preços e limites](#precos-e-limites) antes de ativá-la em produção.

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

## Geração de Documento

Ative `GenerateDocument` para permitir que o modelo crie PDFs a partir de HTML.

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

## Geração de Página Web

Ative `GenerateWebPage` para permitir que o modelo hospede páginas HTML nos servidores da AIVAX, como relatórios, landing pages e infográficos.

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

Ative `Request` para dar ao modelo uma ferramenta completa de solicitação HTTP. O modelo pode definir o método, os cabeçalhos, os campos do formulário e o corpo de cada solicitação.

As respostas de texto são retornadas ao modelo; as respostas binárias não são, e a ferramenta relata apenas seu tipo de conteúdo e tamanho.

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

## Preços e limites

As buscas na web e no X são cobradas por pesquisa. O [multiplicador de plano](../pricing.md#plan-multipliers) aplica-se a cobranças baseadas em tokens. A inferência do modelo usada para invocar uma ferramenta ainda é cobrada à sua taxa regular. A geração de imagem é cobrada nas taxas do modelo selecionado; consulte [Geração de Imagem](../generations/images.md).

| Descrição | Preço |
| --- | ---: |
| Busca na web | **$5/1k pesquisas** |
| Busca no X (Twitter) | **$5/1k pesquisas** |
| [Memória](#memoria) | Salvando ou substituindo conteúdo: embedding de documento; busca semântica `query`: embedding de consulta RAG; busca `filter`: sem custo |
| Solicitações avançadas | Sem cobrança separada |
| Geração de documento | Sem cobrança separada |
| Geração de página web | Sem cobrança separada |

Busca na web, busca no X/Twitter, geração de documento e página web, geração e edição de imagem, ações gerais de serviço e [comandos Bash](shell.md#precos-e-limites) têm limites de plano; consulte [Limites de ferramentas integradas e busca na web](../limits.md#built-in-tools-and-web-search). A busca no X/Twitter não está disponível no Gratuito. As ações gerais de serviço compartilham uma cota diária de ação de serviço. O conteúdo de cada memória é limitado a 10 KB.

## Diagnóstico de Ferramentas

Use estas verificações quando uma ferramenta não for chamada, for chamada com muita frequência ou falhar.

### A ferramenta não é chamada

1. Confirme que a ferramenta está habilitada no gateway ou no campo `builtin_tools` da solicitação.
2. Verifique se o modelo selecionado suporta chamadas de função ou se um manipulador de ferramentas está configurado para modelos sem suporte nativo.
3. Revise as instruções. Se elas não disserem quando pesquisar, abrir uma URL, gerar uma imagem ou consultar a memória, o modelo pode responder apenas com base em seu próprio conhecimento.
4. Teste uma pergunta direta que claramente exige a ferramenta, como pedir um artigo de notícias recente para `WebSearch` ou pedir para abrir uma URL específica para `OpenUrl`.

### A ferramenta é chamada com muita frequência

Reduza a ambiguidade. Ferramentas como `WebSearch` e `XPostsSearch` competem por informações recentes; `OpenUrl` e `Request` podem parecer semelhantes quando o usuário envia um link. Para `Remember`, distinga um pedido para salvar informações de uma pergunta que requer recuperar uma memória existente. Remova ferramentas desnecessárias, torne as descrições das instruções do gateway mais restritivas e, quando possível, use [workers](/docs/pt-br/inference/workers) para bloquear ou substituir chamadas em cenários específicos.

### A ferramenta falha

Trate falhas de ferramentas como parte normal da experiência. Pesquisas podem retornar pouco conteúdo, URLs podem bloquear bots, APIs podem negar autorização, geração de imagem pode recusar conteúdo e execução de código pode receber entrada ambígua. Instrua o modelo a explicar a limitação objetivamente e oferecer o próximo passo, como solicitar outro link, tentar uma consulta mais específica, pedir autorização ou responder com base apenas no contexto disponível. Não dependa de uma ferramenta externa como a única maneira de concluir uma conversa crítica sem um fallback de experiência.
