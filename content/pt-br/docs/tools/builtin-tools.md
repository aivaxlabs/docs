---
{title: Ferramentas Incorporadas,linkTitle: Ferramentas incorporadas,weight: 340,group: Tools,aliases: [/docs/pt-br/platform/memories.html,/docs/pt-br/tools/builtin-tools.html],sourceHash: 96b07c87a5ba6bb8}
---

# Ferramentas Incorporadas

AIVAX fornece uma lista de ferramentas incorporadas que você pode habilitar em seu modelo. Essas ferramentas podem ser usadas juntamente com as [funções do lado do servidor](/docs/pt-br/tools/protocol-functions).

Algumas funções têm custos de uso. Consulte a [Precificação](../pricing.md) antes de habilitá‑las em um fluxo de produção.

Observe que cada modelo decide qual função chamar e seus parâmetros. Nem todos os modelos podem obedecer às regras de chamada.

## Como Escolher e Combinar Ferramentas

Ferramentas incorporadas devem ser habilitadas como capacidades de trabalho, não como decoração de agente. Cada ferramenta adiciona uma decisão ao modelo: ele precisa perceber que a ferramenta existe, entender quando usá‑la, montar argumentos válidos, aguardar o resultado e continuar a resposta. Quanto mais ferramentas semelhantes estiverem disponíveis ao mesmo tempo, maior a chance de uso redundante ou escolha inadequada. Comece com o menor conjunto que resolve o caso de uso e escreva instruções claras sobre quando usar cada uma.

Use `WebSearch` quando a resposta depender de informações públicas, recentes ou variáveis. Use `OpenUrl` quando o usuário já forneceu uma URL e deseja que o assistente analise aquele conteúdo específico. `AdvancedWebUsage` está desativada e retorna uma resposta indisponível; veja os [Changelogs](../changelogs.md). Use `Code` para cálculo, transformação de dados e pequeno raciocínio algorítmico. Use `Request` quando o modelo precisar chamar uma API HTTP com método, cabeçalhos ou corpo customizado. Use `Remember` e `Calendar` apenas em clientes de chat ou chamadas com um usuário identificável, pois essas ferramentas dependem de contexto persistente por usuário.

Ferramentas de geração, como imagem, documento e página web, devem ser tratadas como ações de saída. Elas fazem mais do que melhorar uma resposta; criam artefatos hospedados ou anexados à conversa. Portanto, instrua o modelo sobre quando gerar um artefato e quando responder em texto. Em suporte, por exemplo, gerar um documento pode ser útil para um orçamento, proposta ou resumo formal; gerar uma página web pode ser útil para um relatório visual; gerar uma imagem pode ser útil para ideação criativa. Se o usuário apenas pediu uma explicação, texto simples geralmente é suficiente.

Quando as ferramentas estão disponíveis via `builtin_tools` em uma chamada direta, a aplicação que faz a solicitação decide a lista para cada inferência. Quando configurado no AI Gateway, a lista é centralizada e pode ser combinada com habilidades, workers, MCP, funções de protocolo e shell. Em produção, prefira o gateway para políticas permanentes, pois ele impede que diferentes clientes habilitem ferramentas diferentes sem controle. Use chamadas diretas para testes, rotinas internas e fluxos onde a aplicação realmente precisa escolher ferramentas dinamicamente.

Os valores em `builtin_tools.tools` são sinalizadores de configuração como `WebSearch`, `Code` e `OpenUrl`. O modelo vê nomes de funções em tempo de execução como `web_search`, `evaluate_code` e `open_url`. Use nomes de funções em tempo de execução ao configurar listas de permissão de ferramentas de habilidade ou de shell.

## Data e Hora Atuais

Habilite `DateTime` para expor `get_date_time`. Essa ferramenta não aceita argumentos e lê a hora atual quando chamada. Ela retorna a data, hora, dia da semana, fuso horário, deslocamento UTC e um timestamp ISO 8601.

No painel, selecione **Data e hora atuais** nas ferramentas incorporadas do gateway, depois edite seu **Fuso horário** em **Configuração de data e hora atuais**. As opções do playground de Funções e da ferramenta de fluxo de trabalho em lote também expõem essa configuração.

