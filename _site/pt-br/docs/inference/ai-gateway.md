Source: https://docs.aivax.net/pt-br/docs/inference/ai-gateway.html

# Gateways de IA

Um Gateway de IA armazena uma configuração de inferência reutilizável. Passe o ID ou slug do gateway no campo `model` da solicitação, e a AIVAX aplicará suas configurações de modelo, instruções, coleções RAG, ferramentas, habilidades, trabalhadores, moderação e controles de contexto.

Use um gateway quando o mesmo comportamento precisar ser reutilizado por vários clientes ou alterado sem a necessidade de reimplementar o aplicativo que faz a chamada.

Trate a configuração do gateway como sensível: `GET /api/v1/ai-gateways/<id>` retorna os parâmetros completos para a conta proprietária, incluindo `apiKey` em texto puro quando o gateway usa uma chave de provedor externo.

## Como pensar sobre um gateway

Uma chamada direta para `/v1/chat/completions` pode chamar um modelo integrado da AIVAX diretamente, por exemplo, `@openai/gpt-5-mini`. Um gateway armazena as decisões que você não deseja repetir a cada solicitação:

- Provedor do modelo e nome do modelo.
- Instruções do sistema, fontes remotas de instrução, modelo de prompt do usuário e preenchimento prévio do assistente.
- Coleções RAG, limites de resultados, limite de pontuação, reranker, comportamento de referência e estratégia de consulta.
- Ferramentas compatíveis com OpenAI, ferramentas integradas da AIVAX, ferramentas MCP, funções de protocolo, habilidades e o ambiente bash opcional.
- Comportamento da janela de contexto, truncamento de mensagens de ferramenta, moderação, trabalhadores, roteamento de modelos e manipulação de chamadas de ferramenta.
- O fuso horário no qual o modelo lê e grava datas, usado por `get_date_time`, ferramentas de agendamento e o ambiente bash.

Isso cria um limite de responsabilidade. O aplicativo cliente envia mensagens e substituições opcionais de solicitação. O administrador do gateway controla a política operacional.

Em produção, comece com uma configuração conservadora: instruções do sistema claras, um modelo que suporte as modalidades e ferramentas necessárias, uma coleção RAG bem preparada e apenas as ferramentas que são realmente necessárias. Adicionar muitas ferramentas, habilidades ou coleções aumenta os tokens de entrada, o custo e a chance do modelo escolher o caminho errado.

## Modelos e nomes de gateways

Existem três maneiras comuns de escolher o que `/v1/chat/completions` usará:

- Use uma tag de modelo integrada da AIVAX, geralmente começando com `@`.
- Use o ID completo do gateway.
- Use um slug do gateway no formato `name:final-id`, como `support:50c3`.

Chaves de API privadas podem resolver um gateway pelo ID completo ou pelo slug. Chaves de API públicas são mais restritas: elas podem usar gateways de IA apenas pelo ID completo, e apenas um conjunto limitado de parâmetros de solicitação de conclusão de chat é aceito.

Ao escolher um modelo, valide três pontos antes de colocá-lo em produção:

- O modelo suporta as modalidades de entrada que você pretende enviar, como imagem, áudio, vídeo ou arquivo.
- O modelo suporta chamada de função se o gateway usar ferramentas, RAG através de `QueryFunction`, MCP, funções de protocolo, habilidades ou funções integradas.
- O modelo aceita os parâmetros que você configurou. Alguns modelos integrados rejeitam preenchimento prévio do assistente, temperatura, sequências de parada ou esforço de raciocínio.

Planeje também a aposentadoria: um gateway permite alterar o modelo por trás de um nome estável, mas você ainda precisa qualificar a substituição. Veja [fixar um ID de modelo versus usar um alias de modelo descontinuado](https://aivax.net/blog/pin-llm-model-id-or-use-alias-model-deprecations/) para uma lista de verificação de substituição. Para o encerramento do GPT-4o e GPT-4.1 em 14 de janeiro de 2027, veja [como migrar para gpt-6-luna](https://aivax.net/blog/migrate-gpt-4o-and-gpt-4-1-to-gpt-6-luna/). Para o encerramento do GPT-5 e o3 em 11 de dezembro de 2026, veja [como migrar para GPT-5.6 Sol, Terra e Luna](https://aivax.net/blog/migrate-gpt-5-and-o3-to-gpt-5-6-before-december-11/).

Os gateways também podem usar roteamento de modelos. Para o roteador de complexidade, a AIVAX classifica a última solicitação do usuário como baixa, média ou alta complexidade, seleciona o modelo configurado para esse nível e emite `X-Model-Routed-Complexity` na resposta HTTP quando disponível.

## Usando um Gateway de IA

A AIVAX fornece um endpoint de conclusões de chat compatível com OpenAI:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Inference%20(chat%20completions))

