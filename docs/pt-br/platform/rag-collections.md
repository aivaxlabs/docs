# Coleções RAG

Use **Coleções RAG** para armazenar conhecimento pesquisável que os AI Gateways, clientes MCP e chamadas diretas da API RAG podem recuperar posteriormente. Uma coleção é o limite de uma base de conhecimento: ela agrupa documentos, estado de indexação, contexto, tags, testes de busca e histórico de recuperação em um só lugar.

Esta página é para construtores e operadores que gerenciam bases de conhecimento a partir do console AIVAX. Para esquemas de API, formato de importação JSONL e comportamento de recuperação mais detalhado, veja [Coleções e Documentos](/docs/pt-br/rag/collections) e [Busca semântica](/docs/pt-br/rag/semantic-search).

## Antes de começar

Faça login no [console AIVAX](https://console.aivax.net/) e abra **Dashboard > Coleções RAG**. Confirme a conta ativa antes de importar, redefinir, excluir ou reindexar uma coleção.

Antes de alterar uma coleção de produção, identifique:

- Quais AI Gateways, clientes de chat, fluxos de trabalho em lote, clientes MCP ou aplicações a utilizam.
- Se a alteração afeta documentos fonte, apenas metadados ou vetores gerados.
- Se os usuários estão consultando a coleção no momento.
- Se você precisa de uma exportação JSONL antes de fazer a alteração.
- Se a operação de importação ou reindexação pode gerar custo de indexação.

## Quando usar uma coleção

Use uma coleção quando um assistente ou aplicação precisar de respostas baseadas em conhecimento próprio da conta, como manuais de produtos, políticas, artigos de suporte, cláusulas contratuais, itens de catálogo, procedimentos operacionais ou informações específicas de locatário.

Uma coleção é útil quando o conhecimento deve ser:

- Pesquisável por significado semântico, não apenas por palavras‑chave exatas.
- Reutilizado por mais de um gateway ou integração.
- Mantido separadamente das instruções do gateway.
- Exportado, auditado, reimportado ou testado diretamente.
- Observado por meio de pontuações de recuperação e histórico de transações.

Não coloque todas as fontes em uma única coleção grande por padrão. Prefira coleções separadas quando o conhecimento tiver diferentes proprietários, ciclos de vida, idiomas, regras de acesso, ambientes ou expectativas de qualidade.

## Entender a lista de coleções

A página Coleções RAG mostra as coleções pertencentes à conta ativa.

| Coluna ou controle | Uso |
| --- | --- |
| **Nova coleção** | Crie uma coleção vazia antes de adicionar documentos. |
| **Filtrar colunas...** | Pesquise coleções pelo texto visível na tabela. |
| **Id.** | Forma curta de exibição do ID da coleção. Copie o ID completo ao integrar via API ou MCP. |
| **Nome** | Nome amigável da coleção exibido no console. |
| **Criado em** | Data e hora de criação. |
| **Estado atual** | Contagens de documentos indexados, enfileirados e desatualizados como barra de status segmentada. |
| **Visualizar** | Abra os detalhes da coleção, documentos, transações e configurações. |

Crie uma coleção com um nome que identifique seu propósito e ambiente, como `Help Center - Production` ou `Legal Policies - Internal`. O console requer um nome com pelo menos três caracteres.

## Criar uma coleção

Para criar uma coleção:

1. Selecione **Nova coleção**.
2. Insira um nome de coleção orientado ao propósito.
3. Confirme o diálogo.
4. Abra a nova coleção com **Visualizar**.

Confirme que a nova coleção aparece sob a conta ativa esperada e começa com o estado de documento esperado. Para bases de conhecimento de produção, considere criar coleções de teste e produção separadas para que você possa testar importações, fragmentação e qualidade de recuperação antes de alterar a coleção que os gateways ao usam.

## Navegar documentos

Abra **Visualizar** em uma coleção para acessar o espaço de trabalho da coleção. A aba **Navegar documentos** é a principal superfície de manutenção.

Os cartões de resumo mostram:

| Cartão | Significado |
| --- | --- |
| **Total de documentos** | Número de documentos atualmente armazenados na coleção. |
| **Cobertura de consultas** | Porção de transações RAG registradas que retornaram documentos. Use como sinal de qualidade, não como garantia completa de relevância. |
| **Desempenho médio** | Tempo médio de processamento de recuperação das transações RAG registradas. |
| **Pontuação média** | Pontuação média das transações RAG registradas. |

A tabela de documentos mostra o ID curto de cada documento, horário de atualização, nome, ID de referência, tags, pré‑visualização de conteúdo, estado de indexação e ações. Use a caixa de pesquisa por nome, ID ou texto do conteúdo. Use **Filtrar estado** para focar em todos, indexados ou enfileirados. Use **Ordenar por** para classificar por data de criação, atualização ou indexação em qualquer direção.

Use esta aba após importações para confirmar que os documentos chegaram, passaram de enfileirados para indexados e parecem fragmentos focados em vez de arquivos fonte completos colados em um único documento.

## Adicionar ou editar documentos

Selecione **Novo documento** para criar um documento manualmente, ou **Editar** em uma linha existente para atualizar um documento.

O editor de documentos possui:

| Campo ou controle | Uso |
| --- | --- |
| **Nome do documento** | Nome estável usado para identificar este documento em atualizações posteriores. |
| **Tags** | Rótulos de manutenção para filtragem e organização. |
| **ID de referência** | Identificador compartilhado para fragmentos relacionados da mesma fonte. |
| **Dividir múltiplas seções** | Na criação do documento, dividir texto separado por `---` em múltiplos documentos. |
| **Conteúdo do documento** | O texto que será indexado e recuperado. |
| **Informações do documento** | Contagem aproximada de tokens, custo estimado de indexação, contagem de palavras, caracteres e seções. |
| **Editar com IA** | Peça ao AIVAX para propor uma edição no texto do documento antes de salvar. |

Escreva documentos como fragmentos focados e autocontidos. Um documento recuperado deve conter contexto suficiente para que o modelo o use sem adivinhar o que veio antes ou depois. Se você colar uma página de manual longa, divida-a em seções temáticas primeiro. Se editar um documento existente que contém separadores de seção, o console avisa que salvar não o dividirá em múltiplos documentos.

Texto de documento alterado é enfileirado para indexação. Manutenção apenas de metadados pode evitar reindexação desnecessária quando feita via API. Para o comportamento exato de upsert e nomes de campos JSONL, veja [Campos do documento](/docs/pt-br/rag/collections#document-fields).

## Importar documentos

Use **Opções** no espaço de trabalho da coleção quando precisar importar ou exportar dados.

| Ação | Uso |
| --- | --- |
| **Importar de arquivos** | Envie imagens, áudio, vídeo ou PDFs para que o AIVAX extraia documentos com algoritmo OCR/extracção baseado em LLM. |
| **Importar de JSONL** | Envie documentos de texto preparados onde cada linha é um objeto JSON. |
| **Exportar para JSONL** | Baixe documentos da coleção para backup, migração, revisão ou processamento offline. Trate exportações como dados operacionais sensíveis. |
| **Ver código MCP** | Configure a coleção como fonte MCP através do endpoint de coleções MCP. |

Escolha **Importar de JSONL** quando sua aplicação ou pipeline de pré‑processamento já preparou fragmentos limpos. O diálogo de importação aceita um arquivo `.jsonl`, explica que documentos existentes não alterados são ignorados e estabelece um limite de arquivo de 10 000 documentos e 50 MB por arquivo. Limites de plano e API ainda podem ser aplicados; veja [Limites de importação em lote](/docs/pt-br/rag/collections#batch-import-limits).

Uma importação JSONL é um upsert. Se `docid` corresponde a um documento existente e `text` muda, o AIVAX atualiza esse documento e o enfileira para reindexação. Exporte primeiro, teste em uma coleção não‑produção quando possível e verifique colisões de `docid` antes de importar para produção.

Escolha **Importar de arquivos** quando precisar que o AIVAX extraia texto de mídia fonte. O diálogo aceita imagens, áudio, vídeo e PDFs, solicita um algoritmo de extração e inclui um campo **Contexto** para orientar a extração. Use o campo de contexto para descrever o que a fonte contém e o que deve ser preservado, não para adicionar instruções não relacionadas.

Faça upload apenas de arquivos que você tem permissão para processar com o AIVAX. Texto extraído torna‑se conteúdo da coleção e pode ser posteriormente recuperado por gateways, clientes MCP ou chamadas de API que usem a coleção.

> [!WARNING]
> Importações e atualizações de vetores podem consumir créditos. Exporte a coleção primeiro quando precisar de uma cópia de reversão e teste importações em uma coleção não‑produção quando o formato da fonte ou a estratégia de fragmentação for nova.

Trate o JSONL exportado da coleção como dado sensível. Ele pode conter texto fonte, dados de clientes, procedimentos internos, tags, referências e IDs de documentos. Armazene‑o com segurança e remova informações confidenciais antes de compartilhá‑lo fora da equipe que possui a base de conhecimento.

## Usar o playground

Selecione **Playground** no espaço de trabalho da coleção para testar a recuperação antes de anexar a coleção a um gateway de produção.

O playground permite configurar:

| Configuração | Uso |
| --- | --- |
| **Texto de busca** | A consulta que você deseja testar. Use linguagem realista de usuário. |
| **Pontuação mínima** | Pontuação mais baixa aceita para documentos retornados. Valores mais altos reduzem ruído mas podem ocultar resultados úteis. |
| **Resultados máximos** | Número de documentos a retornar. Mais resultados podem melhorar o recall mas aumentam o tamanho do contexto. |
| **Reranker** | Carregado do catálogo de API ao vivo. Reflex é o padrão; `none`, `lexical` e o `rrf` apenas RAG permanecem disponíveis junto aos modelos do provedor. |
| **Endpoint** | `/query` retorna documentos correspondentes; `/answer` pede ao modelo que responda usando documentos recuperados. |
| **Incluir referências fragmentadas** | Inclui fragmentos relacionados que compartilham referências quando habilitado. |

Use o playground como um filtro de qualidade:

1. Teste perguntas comuns de usuários.
2. Confirme que os documentos retornados são relevantes e específicos.
3. Compare `/query` e `/answer` quando precisar tanto de inspeção da fonte quanto do comportamento de resposta.
4. Ajuste pontuação, número de resultados, reranker, fragmentação de documentos ou contexto da coleção.
5. Anexe a coleção a um [AI Gateway](ai-gateways.md) somente depois que a recuperação for consistente.

A ação **Ver código** gera um exemplo rápido para o endpoint de playground selecionado. Use a referência de API abaixo como fonte de integração canônica, substitua marcadores e mantenha chaves de API em variáveis de ambiente antes de compartilhar ou confirmar exemplos.

## Configurar definições da coleção

Abra **Configurações** para gerenciar metadados ao nível da coleção.

| Configuração | Uso |
| --- | --- |
| **Nome da coleção** | Nome amigável usado no console e na conscientização da coleção pelo modelo. |
| **Contexto da coleção** | Uma dica que descreve o que a coleção contém para que modelos e operadores entendam seu propósito. |
| **Gerar contexto a partir de documentos** | Peça ao AIVAX para propor contexto e tags da coleção a partir de documentos existentes. Isso pode consumir créditos e analisar o conteúdo armazenado. Revise o diff proposto em busca de segredos, dados privados e instruções não desejadas antes de salvar. |
| **Tags da coleção** | Tags que categorizam a coleção como um todo. |
| **Salvar alterações** | Persistir nome, contexto e tags editados. |

Um bom contexto de coleção informa ao modelo do que a coleção trata e que tipo de respostas pode suportar. Mantenha‑o factual e conciso. Não coloque segredos, dados privados de clientes, credenciais ou instruções operacionais ocultas no contexto da coleção.

## Usar configurações avançadas com segurança

O menu **Configurações avançadas** contém ações de manutenção de alto impacto.

| Ação | Efeito | Uso quando |
| --- | --- | --- |
| **Atualizar documentos desatualizados** | Marca vetores desatualizados para que o trabalho de indexação reconstrua embeddings. O console avisa que isso pode gerar custo. | O comportamento de embedding mudou, documentos mostram estado desatualizado ou a qualidade da recuperação depende de vetores atualizados. |
| **Redefinir coleção** | Exclui todos os documentos pendentes e indexados, mas mantém o registro e a configuração da coleção. | Você quer manter a estrutura da coleção mas reconstruir seu conteúdo do zero. |
| **Excluir coleção** | Exclui a coleção e todos os documentos. Isso não pode ser desfeito pelo console. | A coleção não é mais usada por nenhum gateway, cliente, fluxo de trabalho ou aplicação. |

Antes de redefinir ou excluir:

1. Exporte a coleção para JSONL se puder precisar dos documentos depois.
2. Verifique AI Gateways e integrações que referenciam a coleção.
3. Confirme que nenhum tráfego de produção depende dela.
4. Prefira testar coleções de substituição antes de mudar coleções de produção.
5. Após a mudança, verifique o comportamento do gateway e as transações da coleção.

## Revisar transações RAG

Use a aba **Transações** para entender como a coleção está sendo realmente pesquisada.

A aba inclui:

| Controle ou coluna | Significado |
| --- | --- |
| **Visualizar** | Alterna entre visualizações `Recentes`, `Baixa qualidade` e `Alta qualidade`. |
| **Atualizar** | Recarrega a visualização de transação selecionada. |
| **Exportar JSONL** | Baixa a visualização de transação selecionada para revisão offline. |
| **ID** | Identificador da transação. |
| **Momento** | Quando a recuperação ocorreu. |
| **Pontuação original** | Pontuação de recuperação inicial antes do reranking. |
| **Pontuação do reranker** | Pontuação atribuída pelo reranker quando usado. |
| **Consulta** | Consulta de busca registrada para a transação. |
| **Resultados** | Número de documentos retornados. |
| **Detalhes** | Abre temporização, custo, pontuação, reranker e detalhes dos documentos correspondentes. |

Use **Baixa qualidade** para encontrar consultas que precisam de melhores documentos, limites de pontuação mais baixos, fragmentação diferente, contexto de coleção mais claro ou um reranker diferente. Use **Alta qualidade** para identificar exemplos que valem ser reutilizados como testes de regressão. A visibilidade das transações está sujeita à retenção do plano da conta; revise [Planos e limites](/docs/pt-br/limits) ao planejar monitoramento ou frequência de exportação.

O diálogo de detalhes pode mostrar ID da solicitação, texto da consulta, tempo de processamento, custo, pontuação original, pontuação do reranker, pontuação final, nome do reranker, IDs de documentos correspondentes, nomes dos documentos, pontuações e pré‑visualizações de conteúdo. Trate transações exportadas como dados operacionais: remova texto de usuário, dados de clientes e identificadores internos antes de compartilhar fora da sua equipe.

## Usar coleções via MCP

A ação **Ver código MCP** gera uma configuração MCP para consultar a coleção através de `/v1/mcp/collections`. A configuração gerada inclui cabeçalhos da coleção como ID, nome, top‑k, pontuação mínima e comportamento de referência.

Trechos MCP gerados podem incluir a chave de sessão do console atual no cabeçalho `Authorization`. Substitua-a por `YOUR_AIVAX_API_KEY` ou uma variável de ambiente antes de compartilhar, salvar ou confirmar a configuração. Não compartilhe URLs ou trechos de console que contenham valores `api-key` ou `Authorization`. Se uma chave real, URL com sessão ou trecho com sessão foi exposto, rotacione ou revogue a credencial afetada.

Mantenha o acesso MCP somente leitura por padrão. Não habilite escrita na coleção para assistentes gerais ou clientes não confiáveis. Ferramentas MCP com escrita podem criar, atualizar ou excluir documentos da coleção. Use uma credencial dedicada com o acesso mínimo necessário e rotacione‑a se for exposta.

## Solução de problemas

| Sintoma | Verificação | Correção |
| --- | --- | --- |
| A coleção não aparece na lista | Conta ativa, alternador de conta e limite de coleções para o plano atual. | Troque para a conta esperada ou crie a coleção na conta correta. |
| Documentos permanecem enfileirados | Volume de indexação, saldo da conta, limites diários de inserção RAG, tamanho do documento e tempo de processamento em segundo plano. | Aguarde a indexação, reduza o tamanho da importação, aumente o saldo ou divida a importação em lotes menores. |
| Busca não retorna documentos | Formulação da consulta, estado de indexação, pontuação mínima, ID da coleção e se a coleção correta está selecionada. | Diminua temporariamente a pontuação mínima, teste formulações mais amplas, confirme que os documentos estão indexados e inspecione o conteúdo dos documentos. |
| Busca retorna documentos irrelevantes | Tamanho do fragmento, contexto do documento, tags, referências, reranker, limite de pontuação e estratégia de consulta no gateway. | Divida documentos extensos, melhore o texto fonte, compare o modelo padrão Reflex com lexical ou outro modelo do catálogo e aumente deliberadamente a pontuação mínima. |
| Resposta do gateway ignora a coleção | Aba RAG do gateway, IDs de coleções anexadas, estratégia de consulta, resultados máximos, pontuação mínima e instruções de prompt. | Teste a coleção diretamente no playground, depois reteste o mesmo prompt através do gateway. |
| Importação pula registros | Nomes de documentos existentes com conteúdo unchangedado, formato JSONL, campos obrigatórios ausentes ou limites de tamanho/linha do arquivo. | Valide o arquivo JSONL, altere o texto do documento quando a reindexação for pretendida e divida arquivos grandes. |
| Redefinição feita por engano | Se existe exportação JSONL e se os gateways ainda referenciam a mesma coleção. | Reimporte a exportação mais recente na mesma coleção, aguarde a indexação e reteste os gateways afetados. |
| Coleção excluída por engano | Se existe exportação JSONL e quais gateways, clientes MCP ou chamadores de API referenciavam o ID da coleção excluída. | Recrie a coleção, reimporte a exportação mais recente, aguarde a indexação e atualize toda integração que usava o antigo ID da coleção. |
| Cliente MCP não consegue consultar a coleção | Chave de API, cabeçalhos gerados, ID da coleção, pontuação mínima, top‑k e comportamento de referência. | Substitua credenciais de sessão por uma chave de API privada, verifique os cabeçalhos e teste a mesma consulta no playground do console. |

## Referência de API

Crie, inspecione, edite, exporte, redefina, exclua e reindexe coleções através da API de Coleções:

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Collections&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Collection&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Collection%20Details&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Edit%20Collection&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Export%20Collection&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Reset%20Collection&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Update%20Collection%20Vectors&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Collection&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Reveja a atividade de transações RAG através dos endpoints de transação da coleção:

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Collection%20RAG%20Transactions&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=View%20Collection%20RAG%20Transaction&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Export%20Collection%20RAG%20Transactions&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Gerencie documentos da coleção através da API de Documentos:

<script src="https://inference.aivax.net/apidocs?embed-target=Index%20Documents%20(JSONL)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Browse%20Documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Document&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20or%20Update%20Document&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Document&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Teste a recuperação através da API RAG:

<script src="https://inference.aivax.net/apidocs?embed-target=Semantic%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Answer%20generation&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Documentação relacionada:

- [Coleções e Documentos](/docs/pt-br/rag/collections): comportamento técnico de coleções e documentos.
- [Busca semântica](/docs/pt-br/rag/semantic-search): parâmetros de consulta, reranking, referências e geração de respostas.
- [AI Gateways](ai-gateways.md): anexar coleções a configurações de assistentes.
- [Conta, saldo e múltiplas contas](/account-balance.md): gerenciar saldo, limites e chaves de API.