---
{title: Resumo,linkTitle: Resumo,weight: 60,group: Data processing,sourceHash: e4834ea6d60c77bc,aliases: [/docs/pt-br/data-processing/summarization.html]}
---

# Resumo

Use o Resumo para condensar textos, imagens e PDFs em resumos curtos, opcionalmente guiados por instruções sobre formato, foco, idioma ou comprimento. É adequado para relatórios, artigos, contratos e documentos digitalizados que precisam de uma visão geral rápida antes da revisão, busca ou de uma etapa posterior do fluxo de trabalho.

Um resumo reafirma o documento com novas palavras, sem adicionar informações ou comentários. Para obter campos específicos como JSON, use [Extração](extraction.md) em vez disso. Para fazer perguntas abertas sobre mídia ou descrever conteúdo visual, use [Descrições de Mídia](media-descriptions.md).

Antes de chamar este endpoint, [crie uma chave de API](../authentication.md) e certifique-se de que a conta tenha um saldo positivo.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/summarize</span>
</div>

## Comportamento da solicitação

| Propriedade | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `documents` | Array de partes de conteúdo | Sim | Um ou mais documentos como partes de conteúdo compatíveis com OpenAI: `text`, `image_url` ou `file`. |
| `instructions` | String | Não | Orientações que se aplicam a cada resumo, como formato, idioma, foco ou comprimento. |

Imagens e arquivos aceitam URLs de dados base64 ou URLs HTTP(S) públicos. Os formatos suportados são JPEG, PNG, TIFF e PDF, incluindo PDFs de várias páginas. O recurso deve ser acessível sem login. Outros tipos de conteúdo, como áudio ou vídeo, retornam `400 Bad Request`.

```json
{
  "instructions": "Responda em três tópicos, em inglês.",
  "documents": [
    {
      "type": "file",
      "file": {
        "filename": "bitcoin.pdf",
        "file_data": "https://bitcoin.org/bitcoin.pdf"
      }
    }
  ]
}
```

## Leia a resposta

`data` contém uma string de resumo por documento, na mesma ordem que `documents`. Os documentos são resumidos independentemente; para obter um único resumo de vários documentos, envie-os como um único documento de texto ou resuma os resumos individuais em uma segunda solicitação.

```json
{
  "message": null,
  "data": [
    "- Propõe um sistema de dinheiro eletrônico ponto a ponto que funciona sem uma terceira parte confiável.\n- Impede a dupla despesa com uma cadeia de prova de trabalho de transações carimbadas no tempo.\n- Mantém-se seguro enquanto nós honestos controlam a maior parte do poder computacional."
  ]
}
```

Se qualquer documento falhar, a solicitação retorna um erro em vez de resultados parciais. Documentos que foram concluídos antes da falha ainda são cobrados e contam para sua cota, então corrija ou remova o documento com falha antes de tentar novamente. Os resumos são gerados pelo modelo; verifique informações importantes contra o documento original.

## Preços e limites

O Resumo é cobrado pelos tokens de entrada de cada documento. Os tokens de saída não são cobrados.

| Descrição | Preço |
| --- | ---: |
| Entrada de Resumo | **$0,04/M tokens** |

O Resumo e a [Extração](extraction.md) compartilham os mesmos limites de documentos. Arquivos remotos têm limite de 5 MB cada. O número de documentos processados por minuto e por dia depende do plano; consulte [Limites de processamento de dados](/docs/pt-br/limits.md#data-processing).

A cota conta cada item no array `documents` da solicitação, não cada solicitação HTTP. Uma solicitação que excederia qualquer janela ativa retorna `429 Too Many Requests`.

A referência de API embutida contém os detalhes mantidos pelo servidor de solicitação, resposta, autenticação e erro:

<script src="https://inference.aivax.net/apidocs?embed-target=Summarize%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
