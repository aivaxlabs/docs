---
{title: Busca Semântica,linkTitle: busca semântica,weight: 100,group: RAG and collections,sourceHash: 2726fcb28d9c57c6,aliases: [/docs/pt-br/rag/semantic-search.html]}
---

# Busca Semântica

A API de busca semântica procura uma ou mais coleções e devolve os documentos indexados mais relevantes para os termos de busca fornecidos.

Se sua aplicação já possui as strings dos documentos candidatos, considere [Reflex](reflex.md): uma busca RAG sem coleção que classifica documentos fornecidos sem indexação ou armazenamento. Use a busca semântica gerenciada quando a AIVAX deve armazenar e buscar um corpus persistente ou quando o corpus é grande demais para ser enviado como candidatos em cada requisição.

Compare [busca vetorial com o pipeline completo de RAG](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/) antes de decidir o que construir.

Antes de buscar, adicione documentos a uma [coleção](collections.md) e aguarde a indexação. Busque com perguntas completas ou frases que reflitam o que um usuário perguntaria. A resposta pode incluir os documentos correspondentes e seus dados de coleção associados para uso em sua aplicação ou fluxo do AI Gateway.

Para o contrato suportado de requisição, resposta, autenticação e erros, use a Referência da API:

<script src="https://inference.aivax.net/apidocs?embed-target=Semantic%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Filtrando Documentos

Use o campo `filter` para buscar apenas documentos que correspondam a tags, metadados, nomes ou datas, como `tags has "finance" and createdAt >= now-30d`. Consulte [Filtros de Documento](../filters/document-filters.md) para a sintaxe e exemplos.

## Reclassificação

Um reclassificador pode ajustar a ordem dos candidatos retornados pela busca semântica. Ele não busca documentos adicionais nem recupera texto que a etapa de recuperação não selecionou. Consulte [Reclassificadores](reranking.md) para orientações de seleção.

## Múltiplos Termos

Múltiplos termos cobrem caminhos de recuperação alternativos ao invés de exigir que cada termo corresponda ao mesmo documento. Use-os para sinônimos, formulações alternativas ou várias maneiras aceitáveis de encontrar uma resposta.

Se a pergunta do usuário combina várias condições relacionadas, mantenha-as juntas em um único termo de busca. Por exemplo, prefira:

```text
How do I cancel an annual subscription without a penalty?
```

Em vez de palavras‑chave desconectadas:

```text
cancellation
annual subscription
penalty
```

## Qualidade da Busca

Uma consulta completa costuma ter melhor desempenho do que uma lista de palavras‑chave desconectadas porque preserva o relacionamento entre os conceitos.

Se a busca retornar resultados pobres:

1. Confirme que os documentos foram indexados.
2. Consulte a coleção diretamente antes de testar através de um AI Gateway.
3. Compare perguntas completas com formulações alternativas.
4. Verifique se o documento relevante é muito curto, muito longo ou não auto‑contido.
5. Verifique se o idioma da consulta corresponde ao idioma do documento.
6. Se o gateway reescrever perguntas antes de buscar, teste com o caminho de consulta simples para isolar problemas de reescrita.

## MCP de Coleções

Para expor coleções da AIVAX como ferramentas para um cliente MCP externo, veja [MCP de Coleções](/docs/pt-br/mcp-utilities/collections-mcp).

Para a disponibilidade atual do serviço e limites de conta, veja [Planos e Limites](../limits.md).
