# Política de Privacidade

Revisão: 1.4  
Data de vigência: 1 de agosto de 2026  
Atualização anterior: 20 de julho de 2026  
Última atualização: 26 de setembro de 2026

---

Bem‑vindo à AIVAX. Esta Política de Privacidade descreve como a AIVAX coleta, usa, armazena, compartilha e protege informações em seus serviços de inferência de IA. Foi escrita para transparência e clareza técnica, e não constitui aconselhamento jurídico. Gerentes de Conta devem revisá‑la com seu próprio assessor jurídico quando necessário.

Ao usar os serviços da AIVAX, o Gerente de Conta reconhece e concorda com os termos desta política.

### 1. Definições

- **AIVAX:** Empresa que fornece a plataforma e serviços de orquestração de modelos de IA.  
- **AIVAX Account Manager ("Account Manager"):** Pessoa física ou jurídica que cria e administra a conta e integra a API.  
- **End User:** Indivíduo que interage com a aplicação do Gerente de Conta que consome a API AIVAX.  
- **Account Data:** Dados de registro e administrativos, como nome, e‑mail, empresa, função, identificadores internos, preferências e configurações de chave de API.  
- **Billing Data:** Dados necessários para faturas, recibos, saldo da conta, créditos, eventos de pagamento e processamento de pagamento por processadores terceirizados.  
- **Inference Data:** Entradas enviadas aos modelos e saídas resultantes. Nos Termos de Uso, isso corresponde a Conteúdo de Entrada e Conteúdo Gerado.  
- **Semantic Training Data:** Dados de treinamento semântico: conteúdo RAG e de reclassificação elegíveis anonimizado coletado após o Gerente de Conta habilitar a coleta de dados semânticos, conforme descrito em [Data Collecting](/docs/pt-br/data-collecting). Indexação e armazenamento de documentos são excluídos.  
- **Conversations:** Sequências armazenadas de interações de inferência, incluindo mensagens, metadados, nome do modelo, objeto de uso, ferramentas, recursos e informações de erro quando o registro de conversas está habilitado.  
- **Technical Metadata:** Registros de inferência e acesso, endereços IP ou informações de encaminhamento, strings de agente de usuário, carimbos de tempo, latência, identificadores de sessão, uso de tokens, códigos de resposta, identificadores de solicitação e sinais de segurança ou abuso.  
- **Processor:** Processador: AIVAX quando processa dados de acordo com as instruções do Gerente de Conta.  
- **Controller:** Controlador: AIVAX quando define finalidades para dados de conta, faturamento, segurança e conformidade.  
- **Subprocessor:** Subprocessador: Terceiro contratado ou configurado pela AIVAX para apoiar o processamento, como infraestrutura, e‑mail, faturamento, provedores de modelo, provedores de busca ou armazenamento de objetos.  

---

### 2. Funções de Processamento

| Tipo de Dados | Função AIVAX | Função do Gerente de Conta |
| --- | --- | --- |
| Account Data | Controlador | Titular dos dados ou controlador de seu próprio relacionamento interno |
| Billing Data | Controlador para fins legais, contratuais e operacionais de faturamento | Fornece e verifica |
| Inference Data / Conversations | Processador para processamento direcionado ao cliente; Controlador para segurança, prevenção de abuso e logs operacionais quando aplicável | Controlador de conteúdo e finalidade |
| Semantic Training Data | Controlador para desenvolvimento de modelo e sistema semântico com base no consentimento do Gerente de Conta | Controlador do conteúdo original e responsável pela base legal e avisos necessários aos usuários finais |
| Technical Metadata | Controlador para segurança, confiabilidade, prevenção de abuso e operações da plataforma; Processador quando gerado como parte da execução do serviço | Controlador do contexto da aplicação de origem |

Ao atuar como Processador, a AIVAX segue as instruções do Gerente de Conta expressas por meio de chamadas de API, configurações do painel, seleção de modelo e integrações configuradas.

Para consistência contratual, Dados de Inferência nesta política correspondem a Conteúdo de Entrada e Conteúdo Gerado nos Termos de Uso.

---

### 3. Categorias de Dados Coletados

