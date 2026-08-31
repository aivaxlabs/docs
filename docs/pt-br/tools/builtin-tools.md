# Ferramentas Integradas

AIVAX fornece uma lista de ferramentas integradas para você habilitar em seu modelo. Essas ferramentas podem ser usadas juntamente com as [funções do lado do servidor](/docs/pt-br/tools/protocol-functions).

Algumas funções têm custos de uso. Consulte [Preços](../pricing.md) antes de habilitá‑las em um fluxo de trabalho de produção.

Observe que cada modelo decide qual função chamar e seus parâmetros. Nem todos os modelos podem obedecer às regras de chamada.

## Como Escolher e Combinar Ferramentas

Ferramentas integradas devem ser habilitadas como capacidades de trabalho, não como decoração de agente. Cada ferramenta adiciona uma decisão ao modelo: ele precisa perceber que a ferramenta existe, entender quando usá‑la, montar argumentos válidos, aguardar o resultado e continuar a resposta. Quanto mais ferramentas semelhantes estiverem disponíveis ao mesmo tempo, maior a chance de uso redundante ou escolha inadequada. Comece com o menor conjunto que resolva o caso de uso e escreva instruções claras sobre quando usar cada uma.

Use `WebSearch` quando a resposta depende de informações públicas, recentes ou variáveis. Use `OpenUrl` quando o usuário já forneceu uma URL e deseja que o assistente analise aquele conteúdo específico. Use `AdvancedWebUsage` quando a tarefa requer uma pesquisa mais profunda em múltiplas fontes ao invés de uma única busca. Use `Code` para cálculo, transformação de dados e raciocínio algorítmico pequeno. Use `Request` quando o modelo precisa chamar uma API HTTP com método, cabeçalhos ou corpo personalizado. Use `Remember` e `Calendar` apenas em clientes de chat ou chamadas com um usuário identificável, pois essas ferramentas dependem de contexto persistente por usuário.

Ferramentas de geração, como imagem, documento e página web, devem ser tratadas como ações de saída. Elas fazem mais do que melhorar uma resposta; criam artefatos hospedados ou anexados à conversa. Portanto, instrua o modelo sobre quando gerar um artefato e quando responder em texto. No suporte, por exemplo, gerar um documento pode ser útil para uma cotação, proposta ou resumo formal; gerar uma página web pode ser útil para um relatório visual; gerar uma imagem pode ser útil para ideação criativa. Se o usuário apenas pediu uma explicação, texto simples geralmente é suficiente.

Quando as ferramentas estão disponíveis via `builtin_tools` em uma chamada direta, a aplicação que faz a solicitação decide a lista para cada inferência. Quando configurado no AI Gateway, a lista é centralizada e pode ser combinada com habilidades, workers, MCP, funções de protocolo e shell. Em produção, prefira o gateway para políticas permanentes, pois impede que diferentes clientes habilitem ferramentas diferentes sem controle. Use chamadas diretas para testes, rotinas internas e fluxos onde a aplicação realmente precisa escolher ferramentas dinamicamente.

Os valores em `builtin_tools.tools` são bandeiras de configuração como `WebSearch`, `Code` e `OpenUrl`. O modelo vê nomes de funções em tempo de execução como `web_search`, `evaluate_code` e `open_url`. Use nomes de funções em tempo de execução ao configurar listas de permissão de ferramentas de habilidade ou de shell.

## Busca na Internet

Esta função habilita a busca na internet no seu modelo. Com isso, o modelo pode consultar informações específicas ou em tempo real, como dados meteorológicos, notícias, resultados de jogos, etc.

A busca na internet é realizada por múltiplos provedores, escolhidos com base na disponibilidade de rede e latência. AIVAX usa uma combinação de provedores para realizar buscas na internet.

AIVAX oferece dois tipos de buscas configuráveis via seu painel:

- **Full**: a busca realizada é completa, inserindo o conteúdo inteiro de cada resultado no contexto da conversa.
- **Summarized**: a busca realizada é resumida, inserindo no contexto da conversa um resumo gerado por IA pelo próprio provedor de busca.

O modo `Full` pode consumir mais tokens de entrada da conversa, mas pode fornecer resultados mais precisos. Consulte [Preços](../pricing.md) e [Planos e limites](../limits.md) antes de habilitar a busca na internet em produção.

> [!NOTE] 
>
> **Importante:** a busca `Full` nem sempre está disponível.

Activation via `builtin_tools`:

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

