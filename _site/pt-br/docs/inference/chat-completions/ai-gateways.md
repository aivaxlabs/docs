Source: https://docs.aivax.net/pt-br/docs/inference/chat-completions/ai-gateways.html

# Inferência com Gateways de IA

Um Gateway de IA pré-configura uma inferência. Quando `model` é um ID ou slug de gateway, a solicitação que você envia é apenas parte da solicitação que o modelo recebe: o AIVAX a mescla com a configuração do gateway primeiro.

```json
{
    "model": "support:50c3",
    "messages": [
        {
            "role": "user",
            "content": "Onde está meu pedido 123?"
        }
    ]
}
```

Com um gateway configurado com instruções, uma coleção e uma função de protocolo, o modelo recebe as instruções de sistema do gateway, os documentos recuperados para a pergunta e a definição da função, além da mensagem do usuário. A mesma solicitação enviada com `"model": "@openai/gpt-5-mini"` chegaria ao modelo apenas com a mensagem do usuário.

## O que o gateway define

| Área | Definido pelo gateway | A solicitação pode alterá-lo? |
| --- | --- | --- |
| Modelo e provedor | Modelo, endpoint BYOK, roteamento de modelos, roteamento de provedores | Roteamento de provedores, com [`routing_options`](https://docs.aivax.net/pt-br/docs/inference/routing/setup-routing.md#override-routing-per-request) |
| Instruções | Instruções de sistema, fontes remotas, modelo de prompt, preenchimento inicial (prefill) | Não. A solicitação pode adicionar suas próprias mensagens `system`. |
| Parâmetros | Temperatura, top-p, penalidades, stop, limite de saída, esforço de raciocínio, verbosidade, seed | Sim, exceto `frequency_penalty` |
| Conhecimento | Coleções, estratégia de consulta, limites de resultados, reranker | Não |
| Ferramentas | Ferramentas integradas, fontes MCP, funções de protocolo, habilidades, shell, ferramentas brutas | A solicitação pode adicionar `tools` e `builtin_tools`, mas não pode remover as ferramentas do gateway. |
| Mídia | Mecanismos de pré-processamento multimodal, `DisableMultiModalInput` | Mecanismos, com `multimodal_resolver` |
| Contexto | Janela de contexto, ação de transbordamento, truncamento de mensagens de ferramenta | Não |
| Política | Moderação, trabalhadores | Não |
| Apresentação | Explicações de ferramentas, fuso horário | Sim |

A lista completa de substituições de solicitação está em [Substituir valores do gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/using-an-ai-gateway.md#override-gateway-values). Os valores na solicitação aplicam-se apenas àquela solicitação e nunca alteram o gateway.

## Precedência

Quando a mesma configuração vem de vários lugares, a mais específica prevalece:

1. O campo da solicitação, como `temperature` ou `routing_options`.
2. Um sufixo no nome do modelo do gateway, para roteamento; consulte [Roteamento inline](https://docs.aivax.net/pt-br/docs/inference/routing/inline-routing.md).
3. A configuração do gateway.
4. Os padrões do modelo.

As configurações da conta, como [ZDR](https://docs.aivax.net/pt-br/docs/inference/routing/zdr.md) ou [provedores especiais](https://docs.aivax.net/pt-br/docs/inference/routing/special-providers.md), restringem o resultado independentemente desses valores.

## Chaves públicas

Chaves de API públicas só podem chamar gateways, por ID completo, e aceitam um conjunto reduzido de campos de solicitação. Com uma chave pública, as fontes MCP do gateway, funções de protocolo, ferramentas integradas, shell e habilidades não são usadas, portanto, a configuração do gateway é o único lugar onde seu comportamento é definido. Consulte [Limites](https://docs.aivax.net/pt-br/docs/inference/chat-completions/limits.md#public-api-keys).

## Quando mover configurações para um gateway

Mova uma configuração da solicitação para um gateway quando todos os clientes enviarem o mesmo valor, quando não desenvolvedores precisarem alterá-la ou quando ela não puder ser controlada pelo cliente, como instruções, ferramentas ou moderação. Mantenha-a na solicitação quando variar por chamada, como `metadata`, `conversation_token` ou um `response_schema` por tarefa.
