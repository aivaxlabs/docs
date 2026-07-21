# Coleta de Dados

A AIVAX oferece um programa opcional de coleta de dados semânticos para contas que escolham contribuir com dados elegíveis de buscas RAG e Reflex para o desenvolvimento de modelos. A indexação de documentos e o armazenamento estão fora deste programa. Os registros coletados são desvinculados da conta de origem antes de serem gravados no conjunto de treinamento. A configuração permanece desabilitada por padrão e deve ser habilitada por um Gestor da Conta autorizado.

## O que muda quando a coleta é habilitada

Enquanto a configuração estiver habilitada:

- o uso elegível de embeddings de consulta do RAG recebe 10% de desconto;
- as buscas elegíveis do Reflex recebem 10% de desconto;
- o reranqueamento do RAG permanece com seu preço normal; e
- indexação de documentos, armazenamento, inferências, ferramentas e demais serviços não relacionados mantêm seus preços normais.

O desconto aplica-se somente às operações elegíveis realizadas enquanto a coleta estiver habilitada. Desabilitar a coleta remove o desconto das operações futuras.

## Dados incluídos

Dependendo da operação, a AIVAX poderá coletar:

| Operação | Dados coletados |
| --- | --- |
| Busca semântica RAG | Termos da consulta, reranqueador selecionado e conteúdos e pontuações de relevância dos documentos retornados. |
| Reflex | Consulta, documentos enviados e resultados de classificação. Metadados desconhecidos da resposta e informações de uso ou faturamento não são incluídos. |

O conjunto de treinamento não armazena identificador da conta, chave de API, identificador da solicitação, identificadores de coleção ou documento, nomes de documentos, dados de faturamento ou data e hora da coleta. A conta é consultada transitoriamente apenas para verificar se a coleta está habilitada e aplicar o desconto elegível de busca. A indexação de documentos e as coleções armazenadas nunca são copiadas para o conjunto de treinamento por este programa; o conteúdo de documentos é incluído somente quando enviado ao Reflex ou retornado por uma busca RAG.

Habilitar essa configuração não inclui, por si só, conclusões de chat, conversas, chamadas de ferramentas ou outros recursos não relacionados da conta no conjunto de treinamento.

> [!IMPORTANT]
> A anonimização em relação à conta não inspeciona nem remove informações do texto semântico enviado pelo Gestor da Conta. Uma consulta ou um documento ainda poderá conter nomes, contatos, segredos ou outras informações identificáveis. Não envie essas informações ao programa sem autorização para sua coleta e uso em treinamento.

## Finalidade e uso

A AIVAX poderá usar os dados coletados para desenvolver, treinar, ajustar, avaliar, testar e aprimorar modelos e sistemas relacionados a embeddings, recuperação, classificação, reranqueamento e outros processamentos semânticos. Isso poderá incluir preparação de conjuntos de dados, anotação ou transformação de registros, medição de qualidade e produção de artefatos agregados ou derivados.

O acesso fica limitado a pessoas autorizadas e prestadores de serviço que apoiem essas finalidades sob obrigações aplicáveis de confidencialidade e proteção de dados. A AIVAX não vende os dados semânticos coletados nem mantém um vínculo entre a conta e os registros desse conjunto.

## Responsabilidades do Gestor da Conta

Antes de habilitar a coleta, o Gestor da Conta deve:

- ter poderes para aceitar essas condições em nome da conta;
- possuir base legal adequada para que a AIVAX utilize os dados enviados nas finalidades acima;
- fornecer os avisos e obter as permissões ou os consentimentos exigidos de usuários finais ou outros titulares; e
- evitar o envio de credenciais, segredos, dados regulados ou dados pessoais sensíveis, salvo quando sua coleta e utilização forem legalmente permitidas e necessárias.

## Ativação, desativação e exclusão

O Gestor da Conta pode controlar a coleta em **Dashboard > My account > Semantic data collection**.

- A configuração permanece desabilitada por padrão.
- Habilitá-la autoriza a coleta das buscas elegíveis futuras de RAG e Reflex.
- Desabilitá-la interrompe novas coletas e encerra o desconto nas operações futuras.
- Desabilitá-la não exclui automaticamente os registros coletados durante a vigência do consentimento nem desfaz treinamentos já concluídos.

Como identificadores de conta e vínculos entre conta e registro não são armazenados, a AIVAX não consegue recuperar ou excluir registros de treinamento apenas a partir do identificador de uma conta. Solicitações relacionadas a dados pessoais presentes no conteúdo semântico enviado podem ser encaminhadas para **privacy@aivax.net** ou **wm@aivax.net** e deverão fornecer informações suficientes para localizar o conteúdo, quando aplicável. Os registros de origem são mantidos apenas pelo período razoavelmente necessário às finalidades documentadas e ao cumprimento de obrigações legais, de segurança e de auditoria, podendo depois ser excluídos ou submetidos a anonimização adicional. A exclusão dos registros de origem não obriga a AIVAX a treinar novamente ou destruir modelos ou artefatos agregados que já não identifiquem uma pessoa, salvo exigência da legislação aplicável.

Consulte a [Política de Privacidade](/docs/pt-br/legal/privacy-policy) e os [Termos de Uso](/docs/pt-br/legal/terms-of-service) para conhecer as condições legais aplicáveis.
