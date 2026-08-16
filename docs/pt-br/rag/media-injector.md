# Injetor de Mídia

Injetor de Mídia transforma um arquivo de origem em documentos focados e autocontidos dentro de uma coleção RAG da AIVAX. Ele examina a origem, identifica conhecimento materialmente útil, escreve documentos factuais concisos no idioma predominante da origem e coloca esses documentos em fila para indexação semântica.

Use o Injetor de Mídia quando você tem um arquivo cujo conhecimento útil ainda não foi dividido em texto pronto para recuperação. Se você já possui strings de documentos limpos, use [Criar ou Atualizar Documento ou importação JSONL](collections.md#campos-de-documento) em vez disso; esses caminhos são mais previsíveis e evitam o processamento adicional necessário para interpretar um arquivo de origem.

## Quando usar

O Injetor de Mídia é útil para:

- PDFs como relatórios, manuais e políticas que contêm vários tópicos independentes.
- Imagens ou páginas digitalizadas cujo conteúdo visível deve se tornar conhecimento pesquisável.
- Áudio e vídeo cujos fatos materiais devem estar disponíveis através do RAG.

Não é um recurso geral de armazenamento de arquivos e não preserva a origem como um único documento pesquisável. A saída é um conjunto de documentos RAG gerados. Revise esses documentos após o processamento quando a formulação, cobertura, fidelidade legal ou o tratamento de dados sensíveis forem importantes.

Use a importação direta de documentos quando precisar da formulação exata da origem, limites determinísticos, nomes de documentos estáveis ou metadados controlados pela aplicação. Use [Segmentação de Texto](text-segmentation.md) quando precisar apenas de segmentos coesos de texto‐origem retornados à sua aplicação sem criar documentos de coleção.

## Como funciona a ingestão

No painel de controle da AIVAX:

1. Abra a coleção de destino e escolha **Importar de arquivos**.
2. Selecione um ou mais arquivos de origem.
3. Opcionalmente forneça contexto de processamento. O mesmo contexto é aplicado a cada arquivo selecionado.
4. Confirme a importação. O painel faz upload dos arquivos sequencialmente e um trabalho separado é criado para cada arquivo depois que todos os seus blocos chegam à AIVAX.
5. Acompanhe os trabalhos em **Lote > Processamento de Mídia**.
6. Após a conclusão de cada trabalho, revise os documentos gerados e aguarde o estado de indexação antes de testar a [Busca Semântica](semantic-search.md).

Um trabalho pode estar `na fila`, `processando`, `concluído`, `falhou` ou `cancelado`. O painel relata o arquivo de origem, o tempo decorrido, o número de documentos produzidos e o custo atual. Trabalhos que falharam ou foram cancelados podem ser reexecutados quando seus dados enviados recuperáveis ainda estiverem disponíveis.

Áudios e vídeos maiores que 20 MiB são divididos em segmentos baseados no tempo para processamento. Outros arquivos individuais não devem exceder 20 MiB. A segmentação é automática e não altera o nome original do arquivo mostrado para o trabalho.

## Definir contexto de processamento

O contexto de processamento é uma instrução opcional que ajuda o Injetor de Mídia a decidir quais fatos são mais valiosos para sua base de conhecimento. Ele é considerado juntamente com a origem, mas não é tratado como uma fonte factual e não pode adicionar fatos ausentes no arquivo.

Um bom contexto descreve:

- A identidade e o propósito da origem.
- O público que buscará na coleção.
- Os tópicos, produtos, jurisdições, períodos ou áreas que importam.
- Rótulos ambíguos ou terminologia interna que a própria origem estabelece.
- Conteúdo que deve ser despriorizado, como cabeçalhos repetidos ou texto padrão administrativo.

Exemplo:

```text
Esta é a política de suporte de 2026 para clientes Acme Cloud no Brasil. Priorize regras de elegibilidade, prazos, diferenças de planos, exceções e os passos que um agente de suporte deve comunicar. Ignore cabeçalhos de página repetidos e blocos de assinatura.
```

Evite pedir ao mecanismo que infira conclusões, forneça informações ausentes ou use conhecimento externo. Por exemplo, não instrua-o a decidir se um contrato é legalmente executável ou a calcular valores que a origem não relata.

O contexto de processamento difere do contexto de uma coleção. O contexto de processamento orienta apenas esta importação. O contexto da coleção descreve a base de conhecimento para um AI Gateway quando a coleção é usada posteriormente. Coloque aqui orientações específicas da origem; mantenha orientações duráveis e abrangentes nas configurações da coleção.

## Tipos de origem aceitos

O painel aceita quatro grupos de origem para o Injetor de Mídia:

| Grupo de origem | Comportamento de processamento |
| --- | --- |
| Documentos PDF | Lê a estrutura do documento, texto e conteúdo visual relevante. |
| Imagens | Interpreta texto e conteúdo visível para produzir documentos RAG textuais. |
| Áudio | Interpreta fala e outro conteúdo auditivo relevante; arquivos grandes são segmentados automaticamente. |
| Vídeo | Interpreta conteúdo visual e auditivo relevante; arquivos grandes são segmentados automaticamente. |

Use a extensão de arquivo original e correta porque a AIVAX a usa para identificar o tipo de mídia. Uma extensão rotulada incorretamente pode selecionar o caminho de processamento errado ou fazer o trabalho falhar. O suporte a contêineres e codecs pode variar; se um arquivo de áudio ou vídeo falhar, converta‐o para um formato comum e tente novamente.

## Documentos gerados

Cada item gerado é projetado para ser uma unidade de conhecimento útil, e não uma transcrição página a página. O Injetor de Mídia:

- Prioriza identidade da origem, escopo, fatos principais, relacionamentos, exceções e distinções materiais.
- Combina fatos estreitamente relacionados ao invés de criar um documento por rótulo, célula de tabela ou valor repetido.
- Ignora texto decorativo, paginação, resumos repetidos e metadados incidentais, a menos que mudem o significado.
- Preserva o idioma, a terminologia, as datas exibidas e os formatos numéricos da origem.
- Interrompe quando a origem não tem conhecimento materialmente novo a acrescentar.

Os documentos gerados são marcados para que possam ser identificados como conteúdo produzido automaticamente. Eles são então indexados como outros documentos da coleção e incidem no custo normal de incorporação de texto da coleção, além do processamento do Injetor de Mídia.

Para orientações de qualidade de recuperação após a ingestão, veja [Melhores Práticas para RAG](best-practices.md). Em particular, inspecione documentos gerados a partir de tabelas, digitalizações e fontes com layouts repetidos antes de utilizá‐los em produção.

## Uso, preços e limites

O uso do Injetor de Mídia depende da origem, contexto opcional, perguntas e respostas geradas, reutilização de cache e tokens de mídia quando aplicável. A faturação agrega entrada, entrada em cache, saída e uso de mídia para o trabalho de processamento sem expor o modelo subjacente. Consulte [Preços](../pricing.md#lista-de-preços) para as tarifas finais.

O Injetor de Mídia está disponível nos planos Pro e Max. Os limites diários de arquivos estão listados em [Planos e Limites](../limits.md#limites-do-plano). O upload requer pelo menos $5 de saldo disponível na conta, e o processamento é interrompido se a conta não puder cobrir o uso.