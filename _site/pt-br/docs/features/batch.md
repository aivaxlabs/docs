Source: http://localhost:1313/pt-br/docs/features/batch.html

# Lote

Lote é o recurso da AIVAX para executar o mesmo fluxo de trabalho de IA em muitos itens independentes. Ele transforma uma lista de entradas em uma fila processada em segundo plano com instruções fixas, saída estruturada, validação opcional, rastreamento de progresso, tentativas de nova execução e exportação de resultados.

Use Lote quando você tem dezenas, centenas ou milhares de registros que precisam passar pelo mesmo raciocínio: classificar leads, extrair campos de texto, enriquecer registros, resumir documentos curtos, avaliar respostas, moderar conteúdo, gerar dados estruturados ou invocar ferramentas internas para cada linha de uma lista.

## O que o Lote resolve

Processar muitos itens com IA geralmente requer uma fila, tratamento de erros, novasativas, validação JSON e exportação de resultados. O Lote consolida essas partes na AIVAX.

Na prática, ele resolve principalmente:

- **Processamento repetível:** a mesma instrução, modelo e esquema são aplicados a todos os itens.
- **Execução assíncrona:** o trabalho continua em segundo plano, sem manter a requisição aberta.
- **Saída estruturada:** cada item pode ser exigido a retornar um objeto compatível com um JSON Schema.
- **Correção e validação:** a AIVAX tenta reprocessar respostas inválidas e pode executar uma segunda etapa de validação.
- **Operação em escala:** trabalhos podem ser iniciados, pausados, retomados, monitorados, filtrados, limpos, reenviados para nova tentativa e exportados.
- **Controle operacional:** a interface mostra progresso, falhas, confiança e eventos do trabalho.

## Quando usar

Use Lote quando os itens podem ser processados independentemente e não precisam compartilhar memória. Bons exemplos são uma linha por cliente, URL, produto, ticket, mensagem, documento curto, trecho de contrato ou registro bruto.

Lote é uma boa escolha quando:

- o mesmo prompt se aplica a todos os itens;
- você precisa de resultados tabulares ou JSON para consumo posterior;
- o tempo de resposta pode ser assíncrono;
- você quer rastrear erros e tentar novamente apenas os itens problemáticos;
- você quer usar ferramentas internas, como busca na web, para cada item;
- você precisa medir confiança e taxa de sucesso por execução.

