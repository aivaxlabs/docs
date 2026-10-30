Source: https://docs.aivax.net/pt-br/docs/rag/documents.html

# Documentos

Um documento é a unidade que o AIVAX indexa e recupera dentro de uma [coleção](https://docs.aivax.net/pt-br/docs/rag/collections.md). Cada documento armazena texto, uma referência opcional, tags opcionais, metadados opcionais e os vetores gerados pelo trabalho de indexação. A qualidade da pesquisa depende fortemente do quão claros, focados e autocontidos são cada um dos documentos.

## Anatomia de um documento

| Campo | Descrição |
| --- | --- |
| Nome | Identificador estável obrigatório, com até 256 caracteres. Documentos existentes são correspondidos por nome, portanto, reutilize o mesmo nome para atualizar um documento. |
| Conteúdo | Texto obrigatório que é incorporado e pesquisado semanticamente. |
| Referência | ID opcional, com até 64 caracteres, que agrupa trechos pertencentes à mesma fonte lógica. |
| Tags | Rótulos opcionais para filtragem, navegação e manutenção. |
| Metadados | Objeto opcional retornado com os resultados, como URL de origem, versão, autor ou data de publicação. |

Apenas o conteúdo é incorporado. Metadados e tags são retornados com os resultados e podem ser usados em [filtros avançados](https://docs.aivax.net/pt-br/docs/rag/document-filters.md), mas não influenciam a correspondência semântica. Se os usuários puderem pesquisar por "política de reembolso", essas palavras devem aparecer no conteúdo, não apenas em uma tag.

Use referências quando vários documentos representam partes da mesma fonte, como seções de um contrato, cláusulas de uma política ou trechos de um PDF. Quando uma pesquisa permite a expansão por referência, um documento correspondente pode trazer os outros documentos que compartilham sua referência.

## Escreva bons documentos

Um documento deve representar um único pedaço limitado de conhecimento. Como meta prática, mantenha a maioria dos documentos entre 20 e 700 palavras. Esta não é uma regra da API, mas geralmente fornece ao modelo de incorporação contexto suficiente sem misturar tópicos não relacionados. Divida conteúdos mais longos em limites lógicos, como seções, cláusulas, entradas de FAQ ou descrições de produtos.

Faça:

- Dê a cada documento um nome claro e um texto focado.
- Coloque o assunto perto do início do documento.
- Use linguagem natural semelhante à maneira como os usuários fazem perguntas.
- Repita identificadores importantes, nomes de produtos, nomes de políticas, siglas e termos quando forem relevantes.
- Inclua contexto suficiente para que o texto seja compreendido por si só.

Evite:

- Documentos vazios, minúsculos ou apenas com título.
- PDFs inteiros, capítulos, logs ou manuais como um único documento.
- Múltiplos assuntos não relacionados em um único documento.
- Texto que dependa de páginas adjacentes para fazer sentido.
- Idiomas misturados no mesmo documento, a menos que se espere que os usuários pesquisem dessa forma.
- JSON bruto, código, tabelas ou logs sem uma breve explicação em linguagem natural.
- Pronomes como "ele" ou "o produto" quando o documento não identifica o sujeito.

Por exemplo, prefira:

```text
A cor do Honda Civic 2015 registrado no registro de frota CAR-123 é amarela.
```

em vez de:

```text
O carro é amarelo.
```

A primeira versão pode ser recuperada e compreendida sem contexto externo.

### Segmentação de fontes maiores

Ao importar PDFs, planilhas, páginas da web ou manuais, inspecione os trechos resultantes antes de confiar na coleção. Remova cabeçalhos, rodapés, menus de navegação, tabelas quebradas, textos genéricos e avisos irrelevantes sempre que possível.

Um bom trecho inclui um título ou cabeçalho de seção da fonte, o contexto imediato da seção e a regra completa, resposta ou explicação. Um trecho ruim contém metade de uma linha de tabela, uma frase que depende da página anterior ou várias políticas misturadas.

A [Segmentação de Texto](https://docs.aivax.net/pt-br/docs/data-processing/text-segmentation.md) pode dividir o texto da fonte em segmentos coesos antes da importação. Para um script de ponta a ponta que converte um PDF com Fetch, o segmenta e grava JSONL com valores `docid` estáveis, consulte [como converter um PDF para Markdown para RAG e dividi-lo em trechos](https://aivax.net/blog/pdf-to-markdown-for-rag-chunks-jsonl/).

### Tamanho do documento

Documentos muito pequenos, abaixo de cerca de 32 tokens, são aceitos, mas podem não ser recuperados de forma confiável. Documentos acima de cerca de 4.096 tokens são aceitos e indexados, mas registram um aviso nos logs da conta porque um único vetor representa todo o seu texto com menos precisão. O texto muito além desse tamanho é truncado para incorporação. Divida documentos grandes em vez de depender do truncamento.

## Importar documentos

O AIVAX oferece várias maneiras de adicionar documentos. Todos eles colocam novos ou alterados documentos na fila para indexação; um documento torna-se pesquisável após seu estado mudar de **Em Fila** para **Indexado**.

| Método | Use quando |
| --- | --- |
| Criar ou atualizar um documento | Seu aplicativo gerencia documentos um de cada vez, como uma tela de administração que salva uma entrada de FAQ. |
| Importação em lote via WebSocket | Você tem muitos documentos preparados, como trechos gerados a partir de PDFs, catálogos, políticas ou artigos de centro de ajuda. |
| Importação de arquivos com Media Injector | Você tem arquivos-fonte cujo conhecimento ainda não foi dividido em texto pronto para recuperação. |

### Atualizações e reindexação

Os documentos são correspondidos por nome. Quando um documento é criado, ele é colocado na fila para indexação. Quando seu conteúdo muda, ele é colocado na fila novamente e seus vetores são regenerados. Documentos inalterados são ignorados.

O que você pode atualizar sem alterar o conteúdo depende do método de importação:

- **Atualização de documento único:** altera a referência, as tags ou os metadados sem reindexar. Os campos omitidos mantêm seus valores atuais.
- **Importação em lote:** atualiza apenas os metadados sem reindexar. A referência e as tags são atualizadas apenas junto com o conteúdo alterado, portanto, uma linha que altera apenas a referência ou as tags é ignorada.

> [!WARNING]
> A indexação incorre em custo baseado em tokens de texto do documento quando os documentos são criados ou quando seu conteúdo muda.

### Importação em lote

Use o endpoint **Indexar Documentos (JSONL WebSocket)** para importações em lote. Ele substitui o upload multipart **Indexar Documentos (JSONL)**, que permanece disponível apenas para integrações existentes. A importação via WebSocket transmite documentos em blocos, relata o progresso conforme avança, aceita 10 vezes o limite de documentos por solicitação do upload multipart e permite retomar a partir da última linha confirmada após uma desconexão.

Cada linha JSONL representa um documento:

| Propriedade | Obrigatório | Descrição |
| --- | --- | --- |
| `docid` | Sim | Nome do documento. Documentos existentes são correspondidos por este valor. |
| `text` | Sim | Conteúdo a ser indexado. |
| `__ref` | Não | ID de referência. |
| `__tags` | Não | Tags. |
| `__meta` | Não | Objeto de metadados. |

A importação funciona da seguinte maneira:

1. Abra um WebSocket para o endpoint. Navegadores podem autenticar com o parâmetro de consulta `api-key`. Adicione `insert-mode=sync` para excluir documentos da coleção cujos nomes não foram enviados.
2. Envie mensagens de texto UTF-8 com linhas JSONL completas separadas por `\n`. Uma mensagem pode conter uma ou muitas linhas. Cada mensagem deve chegar dentro de 30 segundos da mensagem anterior.
3. O AIVAX confirma as linhas em blocos. Para cada bloco, verifica o saldo da conta, a cota de armazenamento e o acesso à coleção, salva os documentos, os coloca na fila para indexação e envia uma mensagem `progress` com o número de linhas confirmadas.
4. Envie uma linha contendo apenas `END`. O AIVAX salva as linhas restantes, aplica `insert-mode=sync` quando solicitado e envia uma mensagem `completed` antes de fechar a conexão.

Se a conexão for fechada, expirar ou falhar antes de `END`, as linhas não confirmadas serão descartadas, enquanto os blocos confirmados permanecerão na fila. A mensagem `error` relata a contagem de linhas confirmadas, permitindo que você envie apenas as linhas restantes. Apenas uma importação é executada por coleção por vez; uma segunda importação aguarda até 30 segundos e depois falha com `409 Conflict`.

Quando uma linha altera o texto de um documento existente, sua referência e tags são substituídas pelos valores enviados; um `__meta` omitido mantém os metadados existentes.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Index%20Documents%20(JSONL%20WebSocket))

### Importação de arquivos com Media Injector

O Media Injector transforma um arquivo-fonte em documentos focados e autocontidos. Ele examina a fonte, identifica o conhecimento materialmente útil, escreve documentos factuais concisos no idioma predominante da fonte e os coloca na fila para indexação. Use a importação direta quando precisar de redação exata da fonte, limites determinísticos, nomes de documentos estáveis ou controle de metadados pela aplicação.

O Media Injector é útil para PDFs que contêm vários tópicos independentes, imagens ou páginas digitalizadas cujo conteúdo visível deve se tornar pesquisável, e áudio ou vídeo cujos fatos devem estar disponíveis por meio de RAG. Ele não preserva a fonte como um único documento pesquisável. Revise os documentos gerados quando a redação, cobertura, fidelidade legal ou tratamento de dados sensíveis for importante.

No Console:

1. Abra a coleção de destino e escolha **Importar de arquivos**.
2. Selecione um ou mais arquivos-fonte.
3. Opcionalmente, forneça contexto de processamento. O mesmo contexto é aplicado a todos os arquivos selecionados.
4. Confirme a importação. Os arquivos são carregados sequencialmente, e um trabalho separado é criado para cada arquivo após todos os seus trechos chegarem ao AIVAX.
5. Acompanhe os trabalhos em **Lote > Processamento de Mídia**.
6. Após a conclusão de cada trabalho, revise os documentos gerados e aguarde a indexação antes de testar a [Pesquisa](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md).

Um trabalho pode estar `queued` (em fila), `processing` (processando), `completed` (concluído), `failed` (falhou) ou `cancelled` (cancelado). Trabalhos falhados ou cancelados podem ser retryados enquanto seus dados carregados ainda estiverem disponíveis.

Se nenhum trabalho aparecer, o upload não atingiu sua etapa de conclusão. Retry o upload e verifique o erro exibido. Os nomes dos arquivos são preservados durante o upload, incluindo letras acentuadas e scripts não latinos.

| Grupo de origem | Comportamento de processamento |
| --- | --- |
| Documentos PDF | Lê a estrutura do documento, o texto e o conteúdo visual relevante. |
| Imagens | Interpreta o texto e o conteúdo visíveis. |
| Áudio | Interpreta o conteúdo falado e outro conteúdo auditivo relevante; arquivos grandes são segmentados automaticamente. |
| Vídeo | Interpreta o conteúdo visual e auditivo relevante; arquivos grandes são segmentados automaticamente. |

Use a extensão de arquivo original e precisa, pois ela identifica o tipo de mídia. Se um arquivo de áudio ou vídeo falhar, converta-o para um formato comum e tente novamente.

O **contexto de processamento** é uma instrução opcional que ajuda o Media Injector a decidir quais fatos são mais valiosos. Não é tratado como uma fonte factual e não pode adicionar fatos ausentes do arquivo. Descreva a identidade e o propósito da fonte, o público-alvo, os tópicos relevantes, terminologia ambígua e conteúdo a ser priorizado negativamente:

```text
Esta é a política de suporte de 2026 para clientes da Acme Cloud no Brasil. Priorize regras de elegibilidade, prazos, diferenças de planos, exceções e os passos que um agente de suporte deve comunicar. Ignore cabeçalhos de página repetidos e blocos de assinatura.
```

Não peça para inferir conclusões, fornecer informações ausentes ou calcular valores que a fonte não reporta.

Documentos gerados:

- Priorizam a identidade da fonte, escopo, fatos principais, relacionamentos e exceções.
- Combinam fatos estreitamente relacionados.
- Ignoram texto decorativo e paginação.
- Preservam o idioma, a terminologia, as datas e os formatos numéricos da fonte.
- São marcados como conteúdo produzido automaticamente e indexados como outros documentos.

Inspecione os documentos gerados a partir de tabelas, digitalizações e layouts repetidos antes de confiá-los em produção. Para um procedimento de amostragem que classifica cada documento gerado contra fatos que você anotou previamente, consulte [como verificar a qualidade da ingestão de PDF e digitalizações antes de incorporar para RAG](https://aivax.net/blog/check-pdf-ingestion-quality-before-embedding-for-rag/).

## Gerenciar documentos

Você pode gerenciar documentos no Console, na aba **Navegar documentos** da coleção ou por meio da API. As capacidades de gerenciamento incluem:

- **Navegar e filtrar** por tag, referência, conteúdo, nome ou ID, por estado de indexação (em fila ou indexado) e classificado por data de criação, atualização ou indexação.
- **Inspecionar** o conteúdo, referência, tags, metadados, carimbos de data/hora e contagem aproximada de tokens de um documento. O editor do Console também alerta quando um documento tem muitas ou poucas palavras.
- **Editar** conteúdo, referência, tags e metadados. Alterar o conteúdo reindexa o documento.
- **Excluir** documentos individuais ou remover documentos que não foram enviados em uma importação em lote sincronizada com `insert-mode=sync`.
- **Exportar** todos os documentos de uma coleção como JSONL.
- **Remover duplicatas** com o [deduplicador de coleções](https://docs.aivax.net/pt-br/docs/rag/collections.md#de-duplicator).

Veja os grupos Documentos e Coleções da [referência da API](https://inference.aivax.net/apidocs) para os endpoints, incluindo **Criar ou Atualizar Documento**, **Navegar Documentos**, **Obter Documento**, **Excluir Documento** e **Exportar Coleção**.

## Solucionar problemas de recuperação

Quando os resultados da pesquisa são ruins, verifique o básico primeiro:

- Confirme se os documentos estão indexados.
- Teste a coleção com a [Pesquisa](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md) ou o playground do Console antes de testar por meio de um Gateway de IA.
- Tente uma pergunta completa em vez de palavras-chave isoladas e compare o idioma da consulta com o idioma do documento.
- Verifique se a resposta está dividida em muitos documentos pequenos ou enterrada em um muito grande.
- Verifique o histórico de pesquisa e a cobertura de consultas no [Observabilidade de RAG](https://docs.aivax.net/pt-br/docs/rag/observability.md).

## Preços e limites

A indexação de documentos é cobrada como incorporação de texto de coleção; veja [Coleções](https://docs.aivax.net/pt-br/docs/rag/collections.md#pricing-and-limits). O Media Injector é cobrado por entrada, entrada em cache, saída e uso de mídia do trabalho de processamento, além do custo normal de incorporação dos documentos gerados. As taxas dependem do tipo de mídia e do volume de tokens de entrada.

| Media Injector | Preço |
| --- | ---: |
| PDFs e imagens - até 272K tokens de entrada | Entrada **$0,30/M tokens**; cache **$0,03/M tokens**; saída **$1,80/M tokens** |
| PDFs e imagens - acima de 272K tokens de entrada | Entrada **$0,60/M tokens**; cache **$0,06/M tokens**; saída **$3,60/M tokens** |
| Áudio - até 256K tokens de entrada | Entrada/mídia **$0,60/M tokens**; cache **$0,12/M tokens**; saída **$3,00/M tokens** |
| Áudio - acima de 256K tokens de entrada | Entrada/mídia **$1,20/M tokens**; cache **$0,24/M tokens**; saída **$6,00/M tokens** |
| Vídeo | Entrada/mídia **$0,45/M tokens**; cache **$0,045/M tokens**; saída **$3,75/M tokens** |

| Limite | Grátis | Pro | Max |
| --- | --- | --- | --- |
| Inserções de documentos | 500/dia | 10.000/dia | — |
| Documentos por importação JSONL multipart | 1.000 | 10.000 | 1.000.000 |
| Documentos por importação JSONL WebSocket | 10.000 | 100.000 | 10.000.000 |
| Media Injector | 2 arquivos/dia | 30 arquivos/dia | 1.000 arquivos/dia |

Um travessão (`—`) significa que o plano não impõe um limite. Se uma importação exceder o limite por importação, divida-a em múltiplas importações. Se a conta atingir o limite diário de inserções, aguarde a reinicialização da janela ou faça upgrade do plano.
