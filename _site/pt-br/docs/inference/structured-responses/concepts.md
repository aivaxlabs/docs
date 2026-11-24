Source: https://docs.aivax.net/pt-br/docs/inference/structured-responses/concepts.html

# Conceitos de respostas estruturadas

A AIVAX pode gerar JSON estruturado por meio de dois caminhos:

- `response_schema`: A AIVAX valida a saída final do modelo contra um JSON Schema e tenta novamente com feedback de validação quando a saída é inválida. Este é o caminho de "JSON Healing"; [When an LLM returns invalid JSON](https://aivax.net/blog/structured-output-healing-boundary/) explica como truncamento, recusas e reparo diferem.
- `response_format`: A AIVAX passa um formato de resposta nativo compatível com OpenAI ao provedor, ou aplica healing quando `healing_options` está presente ou o JSON Healing automático está habilitado na conta.

Use respostas estruturadas quando outro sistema consumirá a saída e o texto livre seria frágil.

## Escolhendo um modo

- **`response_schema`:** use-o quando a AIVAX deve assumir a validação e o reparo. Este é o modo mais seguro para modelos que não suportam nativamente saída estruturada, para respostas que usam ferramentas antes de produzir JSON e para sistemas que não toleram JSON malformado.
- **`response_format` com `type: "json_schema"`:** use-o quando o modelo do provedor deve lidar com a saída estruturada nativamente. A AIVAX ainda usa o schema internamente, e o healing é aplicado quando `response_format.json_schema.healing_options` é fornecido ou a conta possui JSON Healing automático habilitado.
- **`json_only: true`:** use-o quando o corpo da resposta HTTP deve conter apenas o JSON final. Isso remove o envelope normal de conclusão de chat, escolhas, uso e metadados de geração do corpo da resposta. Veja [JSON-only](https://docs.aivax.net/pt-br/docs/inference/structured-responses/json-only.md).

| Página | Abrange |
| --- | --- |
| [JSON Healing](https://docs.aivax.net/pt-br/docs/inference/structured-responses/json-healing.md) | Como validação e tentativas funcionam, saída estruturada nativa, recursos de schema suportados e falhas. |
| [Reasoning and tools](https://docs.aivax.net/pt-br/docs/inference/structured-responses/reasoning-and-tools.md) | Como modelos de raciocínio e chamadas de ferramenta se combinam com um schema. |
| [JSON-only](https://docs.aivax.net/pt-br/docs/inference/structured-responses/json-only.md) | Retornando o corpo JSON puro, com e sem streaming. |

## Solicitações estruturadas de longa duração

Uma solicitação estruturada pode levar muito mais tempo do que uma simples: o modelo pode raciocinar, chamar ferramentas e depois fazer várias tentativas de healing, cada uma sendo uma geração completa. Sem streaming e sempre com `json_only`, o cliente não recebe nada até que o JSON final esteja pronto, então a solicitação pode exceder o tempo limite do proxy em `https://inference.aivax.net` e terminar com HTTP `524` enquanto a AIVAX ainda está trabalhando.

Envie essas solicitações para o host de inferência direta `https://direct.inference.aivax.net/v1` e defina um tempo limite no cliente que cubra o tempo esperado, incluindo as tentativas. O corpo da solicitação e a resposta são os mesmos. Veja [Long-running inference](https://docs.aivax.net/pt-br/docs/overview.md#long-running-inference).

Para uma lista de verificação de solução de problemas que abrange recusas, streams incompletos e aplicação nativa versus healing, leia [How to fix invalid JSON from an LLM API with structured outputs](https://aivax.net/blog/structured-output-healing-boundary/).
