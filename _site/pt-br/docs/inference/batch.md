Source: https://docs.aivax.net/pt-br/docs/inference/batch.html

# Processamento em Lote (Batch)

O Batch executa o mesmo fluxo de trabalho de IA sobre muitos itens independentes. Ele transforma uma lista de entradas em uma fila de segundo plano com instruções fixas, saída estruturada, validação opcional, rastreamento de progresso, tentativas de repetição e exportação de resultados.

Use o Batch quando dezenas, centenas ou milhares de registros precisarem do mesmo raciocínio e cada registro puder ser tratado isoladamente. Tarefas típicas:

- Classificar leads.
- Extrair campos de textos.
- Enriquecer registros.
- Resumir documentos curtos.
- Avaliar respostas.
- Moderar conteúdo.
- Gerar dados estruturados.
- Chamar ferramentas integradas para cada linha de uma lista.

## O que o Batch resolve

Use o Batch quando você construiria a fila manualmente. Processar muitos itens geralmente exige tratamento de erros, tentativas de repetição, validação JSON e exportação de resultados. O Batch mantém essas partes no AIVAX, permitindo que você opere a carga de trabalho em vez de montar o pipeline.

Na prática, ele oferece:

- **Processamento repetível:** as mesmas instruções, modelo e esquema são aplicados a todos os itens.
- **Execução assíncrona:** o trabalho continua em segundo plano, sem manter uma solicitação aberta.
- **Saída estruturada:** cada item pode ser obrigado a retornar um objeto compatível com um JSON Schema.
- **Correção e validação:** o AIVAX tenta reprocessar respostas inválidas e pode executar uma segunda etapa de validação.
- **Operação em escala:** os trabalhos podem ser iniciados, pausados, retomados, monitorados, filtrados, limpos, reenviados para nova tentativa e exportados.
- **Controle operacional:** a interface mostra o progresso, falhas, confiança e eventos do trabalho.

## Quando usar

Use o Batch quando cada item puder ser processado isoladamente e não precisar compartilhar memória com os outros. Um item típico é uma linha para:

- um cliente;
- uma URL;
- um produto;
- um ticket;
- uma mensagem;
- um documento curto;
- um trecho de contrato;
- um registro bruto.

O Batch é uma boa escolha quando:

- a mesma prompt se aplica a todos os itens;
- você precisa de resultados tabulares ou JSON para consumo posterior;
- o tempo de resposta pode ser assíncrono;
- você deseja rastrear erros e repetir apenas os itens problemáticos;
- você quer usar ferramentas integradas, como busca na web, para cada item;
- você precisa medir a confiança e a taxa de sucesso por execução.

**Não** use o Batch quando:

- a conversa deve ser em tempo real;
- um item depende da resposta do item anterior;
- você está indexando documentos para RAG;
- a tarefa é puramente determinística e não requer um modelo de IA.

