---
{title: Documentos,linkTitle: Documentos,weight: 20,group: RAG and collections,aliases: [/docs/pt-br/rag/media-injector.html,/docs/pt-br/rag/best-practices.html,/docs/pt-br/rag/documents.html],sourceHash: f0872f57e0ea5f16}
---

# Documentos

Um documento é a unidade que a AIVAX indexa e recupera dentro de uma [coleção](collections.md). Cada documento armazena texto, uma referência opcional, tags opcionais, metadados opcionais e os vetores gerados pelo trabalho de indexação. A qualidade da busca depende muito de quão claro, focado e autocontido cada documento é.

## Anatomia de um documento

| Campo | Descrição |
| --- | --- |
| Nome | Identificador estável obrigatório, de até 256 caracteres. Documentos existentes são correspondidos pelo nome, portanto reutilize o mesmo nome para atualizar um documento. |
| Conteúdo | Texto obrigatório que é incorporado e buscado semanticamente. |
| Referência | ID opcional, de até 64 caracteres, que agrupa blocos pertencentes à mesma fonte lógica. |
| Tags | Rótulos opcionais para filtragem, navegação e manutenção. |
| Metadados | Objeto opcional retornado com os resultados, como URL da fonte, versão, autor ou data de publicação. |

Apenas o conteúdo é incorporado. Metadados e tags são retornados com os resultados e podem ser usados em [filtros avançados](document-filters.md), mas não influenciam a correspondência semântica. Se os usuários puderem buscar por “política de reembolso”, essas palavras devem aparecer no conteúdo, não apenas em uma tag.

Use referências quando vários documentos representam partes da mesma fonte, como seções de um contrato, cláusulas de uma política ou blocos de um PDF. Quando uma busca habilita a expansão de referência, um documento correspondido pode trazer os outros documentos que compartilham sua referência.

## Escreva bons documentos

Um documento deve representar um pedaço limitado de conhecimento. Como meta prática, mantenha a maioria dos documentos entre 20 e 700 palavras. Isso não é uma regra de API, mas geralmente fornece ao modelo de incorporação contexto suficiente sem misturar tópicos não relacionados. Divida conteúdo mais longo em limites lógicos, como seções, cláusulas, entradas de FAQ ou descrições de produtos.

Faça:

- Dê a cada documento um nome claro e um texto focado.
- Coloque o assunto próximo ao início do documento.
- Use linguagem natural semelhante à forma como os usuários fazem perguntas.
- Repita identificadores importantes, nomes de produtos, nomes de políticas, siglas e termos quando forem relevantes.
- Inclua contexto suficiente para que o texto seja compreendido por si só.

Evite:

- Documentos vazios, pequenos ou apenas com título.
- PDFs, capítulos, logs ou manuais inteiros como um único documento.
- Múltiplos assuntos não relacionados em um documento.
- Texto que dependa de páginas circundantes para fazer sentido.
- Idiomas misturados no mesmo documento, a menos que os usuários esperem buscar dessa forma.
- JSON bruto, código, tabelas ou logs sem uma breve explicação em linguagem natural.
- Pronomes como “ele” ou “o produto” quando o documento não identifica o assunto.

Por exemplo, prefira:

```text
The color of the 2015 Honda Civic registered in fleet record CAR-123 is yellow.
```

sobre:

```text
The car is yellow.
```

A primeira versão pode ser recuperada e compreendida sem contexto externo.

### Segmentação de fontes maiores

Ao importar PDFs, planilhas, páginas web ou manuais, inspecione os blocos resultantes antes de confiar na coleção. Remova cabeçalhos, rodapés, menus de navegação, tabelas quebradas, texto padrão e isenções irrelevantes quando possível. Um bom bloco inclui um título ou cabeçalho da fonte, o contexto imediato da seção e a regra, resposta ou explicação completa. Um bloco ruim contém metade de uma linha de tabela, uma frase que depende da página anterior ou várias políticas misturadas. [Segmentação de Texto](../data-processing/text-segmentation.md) pode dividir o texto da fonte em segmentos coesos antes da importação.