Configure `dateTimeTimeZone` com um identificador de fuso horário IANA. O padrão é `America/Los_Angeles` (Horário do Pacífico), que segue automaticamente as mudanças de horário de verão PST/PDT ao invés de usar um deslocamento UTC fixo. Por exemplo, use `America/Sao_Paulo` para São Paulo ou `UTC` para UTC. Identificadores inválidos são rejeitados. A ferramenta usa esse fuso configurado, não o fuso do navegador ou do contexto do usuário.

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

A data usa `yyyy-MM-dd`, a hora usa o formato de 24 h `HH:mm:ss`, e os nomes dos dias da semana são retornados em inglês. Todos os campos descrevem o mesmo instante.

## Busca na Internet

Essa função habilita a busca na internet em seu modelo. Com ela, o modelo pode consultar informações específicas ou em tempo real, como dados meteorológicos, notícias, resultados de jogos etc.

A busca na internet é realizada por múltiplos provedores, escolhidos com base na disponibilidade de rede e latência. AIVAX usa uma mistura de provedores para realizar buscas na internet.

AIVAX fornece dois tipos de buscas configuráveis via painel:

- **Full**: a busca realizada é completa, inserindo todo o conteúdo de cada resultado no contexto da conversa.
- **Summarized**: a busca realizada é resumida, inserindo no contexto da conversa um resumo gerado por IA pelo próprio provedor da busca.

O modo `Full` pode consumir mais tokens de entrada da conversa, mas pode fornecer resultados mais precisos. Consulte a [Precificação](../pricing.md) e [Planos e limites](../limits.md) antes de habilitar a busca na internet em produção.

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

`AdvancedWebUsage` está desativada e retorna uma resposta indisponível. Veja os [Changelogs](../changelogs.md) para detalhes.

## Execução de Código

Essa função permite que o modelo execute código JavaScript e inspecione o resultado da execução. Com ela, o modelo pode avaliar resultados algorítmicos de expressões matemáticas e outras situações que são melhor representadas por código.

O código roda em um ambiente JavaScript protegido. Ele é destinado a cálculos e pequenas transformações, não para I/O de arquivos, acesso à rede ou importação de scripts externos.

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

Essa função permite que o modelo acesse conteúdo externo em URLs e links fornecidos pelo usuário. Com essa função, o modelo pode acessar links e avaliar seu conteúdo.

Observe que alguns destinos podem identificar o acesso como um bot e bloqueá‑lo, pois essa função não é um rastreamento, mas um simples GET ao destino.

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

Essa função permite que o modelo armazene conteúdo relevante para ser usado em múltiplas conversas.

> Atualmente, essa função está disponível apenas quando usada em [clientes de chat](/docs/pt-br/features/chat-clients) e quando a sessão é identificada por um `tag`.

Através do `tag` da sessão, o modelo armazena um fragmento relevante de dados da conversa, como preferências de nome ou contexto persistente que o assistente deve lembrar.

A ferramenta de memória requer uma sessão identificável. Sem um ID de referência de usuário, as operações de memória retornam erro ao invés de armazenar ou buscar informações. A instrução de memória diz ao modelo para não salvar dados sensíveis ou pessoais; no entanto, não há garantia de que o modelo sempre seguirá essa regra.

Cada memória salva pode incluir um período de retenção. Itens de memória podem ser buscados, atualizados, removidos individualmente ou limpos para o usuário.

> Observação: em solicitações de chat/completions, o `tag` é especificado no parâmetro `$.user`.

Ativação via `builtin_tools`:

```json
{
    "tools": [
        "Remember"
    ],
    "options": {
        "include_all_memory_context": true
    }
}
```