Os valores do gateway podem ser substituídos pela solicitação para parâmetros suportados, como `temperature`, `top_p`, `seed`, `reasoning_effort`, `max_completion_tokens`, `stop`, `tools`, `response_schema`, `response_format`, `builtin_tools`, `time_zone`, `multimodal_resolver`, o depreciado `multimodal_preprocess` e `tool_invocation_explanations`. Para o comportamento de inferência direta, incluindo opções de renderização de resposta, consulte [Inferência](https://docs.aivax.net/pt-br/docs/inference/inference.md).

## Usando SDKs

Como o endpoint segue o formato de conclusões de chat do OpenAI, você pode usar SDKs existentes compatíveis com OpenAI. No exemplo abaixo, substitua `my-gateway:50c3` pelo ID completo ou slug do seu gateway e carregue sua chave de API privada de uma configuração segura. Consulte [Primeiros Passos](https://docs.aivax.net/pt-br/docs/overview.md#make-your-first-request) para um exemplo de variável de ambiente.

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="<AIVAX_API_KEY>"
)

response = client.chat.completions.create(
    model="my-gateway:50c3",
    messages=[
        {"role": "user", "content": "Explique por que os gateways de IA são úteis."}
    ]
)

print(response.choices[0].message.content)
```

A inferência compatível com OpenAI usa `/v1/chat/completions`. O endpoint `/v1/responses` não é suportado.

## Configuração recomendada para produção

Escreva as instruções do sistema para que o modelo entenda seu papel, público-alvo, fontes de verdade e limites. Inclua quando usar RAG, quando usar ferramentas e como responder quando as informações estão indisponíveis. Evite repetir configurações operacionais que já existem no gateway, como limites de truncamento ou listas de ferramentas. Se seus prompts atualmente vivem em Objetos de Prompt do OpenAI ou Agent Builder, consulte [o que você perde quando eles são encerrados e onde cada peça pode viver](https://aivax.net/blog/openai-prompt-objects-agent-builder-shutdown-what-you-lose/).

Para RAG, vincule coleções com documentos curtos, autocontidos e bem nomeados. Escolha a estratégia de consulta com base no tipo de conversa:

- `Plain`: Usa a última mensagem do usuário como termo de busca.
- `Concatenate`: Junta as últimas mensagens configuradas do usuário linha por linha.
- `UserRewrite`: Reescreve as mensagens recentes do usuário em uma ou mais consultas de busca usando um modelo resolvedor.
- `FullRewrite`: Reescreve as mensagens recentes do usuário e do assistente usando um modelo resolvedor.
- `QueryFunction`: Expõe uma função de busca ao modelo em vez de injetar um resultado de busca antes da inferência.

Para ferramentas, ative apenas aquelas com um papel claro. As ferramentas integradas cobrem capacidades comuns, como data e hora atuais, busca na web, abertura de URLs, execução de código, geração de imagens, geração de documentos, geração de páginas, memória, solicitações HTTP e pesquisa de postagens X. O MCP externo é melhor quando você já possui um servidor MCP com ferramentas de negócios. Funções de protocolo são úteis quando você deseja expor callbacks HTTP específicos ao modelo sem instalar um servidor MCP completo.

Ao habilitar a [memória](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#memory), defina o que o assistente pode reter e quando deve chamar `memory_search`: as memórias não são incluídas automaticamente nas instruções do sistema. Por padrão, as memórias são compartilhadas entre os gateways da conta para o mesmo usuário identificado; desative a memória compartilhada para restringir um gateway às suas próprias memórias. As memórias só expiram quando salvas com `expiresInDays`. Planeje como seu aplicativo revisará e removerá documentos na coleção `@memories`. O [guia de envenenamento de memória](https://aivax.net/blog/persistent-memory-is-a-write-path/) delineia esses controles.

Use um manipulador de ferramentas apenas quando o modelo selecionado precisar de ajuda para produzir chamadas de ferramenta. O manipulador disponível é `react.v1.selfcall`; `native` ou nenhum valor usa a chamada nativa de ferramentas do modelo.

Use trabalhadores quando um sistema externo precisar decidir algo durante o fluxo de inferência. Um trabalhador pode bloquear uma mensagem, reescrever o contexto, adicionar ferramentas ou substituir um resultado de ferramenta do lado do servidor. Como o trabalhador é chamado no caminho crítico, mantenha-o rápido e determinístico.

Valide a configuração do seu gateway com um [cenário simulado de usuário e juiz LLM](https://aivax.net/blog/introducing-agentic-tests/) antes de confiar nele em produção.

Quando você habilita a moderação, consulte [moderação de entrada LLM: prompt do sistema ou etapa de moderação separada?](https://aivax.net/blog/aivax-gateway-moderation/) para saber o que ela cobre, seu comportamento em caso de falha e o que ainda precisa de verificações em nível de aplicativo.

## Inferência MCP

Para expor um modelo integrado ou Gateway de IA como uma ferramenta para um cliente MCP externo, consulte [Inferência MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/inference-mcp.md).
