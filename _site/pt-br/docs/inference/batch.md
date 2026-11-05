Source: https://docs.aivax.net/pt-br/docs/inference/batch.html

# Processamento em Lote

O Batch é o recurso do AIVAX para executar o mesmo fluxo de trabalho de IA em vários itens independentes. Ele transforma uma lista de entradas em uma fila processada em segundo plano com instruções fixas, saída estruturada, validação opcional, rastreamento de progresso, tentativas de repetição e exportação de resultados.

Use o Batch quando você tiver dezenas, centenas ou milhares de registros que precisam passar pelo mesmo raciocínio: classificar leads, extrair campos de textos, enriquecer registros, resumir documentos curtos, avaliar respostas, moderar conteúdo, gerar dados estruturados ou invocar ferramentas integradas para cada linha de uma lista.

## O que o Batch resolve

Processar muitos itens com IA geralmente requer uma fila, tratamento de erros, tentativas de repetição, validação JSON e exportação de resultados. O Batch consolida essas partes no AIVAX.

Na prática, ele resolve principalmente:

- **Processamento repetível:** a mesma instrução, modelo e esquema são aplicados a todos os itens.
- **Execução assíncrona:** o trabalho continua em segundo plano, sem manter uma solicitação aberta.
- **Saída estruturada:** cada item pode ser obrigado a retornar um objeto compatível com um Esquema JSON.
- **Correção e validação:** o AIVAX tenta reprocessar respostas inválidas e pode executar uma segunda etapa de validação.
- **Operação em escala:** os trabalhos podem ser iniciados, pausados, retomados, monitorados, filtrados, limpos, reenviados para nova tentativa e exportados.
- **Controle operacional:** a interface mostra o progresso, falhas, confiança e eventos do trabalho.

## Quando usar

Use o Batch quando os itens puderem ser processados de forma independente e não precisarem compartilhar memória. Bons exemplos são uma linha por cliente, URL, produto, ticket, mensagem, documento curto, trecho de contrato ou registro bruto.

O Batch é uma boa escolha quando:

- a mesma prompt se aplica a todos os itens;
- você precisa de resultados tabulares ou JSON para consumo posterior;
- o tempo de resposta pode ser assíncrono;
- você deseja rastrear erros e repetir apenas os itens problemáticos;
- você quer usar ferramentas integradas, como busca na web, para cada item;
- você precisa medir a confiança e a taxa de sucesso por execução.