1. **Fornecido diretamente pelo Gerente de Conta:** Dados da Conta, preferências, configurações da conta, informações da organização, chaves de API geradas e credenciais armazenadas como hashes ou tokens quando aplicável.  
2. **Gerado pelo uso:** Metadados técnicos, registros de uso, contagem de tokens, latência, uso do modelo, recursos de solicitação, informações de erro e eventos de faturamento.  
3. **Dados de Inferência e Conversas:** Texto e outros conteúdos enviados aos modelos e as saídas dos modelos são processados para executar solicitações. O conteúdo da conversa e o histórico de mensagens são coletados e registrados apenas quando o Gerente de Conta habilita o recurso de observabilidade (“Conversas”) para a solicitação ou globalmente para a conta, conforme descrito na Seção 5.  
4. **Dados de Treinamento Semântico:** Termos de consulta RAG anonimizados, conteúdos e pontuações de relevância de documentos retornados por uma busca, reclassificador selecionado, consultas de reclassificação, documentos enviados e resultados de classificação coletados enquanto a coleta de dados semânticos está habilitada. Indexação e armazenamento de documentos não são coletados. Esses registros anonimados excluem identificadores de conta, chave de API, solicitação, coleção e documento, nomes de documentos, dados de faturamento e carimbos de tempo da coleta.  
5. **Suporte e Comunicação:** Mensagens de tíquetes, e‑mails enviados ao suporte ou canais de contato e comunicações operacionais.  
6. **Faturamento:** Dados fiscais, de pagamento, fatura, crédito, saldo da conta, intenção de pagamento e webhook de pagamento.  
7. **Dados Agregados ou Anonimizados:** Métricas derivadas que não identificam o Gerente de Conta ou os usuários finais.  

A AIVAX não exige categorias especiais de dados pessoais sensíveis. Se o Gerente de Conta enviar dados pessoais sensíveis em Dados de Inferência, ele será responsável por possuir a base legal e os avisos adequados.

---

### 4. Finalidades, Bases Legais e Retenção

| Categoria | Finalidade Primária | Base Legal (LGPD) | Retenção Técnica ou Limite |
| --- | --- | --- | --- |
| Account Data | Criação de conta, autenticação, gerenciamento de conta, comunicações operacionais | Execução de contrato / interesse legítimo | Enquanto a conta estiver ativa; contas desativadas ou inativas podem ser excluídas por limpeza programada conforme regras da plataforma |
| Billing Data | Faturas, créditos, confirmação de pagamento, prevenção de fraude, registros fiscais e contábeis | Obrigações legais / execução de contrato | De acordo com exigências legais, contábeis e contratuais |
| Technical Metadata | Segurança, prevenção de abuso, depuração, confiabilidade, limitação de taxa, contabilização de custos | Interesse legítimo / execução de contrato | Registros de inferência e acesso e metadados, incluindo endereços IP e strings de agente de usuário, são retidos por até 1 ano |
| Inference Data | Execução da inferência solicitada e integrações configuradas | Execução de contrato | Processado para a solicitação e pode ser armazenado em Conversas quando o registro de conversas está habilitado |
| Semantic Training Data | Desenvolver, treinar, ajustar, avaliar, testar e melhorar modelos e sistemas de recuperação ou classificação semântica | Consentimento | Retido em forma anonimizada enquanto razoavelmente necessário para essas finalidades, obrigações legais, segurança e auditorias; depois excluído |
| Conversations | Monitoramento, suporte, exportação, depuração, revisão de uso e histórico visível ao usuário | Interesse legítimo / execução de contrato | Visível/exportável conforme retenção do plano: Gratuito até 2 horas, Pro até 2 dias, Max até 30 dias |
| Support | Resolver dúvidas, incidentes e solicitações de conformidade | Execução de contrato / interesse legítimo | Retido conforme necessário para resolver a solicitação e manter registros comerciais |
| Aggregated or Anonymized Data | Planejamento de capacidade, confiabilidade, prevenção de abuso, melhoria de serviço | Fora do escopo da LGPD quando anonimizado irreversivelmente | Indeterminado enquanto anonimizado |

Os períodos de exportação de conversas são 2 horas, 1 dia, 7 dias e 30 dias, limitados pelo período de retenção do plano da conta.

---

### 5. Registro e Exclusão de Conversas

A AIVAX coleta e registra conversas apenas quando o Gerente de Conta habilita o recurso de observabilidade (“Conversas”), seja para a solicitação individual ou globalmente para a conta. Se não estiver habilitado para a solicitação ou por meio da configuração global da conta, a AIVAX não coleta, registra nem armazena o conteúdo da conversa dessa solicitação. Processar entradas e saídas para executar inferência não cria um registro de conversa armazenado.