## Diagnóstico de Ferramentas

Quando uma ferramenta não é chamada, primeiro confirme que ela está habilitada no gateway ou no campo `builtin_tools` da solicitação. Em seguida, verifique se o modelo selecionado suporta chamadas de função ou se um manipulador de ferramenta está configurado para modelos sem suporte nativo. Depois, revise a instrução: se não especificar quando buscar, abrir uma URL, gerar uma imagem ou consultar a memória, o modelo pode responder apenas com seu próprio conhecimento. Finalmente, teste uma pergunta direta que claramente exija a ferramenta, como solicitar um artigo de notícias recente para `WebSearch` ou pedir para abrir uma URL específica para `OpenUrl`.

Quando uma ferramenta é chamada com muita frequência, reduza a ambiguidade. Ferramentas como `WebSearch`, `AdvancedWebUsage` e `XPostsSearch` competem por informações recentes; `OpenUrl` e `Request` podem parecer semelhantes quando o usuário envia um link; `Remember` e `Calendar` podem se sobrepor quando o usuário fala sobre preferências e datas. Remova ferramentas desnecessárias, torne as descrições de instruções do gateway mais restritivas e, quando possível, use workers para bloquear ou substituir chamadas em cenários específicos.

Quando uma ferramenta falha, trate-a como parte normal da experiência. As buscas podem retornar pouco conteúdo, URLs podem bloquear bots, APIs podem negar autorização, a geração de imagens pode recusar conteúdo e a execução de código pode receber entrada ambígua. Instrua o modelo a explicar a limitação de forma objetiva e oferecer o próximo passo, como solicitar outro link, tentar uma consulta mais específica, pedir autorização ou responder apenas com base no contexto disponível. Não dependa de uma ferramenta externa como a única forma de concluir uma conversa crítica sem um fallback de experiência.

## Busca Avançada na Internet

Esta função executa uma solicitação de pesquisa web mais profunda através do agente de pesquisa da AIVAX. Destina‑se a perguntas complexas que necessitam de síntese entre múltiplas fontes ou de uma passagem de pesquisa mais detalhada do que `WebSearch`.

O nome da função em tempo de execução é `advanced_web_search`, e ela aceita um único argumento `prompt`. Evite habilitá‑la para tarefas rotineiras de consulta; use `WebSearch` para fatos atuais rápidos e `OpenUrl` para URLs fornecidas pelo usuário.