**Não** use o Batch para conversas em tempo real, fluxos onde um item depende da resposta do item anterior, indexação de documentos para RAG ou tarefas puramente determinísticas que não exigem um modelo de IA. Para indexar conhecimento pesquisável, use [coleções RAG](https://docs.aivax.net/pt-br/docs/rag/collections.md). Para uma resposta imediata única a um usuário, use [inferência](https://docs.aivax.net/pt-br/docs/inference/chat-completions/concepts.md).

## Conceitos

### Fluxo de Trabalho (Workflow)

O fluxo de trabalho é a receita de processamento. Ele define como os itens futuros serão tratados:

- título;
- instruções de processamento;
- modelo ou gateway de IA;
- esquema de resultado esperado;
- ferramentas integradas habilitadas;
- instruções de validação; e
- comportamento de tentativas de repetição e tratamento de erros.

Alterar um fluxo de trabalho afeta os trabalhos subsequentes e os itens processados com essa configuração. Use fluxos de trabalho separados quando a instrução, o esquema, o modelo ou as regras de validação mudarem de maneira significativa.

### Modelo e roteamento

Um fluxo de trabalho processa seus itens com um modelo integrado ou com um Gateway de IA. Ambos são escolhidos na configuração **Modelo** do fluxo de trabalho e referenciados por `modelName` na API.

O Batch otimiza o custo quando o fluxo de trabalho não usa um Gateway de IA: os itens são sempre roteados com a preferência de roteamento de provedor `Cheapest` (Mais Barato), que seleciona o provedor disponível com o menor preço de tokens de entrada e saída para esse modelo. A opção padrão `Balanced` (Equilibrado) não é aplicada neste caso, portanto, a seleção do provedor pode diferir de outros recursos que solicitam o mesmo modelo. Quando apenas um provedor está disponível ou é compatível com a solicitação, o roteamento não altera o resultado.

Crie um [Gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md) e selecione-o no fluxo de trabalho para usar a preferência `Balanced` (Equilibrado), `Fastest` (Mais Rápido) ou `Quality` (Qualidade), restringir quais provedores são tentados ou aplicar instruções fixas, ferramentas e configuração de RAG a cada item.

### Trabalho (Job)

Um trabalho é uma execução concreta criada a partir de um fluxo de trabalho. Ele agrupa os itens de uma carga de trabalho e mantém o estado, os eventos e as métricas da carga de trabalho.

Um trabalho representa a carga de trabalho enquanto ela está sendo preparada, processada, pausada ou concluída. Consulte a Referência da API embutida para ver os estados de trabalho suportados.

### Item

Um item é uma linha da lista importada. Cada linha se torna uma entrada independente enviada ao modelo com as instruções do fluxo de trabalho.

Cada item registra seu resultado de processamento, saída, confiança e detalhes de validação. Consulte a Referência da API embutida para ver os estados de item suportados.

## Como usar no console

No console do AIVAX, vá para **Batch**.

### Criar um fluxo de trabalho

Em **Workflows**, crie um fluxo de trabalho e configure:

1. **Básico:** defina um título, a instrução de processamento e o Esquema JSON do resultado.
2. **Comportamento:** escolha as capacidades de assistente suportadas para o fluxo de trabalho.
3. **Validação:** habilite a validação quando a resposta precisar ser verificada contra regras de negócios.
4. **Tratamento:** configure o comportamento de tratamento de erros do fluxo de trabalho.

Escreva a instrução como uma regra geral, não como uma única pergunta. O item importado será a variável de entrada.

Exemplo de instrução:

```text
Classifique a empresa fornecida na entrada. Retorne o setor provável, uma breve justificativa e os sinais encontrados no texto. Se a entrada não contiver informações suficientes, use o setor "Undefined".
```

Exemplo de esquema:

```json
{
  "type": "object",
  "properties": {
    "sector": { "type": "string" },
    "reason": { "type": "string" },
    "signals": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["sector", "reason", "signals"],
  "additionalProperties": false
}
```

### Criar e executar um trabalho

Após criar o fluxo de trabalho, crie um trabalho para a carga que deseja processar. Novos trabalhos são criados no estado `Paused` (Pausado) para que você possa importar e inspecionar a carga antes de iniciar o processamento.

Você pode importar itens em quatro modos:

- `lines`: lê um arquivo de texto carregado e importa cada linha não vazia como um item.
- `files`: importa cada arquivo de texto simples carregado como um item.
- `zip`: importa cada entrada de texto simples em um arquivo ZIP carregado como um item.
- `text`: importa o campo de texto submetido como um único item.

As linhas podem ser texto simples, CSV delimitado, URLs, IDs, JSON compacto ou qualquer formato que a instrução saiba interpretar. Para entradas baseadas em linhas estruturadas, prefira JSONL: um objeto JSON por linha.

Exemplo:

```jsonl
{"name":"Company A","description":"B2B auto-parts marketplace"}
{"name":"Company B","description":"Office specializing in employment contracts"}
{"name":"Company C","description":"Regional pharmacy chain"}
```

Com os itens importados, inicie o trabalho. A tela do trabalho permite monitorar:

- progresso geral;
- itens pendentes, concluídos e com falha;
- confiança média;
- eventos do trabalho;
- itens processados mais recentes;
- lista completa de itens com filtros por estado e confiança.

### Operar em itens com falha

Use os filtros da lista para encontrar itens com erro de execução, erro de validação, recusa ou baixa confiança. Em seguida, você pode:

- repetir todos os erros;
- repetir apenas erros de execução;
- repetir apenas erros de validação;
- repetir itens concluídos com baixa confiança;
- remover itens pendentes, concluídos, com erro ou todos os itens que não estão em execução;
- abrir um item individual para revisar entrada, saída, estado e confiança.

### Exportar resultados

Quando o trabalho termina, exporte os resultados em JSONL. Cada linha exportada contém metadados, a entrada original e a saída. Use esta exportação para importar para uma planilha, banco de dados, pipeline de dados ou etapa de revisão manual.

## Como usar via API

Use a API quando quiser integrar o Batch ao seu sistema interno, pipeline de dados ou automação. A autenticação segue o mesmo padrão da API do AIVAX.

O fluxo da API é o mesmo do fluxo do console, apenas expresso como operações separadas. Primeiro, crie o fluxo de trabalho, que é a receita reutilizável. Em seguida, crie um trabalho, importe os itens e inicie o trabalho quando a carga estiver pronta. Após o início do processamento, use os endpoints de listagem, repetição, limpeza e exportação para operar o trabalho sem perder o controle dos registros individuais.

Se você ainda está decidindo se o Batch é o recurso certo, compare-o com [coleções RAG](https://docs.aivax.net/pt-br/docs/rag/collections.md) e [inferência direta](https://docs.aivax.net/pt-br/docs/inference/chat-completions/concepts.md). O Batch é para raciocínio repetido sobre itens independentes. As coleções RAG são para conhecimento pesquisável que deve ser recuperado posteriormente. A inferência direta é para uma resposta imediata única.

### Criar fluxo de trabalho

Crie um fluxo de trabalho quando quiser salvar a regra de processamento que os trabalhos futuros reutilizarão. É aqui que você define a instrução, o modelo, o esquema de saída, o comportamento de validação, as tentativas de repetição e as ferramentas habilitadas. Um bom fluxo de trabalho parece uma política para cada item, não como uma prompt única para um único registro.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20Batch%20Workflow)

### Criar trabalho

Crie um trabalho quando tiver uma carga de trabalho concreta para executar através de um fluxo de trabalho existente. Os trabalhos são criados pausados para que você possa importar e inspecionar os itens antes do processamento.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20Batch%20Job)