A AIVAX não pode recuperar ou fornecer conversas que não foram coletadas porque esse recurso não foi habilitado, inclusive em resposta a ordem judicial. Logs técnicos e metadados descritos na Seção 4 são independentes do conteúdo da conversa. A divulgação de conversas armazenadas às autoridades está sujeita aos requisitos de ordem judicial na Seção 7.1.

O Gerente de Conta autenticado pode listar, visualizar, exportar e excluir conversas armazenadas por meio da API de conversas, sujeito a autorizações e janelas de retenção. Excluir uma conversa remove o registro correspondente para aquela conta do armazenamento de produção.

---

### 6. RAG, Memórias e Armazenamento

A AIVAX pode armazenar coleções RAG, documentos, embeddings, metadados de documentos, memórias de usuário, descrições de mídia, dados de sessão de chat web e arquivos de workspace de shell quando esses recursos são usados.

A contagem de armazenamento atual inclui:

- Texto de documentos RAG e bytes de embedding.  
- Informações persistentes do usuário.  
- Descrições de mídia.  
- Mensagens de sessão de chat web, contexto extra e metadados.  
- Arquivos de shell da conta.

As cotas de armazenamento são baseadas no plano. O armazenamento incluído atual é 30 MB para Gratuito, 2 GB para Pro e 20 GB para Max.

---

### 7. Coleta Opcional de Dados Semânticos e Treinamento de Modelo

Por padrão, a AIVAX não usa Dados de Inferência ou Conversas do Gerente de Conta para treinar modelos proprietários da AIVAX. Quando um Gerente de Conta autorizado habilita a coleta de dados semânticos, a AIVAX pode usar registros RAG e de reclassificação anonimados elegíveis gerados enquanto a configuração está habilitada para os fins descritos em [Data Collecting](/docs/pt-br/data-collecting). Indexação e armazenamento de documentos RAG não são incluídos e não recebem desconto no programa.

Antes do armazenamento, a AIVAX anonimiza esses registros removendo o relacionamento da conta e excluindo identificadores operacionais, nomes de documentos, dados de faturamento e carimbos de tempo da coleta. A conta é consultada apenas para verificar o consentimento e aplicar o desconto elegível. A AIVAX não retém um mapeamento conta‑para‑registro.

A configuração está desabilitada por padrão. Desabilitá‑la interrompe a nova coleta, mas não exclui automaticamente os registros coletados enquanto o consentimento estava ativo nem reverte o treinamento já concluído. Como os mapeamentos conta‑para‑registro não são armazenados, a AIVAX não pode localizar um registro de treinamento apenas pelo ID da conta. O Gerente de Conta continua responsável pela base legal, avisos e permissões necessários para os dados pessoais enviados por seus usuários finais. Solicitações relacionadas a dados pessoais presentes em conteúdo semântico podem ser enviadas para **privacy@aivax.net** ou **wm@aivax.net** com informações suficientes para localizar o conteúdo quando aplicável.

Provedores de modelo e agregadores terceirizados podem ter seus próprios termos de processamento, prazos de retenção e políticas de melhoria de modelo, independentes deste programa opcional. O Gerente de Conta deve revisar a política do provedor selecionado antes de enviar dados pessoais ou sensíveis.

---

### 7.1. Ordens Judiciais e Solicitações de Autoridades Estrangeiras

Para divulgação judicial de dados de conta, a AIVAX executa apenas ordens emitidas por tribunais brasileiros competentes. Ordens emitidas em outros países devem ser submetidas através dos tribunais brasileiros e resultar em uma ordem judicial brasileira antes que a AIVAX divulgue dados. Uma ordem estrangeira por si só não autoriza a divulgação.

Autoridades judiciais estrangeiras podem solicitar a preservação de logs existentes por até 1 ano enquanto conduzem os processos aplicáveis através dos tribunais brasileiros. A preservação não é divulgação e não autoriza a coleta ou reconstrução de conteúdo de conversa que não foi registrado.

Para cumprir uma ordem judicial brasileira, a AIVAX pode fornecer os seguintes dados, limitados ao escopo da ordem e aos registros realmente disponíveis:

