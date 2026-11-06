---
{title: Política de Privacidade,linkTitle: Política de Privacidade,weight: 10,group: Legal documents,sourceHash: 903395b6e61b9474,aliases: [/docs/pt-br/legal/privacy-policy.html]}
---

# Política de Privacidade

Revisão: 1.4
Data de vigência: 1º de agosto de 2026
Última atualização anterior: 20 de julho de 2026
Última atualização: 26 de setembro de 2026

---

Bem-vindo à AIVAX. Esta Política de Privacidade descreve como a AIVAX coleta, usa, armazena, compartilha e protege informações em seus serviços de inferência de IA. Ela foi redigida com transparência e clareza técnica e não constitui aconselhamento jurídico. Os Gerentes de Conta devem revisar esta política com seus próprios conselheiros jurídicos quando necessário.

Ao utilizar os serviços da AIVAX, o Gerente de Conta reconhece e concorda com os termos desta política.

### 1. Definições

- **AIVAX:** Empresa que fornece a plataforma e os serviços de orquestração de modelos de IA.
- **Gerente de Conta da AIVAX ("Gerente de Conta"):** Pessoa física ou jurídica que cria e administra a conta e integra a API.
- **Usuário Final:** Indivíduo que interage com o aplicativo do Gerente de Conta que consome a API da AIVAX.
- **Dados da Conta:** Dados de registro e administrativos, como nome, e-mail, empresa, cargo, identificadores internos, preferências e configurações de chave de API.
- **Dados de Faturamento:** Dados necessários para faturas, recibos, saldo da conta, créditos, eventos de pagamento e processamento de pagamentos por meio de processadores terceirizados.
- **Dados de Inferência:** Entradas enviadas aos modelos e as saídas resultantes. Nos Termos de Uso, isso corresponde ao Conteúdo de Entrada e ao Conteúdo Gerado.
- **Dados de Treinamento Semântico:** Conteúdo RAG (Recuperação Aumentada por Geração) e de reranking elegível, anonimizado, coletado após o Gerente de Conta ativar a coleta de dados semânticos, conforme descrito em [Coleta de Dados](/docs/pt-br/data-sharing). A indexação e o armazenamento de documentos estão excluídos.
- **Conversas:** Sequências armazenadas de interações de inferência, incluindo mensagens, metadados, nome do modelo, objeto de uso, ferramentas, recursos e informações de erro quando o registro de conversas estiver habilitado.
- **Metadados Técnicos:** Logs de inferência e acesso, endereços IP ou informações de encaminhamento, strings do user-agent, carimbos de data/hora, latência, identificadores de sessão, uso de tokens, códigos de resposta, identificadores de solicitação e sinais de segurança ou abuso.
- **Processador:** A AIVAX quando processa dados de acordo com as instruções do Gerente de Conta.
- **Controlador:** A AIVAX quando define finalidades para dados de conta, faturamento, segurança e conformidade.
- **Subprocessador:** Terceiro contratado ou configurado pela AIVAX para apoiar o processamento, como infraestrutura, e-mail, faturamento, provedores de modelos, provedores de pesquisa ou armazenamento de objetos.

---

### 2. Papéis de Processamento

| Tipo de Dado | Papel da AIVAX | Papel do Gerente de Conta |
| --- | --- | --- |
| Dados da Conta | Controlador | Titular dos dados ou controlador de seu próprio relacionamento interno |
| Dados de Faturamento | Controlador para finalidades legais, contratuais e operacionais de faturamento | Fornece e verifica |
| Dados de Inferência / Conversas | Processador para processamento direcionado pelo cliente; Controlador para segurança, prevenção de abuso e logs operacionais, quando aplicável | Controlador do conteúdo e da finalidade |
| Dados de Treinamento Semântico | Controlador para desenvolvimento de modelos e sistemas semânticos com base no consentimento do Gerente de Conta | Controlador do conteúdo de origem e responsável pela base legal e pelos avisos necessários aos usuários finais |
| Metadados Técnicos | Controlador para segurança, confiabilidade, prevenção de abuso e operações da plataforma; Processador quando gerado como parte da execução do serviço | Controlador do contexto do aplicativo de origem |

Ao atuar como Processador, a AIVAX segue as instruções do Gerente de Conta expressas por meio de chamadas de API, configurações do painel, seleção de modelos e integrações configuradas.

Para consistência contratual, os Dados de Inferência nesta política correspondem ao Conteúdo de Entrada e ao Conteúdo Gerado nos Termos de Uso.

---