Esta função pode gerar custos de uso. Consulte [Preços](../pricing.md) antes de habilitá‑la em produção.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "AdvancedWebUsage"
    ],
    "options": {
    }
}
```

## Execução de Código

Esta função permite que o modelo execute código JavaScript e inspecione o resultado da execução. Com isso, o modelo pode avaliar resultados algorítmicos de expressões matemáticas e outras situações que são melhor representadas através de código.

O código roda em um ambiente JavaScript protegido. Destina‑se a cálculos e pequenas transformações, não a I/O de arquivos, acesso à rede ou importação de scripts externos.

Activation via `builtin_tools`:

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

Esta função permite que o modelo acesse conteúdo externo em URLs e links fornecidos pelo usuário. Com essa função, o modelo pode acessar links e avaliar seu conteúdo.

Observe que alguns destinos podem identificar o acesso como um bot e bloqueá‑lo, pois esta função não é um rastreamento, mas um simples GET ao destino.

Ao obter o conteúdo do link, o sistema verifica o conteúdo retornado e o trata de acordo com cada tipo:

- O conteúdo HTML é renderizado: tags HTML, scripts, CSS e “ruído” são removidos do resultado de acesso, mantendo apenas o texto simples do link.
- Outro conteúdo textual: o conteúdo é lido diretamente e nenhuma transformação é feita.
- Conteúdo não‑textual: quando o link responde com conteúdo não‑textual e a resposta indica um nome de arquivo (por caminho ou pelo cabeçalho `Content‑Disposition`), o sistema tenta converter o arquivo baixado para uma versão textual.

Activation via `builtin_tools`:

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

Esta função permite que o modelo armazene conteúdo relevante para ser usado em múltiplas conversas.

> Atualmente, esta função está disponível apenas quando usada em [clientes de chat](/docs/pt-br/features/chat-clients) e quando a sessão é identificada por um `tag`.

Através do `tag` da sessão, o modelo armazena um pedaço relevante de dados da conversa, como preferências de nome ou contexto persistente que o assistente deve lembrar.

A ferramenta de memória requer uma sessão identificável. Sem um ID de referência de usuário, as operações de memória retornam um erro ao invés de armazenar ou buscar informações. A instrução de memória diz ao modelo para não salvar dados sensíveis ou pessoais, porém, não há garantia de que o modelo sempre seguirá essa regra.

Cada memória salva pode incluir um período de retenção. It itens de memória podem ser pesquisados, atualizados, removidos individualmente ou limpos para o usuário.

> Nota: em solicitações de chat/completions, o `tag` é especificado no parâmetro `$.user`.

Activation via `builtin_tools`:

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

## Geração de Imagem

Esta função permite que o modelo crie imagens de IA.

Imagens geradas por IA são anexadas ao contexto da conversa, mas não são diretamente visíveis ao assistente.

A geração de imagens pode gerar custos de uso. Consulte [Preços](../pricing.md) antes de habilitá‑la em produção.

Você também pode habilitar a geração de imagens explícitas e adultas na geração de imagens. Quando esse recurso está habilitado, o modelo será permitido a gerar conteúdo adulto. Para que isso ocorra, o modelo também deve “concordar” em gerar tal conteúdo. Alguns modelos têm um filtro de segurança mais baixo que outros. Por exemplo, modelos Gemini têm o filtro de segurança mais baixo, tornando‑os uma opção viável para role‑play e geração desse tipo de material.

Você é sempre responsável pelo [material que você gera](/docs/pt-br/legal/terms-of-service) e o material gerado deve ser compatível com nossos termos de serviço.

Os modelos de geração de imagem disponíveis são:
- `gpt-image-2`
- `wan-image-2.7-pro`
- `wan-image-2.7`
- `grok-imagine-pro`
- `grok-imagine`
- `seedream-5-lite`
- `nanobanana-2`
- `gpt-image-1.5`
- `gpt-image-1-mini`
- `seedream-4.5-pro`
- `seedream-4`
- `nanobanana-pro`
- `nanobanana`
- `flux-schnell`
- `zimage-turbo`
- `flux-2-klein`
- `majicMIX-realistic`
- `AbsoluteReality`
- `CyberRealistic`
- `RealCartoon-Realistic`
- `CyberRealistic-Pony`
- `Hassaku-XL`
- `Meina-Mix`

Imagens geradas são armazenadas nos servidores da AIVAX por alguns meses antes de serem removidas permanentemente.

Activation via `builtin_tools`:

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

## Busca de Posts X

Esta função permite que o modelo procure posts no X (antigo Twitter) e leia um post específico quando o modelo tem um ID de post.

É uma alternativa direta ao `web_search`, pois pode ser usado para buscar informações atualizadas em tempo real, como notícias, informações, resultados de jogos, etc. Esta ferramenta fornece resultados muito mais recentes que a ferramenta convencional de busca na internet.

Não é recomendado usar ambas as funções juntas porque elas têm o mesmo propósito.

Esta função pode gerar custos de uso. Consulte [Preços](../pricing.md) antes de habilitá‑la em produção.

Activation via `builtin_tools`:

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

Os arquivos criados são hospedados nos servidores da AIVAX e disponibilizados pelo assistente.

O conteúdo é hospedado por alguns meses antes de ser excluído permanentemente.

Activation via `builtin_tools`:

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

Esta função permite que o modelo hospede páginas HTML nos servidores da AIVAX.

Isso permite que o modelo hospede relatórios, páginas de destino e outras infografias HTML.

O conteúdo é hospedado por alguns meses antes de ser excluído permanentemente.

Activation via `builtin_tools`:

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

Esta função fornece ao modelo uma ferramenta avançada de requisição HTTP. Com essa função, o modelo pode definir cabeçalhos, formulários, conteúdos e métodos para realizar requisições HTTP avançadas.

Respostas de texto são lidas até o limite de conteúdo da plataforma. Respostas binárias não são expandidas no contexto; a ferramenta retorna um marcador de conteúdo binário curto com o tipo de conteúdo e tamanho quando disponível.

Activation via `builtin_tools`:

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

O Calendário é sustentado pelo mesmo armazenamento de informações persistente da memória, mas armazena objetos de lembrete baseados em datas ao invés de texto solto de memória. Ele pode criar, buscar, encontrar, atualizar e excluir compromissos para um usuário identificado.

Não é recomendado ativar esta função juntamente com a função de memória ou funções de agendamento de mensagens do cliente de chat.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "Calendar"
    ],
    "options": {
    }
}
```