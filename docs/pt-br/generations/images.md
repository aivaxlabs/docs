# Geração de Imagens

Use a geração de imagens quando sua aplicação precisa de uma ou mais imagens a partir de um prompt de texto sem solicitar a um modelo de chat que chame a ferramenta de imagem integrada. Uma solicitação pode conter um prompt ou um array de prompts, e a AIVAX devolve as URLs das imagens geradas agrupadas pelo prompt que as produziu.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/images</span>
</div>

## Escolha um modelo

`model` é obrigatório e deve corresponder a um modelo exposto por `/api/v1/information/image-models.json`. Os nomes dos modelos são comparados sem diferenciar maiúsculas de minúsculas. A lista de modelos também expõe sinalizadores de capacidade, incluindo se um modelo suporta imagens de referência.

Os campos da solicitação são:

| Propriedade | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `input` | `string` ou `string[]` | Obrigatório | Um prompt ou múltiplos prompts. Prompts vazios são rejeitados. |
| `count` | `integer` | `1` | Imagens geradas para cada prompt. Mínimo 1; máximo 4. |
| `model` | `string` | Obrigatório | Nome público do modelo de geração de imagens. |
| `referenceImages` | `string[]` | Vazio | Até quatro URLs de imagens seguras e absolutas. O modelo selecionado deve suportar referências. |

Por exemplo, dois prompts com `count: 4` solicitam oito imagens no total. A resposta mantém cada prompt ao lado de seu próprio array `images` para que o chamador não precise inferir a qual URL cada entrada pertence.

As URLs de referência são buscadas e normalizadas pela AIVAX antes da geração. Use URLs de imagens publicamente acessíveis com tipo de conteúdo de imagem. Cada referência é limitada pelo caminho de busca de mídia, e imagens não suportadas ou inacessíveis não podem ser usadas pelo provedor.

## Cobrança e limites

O endpoint usa o mesmo serviço de geração de imagens e a [cota do plano diário](/docs/pt-br/limits#built-in-tool-limits) da ferramenta de imagem integrada. Cada prompt consome uma operação de geração de imagens da cota; `count` controla quantas imagens essa operação solicita e afeta o custo do provedor.

Imagens geradas são armazenadas pela AIVAX e retornadas como URLs. Baixe ou copie-as para armazenamento próprio da aplicação se precisar de uma política de retenção separada.

<script src="https://inference.aivax.net/apidocs?embed-target=Generate%20images&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Para geração de imagens orientada por modelo dentro de uma conversa, habilite a ferramenta integrada de Geração de Imagens. O endpoint direto é melhor quando sua aplicação já sabe que uma imagem deve ser criada e deseja um formato de resposta previsível.