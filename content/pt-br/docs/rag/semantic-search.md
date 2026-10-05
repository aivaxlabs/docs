---
{title: Busca Semântica,linkTitle: Busca semântica,weight: 100,group: RAG and collections,sourceHash: 42ffbca8cbb6c70a,aliases: [/docs/pt-br/rag/semantic-search.html]}
---

# Busca Semântica

A API de busca semântica pesquisa uma ou mais coleções e retorna os documentos indexados mais relevantes para os termos de busca fornecidos.

Se sua aplicação já possui as strings de documentos candidatos, considere [Reflex](reflex.md): uma busca RAG sem coleção que classifica documentos fornecidos sem indexação ou armazenamento. Use a busca semântica gerenciada quando a AIVAX deve armazenar e pesquisar um corpus persistente ou quando o corpus é grande demais para ser enviado como candidatos em cada requisição.

Compare a [busca vetorial com o pipeline completo de RAG](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/) antes de decidir o que construir.

Após criar uma coleção, pesquise-a com termos completos que reflitam a pergunta que o usuário faria. A resposta pode incluir os documentos correspondentes e seus dados de coleção associados para uso em sua aplicação ou fluxo do AI Gateway.

Para o contrato de requisição, resposta, autenticação e erro suportados, use a Referência da API:

<script src="https://inference.aivax.net/apidocs?embed-target=Semantic%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Filtrando Documentos

Use o campo `filter` para pesquisar apenas documentos que correspondam a tags, metadados, nomes ou datas, como `tags has "finance" and createdAt >= now-30d`. Consulte [Filtros de Documento](../filters/document-filters.md) para a sintaxe e exemplos.

## Reordenação (Reranking)

Um reranker pode ajustar a ordem dos candidatos retornados pela busca semântica. Ele não pesquisa documentos adicionais nem recupera texto que a fase de recuperação não selecionou. Consulte [Rerankers](reranking.md) para orientações de seleção.

## Múltiplos Termos

Múltiplos termos cobrem caminhos de recuperação alternativos ao invés de exigir que cada termo corresponda ao mesmo documento. Use-os para sinônimos, formulações alternativas ou várias maneiras aceitáveis de encontrar uma resposta.

Se a intenção do usuário for uma ideia composta, envie essa ideia como um termo completo. Por exemplo, prefira:

```text
Como cancelar uma assinatura anual sem penalidade?
```

Em vez de palavras‑chave desconectadas:

```text
cancelamento
assinatura anual
penalidade
```

## Qualidade da Busca

Uma consulta completa geralmente tem desempenho melhor do que uma lista de palavras‑chave desconectadas porque preserva a relação entre os conceitos.

Se a busca retornar resultados insatisfatórios:

1. Confirme que os documentos estão indexados.  
2. Consulte a coleção diretamente antes de testar através de um AI Gateway.  
3. Compare perguntas completas com formulações alternativas.  
4. Verifique se o documento relevante é muito curto, muito longo ou não é autocontido.  
5. Verifique se o idioma da consulta corresponde ao idioma do documento.  
6. Se o gateway reescrever perguntas antes da busca, teste com o caminho de consulta simples para isolar problemas de reescrita.

## Collections MCP

Para expor coleções AIVAX como ferramentas para um cliente MCP externo, veja [Collections MCP](/docs/pt-br/mcp-utilities/collections-mcp).

Para disponibilidade atual do serviço e limites de conta, veja [Planos e Limites](../limits.md).
