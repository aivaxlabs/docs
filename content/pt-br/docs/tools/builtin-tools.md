---
{title: Ferramentas integradas,linkTitle: Ferramentas integradas,weight: 340,group: Tools,aliases: [/docs/pt-br/platform/memories.html,/docs/pt-br/tools/builtin-tools.html],sourceHash: 6f67460559b51002}
---

# Ferramentas integradas

AIVAX fornece uma lista de ferramentas integradas que você pode habilitar em seu modelo. Essas ferramentas podem ser usadas junto com as [funções do lado do servidor](/docs/pt-br/tools/protocol-functions).

Algumas funções têm custos de uso. Consulte a [Precificação](../pricing.md) antes de habilitá‑las em um fluxo de produção.

Observe que cada modelo decide qual função chamar e seus parâmetros. Nem todos os modelos podem obedecer às regras de chamada.

## Como escolher e combinar ferramentas

Ferramentas integradas devem ser habilitadas como capacidades de trabalho, não como decoração de agente. Cada ferramenta adiciona uma decisão ao modelo: ele precisa perceber que a ferramenta existe, entender quando usá‑la, montar argumentos válidos, aguardar o resultado e continuar a resposta. Quanto mais ferramentas semelhantes estiverem disponíveis ao mesmo tempo, maior a chance de uso redundante ou escolha inadequada. Comece com o menor conjunto que resolve o caso de uso e escreva instruções claras sobre quando usar cada uma.

Use `WebSearch` quando a resposta depender de informações públicas, recentes ou variáveis. Use `OpenUrl` quando o usuário já forneceu um URL e deseja que o assistente analise aquele conteúdo específico. `AdvancedWebUsage` está desativado e retorna uma resposta indisponível; veja os [Changelogs](../changelogs.md). Use `Code` para cálculo, transformação de dados e raciocínio algorítmico pequeno. Use `Request` quando o modelo precisar chamar uma API HTTP com método, cabeçalhos ou corpo customizado. Use `Remember` apenas em clientes de chat ou chamadas com um usuário identificável, pois as ferramentas de memória armazenam e recuperam informações persistentes para aquele usuário.

Ferramentas de geração, como imagem, documento e página web, devem ser tratadas como ações de saída. Elas fazem mais do que melhorar uma resposta; criam artefatos hospedados ou anexados à conversa. Portanto, instrua o modelo sobre quando gerar um artefato e quando responder em texto. Por exemplo, gerar um documento pode ser útil para uma cotação, proposta ou resumo formal; gerar uma página web pode ser útil para um relatório visual; gerar uma imagem pode ser útil para ideação criativa. Se o usuário apenas pediu uma explicação, texto simples geralmente é suficiente.

Quando as ferramentas estão disponíveis via `builtin_tools` em uma chamada direta, a aplicação que faz a requisição decide a lista para cada inferência. Quando configurado no AI Gateway, a lista é centralizada e pode ser combinada com habilidades, workers, MCP, funções de protocolo e shell. Em produção, prefira o gateway para políticas permanentes, pois ele impede que diferentes clientes habilitem ferramentas diferentes sem controle. Use chamadas diretas para testes, rotinas internas e fluxos onde a aplicação realmente precisa escolher ferramentas dinamicamente.

Os valores em `builtin_tools.tools` são flags de configuração como `WebSearch`, `Code` e `OpenUrl`. O modelo vê nomes de funções em tempo de execução como `web_search`, `evaluate_code` e `open_url`. Use os nomes de funções em tempo de execução ao configurar allowlists de habilidades ou allowlists de ferramentas de shell.

## Data e hora atuais

Habilite `DateTime` para expor `get_date_time`. Essa ferramenta não aceita argumentos e lê a hora atual quando chamada. Ela retorna a data, hora, dia da semana, fuso horário, deslocamento UTC e um timestamp ISO 8601.

No painel, selecione **Data e hora atuais** nas ferramentas integradas do gateway, depois edite seu **Fuso horário** em **Configuração de data e hora atuais**. As opções do playground de Funções e da ferramenta de fluxo de trabalho em lote também expõem essa configuração.

