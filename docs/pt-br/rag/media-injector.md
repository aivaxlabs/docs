# Media Injector

Media Injector transforma um arquivo de origem em documentos focados e autônomos dentro de uma coleção RAG da AIVAX. Ele examina a origem, identifica conhecimento materialmente útil, escreve documentos factuais concisos no idioma predominante da origem e coloca esses documentos em fila para indexação semântica.

Use o Media Injector quando você tem um arquivo cujo conhecimento útil ainda não foi dividido em texto pronto para recuperação. Se você já possui strings de documentos limpas, use [Create or Update Document or JSONL import](collections.md#document-fields) em vez disso; esses caminhos são mais previsíveis e evitam o processamento adicional necessário para interpretar um arquivo de origem.

## Quando usar

Media Injector é útil para:

- PDFs como relatórios, manuais e políticas que contêm vários tópicos independentes.
- Imagens ou páginas digitalizadas cujo conteúdo visível deve se tornar conhecimento pesquisável.
- Áudio e vídeo cujos fatos materiais devem estar disponíveis através do RAG.

Não é um recurso geral de armazenamento de arquivos e não preserva a origem como um único documento pesquisável. A saída é um conjunto de documentos RAG gerados. Revise esses documentos após o processamento quando a redação, cobertura, fidelidade legal ou o tratamento de dados sensíveis for importante.

Use a importação direta de documentos quando precisar da redação exata da origem, limites determinísticos, nomes de documentos estáveis ou metadados controlados pela aplicação. Use [Text Segmentation](text-segmentation.md) quando precisar apenas de segmentos coesos de texto de origem retornados à sua aplicação sem criar documentos de coleção.

## Como funciona a ingestão

No painel da AIVAX:

1. Abra a coleção alvo e escolha **Import from files**.
2. Selecione um ou mais arquivos de origem.
3. Opcionalmente forneça contexto de processamento. O mesmo contexto é aplicado a cada arquivo selecionado.
4. Confirme a importação. O painel envia os arquivos sequencialmente, e um trabalho separado é criado para cada arquivo depois que todos os seus blocos chegaram ao AIVAX.
5. Acompanhe os trabalhos em **Batch > Media Processing**.
6. Após a conclusão de cada trabalho, revise os documentos gerados e aguarde o estado de indexação antes de testar [Semantic Search](semantic-search.md).

Um trabalho pode estar `queued`, `processing`, `completed`, `failed` ou `cancelled`. O painel relata o arquivo de origem, tempo decorrido, número de documentos produzidos e custo atual. Trabalhos falhados ou cancelados podem ser reexecutados quando seus dados carregados recuperáveis ainda estiverem disponíveis.

Áudio e vídeo podem ser divididos em segmentos baseados no tempo para processamento. A segmentação é automática e não altera o nome original do arquivo exibido para o trabalho. Consulte [Plans and limits](../limits.md) para limites de upload atuais.

## Definir contexto de processamento

O contexto de processamento é uma instrução opcional que ajuda o Media Injector a decidir quais fatos são mais valiosos para sua base de conhecimento. Ele é considerado junto com a origem, mas não é tratado como uma fonte factual e não pode adicionar fatos que estejam ausentes no arquivo.

Um bom contexto descreve:

- A identidade e o propósito da origem.
- O público que buscará a coleção.
- Os tópicos, produtos, jurisdições, períodos ou áreas que importam.
- Rótulos ambíguos ou terminologia interna que a própria origem estabelece.
- Conteúdo que deve ser despriorizado, como cabeçalhos repetidos ou texto padrão administrativo.

Exemplo:

```text
Esta é a política de suporte de 2026 para clientes da Acme Cloud no Brasil. Priorize regras de elegibilidade, prazos, diferenças de plano, exceções e os passos que um agente de suporte deve comunicar. Ignore cabeçalhos de página repetidos e blocos de assinatura.
```

Evite pedir ao mecanismo que infera conclusões, forneça informações ausentes ou use conhecimento externo. Por exemplo, não instrua-o a decidir se um contrato é legalmente exigível ou a calcular valores que a origem não relata.

O contexto de processamento é diferente do contexto de uma coleção. O contexto de processamento orienta apenas esta importação. O contexto da coleção descreve a base de conhecimento para um AI Gateway quando a coleção for usada posteriormente. Coloque aqui orientações de ingestão específicas da origem; mantenha orientações duráveis de toda a coleção nas configurações da coleção.

## Tipos de fonte aceitos

O painel aceita quatro grupos de origem para o Media Injector:

| Grupo de origem | Comportamento de processamento |
| --- | --- |
| Documentos PDF | Lê a estrutura do documento, texto e conteúdo visual relevante. |
| Imagens | Interpreta texto e conteúdo visível para produzir documentos RAG textuais. |
| Áudio | Interpreta fala e outros conteúdos auditivos relevantes; arquivos grandes são segmentados automaticamente. |
| Vídeo | Interpreta conteúdo visual e auditivo relevante; arquivos grandes são segmentados automaticamente. |

Use a extensão de arquivo original e precisa porque a AIVAX a usa para identificar o tipo de mídia. Uma extensão rotulada incorretamente pode selecionar o caminho de processamento errado ou fazer o trabalho falhar. O suporte a contêineres e codecs pode variar; se um arquivo de áudio ou vídeo falhar, converta-o para um formato comum e tente novamente.

## Documentos gerados

Cada item gerado foi projetado para ser uma unidade de conhecimento útil, em vez de uma transcrição página por página. Media Injector:

- Prioriza a identidade da origem, escopo, fatos principais, relacionamentos, exceções e distinções materiais.
- Combina fatos estreitamente relacionados em vez de criar um documento por rótulo, célula de tabela ou valor repetido.
- Ignora texto decorativo, paginação, resumos repetidos e metadados incidentais, a menos que alterem o significado.
- Preserva o idioma, a terminologia, as datas exibidas e os formatos numéricos da origem.
- Para quando a origem não tem conhecimento materialmente novo para acrescentar.

Os documentos gerados são marcados para que possam ser identificados como conteúdo produzido automaticamente. Eles são então indexados como outros documentos da coleção e incidem no custo normal de incorporação de texto da coleção, além do processamento do Media Injector.

Para orientações de qualidade de recuperação após a ingestão, veja [Best Practices for RAG](best-practices.md). Em particular, inspecione documentos gerados a partir de tabelas, digitalizações e fontes com layouts repetidos antes de confiar neles em produção.

## Uso, preços e limites

O uso do Media Injector depende da origem, contexto opcional, perguntas e respostas geradas, reutilização de cache e tokens de mídia quando aplicável. A faturação agrega entrada, entrada em cache, saída e uso de mídia para o trabalho de processamento sem expor o modelo de processamento subjacente. Consulte [Pricing](../pricing.md#pricing-list) para as taxas finais.

A disponibilidade e os limites operacionais do Media Injector dependem da configuração da conta. Consulte [Pricing](../pricing.md) e [Plans and limits](../limits.md) antes de enviar arquivos em produção.