### 3. Categorias de Dados Coletados

1. **Fornecidos diretamente pelo Gerente de Conta:** Dados da Conta, preferências, configurações da conta, informações da organização, chaves de API geradas e credenciais armazenadas como hashes ou tokens, quando aplicável.
2. **Gerados pelo uso:** Metadados técnicos, registros de uso, contagens de tokens, latência, uso de modelos, recursos de solicitação, informações de erro e eventos de faturamento.
3. **Dados de Inferência e Conversas:** Texto e outros conteúdos enviados aos modelos e as saídas dos modelos são processados para executar solicitações. O conteúdo das conversas e o histórico de mensagens são coletados e registrados apenas quando o Gerente de Conta habilita o recurso de observabilidade ("Conversas") para a solicitação ou globalmente para a conta, conforme descrito na Seção 5.
4. **Dados de Treinamento Semântico:** Termos de consulta RAG anonimizados, conteúdos e pontuações de relevância de documentos retornados por uma pesquisa, reranker selecionado, consultas de reranking, documentos submetidos e resultados de classificação coletados enquanto a coleta de dados semânticos está habilitada. A indexação e o armazenamento de documentos não são coletados. Esses registros anonimizados excluem identificadores de conta, chave de API, solicitação, coleção e documento, nomes de documentos, dados de faturamento e carimbos de data/hora de coleta.
5. **Suporte e Comunicação:** Mensagens de tickets, e-mails enviados aos canais de suporte ou contato e comunicações operacionais.
6. **Faturamento:** Dados fiscais, de pagamento, fatura, crédito, saldo da conta, intenção de pagamento e webhook de pagamento.
7. **Dados Agregados ou Anonimizados:** Métricas derivadas que não identificam o Gerente de Conta ou os usuários finais.

A AIVAX não requer categorias especiais de dados pessoais sensíveis. Se o Gerente de Conta enviar dados pessoais sensíveis nos Dados de Inferência, o Gerente de Conta é responsável por ter a base legal adequada e os avisos necessários.

---

### 4. Finalidades, Bases Legais e Retenção

| Categoria | Finalidade Principal | Base Legal (LGPD) | Retenção Técnica ou Limite |
| --- | --- | --- | --- |
| Dados da Conta | Criação de conta, autenticação, gerenciamento de conta, comunicações operacionais | Execução contratual / interesse legítimo | Enquanto a conta estiver ativa; contas desativadas ou inativas podem ser excluídas por limpeza agendada de acordo com as regras da plataforma |
| Dados de Faturamento | Faturas, créditos, confirmação de pagamento, prevenção de fraude, registros fiscais e contábeis | Obrigações legais / execução contratual | De acordo com requisitos legais, contábeis e contratuais |
| Metadados Técnicos | Segurança, prevenção de abuso, depuração, confiabilidade, limitação de taxa, contabilização de custos | Interesse legítimo / execução contratual | Logs de inferência e acesso e metadados, incluindo endereços IP e strings do user-agent, são retidos por até 1 ano |
| Dados de Inferência | Execução da inferência solicitada e integrações configuradas | Execução contratual | Processados para a solicitação e podem ser armazenados dentro das Conversas quando o registro de conversas estiver habilitado |
| Dados de Treinamento Semântico | Desenvolver, treinar, ajustar, avaliar, testar e melhorar modelos e sistemas de recuperação ou classificação semântica | Consentimento | Retidos na forma anonimizada enquanto razoavelmente necessário para essas finalidades, obrigações legais, segurança e auditorias; depois excluídos |
| Conversas | Monitoramento, suporte, exportação, depuração, revisão de uso e histórico visível ao usuário | Interesse legítimo / execução contratual | Visível/exportável de acordo com a retenção do plano: Grátis até 2 horas, Pro até 2 dias, Max até 14 dias, Ultimate até 30 dias |
| Suporte | Resolver dúvidas, incidentes e solicitações de conformidade | Execução contratual / interesse legítimo | Retidos conforme necessário para resolver a solicitação e manter registros comerciais |
| Dados Agregados ou Anonimizados | Planejamento de capacidade, confiabilidade, prevenção de abuso, melhoria do serviço | Fora do escopo da LGPD quando irreversivelmente anonimizados | Indeterminado enquanto anonimizados |

Os períodos de exportação de conversas são de 2 horas, 1 dia, 7 dias e 30 dias, limitados pelo período de retenção do plano da conta.

---

### 5. Registro e Exclusão de Conversas

