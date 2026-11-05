---
{title: Conceitos de Respostas Estruturadas,linkTitle: Conceitos,weight: 10,group: Structured Responses,aliases: [/docs/pt-br/inference/structured-responses.html,/docs/pt-br/inference/structured-responses/concepts.html],sourceHash: fd41afff006c643d}
---

# Conceitos de respostas estruturadas

A AIVAX pode gerar JSON estruturado por meio de dois caminhos:

- `response_schema`: A AIVAX valida a saída final do modelo contra um JSON Schema e tenta novamente com feedback de validação quando a saída é inválida. Este é o caminho de Curativo JSON; [Quando um LLM retorna JSON inválido](https://aivax.net/blog/structured-output-healing-boundary/) explica como o truncamento, as recusas e o reparo diferem.
- `response_format`: A AIVAX passa um formato de resposta nativo compatível com OpenAI ao provedor ou aplica curativo quando `healing_options` está presente ou o Curativo JSON automático está habilitado na conta.

Use respostas estruturadas quando outro sistema consumirá a saída e o texto livre seria frágil.

## Escolhendo um modo

Use `response_schema` quando a AIVAX deve assumir a validação e o reparo. Este é o modo mais seguro para modelos que não suportam nativamente saída estruturada, para respostas que usam ferramentas antes de produzir JSON e para sistemas que não podem tolerar JSON malformado.

Use `response_format` com `type: "json_schema"` quando o modelo do provedor deve lidar com a saída estruturada nativamente. A AIVAX ainda usará o esquema internamente, e o curativo é aplicado quando `response_format.json_schema.healing_options` é fornecido ou a conta tem o Curativo JSON automático habilitado.

Use `json_only: true` quando o corpo da resposta HTTP deve conter apenas o JSON final. Isso remove o envelope normal de conclusão de chat, escolhas, uso e metadados de geração do corpo da resposta. Consulte [JSON-only](json-only.md).

| Página | Abrange |
| --- | --- |
| [Curativo JSON](json-healing.md) | Como a validação e as tentativas funcionam, saída estruturada nativa, recursos de esquema suportados e falhas. |
| [Raciocínio e ferramentas](reasoning-and-tools.md) | Como os modelos de raciocínio e as chamadas de ferramenta se combinam com um esquema. |
| [JSON-only](json-only.md) | Retornando o corpo JSON puro, com e sem streaming. |

## Solicitações estruturadas de longa duração

Uma solicitação estruturada pode levar muito mais tempo do que uma simples: o modelo pode raciocinar, chamar ferramentas e depois fazer várias tentativas de curativo, cada uma sendo uma geração completa. Sem streaming e sempre com `json_only`, o cliente não recebe nada até que o JSON final esteja pronto, portanto, a solicitação pode exceder o tempo limite do proxy em `https://inference.aivax.net` e terminar com HTTP `524` enquanto a AIVAX ainda está trabalhando.

Envie essas solicitações para o host de inferência direta `https://direct.inference.aivax.net/v1` e defina um tempo limite do cliente que cubra o tempo esperado, incluindo as tentativas. O corpo da solicitação e a resposta são os mesmos. Consulte [Inferência de longa duração](/docs/pt-br/overview.md#long-running-inference).

Para uma lista de verificação de solução de problemas que abrange recusas, streams incompletos e aplicação nativa versus curativo, leia [Como corrigir JSON inválido de uma API de LLM com saídas estruturadas](https://aivax.net/blog/structured-output-healing-boundary/).
