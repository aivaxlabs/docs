# Batch

Batch é o recurso da AIVAX para executar o mesmo fluxo de trabalho de IA em muitos itens independentes. Ele transforma uma lista de entradas em uma fila processada em segundo plano com instruções fixas, saída estruturada, validação opcional, acompanhamento de progresso, tentativas de nova execução e exportação de resultados.

Use o Batch quando você tem dezenas, centenas ou milhares de registros que precisam passar pelo mesmo raciocínio: classificar leads, extrair campos de texto, enriquecer registros, resumir documentos curtos, avaliar respostas, moderar conteúdo, gerar dados estruturados ou invocar ferramentas internas para cada linha de uma lista.

## O que o Batch resolve

Processar muitos itens com IA normalmente requer uma fila, tratamento de erros, novasativas, validação JSON e exportação de resultados. O Batch consolida essas partes na AIVAX.

Na prática, ele resolve principalmente:

- **Processamento repetível:** a mesma instrução, modelo e esquema são aplicados a todos os itens.
- **Execução assíncrona:** o trabalho continua em segundo plano, sem manter a solicitação aberta.
- **Saída estruturada:** cada item pode ser exigido a retornar um objeto compatível com um JSON Schema.
- **Correção e validação:** a AIVAX tenta reprocessar respostas inválidas e pode executar uma segunda etapa de validação.
- **Operação em escala:** os jobs podem ser iniciados, pausados, retomados, monitorados, filtrados, limpos, reenviados para tentativa e exportados.
- **Controle operacional:** a UI mostra progresso, falhas, confiança e eventos do job.

## Quando usar

Use o Batch quando os itens puderem ser processados independentemente e não precisarem compartilhar memória. Bons exemplos são uma linha por cliente, URL, produto, ticket, mensagem, documento curto, trecho de contrato ou registro bruto.

O Batch é uma boa escolha quando:

- o mesmo prompt se aplica a todos os itens;
- você precisa de resultados tabulares ou JSON para consumo posterior;
- o tempo de resposta pode ser assíncrono;
- você quer rastrear erros e tentar novamente apenas os itens problemáticos;
- você quer usar ferramentas internas, como busca web, para cada item;
- você precisa medir confiança e taxa de sucesso por execução.

Não **use** o Batch para conversas em tempo real, fluxos onde um item depende da resposta do item anterior, indexação de documentos para RAG ou tarefas puramente determinísticas que não requerem um modelo de IA. Para indexar conhecimento pesquisável, use [RAG collections](/docs/pt-br/rag/collections). Para uma única resposta imediata a um usuário, use [inference](/docs/pt-br/inference/inference).

## Conceitos

### Workflow

O workflow é a receita de processamento. Ele define como os itens futuros serão tratados:

- título;
- instruções de processamento;
- modelo;
- esquema de resultado esperado;
- ferramentas internas habilitadas;
- instruções de validação; e
- comportamento de tentativa e tratamento de erros.

Alterar um workflow afeta jobs subsequentes e itens processados com essa configuração. Use workflows separados quando a instrução, esquema, modelo ou regras de validação mudarem de forma significativa.

### Job

Um job é uma execução concreta criada a partir de um workflow. Ele agrupa os itens de uma carga de trabalho, mantém estado, eventos e métricas.

Um job representa a carga de trabalho enquanto está sendo preparado, processado, pausado ou concluído. Consulte a Referência de API embutida para os estados de job suportados.

### Item

Um item é uma linha da lista importada. Cada linha se torna uma entrada independente enviada ao modelo com as instruções do workflow.

Cada item registra seu resultado de processamento, saída, confiança e detalhes de validação. Consulte a Referência de API embutida para os estados de item suportados.

## Como usar no console

No console da AIVAX, vá para **Batch**.

### Criar um workflow

Em **Workflows**, crie um workflow e configure:

1. **Básico:** defina um título, a instrução de processamento e o JSON Schema do resultado.
2. **Comportamento:** escolha as capacidades de assistente suportadas para o workflow.
3. **Validação:** habilite a validação quando a resposta precisar ser verificada contra regras de negócio.
4. **Manipulação:** configure o comportamento de tratamento de erros do workflow.

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

### Criar e executar um job

Depois de criar o workflow, crie um job para a carga que deseja processar. Novos jobs são criados no estado `Paused` para que você possa importar e inspecionar a carga antes de iniciar o processamento.

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

Com os itens importados, inicie o job. A tela do job permite monitorar:

- progresso geral;
- itens pendentes, concluídos e falhados;
- confiança média;
- eventos do job;
- itens processados mais recentes;
- lista completa de itens com filtros por estado e confiança.

### Operar em itens falhados

Use os filtros de lista para encontrar itens com erro de execução, erro de validação, recusa ou baixa confiança. Então você pode:

- tentar novamente todos os erros;
- tentar novamente apenas erros de execução;
- tentar novamente apenas erros de validação;
- tentar novamente itens concluídos com baixa confiança;
- remover itens pendentes, concluídos, com erro ou todos os itens não em execução;
- abrir um item individual para revisar entrada, saída, estado e confiança.

### Exportar resultados

Quando o job terminar, exporte os resultados em JSONL. Cada linha exportada contém metadados, a entrada original e a saída. Use essa exportação para importar para uma planilha, banco de dados, pipeline de dados ou etapa de revisão manual.

## Como usar via API

Use a API quando quiser integrar o Batch ao seu sistema interno, pipeline de dados ou automação. A autenticação segue o mesmo padrão da API da AIVAX.

