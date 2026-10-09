---
{title: Coleta de Dados,linkTitle: coleta de dados,weight: 60,group: Introduction,sourceHash: 68dbfddd7578cafa,aliases: [/docs/pt-br/data-collecting.html]}
---

# Coleta de Dados

AIVAX oferece um programa opcional de coleta semântica de dados para contas que optam por contribuir com dados elegíveis de RAG e reranking para o desenvolvimento de modelos. Indexação e armazenamento de documentos estão fora deste programa. Todos os registros de RAG e reranking coletados são anonimizados antes de serem escritos no conjunto de dados de treinamento. A configuração está desativada por padrão e deve ser ativada por um Gerente de Conta autorizado — a pessoa que usa a conta AIVAX, não um papel na API.

## O que muda quando a coleta é ativada

Enquanto a configuração estiver ativada:

- o uso elegível de incorporação de consulta RAG recebe um desconto (veja [Pricing](/docs/pt-br/pricing#data-collection-discount));
- as operações elegíveis de reranking recebem o mesmo desconto; e
- indexação de documentos, armazenamento, inferência não relacionada, ferramentas e outros serviços mantêm seus preços regulares.

O desconto se aplica apenas às operações elegíveis realizadas enquanto a coleta está ativada. Desativar a coleta remove o desconto das operações futuras.

## Dados incluídos

Dependendo da operação, a IVAX pode coletar:

| Operação | Dados coletados |
| --- | --- |
| Busca semântica RAG | Termos de consulta, reranker selecionado e o conteúdo e pontuações de relevância dos documentos retornados. |
| Reranking | Consulta, documentos enviados, reranker selecionado e resultados de classificação. Metadados de resposta desconhecidos e informações de uso ou faturamento não são incluídos. |

O conjunto de dados anonimizado não armazena o ID da conta, chave de API, ID da solicitação, IDs de coleção ou documento, nomes de documentos, dados de faturamento ou timestamp da coleta. A conta é consultada de forma transitória apenas para verificar se a coleta está ativada e aplicar o desconto da operação elegível. Indexação de documentos e coleções armazenadas nunca são copiadas para o conjunto de dados de treinamento por este programa; o conteúdo do documento é incluído apenas quando enviado para reranking ou retornado por uma busca RAG.

Ativar esta configuração não inclui por si só complementos de chat não relacionados, conversas, chamadas de ferramentas ou outros recursos da conta no conjunto de dados de treinamento.

## Propósito e uso

AIVAX pode usar os dados coletados para desenvolver, treinar, ajustar fino, avaliar, testar e melhorar modelos e sistemas relacionados a incorporações, recuperação, classificação, reranking e outros processamentos semânticos. Isso pode incluir a preparação de conjuntos de dados, anotação ou transformação de registros, medição de qualidade e produção de artefatos agregados ou derivados.

O acesso é limitado a pessoal autorizado e provedores de serviço que suportam esses propósitos sob obrigações aplicáveis de confidencialidade e proteção de dados. AIVAX não vende dados semânticos coletados nem mantém um mapeamento conta‑para‑registro para este conjunto de dados.

## Responsabilidades do Gerente de Conta

Nos termos legais da AIVAX, o Gerente de Conta é a pessoa que usa a conta AIVAX. Antes de ativar a coleta, o Gerente de Conta deve:

- ter autoridade para aceitar essas condições para a conta;
- possuir uma base legal adequada para que a AIVAX use os dados enviados para os propósitos acima;
- fornecer quaisquer avisos e obter quaisquer permissões ou consentimentos necessários dos usuários finais ou de outros titulares de dados; e
- evitar o envio de credenciais, segredos, dados regulados ou dados pessoais sensíveis, a menos que sua coleta e uso sejam legalmente permitidos e necessários.

## Ativação, desativação e exclusão

O Gerente de Conta pode controlar a coleta em **Dashboard > My account > Semantic data collection**.

- A configuração está desativada por padrão.
- Ativá‑la autoriza a coleta anonimizada de futuras operações elegíveis de RAG e reranking.
- Desativá‑la interrompe a coleta nova e encerra o desconto para operações futuras.
- Desativá‑la não exclui automaticamente os registros coletados enquanto o consentimento estava ativo nem reverte o treinamento já concluído.

Como os identificadores de conta e os mapeamentos conta‑para‑registro não são armazenados, a AIVAX não pode recuperar ou excluir registros de treinamento apenas a partir de um ID de conta. Solicitações referentes a dados pessoais presentes no conteúdo semântico enviado podem ser enviadas para **privacy@aivax.net** ou **wm@aivax.net** e devem incluir informações suficientes para localizar o conteúdo, quando aplicável. Os registros de origem são retidos apenas pelo tempo razoavelmente necessário para os propósitos documentados, obrigações legais, segurança e requisitos de auditoria, e podem então ser excluídos. A exclusão de registros de origem não exige que a AIVAX re‑treine ou destrua modelos ou artefatos agregados que não identificam mais uma pessoa, exceto quando exigido por lei aplicável.

Consulte a [Privacy Policy](/docs/pt-br/legal/privacy-policy) e os [Terms of Use](/docs/pt-br/legal/terms-of-service) para os termos legais vigentes.
