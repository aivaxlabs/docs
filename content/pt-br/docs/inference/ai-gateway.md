---
{title: Portal de IA,linkTitle: gateways de IA,weight: 160,group: Inference,aliases: [/docs/pt-br/platform/ai-gateways.html,/docs/pt-br/inference/ai-gateway.html],sourceHash: e259e9be7e757b52}
---

# Portal de IA

Um Portal de IA armazena uma configuração de inferência reutilizável. Passe o ID ou slug do portal no campo `model` da solicitação e o AIVAX aplicará suas configurações de modelo, instruções, coleções RAG, ferramentas, habilidades, workers, moderação e controles de contexto.

Use um portal quando o mesmo comportamento precisar ser reutilizado por vários clientes ou alterado sem reimplantar a aplicação chamadora.

## Como pensar em um portal

Uma chamada direta para `/v1/chat/completions` pode chamar um modelo AIVAX integrado diretamente, por exemplo `@openai/gpt-5-mini`. Um portal armazena as decisões que você não quer repetir a cada solicitação:

- Provedor e nome do modelo.
- Instruções do sistema, fontes de instrução remotas, modelo de prompt do usuário e pré-preenchimento do assistente.
- Coleções RAG, limites de resultados, limiar de pontuação, reranker, comportamento de referência e estratégia de consulta.
- Ferramentas compatíveis com OpenAI, ferramentas internas do AIVAX, ferramentas MCP, funções de protocolo, habilidades e o ambiente bash opcional.
- Comportamento da janela de contexto, truncamento de mensagens de ferramenta, moderação, workers, roteamento de modelo e tratamento de chamadas de ferramenta.

Isso cria um limite de responsabilidade. A aplicação cliente envia mensagens e substituições de solicitação opcionais. O administrador do portal controla a política operacional.

Em produção, comece com uma configuração conservadora: instruções claras do sistema, um modelo que suporte as modalidades e ferramentas necessárias, uma coleção RAG bem preparada e somente as ferramentas realmente necessárias. Adicionar muitas ferramentas, habilidades ou coleções aumenta os tokens de entrada, o custo e a chance de o modelo escolher o caminho errado.

## Modelos e nomes de portal

Existem três maneiras comuns de escolher o que o `/v1/chat/completions` usa:

- Use uma tag de modelo AIVAX integrado, geralmente começando com `@`.
- Use o ID completo do portal.
- Use um slug de portal no formato `name:final-id`, como `support:50c3`.

Chaves de API privadas podem resolver um portal por ID completo ou por slug. Chaves de API públicas são mais restritas: podem usar gateways de IA apenas por ID completo, e apenas um conjunto limitado de parâmetros de solicitação de conclusão de chat é aceito.

Ao escolher um modelo, valide três pontos antes de colocá‑lo em produção:

- O modelo suporta as modalidades de entrada que você pretende enviar, como imagem, áudio, vídeo ou arquivo.
- O modelo suporta chamadas de função se o portal usar ferramentas, RAG através de `QueryFunction`, MCP, funções de protocolo, habilidades ou funções internas.
- O modelo aceita os parâmetros que você configura. Alguns modelos integrados rejeitam pré‑preenchimento do assistente, temperatura, sequências de parada ou esforço de raciocínio.

