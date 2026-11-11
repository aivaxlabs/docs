Source: https://docs.aivax.net/pt-br/docs/data-processing/instruction-refinement.html

# Refinamento de Instrução

Use o Refinamento de Instrução para revisar instruções do sistema, prompts e habilidades antes de enviá-los a um modelo. O serviço verifica esses elementos contra um catálogo de diretrizes de engenharia de prompts compiladas a partir da documentação dos fornecedores de modelos, retornando então uma pontuação, problemas priorizados localizados no seu texto, as diretrizes por trás de cada problema e sugestões de correção com patches que você pode visualizar e aplicar.

Ele se integra a revisões de prompts em pull requests, auditorias de instruções e habilidades de gateways de IA, e editores que destacam problemas conforme você escreve. Ele relata questões relacionadas às diretrizes; não executa o seu prompt nem mede como um modelo performa com ele. Para testar o comportamento contra conversas reais, use [Testes Agênticos](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md).

Antes de chamar este endpoint, [crie uma chave de API](https://docs.aivax.net/pt-br/docs/authentication.md) e certifique-se de que a conta possui saldo positivo.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/instruction-refinement</span>
</div>

## Escolha uma visualização

A revisão é executada em uma de duas visualizações. Cada solicitação executa uma visualização e é cobrada separadamente, portanto, execute ambas quando desejar uma revisão completa.

- **`micro`** (padrão) revisa a redação dentro de cada item: clareza, mensurabilidade das restrições, estrutura, exemplos, ênfase, orientação de ferramentas, formato de saída e diretrizes similares. Use-o enquanto escreve ou edita um único prompt.
- **`macro`** revisa como os itens funcionam juntos como um único agente. Verifica se o agente tem um propósito claro e limites de autoridade, se cada comportamento reside em um único item responsável por ele, se as habilidades podem ser selecionadas a partir de suas descrições sem sobreposição ou serem forçadas, se o contexto corresponde às ferramentas que o agente realmente possui e se evita superespecificação, como conversas roteirizadas ou regras que a plataforma já fornece. Use-o ao revisar um agente inteiro ou seu conjunto de habilidades.

A visualização macro precisa dos itens relacionados para julgar as relações. Envie as instruções base juntamente com as habilidades, descrições de ferramentas e conhecimento que o agente utiliza; um único item lhe dá pouco com que comparar.

## Comportamento da solicitação

| Propriedade | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `view` | String | Não | `micro` ou `macro`. Padrão é `micro`. |
| `purpose` | String | Não | O que o agente deve alcançar. Quando omitido, a revisão infere isso a partir das instruções e documentação, e o resumo indica isso. |
| `context` | Array de Objetos | Sim | Um ou mais itens de contexto, revisados juntos. |
| `context[].type` | String | Sim | O tipo do item, descrito abaixo. |
| `context[].title` | String | Não | Um rótulo para o item, como um nome de arquivo ou habilidade. |
| `context[].description` | String | Não | Uma descrição do item. Para habilidades, envie a descrição que o agente usa para selecionar a habilidade, para que a revisão possa verificar se ela é ativada quando necessário. |
| `context[].content` | String | Sim | O texto do item. Não pode estar vazio. |

| Tipo | Use para |
| --- | --- |
| `instruction` | Instruções do sistema ou do desenvolvedor que são sempre carregadas. |
| `prompt` | Um prompt enviado na interação do usuário. |
| `skill` | Um pacote de instruções que o agente carrega sob demanda. |
| `tool` | A definição ou descrição de uma ferramenta disponível para o agente. |
| `knowledge` | Conteúdo factual de referência disponível para o agente, como produtos, contatos ou políticas. |
| `documentation` | Notas para pessoas sobre o agente. O agente nunca as vê. |

Envie em uma única solicitação os itens que o mesmo agente recebe. Uma diretriz pode ser satisfeita por outro item, e as descobertas podem apontar itens que entram em conflito ou se duplicam; revisar itens em solicitações separadas ignora essas relações. Na visualização micro, os itens `knowledge` e `documentation` são usados apenas como contexto.

Um `view` ou `type` desconhecido, `content` vazio ou array `context` vazio retorna `400 Bad Request`.

```json
{
  "view": "macro",
  "purpose": "Responder perguntas sobre faturamento e repassar reembolsos à equipe financeira.",
  "context": [
    {
      "type": "instruction",
      "title": "support-agent.md",
      "content": "Você é um agente de suporte.\nNunca prometa reembolsos."
    },
    {
      "type": "skill",
      "title": "refunds",
      "description": "Reembolsos.",
      "content": "Prometa um reembolso quando o cliente pedir um."
    }
  ]
}
```

## Leia a resposta

`data` contém a revisão de todos os itens:

| Propriedade | Tipo | Descrição |
| --- | --- | --- |
| `overallScore` | Número | Qualidade geral de `0` a `1`. Pontuações abaixo de `0.4` indicam pelo menos uma descoberta `P0`; pontuações próximas de `1` indicam que apenas melhorias menores se aplicam. |
| `summary` | String | Uma breve avaliação do contexto e sua melhoria mais importante. |
| `findings` | Array de Objetos | Os problemas encontrados, até 20. Pode estar vazio quando o contexto não possui problemas relevantes. |
| `suggestedFixes` | Array de Objetos | Alterações concretas que resolvem uma ou mais descobertas. Na visualização macro, conflitos e riscos vêm primeiro. |

Cada descoberta possui estas propriedades:

| Propriedade | Tipo | Descrição |
| --- | --- | --- |
| `id` | Inteiro | Identificador da descoberta, referenciado por `suggestedFixes[].refFinding`. |
| `priority` | String | `P0` para problemas que podem causar uma ação imprópria ou irreversível, risco regulatório ou de privacidade, ou deixar o agente sem identidade ou propósito; `P1` para decisões erradas prováveis e recorrentes; `P2` para perda de qualidade localizada; `P3` para melhorias de clareza ou organização. |
| `title` | String | Nome curto do problema. |
| `description` | String | O problema e seu efeito no agente. |
| `locations` | Array de Objetos | Cada item envolvido pela descoberta, como ambos os lados de um conflito. Cada localização possui o `contextIndex` do item em `context` (baseado em zero) e um `evidenceSpan`. Pode estar vazio quando o problema não está vinculado a um item. |
| `sources` | Array de Objetos | Diretrizes que sustentam a descoberta, descritas abaixo. |

`evidenceSpan` fornece a localização do problema no `content` desse item como `fromLine`, `toLine`, `fromColumn` e `toColumn`, todos baseados em 1 e inclusivos. É `null` quando o problema é uma omissão, quando reside na `description` de uma habilidade ou quando o texto citado não pôde ser localizado. As colunas contam caracteres a partir do início da linha, portanto, as quebras de linha dentro de `content` devem corresponder ao texto que você exibe ao destacar um trecho.

Cada fonte possui um `id` que identifica a diretriz em seu catálogo, um `number` dentro de seu tipo, um `type` e `references` com as URLs da documentação do fornecedor por trás dela. `type` reflete o peso da diretriz: uma `rule` previne falhas previsíveis, uma `practice` melhora os resultados de forma confiável, uma `tip` é opcional e situacional, e um `dont` é um anti-padrão a ser evitado. Algumas diretrizes macro cobrem o design do agente em vez de orientações do fornecedor e possuem um array `references` vazio.

Cada correção sugerida possui um array `refFinding` com os ids das descobertas que resolve, uma `description` do que exatamente alterar e em qual item, um array `patches` descrito abaixo e um `type`:

| Tipo | Significado |
| --- | --- |
| `modify` | Reescreva o texto no local. |
| `remove` | Exclua texto redundante, conflitante ou prejudicial. |
| `transfer` | Mova o texto para outro item ou tipo, como das instruções para uma habilidade. A descrição nomeia o destino. |
| `add` | Escreva conteúdo que está faltando. A descrição nomeia o item que deve contê-lo. |

`patches` contém a correção como alterações de texto. Cada patch possui o `contextIndex` do item que altera e um `diff` no formato diff unificado, com três linhas de contexto, contra o `content` que você enviou para esse item. Os nomes de arquivo nos cabeçalhos `---` e `+++` são o `title` do item prefixado com `a/` e `b/`, ou `context-<index>` quando o item não possui título. Linhas de cabeçalho terminam com uma quebra de linha, e as linhas de conteúdo mantêm as quebras de linha do seu `content`. Uma correção que altera vários itens, como um `transfer`, possui um patch por item; aplique-os juntos.

`patches` está vazio quando a correção não pode ser escrita como uma alteração nos itens que você enviou: precisa de conteúdo que não está presente, como uma nova habilidade ou uma ferramenta, precisa de fatos que apenas você possui, como um limite ou um contato, ou o texto a ser alterar não pôde ser localizado de forma inequívoca. Use a `description` nesses casos.

Cada patch é calculado contra o `content` original, independentemente das outras correções, portanto, duas correções podem alterar as mesmas linhas. Aplique patches uma correção de cada vez; quando um patch não se aplica mais porque um anterior alterou o mesmo texto, ignore-o ou solicite uma nova revisão.

`title`, `description`, `summary` e descrições de correção são escritos no idioma usado pela maioria do conteúdo analisado.

```json
{
  "message": null,
  "data": {
    "overallScore": 0.35,
    "summary": "As instruções e a habilidade de reembolsos contradizem-se sobre reembolsos, e a descrição da habilidade é vaga demais para ser selecionada de forma confiável.",
    "findings": [
      {
        "id": 1,
        "priority": "P0",
        "title": "Autoridade de reembolso contraditória",
        "description": "As instruções proíbem prometer reembolsos enquanto a habilidade exige isso, então o agente pode prometer reembolsos que não pode conceder.",
        "locations": [
          {
            "contextIndex": 0,
            "evidenceSpan": { "fromLine": 2, "toLine": 2, "fromColumn": 1, "toColumn": 22 }
          },
          {
            "contextIndex": 1,
            "evidenceSpan": { "fromLine": 1, "toLine": 1, "fromColumn": 1, "toColumn": 48 }
          }
        ],
        "sources": [
          {
            "id": "B.D. 3",
            "number": 3,
            "type": "dont",
            "references": [
              "https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide"
            ]
          }
        ]
      }
    ],
    "suggestedFixes": [
      {
        "refFinding": [ 1 ],
        "type": "modify",
        "description": "Na habilidade de reembolsos, substitua a promessa por: \"Explique que a equipe financeira analisa reembolsos e transfira a solicitação para eles.\"",
        "patches": [
          {
            "contextIndex": 1,
            "diff": "--- a/refunds\n+++ b/refunds\n@@ -1,1 +1,1 @@\n-Promise a refund when the customer asks for one.\n\\ No newline at end of file\n+Explain that the finance team reviews refunds and transfer the request to them.\n\\ No newline at end of file\n"
          }
        ]
      }
    ]
  }
}
```

As revisões são geradas por modelos. A pontuação e as descobertas podem variar entre solicitações para o mesmo conteúdo, e uma descoberta pode estar errada ou perder contexto que só você possui. Uma remoção sugerida ainda pode eliminar uma regra de negócio que a revisão não reconheceu como crítica, portanto, verifique as remoções contra seus requisitos, leia cada patch antes de aplicá-lo e confirme que o agente alterado ainda se comporta conforme o esperado.

## Preços e limites

O Refinamento de Instrução é cobrado em unidades de processamento (PUs), cobrindo o uso de entrada e saída. O uso é registrado uma vez por solicitação. O preço da PU varia com o modelo de processamento que atende à solicitação, e o [multiplicador de plano](https://docs.aivax.net/pt-br/docs/pricing.md#plan-multipliers) se aplica. Itens de contexto mais longos consomem mais entrada.

O Refinamento de Instrução compartilha os limites de documento do [Extração](https://docs.aivax.net/pt-br/docs/data-processing/extraction.md) e [Resumo](https://docs.aivax.net/pt-br/docs/data-processing/summarization.md). Cada item no array `context` da solicitação conta como um documento, não cada solicitação HTTP. O número de documentos processados por minuto e por dia depende do plano; veja [Limites de processamento de dados](https://docs.aivax.net/pt-br/docs/limits.md#data-processing). Uma solicitação que excederia qualquer janela ativa retorna `429 Too Many Requests`.

A referência de API embutida contém os detalhes de solicitação, resposta, autenticação e erro mantidos pelo servidor:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Refine%20instructions)
