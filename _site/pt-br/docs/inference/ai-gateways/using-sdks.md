Source: https://docs.aivax.net/pt-br/docs/inference/ai-gateways/using-sdks.html

# Usando Gateways de IA via SDKs

O endpoint de inferência segue o formato de conclusões de chat do OpenAI, portanto, os SDKs compatíveis com o OpenAI funcionam alterando a URL base e a chave da API. Carregue sua chave de API privada a partir de uma configuração segura; consulte [Faça sua primeira solicitação](https://docs.aivax.net/pt-br/docs/overview.md#make-your-first-request) para um exemplo de variável de ambiente.

```python {title="gateway.py"}
import os

from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key=os.environ["AIVAX_API_KEY"],
)

response = client.chat.completions.create(
    model="my-gateway:50c3",
    messages=[
        {"role": "user", "content": "Explique por que os gateways de IA são úteis."}
    ],
)

print(response.choices[0].message.content)
```

```js {title="gateway.js"}
import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "https://inference.aivax.net/v1",
    apiKey: process.env.AIVAX_API_KEY,
});

const response = await client.chat.completions.create({
    model: "my-gateway:50c3",
    messages: [
        { role: "user", content: "Explique por que os gateways de IA são úteis." }
    ],
});

console.log(response.choices[0].message.content);
```

Substitua `my-gateway:50c3` pelo ID completo ou slug do seu gateway.

A inferência compatível com o OpenAI usa `/v1/chat/completions`. O endpoint `/v1/responses` não é suportado.

## Enviar campos AIVAX

As extensões do AIVAX, como `conversation_token`, `builtin_tools`, `response_schema`, `routing_options` ou `metadata`, não fazem parte dos parâmetros tipados do SDK. Envie-as como campos extras no corpo da solicitação:

```python
response = client.chat.completions.create(
    model="my-gateway:50c3",
    messages=[{"role": "user", "content": "O que mudou no meu pedido?"}],
    extra_body={
        "conversation_token": "order-thread-1042",
        "metadata": {"workflow": "order-support"},
    },
)
```

No SDK JavaScript, adicione os campos diretamente ao objeto de solicitação; o SDK os envia no corpo da solicitação. No TypeScript, os campos extras podem precisar de um casting de tipo.

> [!NOTE]
> O argumento `extra_body` do SDK Python adiciona apenas campos ao corpo da solicitação. É diferente do campo de solicitação `extra_body` do AIVAX, que encaminha JSON personalizado para um provedor BYOK; consulte [JSON Personalizado](https://docs.aivax.net/pt-br/docs/inference/chat-completions/custom-json.md).

Os campos que o AIVAX adiciona às respostas, como `conversation_token`, `provider` ou `generation_context`, estão disponíveis por meio da resposta bruta do SDK ou das propriedades não tipadas do objeto retornado.

## Solicitações longas

Solicitações com raciocínio longo ou muitas chamadas de ferramentas podem exceder o tempo limite do proxy do host padrão. Use o host de inferência direto `https://direct.inference.aivax.net/v1` como `base_url` e aumente o tempo limite do SDK; consulte [Inferência de longa duração](https://docs.aivax.net/pt-br/docs/overview.md#long-running-inference).