O fluxo da API é o mesmo do fluxo do console, apenas expresso como operações separadas. Primeiro crie o workflow, que é a receita reutilizável. Depois crie um job, importe os itens e inicie o job quando a carga estiver pronta. Após o início do processamento, use os endpoints de listagem, tentativa, limpeza e exportação para operar o job sem perder o rastreamento dos registros individuais.

Se ainda estiver decidindo se o Batch é o recurso certo, compare-o com [RAG collections](/docs/pt-br/rag/collections) e [direct inference](/docs/pt-br/inference/inference). O Batch é para raciocínio repetido sobre itens independentes. As coleções RAG são para conhecimento pesquisável que deve ser recuperado posteriormente. A inferência direta é para uma resposta imediata.

### Criar workflow

Crie um workflow quando quiser salvar a regra de processamento que jobs jobs futuros reutilizarão. É aqui que você define a instrução, modelo, esquema de saída, comportamento de validação, tentativas e ferramentas habilitadas. Um bom workflow lê como uma política para cada item, não como um prompt de uso único para um único registro.

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Batch%20Workflow&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Criar job

Crie um job quando tiver uma carga de trabalho concreta para executar através de um workflow existente. Jobs são criados pausados para que você possa importar e inspecionar os itens antes do processamento.

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Jobs são criados pausados. Importe os itens antes de iniciar.

### Importar itens

Importe itens após o job existir. Cada item importado se torna uma unidade de trabalho independente, então escolha o modo que melhor corresponde aos seus dados de origem: uma linha por registro, um arquivo por registro, uma entrada ZIP por registro ou um texto enviado como um único registro.

<script src="https://inference.aivax.net/apidocs?embed-target=Import%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Escolha o formato de importação que corresponde aos dados de origem. Consulte a Referência de API embutida para os modos de importação suportados, campos e restrições atuais.

### Iniciar, pausar ou concluir

Inicie o job apenas depois que a lista de itens parecer correta. Pausá‑lo para investigar erros ou ajustar o workflow, e conclua‑lo quando o job deve ser encerrado em vez de retomado.

<script src="https://inference.aivax.net/apidocs?embed-target=Edit%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Consulte a Referência de API embutida para os estados de job suportados.

### Monitorar

O monitoramento é como você decide se o workflow está saudável. A visualização do job mostra o estado geral; a lista de itens indica onde o trabalho está travando, quais itens falharam na validação e quais resultados de baixa confiança merecem revisão humana.

<script src="https://inference.aivax.net/apidocs?embed-target=View%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Para listar itens:

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Use o endpoint de listagem para filtrar itens por estado, confiança ou texto de entrada. Consulte a Referência de API embutida para os filtros suportados.

### Tentativa e limpeza

Tentativas são melhor usadas depois que você entende o padrão de falha. Tente novamente erros de execução quando o provedor ou a solicitação falhar, erros de validação quando a resposta puder ser regenerada para o formato esperado, e resultados de baixa confiança quando o item teve sucesso mas merece outra tentativa de modelo. Endpoints de limpeza servem para remover itens não em execução de um job quando eles não são mais úteis.

<script src="https://inference.aivax.net/apidocs?embed-target=Retry%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Use o endpoint de tentativa após revisar o padrão de falha. Consulte a Referência de API embutida para as opções de tentativa suportadas e o comportamento resultante do job.

Para remover itens não em execução:

<script src="https://inference.aivax.net/apidocs?embed-target=Remove%20Batch%20Job%20Items&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Use o endpoint de remoção apenas para itens que não são mais úteis. Consulte a Referência de API embutida para as opções de remoção suportadas.

### Exportar

Exportar é o ponto de entrega da AIVAX de volta ao seu próprio workflow. Use após o job terminar, ou exporte apenas um subconjunto quando um processo de revisão precisar primeiro dos itens concluídos e depois dos erros. O formato JSONL é conveniente para planilhas, bancos de dados, filas e ferramentas de auditoria manual porque cada linha permanece vinculada à entrada original e à sua saída gerada.

<script src="https://inference.aivax.net/apidocs?embed-target=Export%20Batch%20Job&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Use o endpoint de exportação para selecionar os resultados concluídos que sua revisão ou processo subsequente necessita. Consulte a Referência de API embutida para os filtros de exportação suportados.

## Disponibilidade

Revise [Pricing](/docs/pt-br/pricing) e [Plans and Limits](/docs/pt-br/limits) antes de processar uma carga de trabalho grande.

## Melhores práticas

- Teste o workflow com alguns itens antes de importar uma lista grande.
- Use esquemas restritivos com `required` e `additionalProperties: false` quando a saída for consumida por um sistema.
- Inclua exemplos de entrada e saída na instrução quando o formato for ambíguo.
- Prefira uma linha por item; se precisar enviar objetos complexos, use JSONL.
- Mantenha a validação habilitada para tarefas sensíveis como extração jurídica, financeira ou dados que alimentam automações.
- Use `maxRetries` para corrigir falhas ocasionais, mas investigue erros recorrentes no prompt ou esquema.
- Defina um `errorStopThreshold` baixo em novos workflows para evitar gastar em um lote com configuração errada.
- Tente novamente itens de baixa confiança separadamente; baixa confiança não significa erro, mas indica que a resposta merece revisão.
- Exporte resultados por estado quando for necessária revisão manual, por exemplo, primeiro `finished`, depois `errors`.