### Tamanho do documento

Documentos muito pequenos, abaixo de aproximadamente 10 tokens, são aceitos mas podem não ser recuperados de forma confiável. Documentos acima de aproximadamente 1.562 tokens são aceitos e indexados, mas registram um aviso nos logs da conta porque um único vetor representa seu texto inteiro com menos precisão. Texto muito maior que esse tamanho é truncado para incorporação. Divida documentos grandes em vez de depender do truncamento.

## Importar documentos

A AIVAX oferece várias formas de adicionar documentos. Todas elas enfileiram documentos novos ou alterados para indexação; um documento torna‑se pesquisável após seu estado mudar de **Queued** para **Indexed**.

| Método | Quando usar |
| --- | --- |
| Criar ou atualizar um documento | Sua aplicação gerencia documentos um por um, como uma tela de admin que salva uma única entrada de FAQ. |
| Importação em lote via WebSocket | Você tem muitos documentos preparados, como blocos gerados a partir de PDFs, catálogos, políticas ou artigos de centro de ajuda. |
| Importar arquivos com Media Injector | Você tem arquivos fonte cujo conhecimento ainda não foi dividido em texto pronto para recuperação. |

### Atualizações e reindexação

Documentos são correspondidos pelo nome. Quando um documento é criado, ele é enfileirado para indexação. Quando seu conteúdo muda, ele é enfileirado novamente e seus vetores são regenerados. Documentos não alterados são ignorados.

A atualização de um único documento pode mudar a referência, tags ou metadados sem reindexação, e campos omitidos mantêm seus valores atuais. Uma importação em lote atualiza apenas metadados sem reindexação, mas atualiza a referência e tags apenas junto com conteúdo alterado; uma linha que muda apenas a referência ou tags é ignorada.

> [!WARNING]
> A indexação gera custo com base nos tokens de texto do documento quando documentos são criados ou quando seu conteúdo muda.

### Importação em lote

Use o endpoint **Index Documents (JSONL WebSocket)** para importações em lote. Ele substitui o upload multipart **Index Documents (JSONL)**, que permanece disponível apenas para integrações existentes. A importação via WebSocket transmite documentos em blocos, relata progresso à medida que avança, aceita 10× o limite de documentos por requisição do upload multipart e permite retomar a partir da última linha confirmada após uma desconexão.

Cada linha JSONL representa um documento:

| Propriedade | Obrigatório | Descrição |
| --- | --- | --- |
| `docid` | Sim | Nome do documento. Documentos existentes são correspondidos por esse valor. |
| `text` | Sim | Conteúdo a indexar. |
| `__ref` | Não | ID de referência. |
| `__tags` | Não | Tags. |
| `__meta` | Não | Objeto de metadados. |

A importação funciona da seguinte forma:

1. Abra um WebSocket para o endpoint. Navegadores podem se autenticar com o parâmetro de consulta `api-key`. Adicione `insert-mode=sync` para excluir documentos da coleção cujos nomes não foram enviados.
2. Envie mensagens de texto UTF‑8 com linhas JSONL completas separadas por `\n`. Uma mensagem pode conter uma ou várias linhas. Cada mensagem deve chegar dentro de 30 segundos da anterior.
3. A AIVAX confirma as linhas em blocos. Para cada bloco verifica o saldo da conta, cota de armazenamento e acesso à coleção, salva os documentos, os enfileira para indexação e envia uma mensagem `progress` com o número de linhas confirmadas.
4. Envie uma linha contendo apenas `END`. A AIVAX salva as linhas restantes, aplica `insert-mode=sync` quando solicitado e envia uma mensagem `completed` antes de fechar a conexão.

