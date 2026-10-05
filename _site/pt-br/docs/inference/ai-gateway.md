Source: https://docs.aivax.net/pt-br/docs/inference/ai-gateway.html

# Gateway de IA

Um Gateway de IA é uma configuração de inferência persistente. Ele permite chamar um gateway pelo nome do modelo enquanto o AIVAX aplica as configurações do modelo do gateway, instruções, coleções RAG, ferramentas, habilidades, workers, moderação e controles de contexto.

Use um gateway quando o mesmo comportamento precisar ser reutilizado por vários clientes ou alterado sem reimplantar a aplicação que o chama.

## Como pensar em um gateway

Uma chamada direta para `/v1/chat/completions` pode chamar um modelo integrado do AIVAX diretamente, por exemplo `@openai/gpt-5-mini`. Um gateway armazena as decisões que você não quer repetir a cada requisição:

- Provedor e nome do modelo.
- Instruções do sistema, fontes remotas de instruções, modelo de prompt do usuário e preenchimento prévio do assistente.
- Coleções RAG, limites de resultados, limiar de pontuação, reranker, comportamento de referência e estratégia de consulta.
- Ferramentas compatíveis com OpenAI, ferramentas internas do AIVAX, ferramentas MCP, funções de protocolo, habilidades e o ambiente bash opcional.
- Comportamento da janela de contexto, truncamento de mensagens de ferramenta, moderação, workers, roteamento de modelo e tratamento de chamadas de ferramenta.

Isso cria um limite de responsabilidade. A aplicação cliente envia mensagens e substituições de requisição opcionais. O administrador do gateway controla a política operacional.

Em produção, comece com uma configuração conservadora: instruções claras do sistema, um modelo que suporte as modalidades e ferramentas necessárias, uma coleção RAG bem preparada e somente as ferramentas realmente necessárias. Adicionar muitas ferramentas, habilidades ou coleções aumenta os tokens de entrada, o custo e a chance de o modelo escolher o caminho errado.

## Modelos e nomes de gateways

Existem três formas comuns de escolher o que o `/v1/chat/completions` usa:

- Usar uma tag de modelo integrado do AIVAX, normalmente começando com `@`.
- Usar o ID completo do gateway.
- Usar um slug de gateway no formato `name:final-id`, como `support:50c3`.

Chaves de API privadas podem resolver um gateway pelo ID completo ou pelo slug. Chaves de API públicas são mais restritas: podem usar gateways de IA somente pelo ID completo, e apenas um conjunto limitado de parâmetros de requisição de conclusão de chat é aceito.

Ao escolher um modelo, valide três pontos antes de colocá‑lo em produção:

- O modelo suporta as modalidades de entrada que você pretende enviar, como imagem, áudio, vídeo ou arquivo.
- O modelo suporta chamadas de função se o gateway usar ferramentas, RAG via `QueryFunction`, MCP, funções de protocolo, habilidades ou funções internas.
- O modelo aceita os parâmetros que você configura. Alguns modelos integrados rejeitam preenchimento prévio do assistente, temperatura, sequências de parada ou esforço de raciocínio.

Gateways também podem usar roteamento de modelo. Para o roteador de complexidade, o AIVAX classifica a última requisição do usuário como baixa, média ou alta complexidade, seleciona o modelo configurado para esse nível e emite `X-Model-Routed-Complexity` na resposta HTTP quando disponível.

## Usando um Gateway de IA

O AIVAX fornece um endpoint de conclusão de chat compatível com OpenAI:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Inference%20(chat%20completions))

Os valores do gateway podem ser sobrescritos na requisição para parâmetros suportados como `temperature`, `top_p`, `seed`, `reasoning_effort`, `max_completion_tokens`, `stop`, `tools`, `response_schema`, `response_format`, `builtin_tools`, `multimodal_preprocess` e `tool_invocation_explanations`. Para comportamento de inferência direta, incluindo opções de renderização de resposta, veja [Inference](https://docs.aivax.net/pt-br/docs/inference/inference.md).

## Usando SDKs

Como o endpoint segue o formato de conclusão de chat do OpenAI, você pode usar SDKs compatíveis existentes.

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="<AIVAX_API_KEY>"
)

response = client.chat.completions.create(
    model="my-gateway:50c3",
    messages=[
        {"role": "user", "content": "Explain why AI gateways are useful."}
    ]
)

print(response.choices[0].message.content)
```

A inferência compatível com OpenAI usa `/v1/chat/completions`. O endpoint `/v1/responses` não é suportado.

## Configuração recomendada para produção

Escreva as instruções do sistema de modo que o modelo entenda seu papel, público, fontes de verdade e limites. Inclua quando usar RAG, quando usar ferramentas e como responder quando a informação não estiver disponível. Evite repetir configurações operacionais que já existem no gateway, como limites de truncamento ou listas de ferramentas.

Para RAG, vincule coleções com documentos curtos, autônomos e bem nomeados. Escolha a estratégia de consulta com base no tipo de conversa:

- `Plain`: Usa a última mensagem do usuário como termo de busca.
- `Concatenate`: Junta o último número configurado de mensagens do usuário linha a linha.
- `UserRewrite`: Reescreve mensagens recentes do usuário em uma ou mais consultas de busca usando um modelo resolvedor.
- `FullRewrite`: Reescreve mensagens recentes do usuário e do assistente usando um modelo resolvedor.
- `QueryFunction`: Exponha uma função de busca para o modelo ao invés de injetar um resultado de busca antes da inferência.

Para ferramentas, habilite apenas aquelas com um papel claro. Ferramentas internas cobrem capacidades comuns como data e hora atuais, busca na web, abrir URLs, execução de código, geração de imagens, geração de documentos, geração de páginas, ações de calendário, memória, requisições HTTP e busca de postagens no X. MCP externo é melhor quando você já possui um servidor MCP com ferramentas de negócio. Funções de protocolo são úteis quando você quer expor callbacks HTTP específicos ao modelo sem instalar um servidor MCP completo.

Ao habilitar memória, defina o que o assistente pode reter e como sua aplicação revisará e removerá registros armazenados. O [guia de envenenamento de memória](https://aivax.net/blog/persistent-memory-is-a-write-path/) descreve esses controles.

Use um manipulador de ferramenta somente quando o modelo selecionado precisar de ajuda para gerar chamadas de ferramenta. O manipulador disponível é `react.v1.selfcall`; `native` ou nenhum valor usa a chamada de ferramenta nativa do modelo.

Use workers quando um sistema externo precisar decidir algo durante o fluxo de inferência. Um worker pode bloquear uma mensagem, reescrever o contexto, adicionar ferramentas ou substituir um resultado de ferramenta do lado do servidor. Como o worker é chamado no caminho crítico, mantenha‑o rápido e determinístico.

Valide a configuração do seu gateway com um cenário de [usuário simulado e juiz LLM](https://aivax.net/blog/introducing-agentic-tests/) antes de confiar nele em produção.

## Inference MCP

Para expor um modelo integrado ou um Gateway de IA como ferramenta para um cliente MCP externo, veja [Inference MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/inference-mcp.md).
