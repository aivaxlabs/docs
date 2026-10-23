Source: https://docs.aivax.net/pt-br/docs/rag/semantic-search.html

# Busca

A API de busca procura uma ou mais coleções e devolve os documentos indexados mais relevantes para os termos de busca fornecidos. As mesmas opções de recuperação são usadas pela geração de respostas RAG e pelas coleções anexadas a um gateway de IA.

Se sua aplicação já possui as strings dos documentos candidatos, considere [Reflex](https://docs.aivax.net/pt-br/docs/rag/reflex.md): uma busca sem coleção que classifica os documentos fornecidos sem indexação ou armazenamento. Use busca gerenciada quando a AIVAX deve armazenar e buscar um corpus persistente ou quando o corpus é grande demais para ser enviado como candidatos em cada requisição.

Antes de buscar, adicione [documents](https://docs.aivax.net/pt-br/docs/rag/documents.md) a uma [collection](https://docs.aivax.net/pt-br/docs/rag/collections.md) e aguarde a indexação. Compare a [busca vetorial com o pipeline RAG completo](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/) antes de decidir o que construir.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Semantic%20search)

## Como uma busca é executada

1. Se um `filter` for definido, a AIVAX primeiro restringe as coleções solicitadas aos documentos que o correspondem.  
2. Cada termo de busca é incorporado e comparado com os documentos indexados que permanecem.  
3. Candidatos abaixo da pontuação mínima são descartados.  
4. O reranker reordena os candidatos, e os melhores resultados, até o número solicitado, são retornados.  
5. Quando a expansão de referência está habilitada, documentos que compartilham uma referência com um resultado são anexados a ele.  

Cada resultado inclui o ID do documento, nome, conteúdo, pontuação e metadados.

## Opções de busca

| Opção | Padrão | Descrição |
| --- | --- | --- |
| `collections` | Required | Um ou mais IDs de coleção pertencentes à conta. |
| `terms` | — | Um termo de busca ou uma lista de termos alternativos. Opcional apenas quando `filter` está definido. |
| `top` | 5 | Número máximo de resultados, de 1 a 128. |
| `minScore` | 0.2 | Similaridade vetorial mínima, de 0 a 0,99, aplicada antes do reranking. Aumente para eliminar correspondências fracas; diminua quando documentos relevantes estiverem ausentes. |
| `reranker` | Reflex | Reranker que ordena os candidatos. Use `none` para manter a ordem de similaridade vetorial. Veja [Rerankers](https://docs.aivax.net/pt-br/docs/rag/reranking.md). |
| `filter` | — | Uma expressão de [advanced filter](https://docs.aivax.net/pt-br/docs/rag/document-filters.md), ou uma lista de expressões que devem todas corresponder. |
| `includeReferences` | `false` | Anexa os outros documentos que compartilham a referência de cada resultado. |

A referência da API incorporada é a fonte de verdade para o contrato de requisição e resposta.

## Filtrar resultados

Filtros restringem os documentos que uma busca pode retornar, usando condições exatas nos campos do documento em vez de similaridade semântica. Use-os quando a resposta deve vir de um subconjunto conhecido, como um produto, locatário, idioma, tipo de documento ou período.

| Filtro em | Exemplo | Uso para |
| --- | --- | --- |
| Nome | `name startswith "policy-"` | Famílias de documentos que seguem uma convenção de nomenclatura. |
| Tags | `tags has "finance"` | Rótulos operacionais atribuídos na importação. |
| Metadados | `metadata.region = "br"` | Valores estruturados armazenados com cada documento, como região, versão ou autor. |
| Conteúdo | `content contains "refund"` | Palavras ou identificadores obrigatórios no texto. |
| Datas | `updatedAt >= now-30d` | Documentos criados ou atualizados recentemente. |

Combine condições com `and`, `or`, `not` e parênteses, por exemplo `tags has "finance" and createdAt >= now-30d`. Quando `filter` é uma lista, cada expressão deve corresponder.

Filtros são avaliados antes que os termos de busca sejam incorporados. Apenas documentos correspondentes são classificados, portanto os resultados nunca incluem documentos fora do filtro. Quando nenhum documento corresponde, a busca devolve um resultado vazio sem gerar incorporações ou cobrar pela consulta. Enviar um filtro sem `terms` devolve os documentos correspondentes mais recentes, até `top`, sem incorporação ou reranking.

Filtros não substituem um bom texto de documento: o significado que o usuário procura deve aparecer no conteúdo. Veja [Advanced filters](https://docs.aivax.net/pt-br/docs/rag/document-filters.md) para a sintaxe completa, operadores, limites e erros, ou [How to filter RAG results by metadata, tags and date](https://aivax.net/blog/filter-rag-results-by-metadata-tags-date/) para um guia prático.

## Múltiplos termos

Múltiplos termos cobrem caminhos de recuperação alternativos em vez de exigir que cada termo corresponda ao mesmo documento. Use-os para sinônimos, frases alternativas ou várias maneiras aceitáveis de encontrar uma resposta.

Se a pergunta do usuário combina várias condições relacionadas, mantenha-as juntas em um único termo de busca. Por exemplo, prefira:

```text
Como cancelar uma assinatura anual sem penalidade?
```

Em vez de palavras‑chave desconectadas:

```text
cancelamento
assinatura anual
penalidade
```

Uma consulta completa geralmente tem melhor desempenho do que uma lista de palavras‑chave desconectadas, pois preserva a relação entre os conceitos. Se os usuários buscam por códigos de produto, IDs de política, nomes de plano ou nomes de procedimento, inclua esses identificadores no texto do documento.

## Reranking

Um reranker ajusta a ordem dos candidatos retornados pela busca vetorial. Ele não busca documentos adicionais nem recupera texto que a etapa de recuperação não selecionou. Veja [Rerankers](https://docs.aivax.net/pt-br/docs/rag/reranking.md) para orientações de seleção.

## Qualidade da busca

Se a busca retornar resultados ruins:

1. Confirme que os documentos estão indexados.  
2. Interrogue a coleção diretamente antes de testar através de um gateway de IA.  
3. Compare perguntas completas com frases alternativas.  
4. Verifique se o documento relevante é muito curto, muito longo ou não autocontido; veja [Write good documents](https://docs.aivax.net/pt-br/docs/rag/documents.md#write-good-documents).  
5. Verifique se o idioma da consulta corresponde ao idioma do documento.  
6. Se o gateway reescreve perguntas antes da busca, teste com o caminho de consulta simples para isolar problemas de reescrita.  
7. Revise buscas com baixa pontuação e cobertura de consultas em [RAG Observability](https://docs.aivax.net/pt-br/docs/rag/observability.md).  

Para expor coleções como ferramentas para um cliente MCP externo, veja [Collections and RAG MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/collections-mcp.md). Para preços e limites de taxa de busca, veja [Collections](https://docs.aivax.net/pt-br/docs/rag/collections.md#pricing-and-limits).