Configure `dateTimeTimeZone` com um identificador de fuso horário IANA. O padrão é `America/Los_Angeles` (Horário do Pacífico), que segue automaticamente as mudanças de horário de verão PST/PDT em vez de usar um deslocamento UTC fixo. Por exemplo, use `America/Sao_Paulo` para São Paulo ou `UTC` para UTC. Identificadores inválidos são rejeitados. A ferramenta usa esse fuso configurado, não o fuso do navegador ou do contexto do usuário.

Ativação via `builtin_tools`:

```json
{
    "tools": ["DateTime"],
    "options": {
        "dateTimeTimeZone": "America/Los_Angeles"
    }
}
```

Para um gateway salvo, inclua `DateTime` em `parameters.sentinelOptions.enabledFunctions` e defina `parameters.builtinFunctionsOptions.dateTimeTimeZone`. Para um fluxo de trabalho em lote, use `enabledTools.enabledFunctions` e `enabledTools.options.dateTimeTimeZone`.

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

A data usa `yyyy-MM-dd`, a hora usa o formato de 24 h `HH:mm:ss` e os nomes dos dias da semana são retornados em inglês. Todos os campos descrevem o mesmo instante.

## Pesquisa na Internet

Esta função habilita a pesquisa na Internet em seu modelo. Com ela, o modelo pode consultar informações específicas ou em tempo real, como dados meteorológicos, notícias, resultados de jogos, etc.

A pesquisa na Internet é realizada por múltiplos provedores, escolhidos com base na disponibilidade de rede e latência. AIVAX utiliza uma mistura de provedores para executar pesquisas na Internet.

AIVAX oferece dois tipos de pesquisa configuráveis pelo painel:

- **Full**: a pesquisa realizada é completa, inserindo todo o conteúdo de cada resultado no contexto da conversa.
- **Summarized**: a pesquisa realizada é resumida, inserindo no contexto da conversa um resumo gerado por IA pelo próprio provedor de pesquisa.

O modo `Full` pode consumir mais tokens de entrada da conversa, mas pode fornecer resultados mais precisos. Consulte a [Precificação](../pricing.md) e [Planos e limites](../limits.md) antes de habilitar a pesquisa na Internet em produção.

> [!NOTE] 
>
> **Importante:** a pesquisa `Full` nem sempre está disponível.

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

## Pesquisa avançada na Internet

`AdvancedWebUsage` está desativado e retorna uma resposta indisponível. Veja os [Changelogs](../changelogs.md) para detalhes.

## Execução de código

Esta função permite que o modelo execute código JavaScript e inspecione o resultado da execução. Com ela, o modelo pode avaliar resultados algorítmicos de expressões matemáticas e outras situações que são melhor representadas por código.

O código roda em um ambiente JavaScript protegido. Destina‑se a cálculos e pequenas transformações, não a I/O de arquivos, acesso à rede ou importação de scripts externos.

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

Observe que alguns destinos podem identificar o acesso como um bot e bloqueá‑lo, pois essa função não faz rastreamento, mas um simples GET ao destino.

Ao obter o conteúdo do link, o sistema verifica o conteúdo retornado e o trata de acordo com cada tipo:

- Conteúdo HTML é renderizado: tags HTML, scripts, CSS e “ruído” são removidos do resultado de acesso, mantendo apenas o texto plano do link.
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

Ambas as ferramentas requerem um usuário identificado: defina uma `tag` estável em um [cliente de chat](/docs/pt-br/features/chat-clients) ou `$.user` em uma requisição de chat/completions. Sem esse identificador, as ferramentas retornam um erro. As buscas de memória são automaticamente restritas ao usuário atual. Cada memória registra o gateway que a salvou, e `parameters.builtinFunctionsOptions.allowSharedMemory` controla a visibilidade:

| `allowSharedMemory` | Comportamento |
| --- | --- |
| `true` (padrão) | O gateway lê, substitui e exclui as memórias do usuário salvas por qualquer gateway na conta. |
| `false` | O gateway lê, substitui e exclui apenas as memórias do usuário que ele próprio salvou. |