- **Logs e metadados técnicos:** Até 1 ano de registros de inferência e acesso e metadados, incluindo endereços IP e strings de agente de usuário. Esses registros não implicam que o conteúdo da conversa foi coletado.  
- **Conversas armazenadas:** Apenas conversas coletadas enquanto o Gerente de Conta havia habilitado “Conversas” para a solicitação ou globalmente para a conta, e que permanecem disponíveis. A AIVAX fornece essas conversas às autoridades somente sob ordem judicial brasileira; não pode fornecer conversas que nunca foram coletadas.  
- **Outras informações da conta e recursos armazenados:** Informações da conta, memórias de usuário, gateways de IA e suas configurações, coleções e documentos RAG e outros recursos de conta armazenados. Registros disponíveis podem incluir backups com até 3 meses, conforme descrito na Seção 21.

Esses períodos descrevem os limites da retenção disponível, não uma garantia de que todo registro exista durante todo o período. Uma solicitação de preservação não restaura registros que nunca foram coletados ou que não estão mais disponíveis.

---

### 8. Direitos do Titular dos Dados (Art. 18, LGPD)

Quando a AIVAX atua como Controlador, os titulares dos dados podem solicitar confirmação de tratamento, acesso, correção, anonimização, bloqueio ou exclusão, portabilidade, informações sobre compartilhamento, revogação de consentimento quando aplicável, oposição ao tratamento baseado em interesse legítimo e revisão de decisões automatizadas quando aplicável.

Canal: **privacy@aivax.net** ou **wm@aivax.net** (Encarregado de Proteção de Dados). Podemos solicitar verificação de identidade. Para dados em que a AIVAX atua como Processador, a AIVAX pode direcionar o titular ao Gerente de Conta Controlador.

---

### 9. Encarregado de Proteção de Dados (DPO)

Encarregado de Proteção de Dados (Art. 41): **(Identidade anonimizada)**  
Contato: **wm@aivax.net**

Funções incluem comunicação com titulares e a ANPD, orientação interna de conformidade e apoio a avaliações de impacto de privacidade.

---

### 10. Subprocessadores e Provedores Terceirizados

A AIVAX utiliza serviços terceirizados para infraestrutura, armazenamento de objetos, e‑mail transacional, faturamento, busca na web, geração de imagens, reclassificação e inferência de modelo de IA. A lista técnica atual é mantida em [Data Processors](/docs/pt-br/legal/third-party-processors).

Ao selecionar um modelo ou habilitar uma ferramenta, o Gerente de Conta pode fazer com que o conteúdo seja enviado ao provedor de modelo, agregador ou provedor de ferramenta selecionado. A AIVAX não controla as políticas de terceiros e recomenda revisão prévia.

---

### 11. Transferências Internacionais de Dados

Os dados podem ser processados ou armazenados fora do Brasil dependendo da infraestrutura, provedor de modelo, provedor de busca, provedor de armazenamento de objetos ou provedor de pagamento selecionados. A AIVAX aplica salvaguardas técnicas e contratuais adequadas ao serviço, incluindo controles de acesso, criptografia em trânsito, minimização e segregação lógica quando aplicável.

---

### 12. Segurança da Informação

- Criptografia em trânsito com HTTPS/TLS.  
- Autenticação de chave de API e autorização escopo de conta.  
- Acesso administrativo baseado em funções.  
- Limitação de taxa para inferência, busca RAG, inserção de documentos, ferramentas e operações de pagamento.  
- Verificações de saldo, saldo mínimo e cota de armazenamento antes de operações que geram custos.  
- Logs operacionais e relatórios de erro para solução de problemas e prevenção de abuso.  
- Separação entre recursos de propriedade da conta, como coleções, documentos, conversas, memórias e arquivos de shell.  
- Configuração segura de credenciais por parâmetros de inicialização da aplicação ao invés de segredos codificados.  

Nenhuma medida de segurança é absoluta; a AIVAX mantém um processo de melhoria contínua.

---

### 13. Gestão de Incidentes

Incidentes de segurança relevantes são avaliados com base no impacto, natureza dos dados e risco para os titulares. Quando necessário, a AIVAX notificará os Gerentes de Conta afetados e as autoridades competentes com as informações disponíveis sobre o evento, categorias de dados afetadas, medidas de mitigação e ações recomendadas.

---

### 14. Decisões Automatizadas

