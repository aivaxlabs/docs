---
{title: Corpo da Solicitação do Provedor Personalizado,linkTitle: JSON personalizado,weight: 120,group: Inference,sourceHash: 69840f483ac11b8d,aliases: [/docs/pt-br/inference/chat-completions/custom-json.html]}
---

# Corpo da solicitação do provedor personalizado

Use `extra_body` para enviar opções específicas do provedor. Quando um gateway usa sua própria chave de API do provedor e um ponto de extremidade compatível com OpenAI, `extra_body` mescla JSON personalizado no corpo da solicitação do provedor:

```json
{
    "model": "my-custom-model:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Explain the tradeoff."
        }
    ],
    "extra_body": {
        "reasoning": {
            "enabled": true
        }
    }
}
```

`extra_body` não é permitido com modelos AIVAX integrados.

Os parâmetros de raciocínio diferem entre provedores e modelos. Consulte [como definir o esforço de raciocínio em todos os provedores](https://aivax.net/blog/reasoning-is-a-protocol-not-just-a-model-setting/) antes de escolher as opções específicas do provedor.

Use `extra_body` para opções que a AIVAX não expõe como um campo de solicitação, como a chave de ativação de raciocínio de um provedor. Prefira os campos padrão, como `reasoning_effort`, quando existirem, pois eles também funcionam após você alterar o provedor. O JSON é mesclado na raiz da solicitação do provedor e pode sobrescrever campos definidos pela AIVAX, portanto, envie apenas as chaves documentadas pelo provedor.

Envie `extra_body` como um campo do corpo da solicitação JSON. Ao usar o SDK Python da OpenAI, anide-o dentro do argumento `extra_body` do SDK, como em `extra_body={"extra_body": {...}}`, porque o próprio `extra_body` do SDK apenas adiciona campos à solicitação; consulte [Usando via SDKs](/docs/pt-br/inference/ai-gateways/using-sdks.md#send-aivax-fields).
