---
{title: Ferramentas Integradas,linkTitle: Ferramentas integradas,weight: 10,group: Tools,aliases: [/docs/pt-br/platform/memories.html,/docs/pt-br/tools/builtin-tools.html],sourceHash: 590208e0e5fc5c73}
---

# Ferramentas Integradas

AIVAX fornece uma lista de ferramentas integradas que você pode habilitar em seu modelo. Essas ferramentas podem ser usadas juntamente com as [funções do lado do servidor](/docs/pt-br/tools/protocol-functions).

Algumas funções têm custos de uso. Consulte [Preços e limites](#pricing-and-limits) antes de habilitá‑las em um fluxo de produção.

Observe que cada modelo decide qual função chamar e seus parâmetros. Nem todos os modelos podem obedecer às regras de chamada.

## Como Escolher e Combinar Ferramentas

Ferramentas integradas devem ser habilitadas como capacidades de trabalho, não como decoração de agente. Cada ferramenta adiciona uma decisão ao modelo: ele precisa perceber que a ferramenta existe, entender quando usá‑la, montar argumentos válidos, aguardar o resultado e continuar a resposta. Quanto mais ferramentas semelhantes estiverem disponíveis ao mesmo tempo, maior a chance de uso redundante ou escolha inadequada. Comece com o menor conjunto que resolva o caso de uso e escreva instruções claras sobre quando usar cada uma.

Use `WebSearch` quando a resposta depender de informações públicas, recentes ou variáveis. Use `OpenUrl` quando o usuário já forneceu uma URL e deseja que o assistente analise aquele conteúdo específico. `AdvancedWebUsage` está desativado e retorna uma resposta indisponível; veja [Changelogs](../legal/changelogs.md). Use `Code` para cálculo, transformação de dados e pequeno raciocínio algorítmico. Use `Request` quando o modelo precisar chamar uma API HTTP com método, cabeçalhos ou corpo customizado. Use `Remember` apenas em clientes de chat ou chamadas com um usuário identificável, pois as ferramentas de memória armazenam e recuperam informações persistentes para aquele usuário.

Ferramentas de geração, como imagem, documento e página web, devem ser tratadas como ações de saída. Elas fazem mais do que melhorar uma resposta; criam artefatos hospedados ou anexados à conversa. Portanto, instrua o modelo sobre quando gerar um artefato e quando responder em texto. Por exemplo, gerar um documento pode ser útil para uma cotação, proposta ou resumo formal; gerar uma página web pode ser útil para um relatório visual; gerar uma imagem pode ser útil para ideação criativa. Se o usuário apenas pediu uma explicação, texto simples costuma ser suficiente.

Quando as ferramentas estão disponíveis via `builtin_tools` em uma chamada direta, a aplicação que faz a requisição decide a lista para cada inferência. Quando configurado no gateway de IA, a lista é centralizada e pode ser combinada com habilidades, workers, MCP, funções de protocolo e shell. Em produção, prefira o gateway para políticas permanentes, pois impede que diferentes clientes habilitem ferramentas diferentes sem controle. Use chamadas diretas para testes, rotinas internas e fluxos onde a aplicação realmente precise escolher ferramentas dinamicamente.

Os valores em `builtin_tools.tools` são sinalizadores de configuração como `WebSearch`, `Code` e `OpenUrl`. O modelo vê nomes de funções em tempo de execução como `web_search`, `evaluate_code` e `open_url`. Use os nomes de funções em tempo de execução ao configurar allowlists de ferramentas de habilidade ou allowlists de ferramentas de shell.

## Data e Hora Atuais

Habilite `DateTime` para expor `get_date_time`. Essa ferramenta não aceita argumentos e lê a hora atual quando chamada. Ela retorna a data, hora, dia da semana, fuso horário, deslocamento UTC e um timestamp ISO 8601.

A ferramenta relata o fuso horário do gateway, definido nos `parameters.timeZone` do gateway com um identificador IANA. O padrão é `America/Sao_Paulo`, e mudanças de horário de verão são aplicadas automaticamente. No painel, edite **Time zone** em **Date and time** na aba **Parameters + Tuning** do gateway. O mesmo fuso é usado por ferramentas de agendamento e pela ferramenta Bash, portanto toda data que o modelo lê ou grava usa um único fuso horário. O fuso horário do navegador ou do contexto do usuário não o altera.

Para usar outro fuso em uma única requisição a `/v1/chat/completions`, envie `time_zone`, como `"time_zone": "Asia/Tokyo"`. Identificadores inválidos são rejeitados. Fluxos Batch usam o fuso horário do gateway de IA onde são executados, ou `America/Sao_Paulo` quando nomeiam um modelo diretamente.

Ativação via `builtin_tools`:

```json
{
    "tools": ["DateTime"]
}
```

Para um gateway salvo, inclua `DateTime` em `parameters.sentinelOptions.enabledFunctions`. Para um fluxo Batch, use `enabledTools.enabledFunctions`.

Exemplo de resultado da ferramenta (ilustrativo, não uma leitura real):

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

A data usa `yyyy-MM-dd`, a hora usa `HH:mm:ss` de 24 h, e os nomes dos dias da semana são retornados em inglês. Todos os campos descrevem o mesmo instante.

## Busca na Internet

Esta função habilita a busca na internet em seu modelo. Com ela, o modelo pode consultar informações específicas ou em tempo real, como dados climáticos, notícias, resultados de jogos, etc.

A busca na internet é realizada por múltiplos provedores, escolhidos com base na disponibilidade de rede e latência. AIVAX usa uma mistura de provedores para executar buscas.

AIVAX oferece dois tipos de busca configuráveis via painel:

- **Full**: a busca realizada é completa, inserindo todo o conteúdo de cada resultado no contexto da conversa.
- **Summarized**: a busca realizada é resumida, inserindo no contexto da conversa um resumo gerado por IA pelo próprio provedor de busca.

O modo `Full` pode consumir mais tokens de entrada da conversa, mas pode fornecer resultados mais precisos. Consulte [Preços e limites](#pricing-and-limits) antes de habilitar a busca na internet em produção.

> [!NOTE] 
>
> **Importante:** a busca `Full` nem sempre está disponível.

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

## Busca Avançada na Internet

`AdvancedWebUsage` está desativado e retorna uma resposta indisponível. Veja [Changelogs](../legal/changelogs.md) para detalhes.

## Execução de Código

Esta função permite que o modelo execute código JavaScript e inspecione o resultado da execução. Com ela, o modelo pode avaliar resultados algorítmicos de expressões matemáticas e outras situações que são melhor representadas por código.

O código roda em um ambiente JavaScript protegido. Ele é destinado a cálculos e pequenas transformações, não a I/O de arquivos, acesso à rede ou importação de scripts externos.

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

Esta função permite que o modelo acesse conteúdo externo em URLs e links fornecidos pelo usuário. Com ela, o modelo pode acessar links e avaliar seu conteúdo.

Observe que alguns destinos podem identificar o acesso como um bot e bloqueá‑lo, pois essa função não é um crawler, mas um simples GET ao destino.

Ao obter o conteúdo do link, o sistema verifica o conteúdo retornado e o trata de acordo com cada tipo:

- Conteúdo HTML é renderizado: tags HTML, scripts, CSS e “ruído” são removidos do resultado de acesso, mantendo apenas o texto puro do link.
- Outro conteúdo textual: o conteúdo é lido diretamente e nenhuma transformação é feita.
- Conteúdo não textual: quando o link responde com conteúdo não textual e a resposta indica um nome de arquivo (por caminho ou pelo cabeçalho `Content‑Disposition`), o sistema tenta converter o arquivo baixado para uma versão textual.

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

Habilite `Remember` quando o assistente precisar salvar informações entre conversas e recuperá‑las quando relevantes. Ela expõe exatamente duas ferramentas: `memory_save` e `memory_search`.

Ambas as ferramentas requerem um usuário identificado: defina uma `tag` estável em um [cliente de chat](/docs/pt-br/inference/chat-clients) ou `$.user` em uma requisição chat/completions. Sem esse identificador, as ferramentas retornam erro. As buscas de memória são automaticamente restringidas ao usuário corrente. Cada memória registra o gateway que a salvou, e `parameters.builtinFunctionsOptions.allowSharedMemory` controla a visibilidade:

| `allowSharedMemory` | Comportamento |
| --- | --- |
| `true` (padrão) | O gateway lê, substitui e exclui as memórias do usuário salvas por qualquer gateway na conta. |
| `false` | O gateway só lê, substitui e exclui as memórias do usuário que ele próprio salvou. |

No painel, isso corresponde à opção **Memory visibility** nas configurações de ferramentas do gateway. Memórias salvas fora de um gateway salvo, e memórias migradas das ferramentas de memória anteriores, não têm gateway e são visíveis apenas para gateways com memória compartilhada.

Ativação via `builtin_tools`:

```json
{
    "tools": [
        "Remember"
    ]
}
```

Memórias **não são adicionadas automaticamente às instruções de sistema**. Diga ao modelo quando chamar `memory_search`, por exemplo antes de responder a uma pergunta sobre uma preferência salva. A opção removida `include_all_memory_context`, incluindo sua grafia `IncludeAllMemoryContext`, é ignorada se enviada.

### Salvar, Substituir ou Excluir uma Memória

`memory_save(id?, content?, expiresInDays?)` combina criação, substituição e exclusão. `id` é o identificador da memória; `content` é o texto a salvar, limitado a 10 KB por memória salva; `expiresInDays` é um número inteiro opcional de dias, de 1 a 365, após o qual a memória é excluída automaticamente.

| Argumentos | Resultado |
| --- | --- |
| `content`, com `id` omitido ou `null` | Cria uma memória e devolve seu ID. Sem `expiresInDays`, nunca expira. |
| `id` e `content` | Substitui o conteúdo dessa memória. Sem `expiresInDays`, mantém a expiração atual. |
| `id` e `expiresInDays`, com `content` omitido ou `null` | Altera apenas a expiração dessa memória, contada a partir de agora. |
| Apenas `id` | Exclui essa memória. |
| `id` e `content` ambos omitidos ou `null` | Retorna erro. |

Somente memórias pertencentes ao usuário corrente podem ser substituídas ou excluídas. As antigas ferramentas `memory_update`, `memory_remove` e `memory_clear` não estão mais disponíveis; atualize instruções e tratamento de chamadas de ferramenta para usar `memory_save` para alterações individuais.

### Buscar Memórias

`memory_search(query?, filter?)` requer **exatamente um** argumento: `query` ou `filter`. Enviar ambos ou nenhum retorna erro.

| Argumento | Comportamento |
| --- | --- |
| `query` | Consulta textual para busca semântica nas memórias do usuário corrente, reclassificada com `rrf` (Reciprocal Rank Fusion). Retorna até 10 resultados. |
| `filter` | String usando a [sintaxe de filtro de documentos AIVAX](/docs/pt-br/rag/document-filters). Retorna até 10 memórias correspondentes, mais recentes primeiro, sem gerar embeddings de consulta. |

Cada resultado contém `id`, `content`, `createdAt`, `updatedAt` e `expiresAt` (`null` quando a memória nunca expira). Memórias expiradas nunca são retornadas. Use `query` para encontrar significado; use `filter` para texto exato, metadados ou datas de criação/atualização:

| Objetivo | `filter` |
| --- | --- |
| Criado nos últimos 7 dias | `createdAt >= now-7d` |
| Alterado nas últimas 24 h | `updatedAt >= now-24h` |
| Criado em outubro de 2026 | `createdAt >= "2026-10-01" and createdAt < "2026-11-01"` |
| Não atualizado há 90 dias, por exemplo candidatos obsoletos para revisão | `updatedAt < now-90d` |
| Menciona aniversário e foi criado nos últimos 30 dias | `content contains "birthday" and createdAt >= now-30d` |
| Salvo em uma conversa específica | `metadata.conversation_token = "<conversation token>"` |

Datas e timestamps sem deslocamento usam o fuso horário de referência do servidor descrito em [Document filters — Dates](/docs/pt-br/rag/document-filters#dates). A data de criação ou atualização de uma memória não é a data de um evento mencionado em seu texto.

### Armazenamento e Gerenciamento

Memórias são documentos na coleção RAG `@memories` da sua conta AIVAX. A coleção é criada automaticamente na primeira gravação. O conteúdo de cada documento é o texto da memória, e seus metadados identificam o usuário e a conversa de origem:

```json
{
    "external_user_id": "<user tag>",
    "conversation_token": "<conversation token>",
    "gateway_id": "<gateway ID>",
    "expires_at": 1791580376
}
```

Quando nenhum token de conversa está disponível, `conversation_token` é JSON `null`, não uma string. `gateway_id` é o ID do gateway que salvou a memória, ou `null` quando não foi salva por um gateway salvo. `expires_at` é um timestamp Unix em segundos, ou `null` quando a memória nunca expira. Memórias recém‑salvas ou atualizadas tornam‑se pesquisáveis após a indexação, normalmente em poucos segundos.

Memórias salvas com `expiresInDays` são excluídas em uma limpeza periódica após expirarem; enquanto isso ficam ocultas de `memory_search`. Memórias sem expiração são mantidas até serem excluídas. Ao gerenciar a coleção diretamente, ajuste ou remova `metadata.expires_at` para controlar a expiração. Inspecione e gerencie-as nas páginas Collections e Documents do painel ou via [APIs de Collections e Documents](../rag/collections.md). As APIs dedicadas de Memórias e a página de Memórias do painel foram removidas. **Excluir a coleção `@memories` apaga todas as memórias de usuário na conta**; a coleção é recriada na próxima gravação.

A restrição automática de usuário se aplica às ferramentas de memória. Ao gerenciar a coleção diretamente, use `metadata.external_user_id` para selecionar os registros do usuário desejado e preservar os metadados do usuário.

### Cobrança, Limites e Erros

Salvar ou substituir conteúdo de memória o indexa como qualquer documento, com custos de embedding de documento. Uma busca `query` é cobrada como embedding de consulta RAG. Uma busca `filter` não tem custo de embedding, e o reranker `rrf` não tem custo de reranking. Memória não tem cobrança de ferramenta separada; veja [Preços e limites](#pricing-and-limits).

Ambas as ferramentas de memória usam os [limites de taxa RAG da conta] (rag/collections.md#pricing-and-limits). Se a conta não tem saldo ou atinge um limite de taxa, a ferramenta retorna erro ao modelo. Instrua o modelo a relatar a falha ao invés de afirmar que salvou ou recuperou informação. Para uma gravação recente ainda não encontrada, aguarde a indexação antes de buscar novamente.

### Migração de Ferramentas de Memória e Calendário Anteriores

Memórias não expiradas existentes foram movidas para a coleção `@memories` de cada conta, preservando seus IDs originais, identificadores de usuário em `external_user_id`, datas de criação e datas de expiração em `expires_at`. Registros migrados têm `conversation_token: null`. Eles são re‑indexados, o que gera custo de embedding de documento.

A ferramenta integrada `Calendar` e suas ferramentas de agendamento foram removidas da API e do painel. Gateways e fluxos Batch existentes têm a flag removida automaticamente, mas requisições que ainda incluam `Calendar` em `builtin_tools.tools` falham: remova‑a das requisições. Lembretes de calendário não expirados foram migrados para memórias de texto no formato `Reminder at <date> (<n> minutes): <description>`. Estes são armazenados como texto, não como lembretes agendados ou serviço de calendário substituto.

A antiga API de Memórias, incluindo listagem, obtenção, exclusão e geração de prompts de migração, não está mais disponível. Mova o gerenciamento de memória ao nível da aplicação para as APIs de Collections e Documents. Atualize as instruções do gateway para buscar explicitamente. Gateways com memória privada não veem memórias migradas, pois registros migrados não têm `gateway_id`. O antigo argumento `retentionDays` agora é `expiresInDays`; omiti‑lo cria uma memória que nunca expira, enquanto o padrão antigo era 30 dias.

Para controles ao nível da aplicação sobre gravações, políticas de exclusão e revisão, veja [How to protect LLM agent memory from poisoning](https://aivax.net/blog/persistent-memory-is-a-write-path/).

## Geração de Imagem

Esta função permite que o modelo crie imagens por IA.

Imagens geradas por IA são anexadas ao contexto da conversa, mas não são diretamente visíveis ao assistente.

A geração de imagens pode gerar custos de uso. Consulte [Preços e limites](#pricing-and-limits) antes de habilitá‑la em produção.

Você também pode habilitar a geração de imagens explícitas e adultas. Quando esse recurso está ativado, o modelo poderá gerar material adulto. Para que isso ocorra, o modelo também deve “concordar” em gerar tal conteúdo. Alguns modelos têm filtro de segurança mais baixo que outros. Por exemplo, os modelos Gemini têm o filtro de segurança mais baixo, tornando‑os uma opção viável para role‑play e geração desse tipo de material.

Você é sempre responsável pelo [material que gera](/docs/pt-br/legal/terms-of-service) e o material gerado deve ser compatível com nossos termos de serviço.

Os modelos de geração de imagem disponíveis estão listados no console AIVAX.

Imagens geradas são armazenadas nos servidores AIVAX por alguns meses antes de serem removidas permanentemente.

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

## Busca de Posts no X

Esta função permite que o modelo procure posts no X (antigo Twitter) e leia um post específico quando o modelo tem um ID de post.

É uma alternativa direta ao `web_search`, pois pode ser usada para buscar informações atualizadas em tempo real, como notícias, informações, resultados de jogos, etc. Esta ferramenta fornece resultados muito mais recentes que a ferramenta convencional de busca na internet.

Não é recomendado usar ambas as funções juntas, pois têm o mesmo propósito.

Esta função pode gerar custos de uso. Consulte [Preços e limites](#pricing-and-limits) antes de habilitá‑la em produção.

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

Esta função permite que o modelo crie PDFs a partir de texto HTML.

Os arquivos criados são hospedados nos servidores AIVAX e disponibilizados pelo assistente.

O conteúdo é hospedado por alguns meses antes de ser excluído permanentemente.

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

Esta função permite que o modelo hospede páginas HTML nos servidores AIVAX.

Isso permite que o modelo hospede relatórios, landing pages e outras infografias HTML.

O conteúdo é hospedado por alguns meses antes de ser excluído permanentemente.

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

## Requisição Avançada

Esta função fornece ao modelo uma ferramenta avançada de requisição HTTP. Com ela, o modelo pode definir cabeçalhos, formulários, conteúdos e métodos para realizar requisições HTTP avançadas.

Respostas de texto são lidas até o limite de conteúdo da plataforma. Respostas binárias não são expandidas no contexto; a ferramenta retorna um marcador curto de conteúdo binário com o tipo e tamanho quando disponíveis.

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

Buscas na web e no X são cobradas por busca. O [multiplicador de plano](../pricing.md#plan-multipliers) aplica‑se às cobranças baseadas em tokens. A inferência do modelo usada para invocar uma ferramenta ainda é cobrada à taxa regular. A geração de imagens é cobrada nas taxas do modelo selecionado; veja [Image generation](../generations/images.md).

| Descrição | Preço |
| --- | ---: |
| Busca na web | **$5/1k buscas** |
| Busca no X (Twitter) | **$5/1k buscas** |
| [Memory](#memory) | Salvar ou substituir conteúdo: embedding de documento; busca semântica `query`: embedding de consulta RAG; busca `filter`: sem custo de embedding; reranking `rrf`: sem custo |
| Requisições avançadas | Sem cobrança separada |
| Geração de documento | Sem cobrança separada |
| Geração de página web | Sem cobrança separada |

Um travessão (`—`) indica que o plano não impõe limite, e `Not available` indica que a ferramenta não está disponível no plano.

| Limite | Gratuito | Pro | Máximo |
| --- | --- | --- | --- |
| Busca na web | 15/dia | 1.000/dia | 10.000/dia |
| Busca no X/Twitter | Não disponível | 1.000/dia | 10.000/dia |
| Geração de documento e página web | 5/dia | 1.000/dia | 50.000/dia |
| Geração e edição de imagens | 5/dia | 500/dia | 5.000/dia |
| Ações de serviço geral | 30/dia | 5.000/dia | 100.000/dia |
| [Comandos Bash](shell.md#pricing-and-limits) | 300/hora | 30.000/hora | — |

Ações de serviço geral compartilham uma cota diária de ações de serviço. O conteúdo de memória é limitado a 10 KB.

## Diagnóstico de Ferramentas

Quando uma ferramenta não é chamada, primeiro confirme que está habilitada no gateway ou no campo `builtin_tools` da requisição. Em seguida, verifique se o modelo selecionado suporta chamadas de função ou se um manipulador de ferramenta está configurado para modelos sem suporte nativo. Depois, revise a instrução: se ela não especificar quando buscar, abrir URL, gerar imagem ou consultar memória, o modelo pode responder apenas com seu próprio conhecimento. Por fim, teste uma pergunta direta que claramente exija a ferramenta, como solicitar um artigo de notícias recente para `WebSearch` ou pedir para abrir uma URL específica para `OpenUrl`.

Quando uma ferramenta é chamada com muita frequência, reduza a ambiguidade. Ferramentas como `WebSearch`, `AdvancedWebUsage` e `XPostsSearch` competem por informações recentes; `OpenUrl` e `Request` podem parecer semelhantes quando o usuário envia um link. Para `Remember`, distinga um pedido de salvar informação de uma pergunta que requer recuperar uma memória existente. Remova ferramentas desnecessárias, torne as descrições de instruções do gateway mais restritivas e, quando possível, use workers para bloquear ou substituir chamadas em cenários específicos.

Quando uma ferramenta falha, trate-a como parte normal da experiência. Buscas podem retornar pouco conteúdo, URLs podem bloquear bots, APIs podem negar autorização, geração de imagens pode recusar conteúdo e execução de código pode receber entrada ambígua. Instrua o modelo a explicar a limitação objetivamente e oferecer o próximo passo, como solicitar outro link, tentar uma consulta mais específica, pedir autorização ou responder apenas com base no contexto disponível. Não dependa de uma ferramenta externa como única forma de concluir uma conversa crítica sem um fallback de experiência.
