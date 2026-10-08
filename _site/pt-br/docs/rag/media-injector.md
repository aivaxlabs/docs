Source: http://localhost:1313/pt-br/docs/rag/media-injector.html

# Injetor de Mídia

Media Injector transforma um arquivo fonte em documentos focados e autônomos dentro de uma coleção RAG da AIVAX. Ele examina a origem, identifica conhecimento materialmente útil, escreve documentos factuais concisos na língua predominante da origem e coloca esses documentos em fila para indexação semântica.

Use o Media Injector quando você tem um arquivo cujo conhecimento útil ainda não foi dividido em texto pronto para recuperação. Se você já possui strings de documentos limpos, use [Create or Update Document or JSONL import](http://localhost:1313/pt-br/docs/rag/collections.md#document-fields) em vez disso; esses caminhos são mais previsíveis e evitam o processamento adicional necessário para interpretar um arquivo fonte.

## Quando usar

Media Injector é útil para:

- PDFs como relatórios, manuais e políticas que contêm vários tópicos independentes.
- Imagens ou páginas escaneadas cujo conteúdo visível deve se tornar conhecimento pesquisável.
- Áudio e vídeo cujos fatos materiais devem estar disponíveis via RAG.

Não é um recurso geral de armazenamento de arquivos e não preserva a origem como um único documento pesquisável. A saída é um conjunto de documentos RAG gerados. Revise esses documentos após o processamento quando a formulação, cobertura, fidelidade legal ou o tratamento de dados sensíveis for importante.

Use importação direta de documentos quando você precisar da formulação exata da origem, limites determinísticos, nomes de documentos estáveis ou metadados controlados pela aplicação. Use [Text Segmentation](http://localhost:1313/pt-br/docs/rag/text-segmentation.md) quando precisar apenas de segmentos de texto-fonte coesos retornados à sua aplicação sem criar documentos de coleção.

Use esta [RAG responsibility checklist](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/) para decidir quais etapas de preparação gerenciar.

## Como a ingestão funciona

No painel da AIVAX:

1. Abrir a coleção alvo e escolher **Import from files**.
2. Selecionar um ou mais arquivos fonte.
3. Opcionalmente, fornecer contexto de processamento. O mesmo contexto é aplicado a cada arquivo selecionado.
4. Confirmar a importação. O painel envia os arquivos sequencialmente e um trabalho separado é criado para cada arquivo após todos os seus blocos alcançarem o AIVAX.
5. Acompanhar os trabalhos em **Batch > Media Processing**.
6. Após a conclusão de cada trabalho, revise os documentos gerados e aguarde o estado de indexação antes de testar [Semantic Search](http://localhost:1313/pt-br/docs/rag/semantic-search.md).

Um trabalho pode estar `queued`, `processing`, `completed`, `failed` ou `cancelled`. O painel informa o arquivo fonte, tempo decorrido, número de documentos produzidos e custo atual. Trabalhos falhados ou cancelados podem ser reexecutados quando seus dados enviados recuperáveis ainda estiverem disponíveis.

Áudio e vídeo podem ser divididos em segmentos baseados no tempo para processamento. A segmentação é automática e não altera o nome original do arquivo exibido no trabalho. Consulte [Plans and limits](http://localhost:1313/pt-br/docs/limits.md) para limites de upload atuais.

## Definir contexto de processamento

O contexto de processamento é uma instrução opcional que ajuda o Media Injector a decidir quais fatos são mais valiosos para sua base de conhecimento. Ele é considerado juntamente com a origem, mas não é tratado como uma fonte factual e não pode adicionar fatos que estejam ausentes do arquivo.

Um bom contexto descreve:

- A identidade e o propósito da origem.
- O público que buscará na coleção.
- Os tópicos, produtos, jurisdições, períodos ou áreas que importam.
- Rótulos ambíguos ou terminologia interna que a própria origem estabelece.
- Conteúdo que deve ser despriorizado, como cabeçalhos repetidos ou boilerplate administrativo.

```text
Esta é a política de suporte de 2026 para clientes da Acme Cloud no Brasil. Priorize regras de elegibilidade, prazos, diferenças de plano, exceções e os passos que um agente de suporte deve comunicar. Ignore cabeçalhos de página repetidos e blocos de assinatura.
```

Evite pedir ao mecanismo que infira conclusões, forneça informações ausentes ou use conhecimento externo. Por exemplo, não instrua‑o a decidir se um contrato é legalmente executável ou a calcular valores que a origem não relata.

O contexto de processamento é diferente do contexto de uma coleção. O contexto de processamento orienta apenas esta importação. O contexto da coleção descreve a base de conhecimento para um AI Gateway quando a coleção for usada posteriormente. Coloque aqui orientações de ingestão específicas da origem; mantenha orientações duráveis de toda a coleção nas configurações da coleção.

## Tipos de fonte aceitos

O painel aceita quatro grupos de fonte para o Media Injector:

| Grupo de fonte | Comportamento de processamento |
| --- | --- |
| Documentos PDF | Lê a estrutura do documento, texto e conteúdo visual relevante. |
| Imagens | Interpreta texto visível e conteúdo para produzir documentos RAG textuais. |
| Áudio | Interpreta fala e outro conteúdo auditivo relevante; arquivos grandes são segmentados automaticamente. |
| Vídeo | Interpreta conteúdo visual e auditivo relevante; arquivos grandes são segmentados automaticamente. |

Use a extensão de arquivo original e precisa porque a AIVAX a usa para identificar o tipo de mídia. Uma extensão rotulada incorretamente pode selecionar o caminho de processamento errado ou fazer o trabalho falhar. O suporte a contêineres e codecs pode variar; se um arquivo de áudio ou vídeo falhar, converta‑o para um formato comum e tente novamente.

## Documentos gerados

Cada item gerado é projetado para ser uma unidade de conhecimento útil, em vez de uma transcrição página a página. Media Injector:

- Prioriza a identidade da origem, escopo, fatos principais, relacionamentos, exceções e distinções materiais.
- Combina fatos estreitamente relacionados em vez de criar um documento por rótulo, célula de tabela ou valor repetido.
- Ignora texto decorativo, paginação, resumos repetidos e metadados incidentais, a menos que alterem o significado.
- Preserva a linguagem, terminologia, datas exibidas e formatos numéricos da origem.
- Interrompe quando a origem não tem conhecimento materialmente novo para acrescentar.

Os documentos gerados são marcados para que possam ser identificados como conteúdo produzido automaticamente. Eles são então indexados como outros documentos da coleção e incidem o custo normal de incorporação de texto da coleção, além do processamento do Media Injector.

Para orientações de qualidade de recuperação após a ingestão, veja [Best Practices for RAG](http://localhost:1313/pt-br/docs/rag/best-practices.md). Em particular, inspecione documentos gerados a partir de tabelas, digitalizações e fontes com layouts repetidos antes de confiar neles em produção.

## Uso, preços e limites

O uso do Media Injector depende da origem, contexto opcional, perguntas e respostas geradas, reutilização de cache e tokens de mídia quando aplicável. A cobrança agrega entrada, entrada em cache, saída e uso de mídia para o trabalho de processamento sem expor o modelo de processamento subjacente. Consulte [Pricing](http://localhost:1313/pt-br/docs/pricing.md#media-injector) para as taxas finais.

A disponibilidade e os limites operacionais do Media Injector dependem da configuração da conta. Consulte [Pricing](http://localhost:1313/pt-br/docs/pricing.md) e [Plans and limits](http://localhost:1313/pt-br/docs/limits.md) antes de enviar arquivos em produção.