Não **use** Lote para conversas em tempo real, fluxos onde um item depende da resposta do item anterior, indexação de documentos para RAG, ou tarefas puramente determinísticas que não exigem um modelo de IA. Para indexar conhecimento pesquisável, use [RAG collections](http://localhost:1313/pt-br/docs/rag/collections.md). Para uma resposta imediata a um usuário, use [inference](http://localhost:1313/pt-br/docs/inference/inference.md).

## Conceitos

### Fluxo de trabalho

O fluxo de trabalho é a receita de processamento. Ele define como os itens futuros serão tratados:

- título;
- instruções de processamento;
- modelo;
- esquema de resultado esperado;
- ferramentas internas habilitadas;
- instruções de validação; e
- comportamento de tentativa de nova execução e tratamento de erros.

Alterar um fluxo de trabalho afeta trabalhos e itens subsequentes processados com essa configuração. Use fluxos de trabalho separados quando a instrução, esquema, modelo ou regras de validação mudam de forma significativa.

### Trabalho

Um trabalho é uma execução concreta criada a partir de um fluxo de trabalho. Ele agrupa os itens de uma carga de trabalho, mantém estado, eventos e métricas.

Um trabalho representa a carga de trabalho enquanto está sendo preparado, processado, pausado ou concluído. Consulte a Referência de API incorporada para os estados de trabalho suportados.

### Item

Um item é uma linha da lista importada. Cada linha se torna uma entrada independente enviada ao modelo com as instruções do fluxo de trabalho.

Cada item registra seu resultado de processamento, saída, confiança e detalhes de validação. Consulte a Referência de API incorporada para os estados de item suportados.

## Como usar no console

No console da AIVAX, vá para **Lote**.

### Criar um fluxo de trabalho

Em **Fluxos de Trabalho**, crie um fluxo de trabalho e configure:

1. **Básico:** defina um título, a instrução de processamento e o JSON Schema do resultado.
2. **Comportamento:** escolha as capacidades de assistente suportadas para o fluxo de trabalho.
3. **Validação:** habilite a validação quando a resposta precisar ser verificada contra regras de negócio.
4. **Manipulação:** configure o comportamento de tratamento de erros do fluxo de trabalho.

Escreva a instrução como uma regra geral, não como uma única pergunta. O item importado será a variável de entrada.

Exemplo de instrução:

```text
Classify the company provided in the input. Return the likely sector, a short justification, and signals found in the text. If the input does not contain enough information, use sector "Undefined".
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

Após criar o fluxo de trabalho, crie um trabalho para a carga que deseja processar. Novos trabalhos são criados no estado `Paused` para que você possa importar e inspecionar a carga antes de iniciar o processamento.

Você pode importar itens em quatro modos:

- `lines`: lê um arquivo de texto enviado e importa cada linha não vazia como um item.
- `files`: importa cada arquivo de texto simples enviado como um item.
- `zip`: importa cada entrada de texto simples em um arquivo ZIP enviado como um item.
- `text`: importa o campo de texto enviado como um único item.

Linhas podem ser texto simples, CSV delimitado, URLs, IDs, JSON compacto ou qualquer formato que a instrução saiba interpretar. Para entradas estruturadas baseadas em linhas, prefira JSONL: um objeto JSON por linha.

Exemplo:

```jsonl
{"name":"Company A","description":"B2B auto-parts marketplace"}
{"name":"Company B","description":"Office specializing in employment contracts"}
{"name":"Company C","description":"Regional pharmacy chain"}
```

Com os itens importados, inicie o trabalho. A tela do trabalho permite monitorar:

- progresso geral;
- itens pendentes, concluídos e falhados;
- confiança média;
- eventos do trabalho;
- itens processados mais recentes;
- lista completa de itens com filtros por estado e confiança.

### Operar em itens com falha

Use os filtros de lista para encontrar itens com erro de execução, erro de validação, recusa ou baixa confiança. Então você pode:

- tentar novamente todos os erros;
- tentar novamente apenas erros de execução;
- tentar novamente apenas erros de validação;
- tentar novamente itens concluídos com baixa confiança;
- remover itens pendentes, concluídos, com erro ou todos os itens não em execução;
- abrir um item individual para revisar entrada, saída, estado e confiança.

### Exportar resultados

Quando o trabalho termina, exporte os resultados em JSONL. Cada linha exportada contém metadados, a entrada original e a saída. Use essa exportação para importar em uma planilha, banco de dados, pipeline de dados ou etapa de revisão manual.

## Como usar via API

Use a API quando quiser integrar o Lote ao seu sistema interno, pipeline de dados ou automação. A autenticação segue o mesmo padrão da API da AIVAX.

O fluxo da API é o mesmo do fluxo do console, apenas expresso como operações separadas. Primeiro crie o fluxo de trabalho, que é a receita reutilizável. Depois crie um trabalho, importe os itens e inicie o trabalho quando a carga estiver pronta. Após o início do processamento, use os endpoints de listagem, tentativa de nova execução, limpeza e exportação para operar o trabalho sem perder o controle dos registros individuais.

Se ainda estiver decidindo se o Lote é o recurso certo, compare-o com [RAG collections](http://localhost:1313/pt-br/docs/rag/collections.md) e [direct inference](http://localhost:1313/pt-br/docs/inference/inference.md). Lote é para raciocínio repetido sobre itens independentes. Coleções RAG são para conhecimento pesquisável que deve ser recuperado depois. Inferência direta é para uma resposta imediata.

### Criar fluxo de trabalho

Crie um fluxo de trabalho quando quiser salvar a regra de processamento que trabalhos futuros reutilizarão. É aqui que você define a instrução, modelo, esquema de saída, comportamento de validação, tentativas e ferramentas habilitadas. Um bom fluxo de trabalho lê como uma política para cada item, não como um prompt único para um único registro.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20Batch%20Workflow)

### Criar trabalho

Crie um trabalho quando tiver uma carga concreta para executar através de um fluxo de trabalho existente. Os trabalhos são criados pausados para que você possa importar e inspecionar os itens antes do processamento.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20Batch%20Job)

Os trabalhos são criados pausados. Importe os itens antes de iniciar.

### Importar itens

Importe itens após o trabalho existir. Cada item importado se torna uma unidade de trabalho independente, portanto escolha o modo que melhor corresponde aos seus dados de origem: uma linha por registro, um arquivo por registro, uma entrada ZIP por registro ou um texto enviado como um único registro.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Import%20Batch%20Job%20Items)

Escolha o formato de importação que corresponde aos dados de origem. Consulte a Referência de API incorporada para os modos de importação, campos e restrições atuais suportados.

### Iniciar, pausar ou concluir

Inicie o trabalho somente depois que a lista de itens estiver correta. Pause para investigar erros ou ajustar o fluxo de trabalho e conclua quando o trabalho precisar ser finalizado em vez de retomado.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Edit%20Batch%20Job)

Consulte a Referência de API incorporada para os estados de trabalho suportados.

### Monitorar

Monitorar é como decidir se o fluxo de trabalho está saudável. A visualização do trabalho fornece o estado geral; a lista de itens indica onde o trabalho está travando, quais itens falharam na validação e quais resultados de baixa confiança merecem revisão humana.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=View%20Batch%20Job)

Para listar itens:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=List%20Batch%20Job%20Items)

Use o endpoint de listagem para filtrar itens por estado, confiança ou texto de entrada. Consulte a Referência de API incorporada para filtros suportados.

### Tentativa de nova execução e limpeza

Tentativas são melhores usadas depois de entender o padrão de falha. Tente novamente erros de execução quando o provedor ou a requisição falhar, erros de validação quando a resposta puder ser regenerada no formato esperado e resultados de baixa confiança quando o item teve sucesso mas merece outra tentativa de modelo. Endpoints de limpeza servem para remover itens não em execução de um trabalho quando eles não são mais úteis.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Retry%20Batch%20Job%20Items)

Use o endpoint de tentativa de nova execução após revisar o padrão de falha. Consulte a Referência de API incorporada para opções de tentativa suportadas e comportamento resultante do trabalho.

Para remover itens não em execução:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Remove%20Batch%20Job%20Items)

Use o endpoint de remoção somente para itens que não são mais úteis. Consulte a Referência de API incorporada para opções de remoção suportadas.

### Exportar

Exportar é o ponto de entrega da AIVAX de volta ao seu próprio fluxo de trabalho. Use-o após o trabalho terminar, ou exporte apenas um subconjunto quando um processo de revisão precisar primeiro de itens concluídos e depois de erros. O formato JSONL é conveniente para planilhas, bancos de dados, filas e ferramentas de auditoria manual porque cada linha permanece vinculada à entrada original e à saída gerada.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Export%20Batch%20Job)

Use o endpoint de exportação para selecionar os resultados concluídos que sua revisão ou processo subsequente precisa. Consulte a Referência de API incorporada para filtros de exportação suportados.

## Disponibilidade

Consulte [Pricing](http://localhost:1313/pt-br/docs/pricing.md) e [Plans and Limits](http://localhost:1313/pt-br/docs/limits.md) antes de processar uma carga de trabalho grande.

## Melhores práticas

- Teste o fluxo de trabalho com alguns itens antes de importar uma lista grande.
- Use esquemas restritivos com `required` e `additionalProperties: false` quando a saída será consumida por um sistema.
- Inclua exemplos de entrada e saída na instrução quando o formato for ambíguo.
- Prefira uma linha por item; se precisar enviar objetos complexos, use JSONL.
- Mantenha a validação habilitada para tarefas sensíveis como extração legal, financeira ou dados que alimentam automações.
- Use `maxRetries` para corrigir falhas ocasionais, mas investigue erros recorrentes no prompt ou esquema.
- Defina um `errorStopThreshold` baixo em novos fluxos de trabalho para evitar gastar em um lote com configuração errada.
- Tente novamente itens de baixa confiança separadamente; baixa confiança não significa erro, mas indica que a resposta merece revisão.
- Exporte resultados por estado quando for necessária revisão manual, por exemplo, primeiro `finished`, depois `errors`.