Em seguida, importe os itens. O trabalho permanece pausado até que você o inicie.

### Importar itens

Importe os itens após a existência do trabalho. Cada item importado se torna uma unidade independente de trabalho, portanto, escolha o modo que melhor corresponde aos seus dados de origem: uma linha por registro, um arquivo por registro, uma entrada ZIP por registro ou um texto submetido como um único registro.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Import%20Batch%20Job%20Items)

Consulte a Referência da API embutida para ver os modos de importação suportados, campos e restrições atuais.

### Iniciar, pausar ou finalizar

Inicie o trabalho apenas depois que a lista de itens parecer correta. Pause-o para investigar erros ou ajustar o fluxo de trabalho e finalize-o quando o trabalho dever ser encerrado em vez de retomado.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Edit%20Batch%20Job)

Consulte a Referência da API embutida para os estados de trabalho suportados.

### Monitorar

O monitoramento é como você decide se o fluxo de trabalho está saudável. A visualização do trabalho fornece o estado geral; a lista de itens diz onde o trabalho está ficando preso, quais itens falharam na validação e quais resultados de baixa confiança merecem revisão humana.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=View%20Batch%20Job)

Para ver itens individuais e onde o trabalho está ficando preso, liste os itens do trabalho:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=List%20Batch%20Job%20Items)

Use o endpoint de lista para filtrar itens por estado, confiança ou texto de entrada. Consulte a Referência da API embutida para ver os filtros suportados.

### Repetir e limpar

As repetições são melhores usadas depois que você entende a forma da falha:

