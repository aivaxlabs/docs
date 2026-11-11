---
{title: Conceitos de Inferência,linkTitle: Conceitos,weight: 10,group: Inference,aliases: [/docs/pt-br/inference/inference.html,/docs/pt-br/inference/chat-handling.html,/docs/pt-br/platform/conversations.html,/docs/pt-br/inference/chat-completions/concepts.html],sourceHash: 3645eac75c5fcffc}
---

# Conceitos de inferência

A AIVAX expõe uma API `chat/completions` compatível com OpenAI, com parâmetros adicionais da AIVAX. As adições são opcionais e foram projetadas para suportar gateways, RAG, ferramentas integradas, respostas estruturadas, pré-processamento multimodal, roteamento de provedores e metadados de faturamento.

Estas páginas cobrem o contrato de solicitação. Use um [Gateway de IA](/docs/pt-br/inference/ai-gateways/concepts.md) quando a mesma configuração precisar ser reutilizada ou gerenciada centralmente.

## Chamada direta ou gateway

Use uma chamada direta para tarefas simples, testes, rotinas internas e integrações onde o aplicativo controla o modelo, o prompt, as ferramentas e o contexto para cada solicitação.

Use um Gateway de IA quando o comportamento precisar ser estável, auditável e reutilizável. Os gateways são melhores para assistentes de suporte, chatbots, agentes RAG, ferramentas permanentes, workers, habilidades e configurações compartilhadas por vários clientes. Consulte [Inferência com Gateways de IA](ai-gateways.md) para ver como um gateway altera uma solicitação.

## Como uma solicitação é executada

Uma única solicitação pode envolver várias gerações de modelos. A AIVAX prepara o contexto, chama o modelo, executa quaisquer ferramentas do lado do servidor solicitadas pelo modelo, chama o modelo novamente com os resultados delas e repete até que o modelo produza uma resposta final ou solicite uma ferramenta que seu cliente deve executar.

1. **Preparar.** A AIVAX resolve o modelo ou gateway, adiciona instruções do gateway e documentos recuperados, restaura o [contexto do lado do servidor](server-side-context.md) das rodadas anteriores, aplica [pré-processamento](multimodal-pre-processing.md) e moderação, e ajusta a conversa à janela de contexto.
2. **Gerar.** O provedor selecionado gera raciocínio, texto ou chamadas de ferramenta; consulte [Roteamento](/docs/pt-br/inference/routing/setup-routing.md) para saber como o provedor é escolhido.
3. **Executar ferramentas do lado do servidor.** [Ferramentas integradas](built-in-tools.md), [ferramentas MCP e funções de protocolo](mcp-and-protocol-functions.md) são executadas dentro da AIVAX, e o loop retorna ao passo 2.
4. **Finalizar.** A AIVAX valida a [saída estruturada](structured-output.md) quando solicitado e retorna a resposta final ou as [chamadas de ferramenta do cliente](tools.md) que seu aplicativo deve executar.

Apenas o resultado final é retornado como uma mensagem do assistente. Com [streaming](streaming.md), você também recebe raciocínio, eventos de ferramenta e texto parcial conforme eles ocorrem.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

O endpoint também possui o alias de API `/api/v1/chat/completions`.

Referência:

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Inferência de longa duração

Como uma solicitação pode executar várias gerações e ferramentas, ela pode levar minutos. Em `https://inference.aivax.net`, uma solicitação sem streaming que excede o tempo limite do proxy termina com HTTP `524`, enquanto a AIVAX continua processando-a. Envie solicitações longas para o host de inferência direto em vez disso:

```text
https://direct.inference.aivax.net/v1
```

A solicitação ainda é síncrona: mantenha a conexão aberta e defina um tempo limite no cliente que cubra o tempo de processamento esperado. Caminhos, chaves e corpos de solicitação são os mesmos do host padrão. Solicitações de streaming enviam dados continuamente e raramente precisam disso. Consulte [Inferência de longa duração](/docs/pt-br/overview.md#long-running-inference) para um exemplo de SDK e os endpoints que o host direto serve.

## Metadados da solicitação

Defina `metadata` para anexar informações de chave/valor (ambas strings) à solicitação de inferência. A AIVAX armazena este objeto junto com a conversa registrada e o expõe aos eventos do gateway, sendo útil para correlação operacional, como ID de pedido, tenant, fluxo de trabalho ou chave de rastreamento interna.

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

`metadata` deve ser um objeto JSON cujos nomes de propriedade e valores sejam strings. Não coloque segredos, credenciais, dados de pagamento ou payloads grandes neste campo.

## Respostas e registros de conversa

O envelope de resposta padrão `/v1/chat/completions` inclui `generation_context`. Suas entradas `generated_usage` contêm `sku`, `amount`, `unit_price`, `quantity` e `description`. Defina [`json_only: true`](/docs/pt-br/inference/structured-responses/json-only.md) para retornar apenas o JSON final sem este envelope.

`usage` relata `prompt_tokens`, `completion_tokens` e `total_tokens`. `prompt_tokens` conta apenas a entrada não em cache; a entrada em cache é relatada separadamente em `prompt_tokens_details.cached_tokens`. Consulte [Cache](caching.md).

As respostas para modelos integrados também incluem `provider`, a tag do provedor que atendeu à solicitação; consulte [Provedor nas respostas](/docs/pt-br/inference/routing/setup-routing.md#provider-in-responses).

Defina `allow_logging: false` em uma solicitação `/v1/chat/completions` para manter essa solicitação fora dos logs de conversa da conta. Ela assume `true` como padrão e não pode habilitar o registro de logs quando o log de conversas está desabilitado para a conta. Registros de uso e faturamento ainda são criados.

Quando o log de conversas está habilitado, o registro armazenado inclui seu ID, origem, nome do modelo, ID da solicitação, esquema de resposta, esquemas de ferramentas e entrada de ferramentas, uso, recursos vinculados, carimbos de data/hora de criação e atualização, contagem de tokens, ID de usuário externo, mensagem de erro, mensagens e metadados. O contexto do gateway e da chave de API está disponível por meio dos recursos vinculados.

Use `conversation_token` e `metadata` para correlacionar esses registros com seu próprio fluxo de trabalho.

## Preços

As taxas de inferência dependem do modelo selecionado, do provedor, do tamanho da entrada e do tipo de mídia. A moderação é cobrada separadamente em Unidades de Processamento (PUs), cobrindo o uso de entrada, entrada em cache e saída; seu preço em PU varia conforme o modelo e o provedor usados. O [multiplicador de plano](/docs/pt-br/pricing.md#plan-multipliers) se aplica à inferência de modelos integrados e à moderação. O BYOK não é afetado por ele. Nos registros de uso, os encargos de moderação aparecem sob o modelo `@aivax/layered-moderation`.

| Descrição | Preço |
| --- | ---: |
| Inferência de modelo de IA e Gateway de IA | Taxas do modelo e provedor selecionados |
| Moderação de entrada | Preço variável por PU; separado do encargo principal de inferência |

Uma PU de moderação equivale a um token de saída do modelo de moderação, e os tokens de entrada contam proporcionalmente ao seu preço. Por exemplo, com um modelo precificado em $0,10/M de tokens de entrada e $0,40/M de tokens de saída, uma verificação usando 3.000 tokens de entrada e 50 tokens de saída consome 800 PUs (3.000 × 0,25 + 50), cerca de $0,00032 antes do multiplicador de plano.