Para controles ao nível de aplicação sobre gravações, retenção e revisão de memória, veja [Como proteger a memória de agentes LLM contra envenenamento](https://aivax.net/blog/persistent-memory-is-a-write-path/).

## Geração de Imagem

Essa função permite que o modelo crie imagens de IA.

Imagens geradas por IA são anexadas ao contexto da conversa, mas não são diretamente visíveis ao assistente.

A geração de imagens pode gerar custos de uso. Consulte a [Precificação](../pricing.md) antes de habilitá‑la em produção.

Você também pode habilitar a geração de imagens explícitas e adultas. Quando esse recurso está ativado, o modelo será permitido a gerar material adulto. Para que isso ocorra, o modelo também deve “concordar” em gerar esse conteúdo. Alguns modelos têm filtro de segurança mais baixo que outros. Por exemplo, modelos Gemini têm o filtro de segurança mais baixo, tornando‑os uma opção viável para role‑play e geração desse tipo de material.

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

Essa função permite que o modelo procure posts no X (antigo Twitter) e leia um post específico quando o modelo tem um ID de post.

É uma alternativa direta ao `web_search`, pois pode ser usada para buscar informações atualizadas em tempo real, como notícias, informações, resultados de jogos etc. Essa ferramenta fornece resultados muito mais recentes que a ferramenta convencional de busca na internet.

Não é recomendado usar ambas as funções juntas porque têm o mesmo propósito.

Essa função pode gerar custos de uso. Consulte a [Precificação](../pricing.md) antes de habilitá‑la em produção.

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

Essa função permite que o modelo crie PDFs a partir de texto HTML.

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

Essa função permite que o modelo hospede páginas HTML nos servidores AIVAX.

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

Essa função fornece ao modelo uma ferramenta avançada de requisição HTTP. Com ela, o modelo pode definir cabeçalhos, formulários, conteúdos e métodos para realizar requisições HTTP avançadas.

Respostas de texto são lidas até o limite de conteúdo da plataforma. Respostas binárias não são expandidas no contexto; a ferramenta retorna um marcador curto de conteúdo binário com o tipo de conteúdo e tamanho quando disponível.

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

## Calendário

O calendário usa o mesmo armazenamento de informações persistente da memória, mas armazena objetos de lembrete baseados em datas ao invés de texto solto. Ele pode criar, buscar, encontrar, atualizar e excluir compromissos para um usuário identificado.

Não é recomendado ativar essa função junto com a função de memória ou funções de agendamento de mensagens do cliente de chat.

Ativação via `builtin_tools`:

```json
{
    "tools": [
        "Calendar"
    ],
    "options": {
    }
}
```

## Diagnóstico de Ferramenta

Quando uma ferramenta não é chamada, primeiro confirme que ela está habilitada no gateway ou no campo `builtin_tools` da solicitação. Em seguida, verifique se o modelo selecionado suporta chamadas de função ou se um manipulador de ferramenta está configurado para modelos sem suporte nativo. Depois, revise a instrução: se ela não especificar quando buscar, abrir uma URL, gerar uma imagem ou consultar memória, o modelo pode responder apenas com seu próprio conhecimento. Por fim, teste uma pergunta direta que claramente exija a ferramenta, como solicitar um artigo de notícias recente para `WebSearch` ou pedir para abrir uma URL específica para `OpenUrl`.

Quando uma ferramenta é chamada com muita frequência, reduza a ambiguidade. Ferramentas como `WebSearch`, `AdvancedWebUsage` e `XPostsSearch` competem por informações recentes; `OpenUrl` e `Request` podem parecer semelhantes quando o usuário envia um link; `Remember` e `Calendar` podem se sobrepor quando o usuário fala sobre preferências e datas. Remova ferramentas desnecessárias, torne as descrições das instruções do gateway mais restritivas e, quando possível, use workers para bloquear ou substituir chamadas em cenários específicos.

Quando uma ferramenta falha, trate-a como parte normal da experiência. Buscas podem retornar pouco conteúdo, URLs podem bloquear bots, APIs podem negar autorização, geração de imagens pode recusar conteúdo e execução de código pode receber entrada ambígua. Instrua o modelo a explicar a limitação objetivamente e oferecer o próximo passo, como solicitar outro link, tentar uma consulta mais específica, pedir autorização ou responder apenas com base no contexto disponível. Não dependa de uma ferramenta externa como única forma de concluir uma conversa crítica sem uma alternativa de experiência.
