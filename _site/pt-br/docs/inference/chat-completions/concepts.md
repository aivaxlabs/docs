Source: https://docs.aivax.net/pt-br/docs/inference/chat-completions/concepts.html

# Conceitos de inferência

A AIVAX expõe uma API `chat/completions` compatível com OpenAI, com parâmetros adicionais da AIVAX. As adições são opcionais e foram projetadas para suportar gateways, RAG, ferramentas integradas, respostas estruturadas, pré-processamento multimodal, roteamento de provedores e metadados de faturamento.

Estas páginas cobrem o contrato de solicitação. Use um [AI Gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md) quando a mesma configuração precisar ser reutilizada ou gerenciada centralmente.

## Chamada direta ou gateway

Use uma chamada direta para tarefas simples, testes, rotinas internas e integrações onde o aplicativo controla o modelo, o prompt, as ferramentas e o contexto para cada solicitação.

Use um AI Gateway quando o comportamento precisar ser estável, auditável e reutilizável. Os gateways são melhores para assistentes de suporte, chatbots, agentes RAG, ferramentas permanentes, workers, habilidades e configurações compartilhadas por vários clientes. Consulte [Inferência com AI Gateways](https://docs.aivax.net/pt-br/docs/inference/chat-completions/ai-gateways.md) para ver como um gateway altera uma solicitação.

## Como uma solicitação é executada

Uma única solicitação pode envolver várias gerações de modelos. A AIVAX prepara o contexto, chama o modelo, executa quaisquer ferramentas do lado do servidor solicitadas pelo modelo, chama o modelo novamente com os resultados e repete até que o modelo produza uma resposta final ou solicite uma ferramenta que seu cliente deve executar.

1. **Preparar.** A AIVAX resolve o modelo ou gateway, adiciona instruções do gateway e documentos recuperados, restaura o [contexto do lado do servidor](https://docs.aivax.net/pt-br/docs/inference/chat-completions/server-side-context.md) das rodadas anteriores, aplica [pré-processamento](https://docs.aivax.net/pt-br/docs/inference/chat-completions/multimodal-pre-processing.md) e moderação, e ajusta a conversa à janela de contexto.
2. **Gerar.** O provedor selecionado gera raciocínio, texto ou chamadas de ferramenta; consulte [Roteamento](https://docs.aivax.net/pt-br/docs/inference/routing/setup-routing.md) para saber como o provedor é escolhido.
3. **Executar ferramentas do lado do servidor.** [Ferramentas integradas](https://docs.aivax.net/pt-br/docs/inference/chat-completions/built-in-tools.md), [ferramentas MCP e funções de protocolo](https://docs.aivax.net/pt-br/docs/inference/chat-completions/mcp-and-protocol-functions.md) são executadas dentro da AIVAX, e o loop retorna ao passo 2.
4. **Finalizar.** A AIVAX valida a [saída estruturada](https://docs.aivax.net/pt-br/docs/inference/chat-completions/structured-output.md) quando solicitado e retorna a resposta final ou as [chamadas de ferramenta do cliente](https://docs.aivax.net/pt-br/docs/inference/chat-completions/tools.md) que seu aplicativo deve executar.

Apenas o resultado final é retornado como uma mensagem do assistente. Com [streaming](https://docs.aivax.net/pt-br/docs/inference/chat-completions/streaming.md), você também recebe raciocínio, eventos de ferramenta e texto parcial conforme eles ocorrem.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

O endpoint também possui o alias de API `/api/v1/chat/completions`.

Referência:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Inference%20(chat%20completions))

## Inferência de longa duração

Como uma única solicitação pode executar várias gerações e ferramentas, ela pode levar minutos. Em `https://inference.aivax.net`, uma solicitação sem streaming que excede o tempo limite do proxy termina com HTTP `524`, enquanto a AIVAX continua processando-a. Envie solicitações longas para o host de inferência direto em vez disso:

```text
https://direct.inference.aivax.net/v1
```

A solicitação ainda é síncrona: mantenha a conexão aberta e defina um tempo limite do cliente que cubra o tempo de processamento esperado. Caminhos, chaves e corpos de solicitação são os mesmos do host padrão. Solicitações de streaming enviam dados continuamente e raramente precisam disso. Consulte [Inferência de longa duração](https://docs.aivax.net/pt-br/docs/overview.md#long-running-inference) para um exemplo de SDK e os endpoints que o host direto serve.

## Metadados da solicitação

Defina `metadata` para anexar informações de chave/valor (strings) à solicitação de inferência. A AIVAX armazena este objeto junto com a conversa registrada e o expõe aos eventos do gateway, portanto, é útil para correlação operacional, como ID de pedido, tenant, fluxo de trabalho ou chave de rastreamento interna.

```json
{
    "model": "your-model-or-gateway-id",
    "messages": [
        {
            "role": "user",
            "content": "Summarize this support ticket."
        }
    ],
    "metadata": {
        "ticket_id": "SUP-1042",
        "workflow": "support-triage"
    }
}
```

`metadata` deve ser um objeto JSON cujos nomes de propriedade e valores sejam strings. Não coloque segredos, credenciais, dados de pagamento ou cargas úteis grandes neste campo.

## Registros de resposta e conversa

O envelope de resposta padrão `/v1/chat/completions` inclui `generation_context`, que lista o uso cobrado pela solicitação. Defina [`json_only: true`](https://docs.aivax.net/pt-br/docs/inference/structured-responses/json-only.md) para retornar apenas o JSON final sem este envelope.

`usage` relata `prompt_tokens`, `completion_tokens` e `total_tokens`. `prompt_tokens` conta a entrada completa, incluindo a entrada em cache relatada em `prompt_tokens_details.cached_tokens`. Consulte [Caching](https://docs.aivax.net/pt-br/docs/inference/chat-completions/caching.md).

As respostas para modelos integrados também incluem `provider`, a tag do provedor que atendeu à solicitação; consulte [Provider in responses](https://docs.aivax.net/pt-br/docs/inference/routing/setup-routing.md#provider-in-responses).

Defina `allow_logging: false` em uma solicitação `/v1/chat/completions` para manter essa solicitação fora dos logs de conversa da conta. Ela assume `true` como padrão e não pode habilitar o registro de log quando o registro de conversas está desativado para a conta.

Quando o registro de conversas está habilitado, o registro armazenado inclui as mensagens, ferramentas, uso, modelo, contexto do gateway e chave de API, e `metadata`. Use `conversation_token` e `metadata` para correlacionar esses registros com seu próprio fluxo de trabalho.

## Geração assíncrona

Adicione `"async": true` para enfileirar a solicitação em vez de esperar pelo resultado. A API responde com HTTP `202` e um ID, e você busca o resultado armazenado mais tarde ou recebe um webhook quando estiver concluído. Solicitações de streaming não podem ser enfileiradas. Consulte [Async generations](https://docs.aivax.net/pt-br/docs/inference/batch/async-generations.md).

```json
{
  "model": "@openai/gpt-6-luna#cheapest",
  "messages": [{ "role": "user", "content": "Summarize this report." }],
  "async": true
}
```

## Preços

As taxas de inferência dependem do modelo selecionado, do provedor, do tamanho da entrada e do tipo de mídia. A moderação é cobrada separadamente em Unidades de Processamento (PUs); seu preço em PU varia conforme o modelo e o provedor utilizados. O [multiplicador de plano](https://docs.aivax.net/pt-br/docs/pricing/product-pricing.md#plan-multipliers) se aplica à inferência de modelos integrados e à moderação. O BYOK não é afetado por ele.

| Descrição | Preço |
| --- | ---: |
| Inferência de modelo de IA e AI Gateway | Taxas do modelo e provedor selecionados |
| Moderação de entrada | Preço variável por PU; separado da cobrança principal de inferência |