No painel, isso corresponde à opção **Visibilidade da memória** nas configurações de ferramentas do gateway. Memórias salvas fora de um gateway salvo, e memórias migradas das ferramentas de memória anteriores, não têm gateway e são visíveis apenas para gateways com memória compartilhada.

Ativação via `builtin_tools`:

```json
{
    "tools": [
        "Remember"
    ]
}
```

Memórias **não são adicionadas automaticamente às instruções do sistema**. Instrua o modelo quando chamar `memory_search`, por exemplo, antes de responder a uma pergunta sobre uma preferência salva. A opção removida `include_all_memory_context`, incluindo sua grafia `IncludeAllMemoryContext`, é ignorada se enviada.

### Salvar, substituir ou excluir uma memória

`memory_save(id?, content?, expiresInDays?)` combina criação, substituição e exclusão. `id` é o identificador da memória; `content` é o texto a ser salvo, limitado a **10 KB**; `expiresInDays` é um número inteiro opcional de dias, de 1 a 365, após o qual a memória é excluída automaticamente.

| Argumentos | Resultado |
| --- | --- |
| `content`, com `id` omitido ou `null` | Cria uma memória e retorna seu ID. Sem `expiresInDays`, nunca expira. |
| `id` e `content` | Substitui o conteúdo dessa memória. Sem `expiresInDays`, mantém a expiração atual. |
| `id` e `expiresInDays`, com `content` omitido ou `null` | Altera apenas a expiração dessa memória, contada a partir de agora. |
| Apenas `id` | Exclui essa memória. |
| `id` e `content` ambos omitidos ou `null` | Retorna um erro. |

Somente memórias pertencentes ao usuário atual podem ser substituídas ou excluídas. As antigas ferramentas `memory_update`, `memory_remove` e `memory_clear` não estão mais disponíveis; atualize as instruções e o tratamento de chamadas de ferramenta para usar `memory_save` para alterações individuais.

### Buscar memórias

`memory_search(query?, filter?)` requer **exatamente um** argumento: `query` ou `filter`. Enviar ambos ou nenhum gera um erro.

| Argumento | Comportamento |
| --- | --- |
| `query` | Consulta textual para busca semântica nas memórias do usuário atual, reclassificada com `rrf` (Reciprocal Rank Fusion). Retorna até 10 resultados. |
| `filter` | String usando a [sintaxe de filtro de documentos do AIVAX](/docs/pt-br/filters/document-filters). Retorna até 10 memórias correspondentes, mais recentes primeiro, sem gerar embeddings de consulta. |

Cada resultado contém `id`, `content`, `createdAt`, `updatedAt` e `expiresAt` (`null` quando a memória nunca expira). Memórias expiradas nunca são retornadas. Use `query` para encontrar significado; use `filter` para texto exato, metadados ou datas de criação e atualização:

| Objetivo | `filter` |
| --- | --- |
| Criado nos últimos 7 dias | `createdAt >= now-7d` |
| Alterado nas últimas 24 horas | `updatedAt >= now-24h` |
| Criado em outubro de 2026 | `createdAt >= "2026-10-01" and createdAt < "2026-11-01"` |
| Não atualizado há 90 dias, por exemplo candidatos obsoletos para revisão | `updatedAt < now-90d` |
| Menciona um aniversário e foi criado nos últimos 30 dias | `content contains "birthday" and createdAt >= now-30d` |
| Salvo em uma conversa específica | `metadata.conversation_token = "<conversation token>"` |

