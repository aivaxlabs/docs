---
{title: Extração,linkTitle: Extração,weight: 50,group: Data processing,sourceHash: 9694149e2ef79092,aliases: [/docs/pt-br/data-processing/extraction.html]}
---

# Extração

Use a Extração para transformar texto, imagens e PDFs em JSON moldado por um esquema que você define. Ela se adapta a faturas, recibos, formulários, contratos e outros documentos onde seu aplicativo precisa dos mesmos campos em todos os documentos, como um número, o nome de uma empresa, um total ou uma lista de itens.

Antes de chamar este endpoint, [crie uma chave de API](../authentication.md) e certifique-se de que a conta tenha um saldo positivo.

## Extração, Busca ou Descrições de Mídia

Estes três serviços leem documentos, mas retornam coisas diferentes:

| | Extração | [Busca e OCR](/docs/pt-br/web-foundation/fetch-and-ocr) | [Descrições de Mídia](media-descriptions.md) |
| --- | --- | --- | --- |
| Propósito principal | Encontrar campos específicos em cada documento e retorná-los como JSON. | Recuperar o texto legível de páginas da web e documentos, usando OCR quando necessário. | Interpretar mídias com IA e retornar uma descrição textual guiada pelas suas instruções. |
| Entrada | Texto, JPEG, PNG, TIFF e conteúdo PDF. | Páginas da web e muitos formatos de documento, incluindo arquivos Office, planilhas e e-books. | Imagens, PDFs, áudio e vídeo. |
| Saída | Um objeto JSON por documento, moldado pelo seu esquema. | Texto extraído, além de JSON opcional convertido a partir desse texto. | Texto gerado. |
| Cobrança | Apenas tokens de entrada. | Unidades de processamento com cotas do plano diário; a conversão para JSON é cobrada separadamente. | Custos de uso de IA para entrada e saída. |

Escolha a Extração quando você já sabe quais campos precisa e deseja que sejam lidos diretamente do documento. Escolha a Busca quando precisar do texto completo do documento, por exemplo, para indexá-lo ou ler uma página da web. Escolha as Descrições de Mídia quando precisar de uma explicação sobre conteúdo visual ou audiovisual, como um gráfico, uma foto ou um vídeo, em vez de campos específicos.

Para um padrão de solicitação que impede que um documento falho custe o restante, veja [extrair dados estruturados de um PDF, um documento por solicitação](https://aivax.net/blog/extract-structured-data-from-pdf-llm-api-what-a-failed-batch-costs/).

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/extract</span>
</div>

## Construir a solicitação

| Propriedade | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `responseSchema` | Objeto JSON Schema | Sim | Esquema de objeto cujas `properties` descrevem os campos a extrair. Deve ter pelo menos uma propriedade. |
| `documents` | Array de partes de conteúdo | Sim | Um ou mais documentos como partes de conteúdo compatíveis com OpenAI: `text`, `image_url` ou `file`. |
| `instructions` | String | Não | Diretrizes que se aplicam a todos os documentos, como qual parte conta como fornecedor. |

Cada propriedade em `responseSchema` é um campo a ser encontrado. Sua `description` é o critério de pesquisa, então escreva-a como uma definição curta e específica, como "valor total devido" em vez de "total". Objetos aninhados e arrays de objetos são suportados. `$ref` e `$defs` não são; incorpore todas as definições inline.

Imagens e arquivos aceitam URLs de dados base64 ou URLs HTTP(S) públicos:

- Os formatos suportados são JPEG, PNG, TIFF e PDF, incluindo PDFs de várias páginas.
- O recurso deve ser acessível sem login.
- Outros tipos de conteúdo, como áudio ou vídeo, retornam `400 Bad Request`.

A seguinte solicitação extrai campos de fatura de um documento de texto e um PDF:

```json
{
  "instructions": "Considere apenas a empresa emissora como o fornecedor.",
  "responseSchema": {
    "type": "object",
    "properties": {
      "invoice_number": { "type": "string", "description": "número da fatura" },
      "vendor": { "type": "string", "description": "empresa que emitiu a fatura" },
      "total": { "type": "number", "description": "valor total devido" },
      "line_items": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "product": { "type": "string", "description": "nome do produto" },
            "quantity": { "type": "integer", "description": "número de unidades" }
          }
        }
      }
    }
  },
  "documents": [
    {
      "type": "text",
      "text": "Fatura 1042 da Acme Corp. 2 x Widget a $10,00. Total: 20,00 USD."
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

`data` contém um objeto por documento, na mesma ordem que `documents`. Cada objeto usa os nomes de propriedade do seu esquema. Um campo que não é encontrado é `null`, e um array sem correspondências está vazio.

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

Os documentos são processados independentemente. Se qualquer documento falhar, toda a solicitação retorna um erro em vez de resultados parciais. Documentos que foram concluídos antes da falha ainda são cobrados e contam para sua cota, então corrija ou remova o documento com falha antes de tentar novamente.

Os valores extraídos são gerados pelo modelo. Verifique valores importantes, como montantes e identificadores, contra o documento original.

## Preços e limites

A Extração é cobrada pelos tokens de entrada de cada documento. Tokens de saída não são cobrados.

| Descrição | Preço |
| --- | ---: |
| Entrada de Extração | **$0,04/M tokens** |

A Extração e o [Resumo](summarization.md) compartilham os mesmos limites de documentos. Arquivos remotos têm limite de 5 MB cada. O número de documentos processados por minuto e por dia depende do plano; consulte [Limites de processamento de dados](/docs/pt-br/limits.md#data-processing).

A cota conta cada item no array `documents` da solicitação, não cada solicitação HTTP. Uma solicitação que excederia qualquer janela ativa retorna `429 Too Many Requests`.

A referência de API embutida contém os detalhes mantidos pelo servidor de solicitação, resposta, autenticação e erro:

<script src="https://inference.aivax.net/apidocs?embed-target=Extract%20data%20from%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
