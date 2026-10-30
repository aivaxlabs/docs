---
{title: Resumo,linkTitle: Resumo,weight: 60,group: Data processing,sourceHash: bd9ef167a609fe05,aliases: [/docs/pt-br/data-processing/summarization.html]}
---

# Resumo

Use o recurso de Resumo para condensar textos, imagens e PDFs em resumos curtos, opcionalmente guiados por instruções sobre formato, foco, idioma ou comprimento. Ele se adapta a relatórios, artigos, contratos e documentos digitalizados que precisam de uma visão geral rápida antes da revisão, pesquisa ou de uma etapa posterior do fluxo de trabalho.

Um resumo reafirma o documento com novas palavras, sem adicionar informações ou comentários. Para obter campos específicos em JSON, use [Extração](extraction.md). Para fazer perguntas abertas sobre mídia ou descrever conteúdo visual, use [Descrições de Mídia](media-descriptions.md).

Antes de chamar este endpoint, [crie uma chave de API](../authentication.md) e certifique-se de que a conta tenha um saldo positivo.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/summarize</span>
</div>

## Comportamento da solicitação

| Propriedade | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `documents` | Matriz de partes de conteúdo | Sim | Um ou mais documentos como partes de conteúdo compatíveis com OpenAI: `text`, `image_url` ou `file`. |
| `instructions` | String | Não | Orientações que se aplicam a cada resumo, como formato, idioma, foco ou comprimento. |

Imagens e arquivos aceitam dados URL base64 ou URLs HTTP(S) públicos. Os formatos suportados são JPEG, PNG, TIFF e PDF, incluindo PDFs de várias páginas. A AIVAX baixa URLs remotos antes do processamento, até 5 MB cada; o recurso deve ser acessível sem login. Outros tipos de conteúdo, como áudio ou vídeo, retornam `400 Bad Request`. O erro não identifica qual documento foi rejeitado, portanto, verifique o tipo de conteúdo de cada documento na solicitação.

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

`data` contém uma string de resumo por documento, na mesma ordem que `documents`. Os documentos são resumidos independentemente e em paralelo; para obter um único resumo de vários documentos, envie-os como um único documento de texto ou resuma os resumos individuais em uma segunda solicitação.

```json
{
  "message": null,
  "data": [
    "- Propõe um sistema de dinheiro eletrônico ponto a ponto que funciona sem uma terceira parte confiável.\n- Previne a dupla gasto com uma cadeia de prova de trabalho de transações carimbadas no tempo.\n- Permanece seguro enquanto nós honestos controlam a maior parte do poder de computação."
  ]
}
```

Se qualquer documento falhar, a solicitação retorna um erro em vez de resultados parciais. Documentos que foram concluídos antes da falha ainda são cobrados e contam para sua cota, portanto, tente novamente apenas após corrigir o documento com falha. Os resumos são gerados pelo modelo e podem omitir ou declarar incorretamente detalhes; verifique informações importantes contra o documento original.

## Preços e limites

O Resumo é cobrado pelos tokens de entrada de cada documento. Tokens de saída não são cobrados.

| Descrição | Preço |
| --- | ---: |
| Entrada de Resumo | **$0,04/M tokens** |

Resumo e [Extração](extraction.md) compartilham os mesmos limites de documentos. Um travessão (`—`) significa que o plano não impõe um limite.

| Limite | Gratuito | Pro | Máx |
| --- | --- | --- | --- |
| Documentos processados | 10/min e 300/dia | 200/min | 2.500/min |

A cota conta cada item na matriz `documents` da solicitação, não cada solicitação HTTP. Uma solicitação que excederia qualquer janela ativa retorna `429 Too Many Requests`. Para limites em nível de conta, consulte [Planos e Limites](/docs/pt-br/limits).

A referência de API embutida contém os detalhes mantidos pelo servidor de solicitação, resposta, autenticação e erro:

<script src="https://inference.aivax.net/apidocs?embed-target=Summarize%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
