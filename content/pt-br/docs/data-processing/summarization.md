---
{title: Resumo,linkTitle: Resumo,weight: 60,group: Data processing,sourceHash: d97a7c0a4b36c44c,aliases: [/docs/pt-br/data-processing/summarization.html]}
---

# Resumo

Use o Resumo para condensar texto, imagens e PDFs em resumos curtos, opcionalmente guiado por instruções sobre formato, foco, idioma ou comprimento. É adequado para relatórios, artigos, contratos e documentos escaneados que precisam de uma visão geral rápida antes da revisão, busca ou de uma etapa posterior do fluxo de trabalho.

Um resumo reformula o documento com novas palavras sem adicionar informações ou comentários. Para obter campos específicos como JSON, use [Extraction](extraction.md) em vez disso. Para fazer perguntas abertas sobre mídia ou descrever conteúdo visual, use [Media Descriptions](media-descriptions.md).

Antes de chamar este ponto de extremidade, [crie uma chave de API](../authentication.md) e verifique se a conta tem saldo positivo.

## Ponto de extremidade

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/summarize</span>
</div>

## Comportamento da solicitação

| Propriedade | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `documents` | Content part array | Yes | One or more documents as OpenAI-compatible content parts: `text`, `image_url`, or `file`. |
| `instructions` | String | No | Guidance that applies to every summary, such as format, language, focus, or length. |

Imagens e arquivos aceitam URLs de dados base64 ou URLs públicas HTTP(S). Os formatos suportados são JPEG, PNG, TIFF e PDF, incluindo PDFs de várias páginas. AIVAX baixa URLs remotas antes do processamento, até 5 MB cada; o recurso deve ser acessível sem autenticação. Outros tipos de conteúdo, como áudio ou vídeo, retornam `400 Bad Request` com o índice do documento rejeitado.

```json
{
  "instructions": "Answer in three bullet points, in English.",
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

## Ler a resposta

`data` contém uma string de resumo por documento, na mesma ordem de `documents`. Os documentos são resumidos de forma independente e em paralelo; para obter um único resumo de vários documentos, envie-os como um único documento de texto ou resuma os resumos individuais em uma segunda solicitação.

```json
{
  "message": null,
  "data": [
    "- Proposes a peer-to-peer electronic cash system that works without a trusted third party.\n- Prevents double spending with a proof-of-work chain of timestamped transactions.\n- Stays secure while honest nodes control most of the computing power."
  ]
}
```

Se algum documento falhar, a solicitação retorna um erro em vez de resultados parciais. Os resumos são gerados pelo modelo e podem omitir ou distorcer detalhes; verifique as informações importantes no documento original.

## Preços e limites

O Resumo é cobrado pelos tokens de entrada de cada documento. Tokens de saída não são cobrados.

| Descrição | Preço |
| --- | ---: |
| Entrada de resumo | **$0.04/M tokens** |

Resumo e [Extraction](extraction.md) compartilham os mesmos limites de documento. Um travessão (`—`) indica que o plano não impõe um limite.

| Limite | Gratuito | Pro | Máximo |
| --- | --- | --- | --- |
| Documentos processados | 10/min and 300/day | 200/min | 2,500/min |

A cota conta cada item no array `documents` da solicitação, não cada solicitação HTTP. Uma solicitação que excederia qualquer janela ativa retorna `429 Too Many Requests`. Para limites por conta, veja [Plans and Limits](/docs/pt-br/limits).

A referência de API incorporada contém os detalhes de solicitação, resposta, autenticação e erro mantidos pelo servidor:

<script src="https://inference.aivax.net/apidocs?embed-target=Summarize%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