A AIVAX usa automação para limitação de taxa, verificações de saldo, verificações de cota de armazenamento, prevenção de abuso, prevenção de fraude, indexação, roteamento e monitoramento operacional. Essas automações podem restringir temporariamente solicitações ou chaves. O Gerente de Conta pode solicitar revisão por meio dos canais de suporte.

---

### 15. Cookies e Tecnologias de Rastreamento

Interfaces do painel podem usar cookies estritamente necessários ou armazenamento equivalente no navegador para sessões, autenticação e preferências. A AIVAX não usa cookies de publicidade comportamental no fluxo de plataforma documentado.

---

### 16. Crianças, Adolescentes e Menores Emancipados

Os serviços não são destinados a pessoas menores de 18 anos, exceto menores emancidados legalmente com 16 anos ou mais conforme a lei brasileira. O Gerente de Conta é responsável por implementar verificações adequadas quando seu caso de uso puder envolver menores.

---

### 17. Dados Sensíveis

A AIVAX não exige dados sensíveis para usar a plataforma. O Gerente de Conta deve evitar enviar dados de saúde, biométricos, genéticos, crenças religiosas, opiniões políticas ou outros dados sensíveis, a menos que possua a base legal adequada e avisos claros para os titulares.

---

### 18. Limitações de Uso e Conteúdo Proibido

É proibido usar a plataforma para armazenar ou processar conteúdo ilegal, material que viole direitos, malware, material difamatório ou conteúdo que infrinja direitos de terceiros. A AIVAX pode suspender, restringir ou bloquear chaves ao suspeitar razoavelmente de violação, preservando logs necessários para investigação.

---

### 19. Dados Agregados

A AIVAX pode gerar estatísticas agregadas como volume de tokens, taxa de erro, distribuição de modelos, uso de armazenamento e latência. Estatísticas agregadas são usadas para planejamento de capacidade, confiabilidade, faturamento e prevenção de abuso.

---

### 20. Exportação e Portabilidade

A AIVAX fornece APIs para exportar histórico de conversas em JSON ou JSONL dentro da janela de retenção configurada. Documentos de coleta podem ser exportados em formato JSONL. A disponibilidade de exportação está sujeita à autenticação, autorização, retenção e estado da conta.

---

### 21. Backups e Recuperação de Desastres

A AIVAX mantém backups para continuidade operacional e recuperação de desastres, com cópias históricas de até 3 meses. Esses backups podem conter informações da conta e recursos armazenados, incluindo memórias de usuário, gateways de IA e coleções e documentos RAG. Dados de produção excluídos podem permanecer em backups dentro desse período até que a rotação de backups seja concluída. Dados de backup disponíveis podem ser fornecidos para cumprir uma ordem judicial brasileira sob a Seção 7.1. Backups não contêm conversas que nunca foram coletadas porque “Conversas” não foi habilitado.

---

### 22. Alterações a Esta Política

Alterações materiais podem ser notificadas por e‑mail, aviso no painel ou publicação de política atualizada. O uso continuado após a data de vigência constitui aceitação onde permitido por lei e contrato.

---

### 23. Canal de Contato e Reclamações

Dúvidas, solicitações de direitos ou reclamações: **privacy@aivax.net** / **wm@aivax.net**. Se insatisfeito, o titular pode recorrer à **ANPD** (Autoridade Nacional de Proteção de Dados).

---

### 24. Histórico de Revisões

| Versão | Data de Vigência | Principais Alterações |
| --- | --- | --- |
| 1.0 | 30/07/2025 | Versão inicial publicada |
| 1.1 | 05/10/2025 | Adicionadas bases legais, direitos, retenção detalhada, subprocessadores, transferências, segurança expandida, incidentes, decisões automatizadas, cookies, dados sensíveis, versionamento |

---

### 25. Contato Geral

Legal / Privacidade: **legal@aivax.net**  
Encarregado de Proteção de Dados: **wm@aivax.net**

Sempre use canais oficiais para evitar engenharia social.

---

### 26. Disposições Finais

Se qualquer cláusula desta política for considerada inválida, as demais disposições permanecem em pleno vigor. Em caso de conflito entre esta política e termos específicos de produto, a disposição mais protetiva para os titulares prevalecerá, salvo obrigação legal diferente.

> Observação: Esta política pode ser complementada por um Acordo de Processamento de Dados (DPA) específico entre a AIVAX e o Gerente de Conta, quando aplicável.