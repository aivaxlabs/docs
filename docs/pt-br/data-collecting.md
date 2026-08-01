# Coleta de Dados

AIVAX oferece um programa opcional de coleta de dados semânticos para contas que optam por contribuir com dados elegíveis de RAG e reclassificação para o desenvolvimento do modelo. Indexação e armazenamento de documentos estão fora deste programa. Todos os registros de RAG e reclassificação coletados são anonimados antes de serem gravados no conjunto de dados de treinamento. A configuração está desativada por padrão e deve ser ativada por um Gerente de Conta autorizado.

## O que muda quando a coleta está ativada

Enquanto a configuração está ativada:

- o uso elegível de incorporação de consulta RAG recebe um desconto de 10 %;
- as operações elegíveis de reclassificação recebem um desconto de 10 %; e
- a indexação de documentos, armazenamento, inferência não relacionada, ferramentas e outros serviços mantêm seus preços normais.

O desconto se aplica apenas às operações elegíveis realizadas enquanto a coleta está ativada. Desativar a coleta remove o desconto das operações futuras.

## Dados incluídos

Dependendo da operação, a AIVAX pode coletar:

| Operação | Dados coletados |
| --- | --- |
| Busca semântica RAG | Termos de consulta, reclassificador selecionado e o conteúdo e as pontuações de relevância dos documentos retornados. |
| Reclassificação | Consulta, documentos submetidos, reclassificador selecionado e resultados de classificação. Metadados de resposta desconhecidos e informações de uso ou faturamento não são incluídos. |

O conjunto de dados anonimizado não armazena o ID da conta, chave de API, ID da solicitação, IDs de coleção ou documento, nomes de documentos, dados de faturamento ou marca temporal da coleta. A conta é consultada de forma transitória apenas para verificar se a coleta está ativada e aplicar o desconto da operação elegível. A indexação de documentos e as coleções armazenadas nunca são copiadas para o conjunto de dados de treinamento por este programa; o conteúdo do documento é incluído apenas quando submetido para reclassificação ou retornado por uma busca RAG.

Habilitar esta configuração não inclui, por si só, respostas de chat não relacionadas, conversas, chamadas de ferramentas ou outros recursos da conta no conjunto de dados de treinamento.

## Propósito e uso

A AIVAX pode usar os dados coletados para desenvolver, treinar, ajustar, avaliar, testar e melhorar modelos e sistemas relacionados a incorporações, recuperação, classificação, reclassificação e outro processamento semântico. Isso pode incluir a preparação de conjuntos de dados, anotação ou transformação de registros, medição de qualidade e produção de artefatos agregados ou derivados.

O acesso é limitado a pessoal autorizado e provedores de serviço que suportam esses fins sob obrigações aplicáveis de confidencialidade e proteção de dados. A AIVAX não vende dados semânticos coletados nem mantém um mapeamento conta‑para‑registro para este conjunto de dados.

## Responsabilidades do Gerente de Conta

Antes de habilitar a coleta, o Gerente de Conta deve:

- ter autoridade para aceitar estas condições para a conta;
- possuir uma base legal adequada para que a AIVAX use os dados submetidos para os fins acima;
- fornecer quaisquer avisos e obter as permissões ou consentimentos necessários dos usuários finais ou de outros titulares de dados; e
- evitar submeter credenciais, segredos, dados regulados ou dados pessoais sensíveis, a menos que sua coleta e uso sejam legalmente permitidos e necessários.

## Habilitar, desativar e excluir

O Gerente de Conta pode controlar a coleta em **Dashboard > My account > Semantic data collection**.

- A configuração está desativada por padrão.
- Habilitá‑la autoriza a coleta anonimizada de futuras operações elegíveis de RAG e reclassificação.
- Desativá‑la interrompe a coleta nova e encerra o desconto para operações futuras.
- Desativá‑la não exclui automaticamente os registros coletados enquanto o consentimento estava ativo nem reverte o treinamento já concluído.

Como identificadores de conta e mapeamentos conta‑para‑registro não são armazenados, a AIVAX não pode recuperar ou excluir registros de treinamento apenas a partir de um ID de conta. Solicitações referentes a dados pessoais presentes em conteúdo semântico submetido podem ser enviadas para **privacy@aivax.net** ou **wm@aivax.net** e devem incluir informações suficientes para localizar o conteúdo, quando aplicável. Registros de origem são mantidos apenas pelo tempo razoavelmente necessário para os fins documentados, obrigações legais, segurança e requisitos de auditoria, e podem ser excluídos posteriormente. A exclusão de registros de origem não exige que a AIVAX re‑treine ou destrua modelos ou artefatos agregados que não identifiquem mais uma pessoa, exceto quando exigido por lei aplicável.

Consulte a [Política de Privacidade](/docs/pt-br/legal/privacy-policy) e os [Termos de Uso](/docs/pt-br/legal/terms-of-service) para os termos legais vigentes.