Se a conexão for fechada, expirar ou falhar antes de `END`, linhas não confirmadas são descartadas, enquanto blocos confirmados permanecem enfileirados. A mensagem `error` relata a contagem de linhas confirmadas, para que você possa reenviar apenas as linhas restantes. Apenas uma importação roda por coleção por vez; uma segunda importação aguarda até 30 segundos e então falha com `409 Conflict`.

Quando uma linha altera o texto de um documento existente, sua referência e tags são substituídas pelos valores enviados; um `__meta` omitido mantém os metadados existentes.

<script src="https://inference.aivax.net/apidocs?embed-target=Index%20Documents%20(JSONL%20WebSocket)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Importar arquivos com Media Injector

Media Injector transforma um arquivo fonte em documentos focados e autocontidos. Ele examina a fonte, identifica conhecimento materialmente útil, escreve documentos factuais concisos na língua predominante da fonte e os enfileira para indexação. Use importação direta quando precisar da redação exata da fonte, limites determinísticos, nomes de documentos estáveis ou metadados controlados pela aplicação.

Media Injector é útil para PDFs que contêm vários tópicos independentes, imagens ou páginas escaneadas cujo conteúdo visível deve se tornar pesquisável, e áudio ou vídeo cujos fatos devem estar disponíveis via RAG. Ele não preserva a fonte como um único documento pesquisável. Revise os documentos gerados quando a redação, cobertura, fidelidade legal ou tratamento de dados sensíveis forem importantes.

No Console:

1. Abra a coleção alvo e escolha **Import from files**.
2. Selecione um ou mais arquivos fonte.
3. Opcionalmente forneça contexto de processamento. O mesmo contexto é aplicado a cada arquivo selecionado.
4. Confirme a importação. Os arquivos são enviados sequencialmente, e um trabalho separado é criado para cada arquivo após todos os seus blocos terem chegado ao AIVAX.
5. Acompanhe os trabalhos em **Batch > Media Processing**.
6. Após a conclusão de cada trabalho, revise os documentos gerados e aguarde a indexação antes de testar a [Search](semantic-search.md).

Um trabalho pode estar `queued`, `processing`, `completed`, `failed` ou `cancelled`. Trabalhos falhados ou cancelados podem ser reprocessados enquanto seus dados enviados ainda estão disponíveis. Se nenhum trabalho aparecer, o upload não chegou à etapa de conclusão; refaça o upload e verifique o erro exibido. Nomes de arquivos são preservados durante o upload, incluindo letras acentuadas e scripts não latinos.

| Grupo de origem | Comportamento de processamento |
| --- | --- |
| Documentos PDF | Lê a estrutura do documento, texto e conteúdo visual relevante. |
| Imagens | Interpreta texto e conteúdo visível. |
| Áudio | Interpreta fala e outro conteúdo auditivo relevante; arquivos grandes são segmentados automaticamente. |
| Vídeo | Interpreta conteúdo visual e auditivo relevante; arquivos grandes são segmentados automaticamente. |

Use a extensão de arquivo original e precisa, pois ela identifica o tipo de mídia. Se um arquivo de áudio ou vídeo falhar, converta‑o para um formato comum e tente novamente.

**Contexto de processamento** é uma instrução opcional que ajuda o Media Injector a decidir quais fatos são mais valiosos. Não é tratado como fonte factual e não pode adicionar fatos ausentes do arquivo. Descreva a identidade e o propósito da fonte, o público, os tópicos relevantes, terminologia ambígua e o conteúdo a ser depriorizado:

```text
This is the 2026 support policy for Acme Cloud customers in Brazil. Prioritize eligibility rules, deadlines, plan differences, exceptions, and the steps a support agent must communicate. Ignore repeated page headers and signature blocks.
```

Não peça que ele infira conclusões, forneça informações ausentes ou calcule valores que a fonte não relata.