A AIVAX coleta e registra conversas apenas quando o Gerente de Conta habilita o recurso de observabilidade ("Conversas"), seja para a solicitação individual ou globalmente para a conta. Se não estiver habilitado para a solicitação ou por meio da configuração geral da conta, a AIVAX não coleta, registra ou armazena o conteúdo da conversa dessa solicitação. O processamento de entradas e saídas para executar a inferência não cria um registro de conversa armazenado.

A AIVAX não pode recuperar ou fornecer conversas que não foram coletadas porque esse recurso não estava habilitado, inclusive em resposta a uma ordem judicial. Os logs técnicos e metadados descritos na Seção 4 são separados do conteúdo das conversas. A divulgação de conversas armazenadas às autoridades está sujeita aos requisitos de ordem judicial na Seção 7.1.

O Gerente de Conta autenticado pode listar, visualizar, exportar e excluir conversas armazenadas por meio da API de conversas, sujeito a autorização e janelas de retenção. Excluir uma conversa remove o registro de conversa correspondente para essa conta do armazenamento de produção.

---

### 6. RAG, Memórias e Armazenamento

A AIVAX pode armazenar coleções RAG, documentos, embeddings, metadados de documentos, memórias do usuário, descrições de mídia, dados de sessão de chat web e arquivos de workspace shell quando esses recursos forem usados.

A contabilidade atual de armazenamento inclui:

- Texto de documentos RAG e bytes de embedding.
- Informações persistentes do usuário.
- Descrições de mídia.
- Mensagens de sessão de chat web, contexto extra e metadados.
- Arquivos shell da conta.

As cotas de armazenamento são baseadas no plano. O armazenamento incluído atual é de 30 MB para Grátis, 2 GB para Pro, 10 GB para Max e 20 GB para Ultimate.

---

### 7. Coleta Opcional de Dados Semânticos e Treinamento de Modelos

Por padrão, a AIVAX não utiliza os Dados de Inferência ou as Conversas do Gerente de Conta para treinar modelos proprietários da AIVAX. Quando um Gerente de Conta autorizado habilita a coleta de dados semânticos, a AIVAX pode usar registros RAG e de reranking elegíveis e anonimizados gerados enquanto a configuração estiver habilitada para as finalidades descritas em [Coleta de Dados](/docs/pt-br/data-sharing). A indexação e o armazenamento de documentos RAG não estão incluídos e não recebem desconto programático.

Antes do armazenamento, a AIVAX anonimiza esses registros removendo o relacionamento da conta e excluindo identificadores operacionais, nomes de documentos, dados de faturamento e carimbos de data/hora de coleta. A conta é consultada apenas para verificar o consentimento e aplicar o desconto elegível. A AIVAX não retém um mapeamento de conta para registro.

A configuração é desativada por padrão. Desativá-la interrompe a nova coleta, mas não exclui automaticamente os registros coletados enquanto o consentimento estava ativo nem reverte o treinamento já concluído. Como os mapeamentos de conta para registro não são armazenados, a AIVAX não pode localizar um registro de treinamento apenas a partir de um ID de conta. O Gerente de Conta permanece responsável pela base legal, avisos e permissões necessárias para os dados pessoais submetidos por seus usuários finais. Solicitações relativas a dados pessoais presentes dentro do conteúdo semântico podem ser enviadas para **privacy@aivax.net** ou **wm@aivax.net** com informações suficientes para localizar o conteúdo, quando aplicável.

Provedores de modelos terceiros e agregadores podem ter seus próprios termos de processamento, termos de retenção e políticas de melhoria de modelo independentemente deste programa opcional. O Gerente de Conta deve revisar a política do provedor selecionado antes de enviar dados pessoais ou sensíveis.

---

### 7.1. Ordens Judiciais e Solicitações de Autoridades Estrangeiras

Para divulgação judicial de dados da conta, a AIVAX executa apenas ordens emitidas por tribunais brasileiros competentes. Ordens emitidas em outros países devem ser submetidas por meio dos tribunais brasileiros e resultar em uma ordem de tribunal brasileiro antes que a AIVAX divulgue os dados. Uma ordem estrangeira por si só não autoriza a divulgação.

Autoridades judiciais estrangeiras podem solicitar a preservação de logs existentes por até 1 ano enquanto buscam os procedimentos aplicáveis por meio dos tribunais brasileiros. A preservação não é divulgação e não autoriza a coleta ou reconstrução do conteúdo de conversas que não foram registradas.

Para cumprir uma ordem de tribunal brasileiro, a AIVAX pode fornecer os seguintes dados, limitados ao escopo da ordem e aos registros realmente disponíveis:

