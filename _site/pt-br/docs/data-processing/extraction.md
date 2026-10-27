Source: https://docs.aivax.net/pt-br/docs/data-processing/extraction.html

# Extração

Use a Extração para transformar texto, imagens e PDFs em JSON estruturado de acordo com um esquema que você define. Ela serve para faturas, recibos, formulários, contratos e outros documentos onde sua aplicação precisa dos mesmos campos de cada documento, como número, nome da empresa, total ou uma lista de itens.

Antes de chamar este endpoint, [crie uma chave de API](https://docs.aivax.net/pt-br/docs/authentication.md) e certifique-se de que a conta tem saldo positivo.

## Extração, Busca ou Descrições de Mídia

Esses três serviços leem documentos, mas retornam coisas diferentes:

| | Extraction | [Fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md) | [Media Descriptions](https://docs.aivax.net/pt-br/docs/data-processing/media-descriptions.md) |
| --- | --- | --- | --- |
| Objetivo principal | Encontrar campos específicos em cada documento e retorná‑los como JSON. | Recuperar o texto legível de páginas web e documentos, usando OCR quando necessário. | Interpretar mídia com IA e retornar uma descrição de texto guiada pelas suas instruções. |
| Entrada | Texto, JPEG, PNG, TIFF e conteúdo PDF. | Páginas web e vários formatos de documento, incluindo arquivos Office, planilhas e e‑books. | Imagens, PDFs, áudio e vídeo. |
| Saída | Um objeto JSON por documento, estruturado segundo o seu esquema. | Texto extraído, mais JSON opcional convertido a partir desse texto. | Texto gerado. |
| Cobrança | Apenas tokens de entrada. | Unidades de processamento com cotas diárias; a conversão para JSON é cobrada separadamente. | Custos de uso de IA para entrada e saída. |

Escolha Extração quando você já souber quais campos precisa e quiser que sejam lidos diretamente do documento. Escolha Busca quando precisar do texto completo do documento, por exemplo para indexá‑lo ou ler uma página web. Escolha Descrições de Mídia quando precisar de uma explicação de conteúdo visual ou audiovisual, como um gráfico, uma foto ou um vídeo, em vez de campos específicos.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/extract</span>
</div>

## Comportamento da requisição

| Propriedade | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `responseSchema` | Objeto JSON Schema | Sim | Esquema de objeto cujas `properties` descrevem os campos a extrair. Deve possuir ao menos uma propriedade. |
| `documents` | Array de partes de conteúdo | Sim | Um ou mais documentos como partes de conteúdo compatíveis com OpenAI: `text`, `image_url` ou `file`. |
| `instructions` | String | Não | Orientação que se aplica a todos os documentos, como qual parte conta como fornecedor. |

Cada propriedade em `responseSchema` corresponde a um campo a ser encontrado. Sua `description` é o critério de busca, portanto escreva-a como uma definição curta e específica, como “valor total devido” em vez de “total”. Objetos aninhados e arrays de objetos são suportados. `$ref` e `$defs` não são; inclua cada definição inline.

Imagens e arquivos aceitam URLs de dados base64 ou URLs HTTP(S) públicas. Formatos suportados são JPEG, PNG, TIFF e PDF, incluindo PDFs de múltiplas páginas. A AIVAX baixa URLs remotas antes de processar, até 5 MB cada; o recurso deve ser acessível sem login. Outros tipos de conteúdo, como áudio ou vídeo, retornam `400 Bad Request` com o índice do documento rejeitado.

A requisição a extrai campos de fatura de um documento de texto e de um PDF:

```json
{
  "instructions": "Only consider the issuing company as the vendor.",
  "responseSchema": {
    "type": "object",
    "properties": {
      "invoice_number": { "type": "string", "description": "invoice number" },
      "vendor": { "type": "string", "description": "company that issued the invoice" },
      "total": { "type": "number", "description": "total amount due" },
      "line_items": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "product": { "type": "string", "description": "product name" },
            "quantity": { "type": "integer", "description": "number of units" }
          }
        }
      }
    }
  },
  "documents": [
    {
      "type": "text",
      "text": "Invoice 1042 from Acme Corp. 2 x Widget at $10.00. Total: 20.00 USD."
    },
    {
      "type": "file",
      "file": {
        "filename": "invoice.pdf",
        "file_data": "https://example.com/invoice.pdf"
      }
    }
  ]
}
```

## Ler a resposta

`data` contém um objeto por documento, na mesma ordem de `documents`. Cada objeto usa os nomes de propriedade do seu esquema. Valores são convertidos para os tipos `number`, `integer` ou `boolean` declarados no esquema quando possível. Um campo não encontrado é `null`, e um array sem correspondências fica vazio.

```json
{
  "message": null,
  "data": [
    {
      "invoice_number": "1042",
      "vendor": "Acme Corp",
      "total": 20,
      "line_items": [
        { "product": "Widget", "quantity": 2 }
      ]
    }
  ]
}
```

Documentos são processados de forma independente e em paralelo. Se algum documento falhar, a requisição retorna um erro ao invés de resultados parciais, portanto corrija ou remova esse documento e tente novamente.

Os valores extraídos são gerados pelo modelo. Eles podem estar ausentes, incompletos ou errados, especialmente em digitalizações de baixa qualidade ou layouts complexos. Valide a estrutura e verifique valores consequentes, como valores e identificadores, contra o documento original.

## Preços e limites

A Extração é cobrada pelos tokens de entrada de cada documento. Tokens de saída não são cobrados.

| Descrição | Preço |
| --- | ---: |
| Entrada de Extração | **$0.04/M tokens** |

Extração e [Summarization](https://docs.aivax.net/pt-br/docs/data-processing/summarization.md) compartilham os mesmos limites de documento. Um travessão longo (`—`) indica que o plano não impõe limite.

| Limite | Gratuito | Pro | Máximo |
| --- | --- | --- | --- |
| Documentos processados | 10/min e 300/dia | 200/min | 2.500/min |

A cota conta cada item no array `documents` da requisição, não cada requisição HTTP. Uma requisição que excederia qualquer janela ativa retorna `429 Too Many Requests`. Para limites por conta, veja [Plans and Limits](https://docs.aivax.net/pt-br/docs/limits.md).

A referência de API embutida contém os detalhes mantidos pelo servidor sobre requisição, resposta, autenticação e erros:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Extract%20data%20from%20documents)
