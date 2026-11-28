Source: https://docs.aivax.net/pt-br/docs/pricing/data-sharing.html

# Compartilhamento de Dados

A AIVAX oferece um programa opcional de coleta de dados semânticos para contas que optam por contribuir com dados elegíveis de RAG (Retrieval-Augmented Generation) e reranking para o desenvolvimento de modelos. Em troca, as operações elegíveis recebem um desconto. O indexamento e o armazenamento de documentos estão fora deste programa. Todos os registros de RAG e reranking coletados são anonimizados antes de serem escritos no conjunto de dados de treinamento.

A configuração vem desativada por padrão. Ela deve ser habilitada por um Gerente de Conta autorizado, ou seja, a pessoa que utiliza a conta da AIVAX, não uma função na API.

## O que muda quando a coleta é habilitada

Enquanto a configuração estiver habilitada:

- o uso de embeddings para consultas de RAG elegível recebe um desconto (consulte [Preços](https://docs.aivax.net/pt-br/docs/pricing/product-pricing.md#data-sharing-discount));
- as operações de reranking elegíveis recebem o mesmo desconto; e
- o indexamento de documentos, armazenamento, inferência não relacionada, ferramentas e outros serviços mantêm seus preços regulares.

O desconto aplica-se apenas às operações elegíveis realizadas enquanto a coleta estiver habilitada. Desabilitar a coleta remove o desconto das operações futuras.

## Dados incluídos

Dependendo da operação, a AIVAX pode coletar:

| Operação | Dados coletados |
| --- | --- |
| Busca semântica RAG | Termos da consulta, reranker selecionado e o conteúdo e as pontuações de relevância dos documentos retornados. |
| Reranking | Consulta, documentos submetidos, reranker selecionado e resultados do ranqueamento. Metadados de resposta desconhecidos e informações de uso ou faturamento não estão incluídos. |

O conjunto de dados anonimizado não armazena o ID da conta, chave de API, ID da solicitação, IDs de coleção ou documento, nomes de documentos, dados de faturamento ou carimbo de tempo da coleção. A conta é consultada apenas transitivamente para verificar se a coleta está habilitada e aplicar o desconto à operação elegível. O indexamento de documentos e as coleções armazenadas nunca são copiados para o conjunto de dados de treinamento por este programa; o conteúdo do documento é incluído apenas quando é submetido para reranking ou retornado por uma busca RAG.

Habilitar esta configuração não inclui, por si só, conclusões de chat não relacionadas, conversas, chamadas de ferramenta ou outros recursos da conta no conjunto de dados de treinamento.

## Propósito e uso

A AIVAX pode usar os dados coletados para desenvolver, treinar, ajustar finamente, avaliar, testar e melhorar modelos e sistemas relacionados a embeddings, recuperação, ranqueamento, reranking e outro processamento semântico. Isso pode incluir preparar conjuntos de dados, anotar ou transformar registros, medir a qualidade e produzir artefatos agregados ou derivados.

O acesso é limitado ao pessoal autorizado e aos provedores de serviços que apoiam esses propósitos sob obrigações aplicáveis de confidencialidade e proteção de dados. A AIVAX não vende os dados semânticos coletados nem mantém um mapeamento de conta para registro para este conjunto de dados.

## Responsabilidades do Gerente de Conta

Nos termos legais da AIVAX, o Gerente de Conta é a pessoa que utiliza a conta da AIVAX. Antes de habilitar a coleta, o Gerente de Conta deve:

- ter autoridade para aceitar estas condições para a conta;
- ter uma base legal adequada para que a AIVAX use os dados submetidos para os fins acima;
- fornecer quaisquer avisos e obter quaisquer permissões ou consentimentos necessários de usuários finais ou outros titulares de dados; e
- evitar enviar credenciais, segredos, dados regulamentados ou dados pessoais sensíveis, a menos que sua coleta e uso sejam legalmente permitidos e necessários.

## Habilitação, desabilitação e exclusão

O Gerente de Conta pode controlar a coleta em **Painel > Minha conta > Coleta de dados semânticos**.

- A configuração vem desativada por padrão.
- Habilitá-la autoriza a coleta anonimizada de futuras operações de RAG e reranking elegíveis.
- Desabilitá-la interrompe a nova coleta e encerra o desconto para operações futuras.
- Desabilitá-la não exclui automaticamente os registros coletados enquanto o consentimento estava ativo nem reverte o treinamento já concluído.

Como os identificadores da conta e os mapeamentos de conta para registro não são armazenados, a AIVAX não pode recuperar ou excluir registros de treinamento apenas a partir de um ID de conta. Solicitações relativas a dados pessoais presentes dentro do conteúdo semântico submetido podem ser enviadas para **privacy@aivax.net** ou **wm@aivax.net**. Quando aplicável, inclua informações suficientes para localizar o conteúdo.

Os registros de origem são retidos apenas pelo tempo razoavelmente necessário para os fins documentados, obrigações legais, segurança e requisitos de auditoria, podendo então ser excluídos. A exclusão de registros de origem não exige que a AIVAX re treine ou destrua modelos ou artefatos agregados que já não identifiquem uma pessoa, exceto onde exigido pela lei aplicável.

Consulte a [Política de Privacidade](https://docs.aivax.net/pt-br/docs/legal/privacy-policy.md) e os [Termos de Uso](https://docs.aivax.net/pt-br/docs/legal/terms-of-service.md) para os termos legais regentes.