- **Logs e metadados técnicos:** Até 1 ano de logs e metadados de inferência e acesso, incluindo endereços IP e strings do user-agent. Esses registros não implicam que o conteúdo da conversa foi coletado.
- **Conversas armazenadas:** Apenas conversas coletadas enquanto o Gerente de Conta havia habilitado "Conversas" para a solicitação ou globalmente para a conta, e que permanecem disponíveis. A AIVAX fornece essas conversas às autoridades apenas sob uma ordem de tribunal brasileiro; ela não pode fornecer conversas que nunca foram coletadas.
- **Outras informações da conta e recursos armazenados:** Informações da conta, memórias do usuário, gateways de IA e suas configurações, coleções RAG e documentos e outros recursos armazenados da conta. Os registros disponíveis podem incluir backups com histórico de até 3 meses, conforme descrito na Seção 21.

Esses períodos descrevem os limites da retenção disponível, não uma garantia de que cada registro exista durante todo o período. Um pedido de preservação não restaura registros que nunca foram coletados ou que não estão mais disponíveis.

---

### 8. Direitos do Titular dos Dados (Art. 18, LGPD)

Quando a AIVAX atua como Controlador, os titulares dos dados podem solicitar confirmação de processamento, acesso, correção, anonimização, bloqueio ou exclusão, portabilidade, informações sobre compartilhamento, revogação de consentimento, quando aplicável, oposição ao processamento baseado em interesse legítimo e revisão de decisões automatizadas, quando aplicável.

Canal: **privacy@aivax.net** ou **wm@aivax.net** (Encarregado de Proteção de Dados). Podemos solicitar verificação de identidade. Para dados onde a AIVAX atua como Processador, a AIVAX pode direcionar o titular dos dados ao Gerente de Conta Controlador.

---

### 9. Encarregado de Proteção de Dados (DPO)

Encarregado de Proteção de Dados (Art. 41): **(Identidade Anonimizada)**
Contato: **wm@aivax.net**

As funções incluem comunicação com titulares de dados e com a ANPD, orientação interna de conformidade e apoio para avaliações de impacto à privacidade.

---

### 10. Subprocessadores e Provedores de Terceiros

A AIVAX usa serviços de terceiros para infraestrutura, armazenamento de objetos, e-mail transacional, faturamento, pesquisa na web, geração de imagens, reranking e inferência de modelos de IA. A lista técnica atual é mantida em [Processadores de Dados](/docs/pt-br/legal/third-party-processors).

Ao selecionar um modelo ou habilitar uma ferramenta, o Gerente de Conta pode fazer com que o conteúdo seja enviado ao provedor de modelo, agregador ou provedor de ferramenta selecionado. A AIVAX não controla as políticas de terceiros e recomenda a revisão prévia.

---

### 11. Transferências Internacionais de Dados

Os dados podem ser processados ou armazenados fora do Brasil dependendo da infraestrutura selecionada, provedor de modelo, provedor de pesquisa, provedor de armazenamento de objetos ou provedor de pagamento. A AIVAX aplica salvaguardas técnicas e contratuais apropriadas ao serviço, incluindo controles de acesso, criptografia em trânsito, minimização e segregação lógica, quando aplicável.

---

### 12. Segurança da Informação

Principais medidas incluem:

- Criptografia em trânsito com HTTPS/TLS.
- Autenticação por chave de API e autorização baseada na conta.
- Acesso administrativo baseado em papéis.
- Limitação de taxa para inferência, pesquisa RAG, inserção de documentos, ferramentas e operações de pagamento.
- Verificações de saldo, saldo mínimo e cota de armazenamento antes de operações que incorram em custos.
- Logs operacionais e relatórios de erro para solução de problemas e prevenção de abuso.
- Separação entre recursos de propriedade da conta, como coleções, documentos, conversas, memórias e arquivos shell.
- Configuração segura de credenciais por meio de parâmetros de inicialização do aplicativo, em vez de segredos codificados.

Nenhuma medida de segurança é absoluta; a AIVAX mantém um processo de melhoria contínua.

---

### 13. Gestão de Incidentes

Incidentes de segurança relevantes são avaliados com base no impacto, natureza dos dados e risco aos titulares dos dados. Quando necessário, a AIVAX notificará os Gerentes de Conta afetados e as autoridades competentes com informações disponíveis sobre o evento, categorias de dados afetados, etapas de mitigação e ações recomendadas.

---

### 14. Decisões Automatizadas

