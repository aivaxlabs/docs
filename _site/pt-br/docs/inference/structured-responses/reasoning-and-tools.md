Source: https://docs.aivax.net/pt-br/docs/inference/structured-responses/reasoning-and-tools.html

# Raciocínio e ferramentas

Uma solicitação estruturada pode usar um modelo de raciocínio e ferramentas. O modelo raciocina e chama ferramentas como em qualquer outra solicitação, e o AIVAX valida o JSON apenas quando o modelo escreve sua resposta final.

## Como a solicitação é executada

1. O modelo recebe as mensagens, as ferramentas e o esquema.
2. Ele pode raciocinar e chamar ferramentas quantas vezes precisar. As chamadas de ferramentas e seus resultados não são verificados contra o esquema.
3. Quando o modelo responde sem chamar mais ferramentas, o AIVAX lê o JSON dessa resposta e o valida contra `response_schema`.
4. Se o JSON estiver ausente ou inválido, o AIVAX envia os erros de validação de volta ao modelo e solicita uma nova resposta. Consulte [Cura de JSON](https://docs.aivax.net/pt-br/docs/inference/structured-responses/json-healing.md).

Apenas respostas JSON com falha contam para `max_attempts`. Chamadas de ferramentas e raciocínio não consomem tentativas.

## De onde vem o JSON

O AIVAX lê o JSON do conteúdo da resposta final, nunca do raciocínio. A resposta pode conter o JSON sozinho ou dentro de um bloco de código Markdown; o AIVAX também tolera uma chave ou colchete de abertura ou fechamento ausentes. O texto ao redor de um bloco de código é descartado.

Informe ao modelo para colocar o JSON em sua resposta final. Um modelo que escreve o resultado apenas em seu raciocínio produz uma resposta vazia, o que falha na validação.

## Streaming

Com `response_schema` e cura, o texto da resposta não é transmitido enquanto está sendo gerado, porque uma resposta parcial ou inválida pode ser substituída por uma nova tentativa. Raciocínio, eventos de chamada de ferramenta e uso ainda são transmitidos, para que o cliente possa mostrar o progresso. O JSON validado chega no final do fluxo.

Com `json_only`, o fluxo contém apenas o JSON final. Consulte [JSON-only](https://docs.aivax.net/pt-br/docs/inference/structured-responses/json-only.md).

## Exemplo

```json
{
    "model": "@google/gemini-2.5-flash",
    "messages": [
        {
            "role": "user",
            "content": "Encontre a população atual de Lisboa e retorne-a como JSON com a URL da fonte."
        }
    ],
    "reasoning_effort": "low",
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "response_schema": {
        "type": "object",
        "properties": {
            "city": { "type": "string" },
            "population": { "type": "integer" },
            "source_url": { "type": "string" }
        },
        "required": ["city", "population", "source_url"]
    }
}
```

O modelo pesquisa na web primeiro, depois escreve a resposta final. Apenas essa resposta deve corresponder ao esquema.

## Recomendações

- Use um modelo que suporte chamada de ferramentas quando a solicitação tiver ferramentas, ou um gateway com um manipulador de ferramentas.
- Adicione campos de origem ou evidência ao esquema quando o aplicativo precisar saber de onde veio um valor.
- Mantenha os resultados das ferramentas curtos. Resultados longos ou ruidosos dificultam que o modelo produza um JSON válido no final.
- Espere solicitações mais longas: raciocínio, chamadas de ferramentas e novas tentativas se somam. Use o host de inferência direta para solicitações longas, conforme descrito em [Conceitos](https://docs.aivax.net/pt-br/docs/inference/structured-responses/concepts.md#long-running-structured-requests).