Documentos gerados priorizam identidade da fonte, escopo, fatos principais, relações e exceções; combinam fatos estreitamente relacionados; ignoram texto decorativo e paginação; e preservam a língua, terminologia, datas e formatos numéricos da fonte. Eles são marcados como conteúdo produzido automaticamente e indexados como outros documentos. Inspecione documentos gerados a partir de tabelas, digitalizações e layouts repetidos antes de confiar neles em produção.

## Gerenciar documentos

Você pode gerenciar documentos no Console, na aba **Browse documents** da coleção, ou via API. As capacidades de gerenciamento incluem:

- **Navegar e filtrar** por tag, referência, conteúdo, nome ou ID, por estado de indexação (queued ou indexed) e ordenar por data de criação, atualização ou indexação.
- **Inspecionar** o conteúdo, referência, tags, metadados, timestamps e contagem aproximada de tokens de um documento. O editor do Console também alerta quando um documento tem palavras demais ou de poucas.
- **Editar** conteúdo, referência, tags e metadados. Alterar o conteúdo reindexa o documento.
- **Excluir** documentos individuais ou remover documentos que não foram enviados em uma importação em lote sincronizada com `insert-mode=sync`.
- **Exportar** todos os documentos de uma coleção como JSONL.
- **Remover duplicados** com o [collection de-duplicator](collections.md#de-duplicator).

Consulte os grupos Documentos e Coleções da [referência da API](https://inference.aivax.net/apidocs) para os endpoints, incluindo **Create or Update Document**, **Browse Documents**, **Get Document**, **Delete Document** e **Export Collection**.

## Solucionar problemas de recuperação

Quando os resultados de busca são ruins, verifique o básico primeiro:

- Confirme que os documentos estão indexados.
- Teste a coleção com [Search](semantic-search.md) ou o playground do Console antes de testar através de um **gateway de IA**.
- Tente uma pergunta completa em vez de palavras‑chave isoladas e compare a linguagem da consulta com a linguagem do documento.
- Verifique se a resposta está dividida em muitos documentos pequenos ou enterrada em um documento muito grande.
- Verifique o histórico de busca e a cobertura de consultas em [RAG Observability](observability.md).

## Preços e limites

A indexação de documentos é cobrada como incorporação de texto da coleção; veja [Collections](collections.md#pricing-and-limits). Media Injector é cobrado por entrada, entrada em cache, saída e uso de mídia do trabalho de processamento, além do custo normal de incorporação dos documentos gerados. As tarifas dependem do tipo de mídia e do volume de tokens de entrada.

| Media Injector | Preço |
| --- | --- |
| PDFs e imagens – até 272 K tokens de entrada | Entrada **$0.30/M tokens**; cache **$0.03/M tokens**; saída **$1.80/M tokens** |
| PDFs e imagens – acima de 272 K tokens de entrada | Entrada **$0.60/M tokens**; cache **$0.06/M tokens**; saída **$3.60/M tokens** |
| Áudio – até 256 K tokens de entrada | Entrada/mídia **$0.60/M tokens**; cache **$0.12/M tokens**; saída **$3.00/M tokens** |
| Áudio – acima de 256 K tokens de entrada | Entrada/mídia **$1.20/M tokens**; cache **$0.24/M tokens**; saída **$6.00/M tokens** |
| Vídeo | Entrada/mídia **$0.45/M tokens**; cache **$0.045/M tokens**; saída **$3.75/M tokens** |

| Limite | Gratuito | Pro | Máx |
| --- | --- | --- | --- |
| Inserções de documentos | 500/dia | 10 000/dia | — |
| Documentos por importação multipart JSONL | 1 000 | 10 000 | 1 000 000 |
| Documentos por importação WebSocket JSONL | 10 000 | 100 000 | 10 000 000 |
| Media Injector | 2 arquivos/dia | 30 arquivos/dia | 1 000 arquivos/dia |

Um travessão (`—`) indica que o plano não impõe limite. Se uma importação exceder o limite por importação, divida‑a em múltiplas importações. Se a conta atingir o limite diário de inserções, aguarde o reset da janela ou faça upgrade do plano.