A AIVAX usa automação para limitação de taxa, verificações de saldo, verificações de cota de armazenamento, prevenção de abuso, prevenção de fraude, indexação, roteamento e monitoramento operacional. Essas automações podem restringir temporariamente solicitações ou chaves. O Gerente de Conta pode solicitar revisão por meio dos canais de suporte.

---

### 15. Cookies e Tecnologias de Rastreamento

As interfaces do painel podem usar cookies estritamente necessários ou armazenamento equivalente do navegador para sessões, autenticação e preferências. A AIVAX não usa cookies de publicidade comportamental no fluxo documentado da plataforma.

---

### 16. Crianças, Adolescentes e Menores Emancipados

Os serviços não se destinam a pessoas menores de 18 anos, exceto menores emancipados legalmente com idade igual ou superior a 16 anos, conforme a lei brasileira. O Gerente de Conta é responsável por implementar verificações adequadas quando seu caso de uso puder envolver menores.

---

### 17. Dados Sensíveis

A AIVAX não exige dados sensíveis para usar a plataforma. O Gerente de Conta deve evitar enviar dados de saúde, biométricos, genéticos, crenças religiosas, opiniões políticas ou outros dados sensíveis, a menos que tenha uma base legal adequada e avisos claros para os titulares dos dados.

---

### 18. Limitações de Uso e Conteúdo Proibido

É proibido usar a plataforma para armazenar ou processar conteúdo ilegal, material que infrinja direitos, malware, material difamatório ou conteúdo que infrinja direitos de terceiros. A AIVAX pode suspender, restringir ou bloquear chaves diante de suspeita razoável de violação, preservando logs necessários para investigação.

---

### 19. Dados Agregados

A AIVAX pode gerar estatísticas agregadas, como volume de tokens, taxa de erro, distribuição de modelos, uso de armazenamento e latência. As estatísticas agregadas são usadas para planejamento de capacidade, confiabilidade, faturamento e prevenção de abuso.

---

### 20. Exportação e Portabilidade

A AIVAX fornece APIs para exportar o histórico de conversas em JSON ou JSONL dentro da janela de retenção configurada. Os documentos de coleção podem ser exportados no formato JSONL. A disponibilidade da exportação está sujeita a autenticação, autorização, retenção e estado da conta.

---

### 21. Backups e Recuperação de Desastres

A AIVAX mantém backups para continuidade operacional e recuperação de desastres, com cópias históricas com data de até 3 meses atrás. Esses backups podem conter informações da conta e recursos armazenados, incluindo memórias do usuário, gateways de IA e coleções e documentos RAG. Dados de produção excluídos podem permanecer nos backups dentro desse período até que a rotação do backup seja concluída. Os dados de backup disponíveis podem ser fornecidos para cumprir uma ordem de tribunal brasileiro conforme a Seção 7.1. Backups não contêm conversas que nunca foram coletadas porque "Conversas" não estava habilitado.

---

### 22. Alterações nesta Política

Alterações materiais podem ser notificadas por e-mail, aviso no painel ou publicação de uma política atualizada. O uso continuado após a data de vigência constitui aceitação, onde permitido por lei e contrato.

---

### 23. Canal de Contato e Reclamações

Perguntas, solicitações de direitos ou reclamações: **privacy@aivax.net** / **wm@aivax.net**.
Se insatisfeito, o titular dos dados pode recorrer à **ANPD** (Autoridade Nacional de Proteção de Dados).

---

### 24. Histórico de Revisões

| Versão | Data de Vigência | Principais Alterações |
| --- | --- | --- |
| 1.0 | 30/07/2025 | Versão inicial publicada |
| 1.1 | 05/10/2025 | Adicionadas bases legais, direitos, retenção detalhada, subprocessadores, transferências, segurança expandida, incidentes, decisões automatizadas, cookies, dados sensíveis, versionamento |

---

### 25. Contato Geral

Jurídico / Privacidade: **legal@aivax.net**
Encarregado de Proteção de Dados: **wm@aivax.net**

Sempre use canais oficiais para evitar engenharia social.

---

### 26. Disposições Gerais

Se qualquer cláusula desta política for considerada inválida, as disposições restantes permanecem em pleno vigor. Em caso de conflito entre esta política e termos específicos do produto, prevalecerá a disposição mais protetiva para os titulares dos dados, a menos que uma obrigação legal diferente se aplique.

> Nota: Esta política pode ser complementada por um Acordo de Processamento de Dados (DPA) específico entre a AIVAX e o Gerente de Conta, quando aplicável.