Datas e timestamps sem deslocamento usam o fuso horário de referência do servidor descrito em [Filtros de documento — Datas](/docs/pt-br/filters/document-filters#dates). A data de criação ou atualização de uma memória não é a data de um evento mencionado em seu texto.

### Armazenamento e gerenciamento

Memórias são documentos na coleção RAG `@memories` da sua conta AIVAX. A coleção é criada automaticamente na primeira gravação. O conteúdo de cada documento é o texto da memória, e seus metadados identificam o usuário e a conversa de origem:

```json
{
    "external_user_id": "<user tag>",
    "conversation_token": "<conversation token>",
    "gateway_id": "<gateway ID>",
    "expires_at": 1791580376
}
```

Quando nenhum token de conversa está disponível, `conversation_token` é JSON `null`, não uma string. `gateway_id` é o ID do gateway que salvou a memória, ou `null` quando não foi salva por um gateway salvo. `expires_at` é um timestamp Unix em segundos, ou `null` quando a memória nunca expira. Memórias recém‑salvas ou atualizadas tornam‑se pesquisáveis após a indexação concluir, geralmente em poucos segundos.

Memórias salvas com `expiresInDays` são excluídas em uma limpeza periódica após expirarem; até lá ficam ocultas de `memory_search`. Memórias sem expiração permanecem até serem excluídas. Ao gerenciar a coleção diretamente, defina ou remova `metadata.expires_at` para controlar a expiração. Inspecione e gerencie‑as nas páginas de Coleções e Documentos do painel ou via [APIs de Coleções e Documentos](../rag/collections.md). As APIs dedicadas de Memórias e a página de Memórias do painel foram removidas. **Excluir a coleção `@memories` apaga todas as memórias dos usuários da conta**; a coleção é recriada na próxima gravação.

A restrição automática de usuário aplica‑se às ferramentas de memória. Ao gerenciar a coleção diretamente, use `metadata.external_user_id` para selecionar os registros do usuário desejado e preservar os metadados do usuário.

### Cobrança, limites e erros

Salvar ou substituir conteúdo de memória indexa‑o como qualquer documento de coleção, com custos de embedding de documento. Uma busca `query` é cobrada como embedding de consulta RAG. Uma busca `filter` não tem custo de embedding, e o reranker `rrf` não tem custo de reclassificação. Consulte a [Precificação](../pricing.md).

Ambas as ferramentas de memória usam os [limites de taxa RAG da conta](../limits.md#plan-limits). Se a conta não tem saldo ou atinge um limite de taxa, a ferramenta retorna um erro ao modelo. Instrua o modelo a relatar a falha em vez de alegar ter salvo ou recuperado informação. Para uma gravação recente que ainda não foi encontrada, aguarde a indexação concluir antes de buscar novamente.

### Migração de ferramentas de memória e calendário anteriores

Memórias não expiradas existentes foram movidas para a coleção `@memories` de cada conta, preservando seus IDs originais, identificadores de usuário em `external_user_id`, datas de criação e datas de expiração em `expires_at`. Registros migrados têm `conversation_token: null`. Eles são re‑indexados, o que gera custos de embedding de documento.

A ferramenta integrada `Calendar` e suas ferramentas de agendamento foram removidas da API e do painel. Gateways e fluxos de trabalho em lote existentes têm a flag removida automaticamente, mas requisições que ainda incluam `Calendar` em `builtin_tools.tools` falham: remova‑a das suas requisições. Lembretes de calendário não expirados foram migrados para memórias de texto no formato `Reminder at <date> (<n> minutes): <description>`. Estes são armazenados como texto, não como lembretes agendados ou serviço de calendário substituto.

A antiga API de Memórias, incluindo listagem, obtenção, exclusão e geração de prompt de migração, não está mais disponível. Mova o gerenciamento de memória ao nível da aplicação para as APIs de Coleções e Documentos. Atualize as instruções do gateway para buscar explicitamente. Gateways com memória privada não veem memórias migradas, pois os registros migrados não têm `gateway_id`. O antigo argumento `retentionDays` agora é `expiresInDays`; omiti‑lo cria uma memória que nunca expira, enquanto o padrão antigo era 30 dias.

Para controles ao nível da aplicação sobre gravações de memória, políticas de exclusão e revisão, veja [Como proteger a memória de agentes LLM contra envenenamento](https://aivax.net/blog/persistent-memory-is-a-write-path/).

## Geração de imagem

Esta função permite que o modelo crie imagens de IA.

Imagens geradas por IA são anexadas ao contexto da conversa, mas não são diretamente visíveis ao assistente.

A geração de imagens pode gerar custos de uso. Consulte a [Precificação](../pricing.md) antes de habilitá‑la em produção.

Você também pode habilitar a geração de imagens explícitas e adultas. Quando esse recurso está ativado, o modelo será autorizado a gerar material adulto. Para que isso ocorra, o modelo também deve “concordar” em gerar esse conteúdo. Alguns modelos têm filtro de segurança mais baixo que outros. Por exemplo, os modelos Gemini têm o filtro de segurança mais baixo, tornando‑os uma opção viável para role‑play e geração desse tipo de material.

Você é sempre responsável pelo [material que gera](/docs/pt-br/legal/terms-of-service) e o material gerado deve ser compatível com nossos termos de serviço.

Os modelos de geração de imagem disponíveis são listados no console AIVAX.

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

## Pesquisa de postagens X

Esta função permite que o modelo pesquise postagens no X (antes Twitter) e leia uma postagem específica quando o modelo tem o ID da postagem.

É uma alternativa direta ao `web_search`, pois pode ser usada para buscar informações atualizadas em tempo real, como notícias, informações, resultados de jogos, etc. Essa ferramenta fornece resultados muito mais recentes que a ferramenta de pesquisa tradicional da Internet.

Não é recomendado usar ambas as funções juntas, pois elas têm o mesmo propósito.

Esta função pode gerar custos de uso. Consulte a [Precificação](../pricing.md) antes de habilitá‑la em produção.

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

## Geração de documento

Esta função permite que o modelo crie PDFs a partir de texto HTML.

Os arquivos criados são hospedados nos servidores AIVAX e disponibilizados pelo assistente.

O conteúdo permanece hospedado por alguns meses antes de ser excluído permanentemente.

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

## Geração de página web

Esta função permite que o modelo hospede páginas HTML nos servidores AIVAX.

Isso permite que o modelo hospede relatórios, landing pages e outras infografias HTML.

O conteúdo permanece hospedado por alguns meses antes de ser excluído permanentemente.

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

## Solicitação avançada

Esta função fornece ao modelo uma ferramenta avançada de requisição HTTP. Com ela, o modelo pode definir cabeçalhos, formulários, conteúdos e métodos para realizar requisições HTTP avançadas.

Respostas de texto são lidas até o limite de conteúdo da plataforma. Respostas binárias não são expandidas no contexto; a ferramenta retorna um marcador de conteúdo binário curto com o tipo de conteúdo e tamanho quando disponível.

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

## Diagnóstico de ferramenta

Quando uma ferramenta não é chamada, primeiro confirme que está habilitada no gateway ou no campo `builtin_tools` da requisição. Depois, verifique se o modelo selecionado suporta chamadas de função ou se um manipulador de ferramenta está configurado para modelos sem suporte nativo. Em seguida, revise a instrução: se ela não especificar quando buscar, abrir um URL, gerar uma imagem ou consultar memória, o modelo pode responder apenas com seu próprio conhecimento. Por fim, teste uma pergunta direta que claramente exija a ferramenta, como solicitar um artigo de notícias recente para `WebSearch` ou pedir para abrir um URL específico para `OpenUrl`.

Quando uma ferramenta é chamada com muita frequência, reduza a ambiguidade. Ferramentas como `WebSearch`, `AdvancedWebUsage` e `XPostsSearch` competem por informações recentes; `OpenUrl` e `Request` podem parecer semelhantes quando o usuário envia um link. Para `Remember`, diferencie um pedido de salvar informação de uma pergunta que requer recuperar uma memória existente. Remova ferramentas desnecessárias, torne as descrições das instruções do gateway mais restritivas e, quando possível, use workers para bloquear ou substituir chamadas em cenários específicos.

Quando uma ferramenta falha, trate‑a como parte normal da experiência. Pesquisas podem retornar pouco conteúdo, URLs podem bloquear bots, APIs podem negar autorização, a geração de imagens pode recusar conteúdo e a execução de código pode receber entrada ambígua. Instrua o modelo a explicar a limitação objetivamente e oferecer o próximo passo, como solicitar outro link, tentar uma consulta mais específica, pedir autorização ou responder apenas com base no contexto disponível. Não dependa de uma ferramenta externa como única forma de concluir uma conversa crítica sem um fallback de experiência.