- Repita **erros de execução** quando o provedor ou a solicitação falhou.
- Repita **erros de validação** quando a resposta provavelmente pode ser regenerada na forma esperada.
- Repita **resultados de baixa confiança** quando o item foi bem-sucedido, mas merece outra tentativa do modelo.

Os endpoints de limpeza servem para remover itens que não estão em execução de um trabalho quando eles já não são úteis.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Retry%20Batch%20Job%20Items)

Use o endpoint de repetição após revisar o padrão de falha. Consulte a Referência da API embutida para ver as opções de repetição suportadas e o comportamento resultante do trabalho. Para o filtro de exportação que corresponde a cada modo de repetição e como as APIs de lote do provedor lidam com a expiração, consulte [trabalhos de lote expirados: resultados parciais e repetição apenas do que falhou](https://aivax.net/blog/expired-batch-job-recover-partial-results-retry-failed/).

Para remover itens que não estão em execução do trabalho:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Remove%20Batch%20Job%20Items)

Use o endpoint de remoção apenas para itens que já não são úteis. Consulte a Referência da API embutida para ver as opções de remoção suportadas.

### Exportar

A exportação é o ponto de transferência do AIVAX de volta para o seu próprio fluxo de trabalho. Use-a após o término do trabalho, ou exporte apenas um subconjunto quando um processo de revisão precisar primeiro dos itens concluídos e depois dos erros. O formato JSONL é conveniente para planilhas, bancos de dados, filas e ferramentas de auditoria manual porque cada linha permanece vinculada à entrada original e à sua saída gerada.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Export%20Batch%20Job)

Use o endpoint de exportação para selecionar os resultados concluídos que sua revisão ou processo downstream precisa. Consulte a Referência da API embutida para ver os filtros de exportação suportados.

## Disponibilidade

Revise [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) e os [limites](#limits) abaixo antes de processar uma carga grande.

## Limites

Um travessão (`—`) significa que o plano não impõe um limite.

| Limite | Gratuito | Pro | Max |
| --- | --- | --- | --- |
| Itens de fluxo de trabalho processados | 500/dia | 100.000/dia | — |
| Arquivos por solicitação de importação | 1.000 | 1.000 | 1.000 |
| Tamanho total da importação | 100 MiB/solicitação | 100 MiB/solicitação | 100 MiB/solicitação |
| Tamanho de arquivo importado único | 10 MiB | 10 MiB | 10 MiB |

O processamento em lote é assíncrono. Se o processamento for pausado ou falhar devido à cota, repita após a reinicialização da janela de cota ou atualize a conta. Para saber como a admissão em lote lida com pausas de cota e resultados parciais, consulte [executando milhares de solicitações de LLM em lote](https://aivax.net/blog/batch-is-an-admission-control-problem-not-a-queue/).

## Melhores práticas

- Teste o fluxo de trabalho com alguns itens antes de importar uma lista grande.
- Use esquemas restritivos com `required` e `additionalProperties: false` quando a saída for consumida por um sistema.
- Inclua exemplos de entrada e saída na instrução quando o formato for ambíguo.
- Prefira uma linha por item; se você precisar enviar objetos complexos, use JSONL.
- Mantenha a validação habilitada para tarefas sensíveis, como extração legal, financeira ou dados que alimentam automações.
- Use `maxRetries` para corrigir falhas ocasionais, mas investigue erros repetidos na prompt ou no esquema.
- Defina um `errorStopThreshold` baixo em novos fluxos de trabalho para evitar gastos em um lote com uma configuração incorreta.
- Repita itens de baixa confiança separadamente; baixa confiança não significa erro, mas indica que a resposta merece revisão.
- Exporte resultados por estado quando a revisão manual for necessária, por exemplo, primeiro `finished` (concluídos), depois `errors` (erros).
- Para um guia operacional de limites de taxa, repetições e resultados parciais, consulte [executando milhares de solicitações de LLM em lote](https://aivax.net/blog/batch-is-an-admission-control-problem-not-a-queue/).