Para indexar conhecimento pesquisável, use [coleções RAG](https://docs.aivax.net/pt-br/docs/rag/collections.md). Para uma resposta imediata única a um usuário, use [inferência](https://docs.aivax.net/pt-br/docs/inference/chat-completions/concepts.md).

## Conceitos

O Batch é construído a partir de um fluxo de trabalho, um trabalho e itens. Salve o fluxo de trabalho uma vez, crie um trabalho para cada carga de trabalho e trate cada linha importada como seu próprio item.

### Fluxo de Trabalho (Workflow)

O fluxo de trabalho é a receita de processamento. Crie-o quando vários trabalhos seguirem a mesma regra. Ele define como os itens futuros serão tratados:

- título;
- instruções de processamento;
- modelo ou gateway de IA;
- esquema de resultado esperado;
- ferramentas integradas habilitadas;
- instruções de validação; e
- comportamento de tentativas de repetição e tratamento de erros.

Alterar um fluxo de trabalho afeta os trabalhos subsequentes e os itens processados com essa configuração. Use fluxos de trabalho separados quando as instruções, esquemas, modelos ou regras de validação mudarem de forma significativa.

### Modelo e roteamento

Cada item é processado pelo modelo integrado ou Gateway de IA que você escolher. Defina essa escolha na configuração **Modelo** do fluxo de trabalho. A API usa a mesma escolha que `modelName`.

Quando o fluxo de trabalho não usa um Gateway de IA, o Batch otimiza para custo:

- Os itens são sempre roteados com a preferência de roteamento de provedor `Cheapest` [preferência de roteamento de provedor](https://docs.aivax.net/pt-br/docs/inference/routing/setup-routing.md).
- Essa preferência seleciona o provedor disponível com o menor preço de tokens de entrada e saída para esse modelo.
- A padrão `Balanced` não é aplicada, portanto, a seleção do provedor pode diferir de outros recursos que solicitam o mesmo modelo.
- Quando apenas um provedor está disponível ou é compatível com a solicitação, o roteamento não altera o resultado.

Crie um [Gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md) e selecione-o no fluxo de trabalho quando precisar de uma rota diferente ou configuração de gateway compartilhado. Um gateway permite:

- usar a preferência `Balanced`, `Fastest` ou `Quality`;
- restringir quais provedores são tentados;
- aplicar instruções fixas, ferramentas e configuração RAG a cada item.

### Trabalho (Job)

Um trabalho é uma carga de trabalho criada a partir de um fluxo de trabalho. Use-o para agrupar os itens que deseja processar juntos. Ele mantém o estado, os eventos e as métricas dessa carga de trabalho enquanto o trabalho é preparado, processado, pausado ou concluído.

Consulte a Referência da API embutida para os estados de trabalho suportados.

### Item

Um item é uma linha da lista importada. Cada linha torna-se uma entrada independente enviada ao modelo com as instruções do fluxo de trabalho.

Cada item registra seu resultado do processamento, saída, confiança e detalhes de validação. Consulte a Referência da API embutida para os estados de item suportados.

## Como usar no console

Use o console quando quiser projetar o fluxo de trabalho, inspecionar itens e operar o trabalho manualmente. No console do AIVAX, vá para **Batch**.

### Criar um fluxo de trabalho

Um fluxo de trabalho é a regra que os trabalhos futuros reutilizarão. Em **Workflows**, crie um e configure:

1. **Basic:** defina um título, a instrução de processamento e o JSON Schema do resultado.
2. **Behavior:** escolha as capacidades de assistente suportadas para o fluxo de trabalho.
3. **Validation:** habilite a validação quando a resposta precisar ser verificada contra regras de negócios.
4. **Handling:** configure o comportamento de tratamento de erros do fluxo de trabalho.

Escreva a instrução como uma regra geral, não como uma única pergunta. O item importado será a variável de entrada.

Exemplo de instrução:

```text
Classifique a empresa fornecida na entrada. Retorne o setor provável, uma justificativa curta e os sinais encontrados no texto. Se a entrada não contiver informações suficientes, use o setor "Undefined".
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

Um trabalho é a carga de trabalho para uma execução. Crie-o após o fluxo de trabalho existir. Novos trabalhos são criados no estado `Paused` para que você possa importar e inspecionar a carga de trabalho antes de iniciar o processamento.

Escolha o modo de importação que corresponde à origem:

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

Inicie o trabalho quando a lista importada parecer correta. A tela do trabalho permite monitorar:

- progresso geral;
- itens pendentes, concluídos e com erro;
- confiança média;
- eventos do trabalho;
- itens processados mais recentes;
- lista completa de itens com filtros por estado e confiança.

### Operar em itens com falha

Use esta etapa quando o trabalho tiver erros, recusas ou resultados nos quais você ainda não confia. Filtre a lista por erro de execução, erro de validação, recusa ou baixa confiança. Então você pode:

- repetir todos os erros;
- repetir apenas erros de execução;
- repetir apenas erros de validação;
- repetir itens concluídos com baixa confiança;
- remover itens pendentes, concluídos, com erro ou todos os itens que não estão em execução;
- abrir um item individual para revisar entrada, saída, estado e confiança.

### Exportar resultados

Exporte quando o trabalho terminar e você precisar das linhas fora do AIVAX. O arquivo é JSONL. Cada linha contém metadados, a entrada original e a saída. Importe-o em uma planilha, banco de dados, pipeline de dados ou etapa de revisão manual.

## Como usar via API

Use a API quando o Batch deve rodar dentro do seu próprio sistema, pipeline de dados ou automação. A autenticação segue o mesmo padrão da API do AIVAX.

O fluxo da API corresponde ao do console. Cada etapa é uma operação separada:

1. Crie o fluxo de trabalho, a receita reutilizável.
2. Crie um trabalho a partir desse fluxo de trabalho.
3. Importe os itens.
4. Inicie o trabalho quando a carga de trabalho parecer correta.
5. Liste, repita, limpe e exporte itens sem perder o controle dos registros individuais.

Se você ainda está decidindo se o Batch é o recurso certo:

- Use o Batch para raciocínio repetido sobre itens independentes.
- Use [coleções RAG](https://docs.aivax.net/pt-br/docs/rag/collections.md) para conhecimento pesquisável que deve ser recuperado posteriormente.
- Use [inferência direta](https://docs.aivax.net/pt-br/docs/inference/chat-completions/concepts.md) para uma resposta imediata única.

### Criar fluxo de trabalho

Um fluxo de trabalho é a regra de processamento salva. Crie-o quando trabalhos futuros devem reutilizar a mesma política, não uma prompt única para um único registro.

Defina:

- a instrução;
- o modelo;
- o esquema de saída;
- comportamento de validação;
- tentativas de repetição;
- ferramentas habilitadas.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20Batch%20Workflow)

### Criar trabalho

Um trabalho é uma carga de trabalho concreta. Crie-o quando um fluxo de trabalho existente deve processar uma lista específica. Os trabalhos são criados pausados para que você possa importar e inspecionar itens antes do processamento.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20Batch%20Job)

Importe os itens em seguida. Deixe o trabalho pausado até que a lista pareça correta.

### Importar itens

A importação é como um arquivo de origem se torna unidades independentes de trabalho. Faça isso após o trabalho existir e escolha o modo que corresponde à origem:

- uma linha por registro;
- um arquivo por registro;
- uma entrada ZIP por registro;
- um texto submetido como um único registro.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Import%20Batch%20Job%20Items)

Consulte a Referência da API embutida para modos de importação suportados, campos e restrições atuais.

### Iniciar, pausar ou finalizar

Essas ações alteram se o trabalho continua em execução. Use-as apenas após a lista de itens ser a carga de trabalho que você pretende processar.

- **Start** quando a lista de itens parecer correta.
- **Pause** para investigar erros ou ajustar o fluxo de trabalho.
- **Finish** quando o trabalho deve ser encerrado em vez de retomado.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Edit%20Batch%20Job)

Consulte a Referência da API embutida para os estados de trabalho suportados.

### Monitorar

O monitoramento diz se o fluxo de trabalho é saudável o suficiente para continuar em execução. Use a visualização do trabalho para o estado geral. Use a lista de itens quando precisar ver onde o trabalho está travado, quais itens falharam na validação e quais resultados de baixa confiança merecem revisão humana.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=View%20Batch%20Job)

Liste os itens do trabalho quando precisar da visão nível de linha:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=List%20Batch%20Job%20Items)

Use o endpoint de lista para filtrar itens por estado, confiança ou texto de entrada. Consulte a Referência da API embutida para filtros suportados.

### Repetir e limpar

Repetir e limpar são para itens que você já inspecionou. Repita após entender a forma da falha:

- Repita **erros de execução** quando o provedor ou a solicitação falhou.
- Repita **erros de validação** quando a resposta provavelmente pode ser regenerada na forma esperada.
- Repita **resultados de baixa confiança** quando o item foi bem-sucedido, mas merece outra tentativa do modelo.

Use um endpoint de limpeza quando itens que não estão em execução não forem mais úteis e devem sair do trabalho.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Retry%20Batch%20Job%20Items)

Use o endpoint de repetição após revisar o padrão de falha. Consulte a Referência da API embutida para opções de repetição suportadas e o comportamento resultante do trabalho. Para o filtro de exportação que corresponde a cada modo de repetição e como as APIs de lote do provedor lidam com expiração, consulte [trabalhos em lote expirados: resultados parciais e repetição apenas do que falhou](https://aivax.net/blog/expired-batch-job-recover-partial-results-retry-failed/).

Para remover itens que não estão em execução do trabalho:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Remove%20Batch%20Job%20Items)

Use o endpoint de remoção apenas para itens que não são mais úteis. Consulte a Referência da API embutida para opções de remoção suportadas.

### Exportar

A exportação é a transferência do AIVAX de volta para o seu fluxo de trabalho. Use-a após o trabalho terminar, ou exporte um subconjunto quando a revisão precisar de itens concluídos primeiro e erros depois.

JSONL se adapta a planilhas, bancos de dados, filas e ferramentas de auditoria manual. Cada linha permanece vinculada à entrada original e à sua saída gerada.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Export%20Batch%20Job)

Use o endpoint de exportação quando sua revisão ou processo downstream precisar de um conjunto selecionado de resultados concluídos. Consulte a Referência da API embutida para filtros de exportação suportados.

## Disponibilidade

Revise a faturamento e a capacidade antes de processar uma grande carga de trabalho. Comece com [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) e os [limites](#limits) abaixo.

## Limites

Os limites são a verificação de capacidade para uma grande carga de trabalho. O número de itens de fluxo de trabalho processados por dia depende do plano. Consulte [Limites de Batch e Testes Agentic](https://docs.aivax.net/pt-br/docs/limits.md#batch-and-agentic-tests).

Estes limites de importação se aplicam a todos os planos:

| Limite | Valor |
| --- | --- |
| Arquivos por solicitação de importação | 1.000 |
| Tamanho total da importação | 100 MiB/solicitação |
| Tamanho de arquivo importado único | 10 MiB |

O processamento em lote é assíncrono. Se a cota pausar ou falhar o trabalho:

1. Aguarde até que a janela da cota seja reiniciada e tente novamente.
2. Ou atualize a conta.

Para saber como as APIs de lote do provedor, como a da OpenAI, limitam e falham em um lote, e como um trabalho do AIVAX pausa em um 429 e retoma, consulte [Limites de taxa da API Batch da OpenAI e como um trabalho gerenciado lida com 429](https://aivax.net/blog/batch-is-an-admission-control-problem-not-a-queue/).

## Melhores práticas

Use estas verificações antes de uma grande execução, enquanto corrige falhas e antes de entregar resultados para revisão.

- Teste o fluxo de trabalho com alguns itens antes de importar uma lista grande.
- Use esquemas restritivos com `required` e `additionalProperties: false` quando a saída for consumida por um sistema.
- Inclua exemplos de entrada e saída na instrução quando o formato for ambíguo.
- Prefira uma linha por item; se você precisar enviar objetos complexos, use JSONL.
- Mantenha a validação habilitada para tarefas sensíveis, como extração legal, financeira ou dados que alimentam automações.
- Use `maxRetries` para corrigir falhas ocasionais, mas investigue erros repetidos na prompt ou no esquema.
- Defina um `errorStopThreshold` baixo em novos fluxos de trabalho para evitar gastos em um lote com configuração incorreta.
- Repita itens de baixa confiança separadamente. Baixa confiança não significa erro, mas indica que a resposta merece revisão.
- Exporte resultados por estado quando a revisão manual for necessária, por exemplo, primeiro `finished`, depois `errors`.
- Para um guia operacional de limites de taxa, tentativas de repetição e resultados parciais, consulte [Limites de taxa da API Batch da OpenAI e como um trabalho gerenciado lida com 429](https://aivax.net/blog/batch-is-an-admission-control-problem-not-a-queue/).