Planeje também a aposentadoria: um portal permite que você altere o modelo por trás de um nome estável, mas ainda assim é necessário qualificar o substituto. Consulte [pinning a model ID versus using an alias](https://aivax.net/blog/pin-llm-model-id-or-use-alias-model-deprecations/) para uma lista de verificação de substituição.

Portais também podem usar roteamento de modelo. Para o roteador de complexidade, o AIVAX classifica a última solicitação do usuário como baixa, média ou alta complexidade, seleciona o modelo configurado para esse nível e emite `X-Model-Routed-Complexity` na resposta HTTP quando disponível.

## Usando um Portal de IA

O AIVAX fornece um endpoint de conclusão de chat compatível com OpenAI:

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Os valores do portal podem ser sobrescritos pela solicitação para parâmetros suportados, como `temperature`, `top_p`, `seed`, `reasoning_effort`, `max_completion_tokens`, `stop`, `tools`, `response_schema`, `response_format`, `builtin_tools`, `multimodal_resolver`, o obsoleto `multimodal_preprocess` e `tool_invocation_explanations`. Para comportamento de inferência direta, incluindo opções de renderização de resposta, veja [Inference](/docs/pt-br/inference/inference).

## Usando SDKs

Como o endpoint segue o formato de conclusão de chat do OpenAI, você pode usar SDKs compatíveis existentes. No exemplo abaixo, substitua `my-gateway:50c3` pelo ID completo ou slug do seu portal e carregue sua chave de API privada a partir de configuração segura. Consulte [Getting Started](../getting-started.md) para um exemplo de variável de ambiente.

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

Escreva as instruções do sistema para que o modelo entenda seu papel, público, fontes de verdade e limites. Inclua quando usar RAG, quando usar ferramentas e como responder quando a informação não estiver disponível. Evite repetir configurações operacionais que já existem no portal, como limites de truncamento ou listas de ferramentas.

Para RAG, vincule coleções com documentos curtos, autônomos e bem nomeados. Escolha a estratégia de consulta com base no tipo de conversa:

- `Plain`: Usa a última mensagem do usuário como termo de busca.
- `Concatenate`: Junta o número configurado de últimas mensagens do usuário linha a linha.
- `UserRewrite`: Reescreve mensagens recentes do usuário em uma ou mais consultas de busca usando um modelo resolvedor.
- `FullRewrite`: Reescreve mensagens recentes do usuário e do assistente usando um modelo resolvedor.
- `QueryFunction`: Expõe uma função de busca ao modelo ao invés de injetar um resultado de busca antes da inferência.

Para ferramentas, habilite apenas aquelas com um papel claro. Ferramentas internas cobrem capacidades comuns como data e hora atuais, busca na web, abertura de URLs, execução de código, geração de imagens, geração de documentos, geração de páginas, memória, requisições HTTP e busca de postagens X. MCP externo é melhor quando você já possui um servidor MCP com ferramentas de negócio. Funções de protocolo são úteis quando você quer expor callbacks HTTP específicos ao modelo sem instalar um servidor MCP completo.

Ao habilitar [memory](../tools/builtin-tools.md#memory), defina o que o assistente pode reter e quando deve chamar `memory_search`: memórias não são incluídas automaticamente nas instruções do sistema. Por padrão, memórias são compartilhadas entre os portais da conta para o mesmo usuário identificado; desative a memória compartilhada para restringir um portal às suas próprias memórias. Memórias expiram somente quando salvas com `expiresInDays`. Planeje como sua aplicação revisará e removerá documentos na coleção `@memories`. O [guia de envenenamento de memória](https://aivax.net/blog/persistent-memory-is-a-write-path/) descreve esses controles.

Use um manipulador de ferramenta somente quando o modelo selecionado precisar de ajuda para produzir chamadas de ferramenta. O manipulador disponível é `react.v1.selfcall`; `native` ou nenhum valor usa a chamada de ferramenta nativa do modelo.

Use workers quando um sistema externo precisar decidir algo durante o fluxo de inferência. Um worker pode bloquear uma mensagem, reescrever contexto, adicionar ferramentas ou substituir o resultado de uma ferramenta no servidor. Como o worker é chamado no caminho crítico, mantenha‑o rápido e determinístico.

Valide a configuração do seu portal com um cenário [simulated-user and LLM-judge](https://aivax.net/blog/introducing-agentic-tests/) antes de confiar nele em produção.

Quando habilitar moderação, veja [LLM input moderation: system prompt or separate moderation step?](https://aivax.net/blog/aivax-gateway-moderation/) para o que cobre, seu comportamento de falha e o que ainda precisa de verificações no nível da aplicação.

## Inference MCP

Para expor um modelo integrado ou Portal de IA como ferramenta para um cliente MCP externo, veja [Inference MCP](/docs/pt-br/mcp-utilities/inference-mcp).
