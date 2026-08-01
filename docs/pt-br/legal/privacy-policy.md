# Política de Privacidade

Revisão: 1.4  
Data de vigência: 1 de agosto de 2026  
Atualização anterior: 20 de julho de 2026

---

Bem‑vindo à AIVAX. Esta Política de Privacidade descreve como a AIVAX coleta, usa, armazena, compartilha e protege informações em seus serviços de inferência de IA. Foi escrita para transparência e clareza técnica, e não constitui aconselhamento jurídico. Gerentes de Conta devem revisá‑la com seu próprio assessor jurídico quando necessário.

Ao usar os serviços da AIVAX, o Gerente de Conta reconhece e concorda com os termos desta política.

### 1. Definições

- **AIVAX:** Empresa que fornece a plataforma e serviços de orquestração de modelos de IA.  
- **Gerente de Conta AIVAX ("Account Manager"):** Pessoa física ou jurídica que cria e administra a conta e integra a API.  
- **Usuário Final:** Indivíduo que interage com a aplicação do Gerente de Conta que consome a API da AIVAX.  
- **Dados da Conta:** Dados de registro e administrativos, como nome, e‑mail, empresa, cargo, identificadores internos, preferências e configurações de chave de API.  
- **Dados de Faturamento:** Dados necessários para faturas, recibos, saldo da conta, créditos, eventos de pagamento e processamento de pagamento por provedores terceirizados.  
- **Dados de Inferência:** Entradas enviadas aos modelos e saídas resultantes. Nos Termos de Uso, isso corresponde a Conteúdo de Entrada e Conteúdo Gerado.  
- **Dados de Treinamento Semântico:** Conteúdo RAG e de reclassificação elegível anonimizado coletado após o Gerente de Conta habilitar a coleta de dados semânticos, conforme descrito em [Data Collecting](/docs/pt-br/data-collecting). Indexação e armazenamento de documentos são excluídos.  
- **Conversas:** Sequências armazenadas de interações de inferência, incluindo mensagens, metadados, nome do modelo, objeto de uso, ferramentas, recursos e informações de erro quando o registro de conversas está habilitado.  
- **Metadados Técnicos:** Logs de requisição, informações de IP ou encaminhamento, carimbos de data/hora, latência, identificadores de sessão, uso de tokens, códigos de resposta, identificadores de requisição e sinais de segurança ou abuso.  
- **Processador:** AIVAX quando processa dados de acordo com as instruções do Gerente de Conta.  
- **Controlador:** AIVAX quando define finalidades para dados de conta, faturamento, segurança e conformidade.  
- **Subprocessador:** Terceiro contratado ou configurado pela AIVAX para apoiar o processamento, como infraestrutura, e‑mail, faturamento, provedores de modelo, provedores de busca ou armazenamento de objetos.

---

### 2. Papéis de Processamento

| Tipo de Dados | Papel da AIVAX | Papel do Gerente de Conta |
| --- | --- | --- |
| Dados da Conta | Controlador | Titular dos dados ou controlador de seu próprio relacionamento interno |
| Dados de Faturamento | Controlador para finalidades legais, contratuais e operacionais de faturamento | Fornece e verifica |
| Dados de Inferência / Conversas | Processador para processamento direcionado ao cliente; Controlador para segurança, prevenção de abuso e logs operacionais quando aplicável | Controlador de conteúdo e finalidade |
| Dados de Treinamento Semântico | Controlador para desenvolvimento de modelo e sistema semântico com base no consentimento do Gerente de Conta | Controlador do conteúdo originário e responsável pela base legal e avisos necessários aos usuários finais |
| Metadados Técnicos | Controlador para segurança, confiabilidade, prevenção de abuso e operações da plataforma; Processador quando gerados como parte da execução do serviço | Controlador do contexto de aplicação originário |

Ao atuar como Processador, a AIVAX segue as instruções do Gerente de Conta expressas por meio de chamadas de API, configurações de painel, seleção de modelo e integrações configuradas.

Para consistência contratual, Dados de Inferência nesta política correspondem a Conteúdo de Entrada e Conteúdo Gerado nos Termos de Uso.

---

### 3. Categorias de Dados Coletados

1. **Fornecidos diretamente pelo Gerente de Conta:** Dados da Conta, preferências, configurações da conta, informações da organização, chaves de API geradas e credenciais armazenadas como hashes ou tokens, quando aplicável.  
2. **Gerados por uso:** Metadados técnicos, registros de uso, contagens de tokens, latência, uso do modelo, recursos de requisição, informações de erro e eventos de faturamento.  
3. **Dados de Inferência e Conversas:** Texto e outros conteúdos enviados aos modelos, saídas do modelo, histórico de mensagens, metadados de conversa e dados de uso relacionados.  
4. **Dados de Treinamento Semântico:** Termos de consulta RAG anonimizado, conteúdos e pontuações de relevância de documentos retornados por uma busca, reclassificador selecionado, consultas de reclassificação, documentos submetidos e resultados de classificação coletados enquanto a coleta de dados semânticos está habilitada. Indexação e armazenamento de documentos não são coletados. Esses registros anonimizados excluem identificadores de conta, chave de API, requisição, coleção e documento, nomes de documentos, dados de faturamento e carimbos de coleta.  
5. **Suporte e Comunicação:** Mensagens de tickets, e‑mails enviados ao suporte ou canais de contato e comunicações operacionais.  
6. **Faturamento:** Dados fiscais, de pagamento, fatura, crédito, saldo da conta, intenção de pagamento e webhook de pagamento.  
7. **Dados Agregados ou Anonimizados:** Métricas derivadas que não identificam o Gerente de Conta ou usuários finais.

A AIVAX não requer categorias especiais de dados pessoais sensíveis. Se o Gerente de Conta enviar dados pessoais sensíveis em Dados de Inferência, ele é responsável por possuir a base legal adequada e os avisos necessários.

---

### 4. Finalidades, Bases Legais e Retenção

| Categoria | Finalidade Primária | Base Legal (LGPD) | Retenção ou Limite Técnico |
| --- | --- | --- | --- |
| Dados da Conta | Criação de conta, autenticação, gerenciamento de conta, comunicações operacionais | Execução de contrato / interesse legítimo | Enquanto a conta estiver ativa; contas desativadas ou inativas podem ser excluídas por limpeza programada conforme regras da plataforma |
| Dados de Faturamento | Faturas, créditos, confirmação de pagamento, prevenção de fraude, registros fiscais e contábeis | Obrigações legais / execução de contrato | De acordo com requisitos legais, contábeis e contratuais |
| Metadados Técnicos | Segurança, prevenção de abuso, depuração, confiabilidade, limitação de taxa, contabilidade de custos | Interesse legítimo / execução de contrato | Retidos conforme necessário para fluxos operacionais, de segurança, auditoria e faturamento |
| Dados de Inferência | Execução de inferência solicitada e integrações configuradas | Execução de contrato | Processados para a requisição e podem ser armazenados em Conversas quando o registro de conversas está habilitado |
| Dados de Treinamento Semântico | Desenvolver, treinar, ajustar, avaliar, testar e melhorar modelos e sistemas de recuperação ou classificação semântica | Consentimento | Retidos em forma anonimizada enquanto razoavelmente necessários para essas finalidades, obrigações legais, segurança e auditorias; depois excluídos |
| Conversas | Monitoramento, suporte, exportação, depuração, revisão de uso e histórico visível ao usuário | Interesse legítimo / execução de contrato | Visíveis/exportáveis conforme retenção do plano: Gratuito até 2 horas, Pro até 2 dias, Max até 30 dias |
| Suporte | Resolver dúvidas, incidentes e solicitações de conformidade | Execução de contrato / interesse legítimo | Retidos conforme necessário para resolver a solicitação e manter registros comerciais |
| Dados Agregados ou Anonimizados | Planejamento de capacidade, confiabilidade, prevenção de abuso, melhoria de serviço | Fora do escopo da LGPD quando irreversivelmente anonimizado | Indeterminado enquanto anonimizado |

Os períodos de exportação de conversas são 2 horas, 1 dia, 7 dias e 30 dias, limitados pelo período de retenção do plano da conta.

---

### 5. Registro de Conversas e Exclusão

O registro de conversas está habilitado por padrão. Quando um Gerente de Conta o desabilita, a AIVAX não armazena novos registros de conversa para essa conta.

O Gerente de Conta autenticado pode listar, visualizar, exportar e excluir conversas armazenadas através da API de conversas, sujeito a autorizações e janelas de retenção. Excluir uma conversa remove o registro correspondente daquela conta do armazenamento de produção.

---

### 6. RAG, Memórias e Armazenamento

A AIVAX pode armazenar coleções RAG, documentos, embeddings, metadados de documentos, memórias de usuário, descrições de mídia, dados de sessões de chat web e arquivos de workspace shell quando esses recursos são usados.

A contagem de armazenamento atual inclui:

- Texto de documentos RAG e bytes de embeddings.  
- Informações persistentes do usuário.  
- Descrições de mídia.  
- Mensagens de sessões de chat web, contexto extra e metadados.  
- Arquivos shell da conta.

As cotas de armazenamento são baseadas no plano. O armazenamento incluído atual é 30 MB para Gratuito, 2 GB para Pro e 20 GB para Max.

---

### 7. Coleta Opcional de Dados Semânticos e Treinamento de Modelo

Por padrão, a AIVAX não usa Dados de Inferência ou Conversas do Gerente de Conta para treinar modelos proprietários da AIVAX. Quando um Gerente de Conta autorizado habilita a coleta de dados semânticos, a AIVAX pode usar registros elegíveis de RAG e reclassificação anonimizado gerados enquanto a configuração está habilitada para os fins descritos em [Data Collecting](/docs/pt-br/data-collecting). Indexação e armazenamento de documentos RAG não estão incluídos e não recebem desconto de programa.

Antes do armazenamento, a AIVAX anonimiza esses registros removendo o relacionamento de conta e excluindo identificadores operacionais, nomes de documentos, dados de faturamento e carimbos de coleta. A conta é consultada apenas para verificar consentimento e aplicar o desconto elegível. A AIVAX não mantém um mapeamento conta‑registro.

A configuração está desabilitada por padrão. Desabilitá‑la interrompe a nova coleta, mas não exclui automaticamente os registros coletados enquanto o consentimento estava ativo ou reverte treinamentos já concluídos. Como os mapeamentos conta‑registro não são armazenados, a AIVAX não pode localizar um registro de treinamento apenas pelo ID da conta. O Gerente de Conta continua responsável pela base legal, avisos e permissões necessários para dados pessoais submetidos por seus usuários finais. Solicitações relacionadas a dados pessoais presentes em conteúdo semântico podem ser enviadas para **privacy@aivax.net** ou **wm@aivax.net** com informações suficientes para localizar o conteúdo quando aplicável.

Provedores de modelo e agregadores terceirizados podem ter seus próprios termos de processamento, termos de retenção e políticas de melhoria de modelo independentemente deste programa opcional. O Gerente de Conta deve revisar a política do provedor selecionado antes de enviar dados pessoais ou sensíveis.

---

### 8. Direitos do Titular dos Dados (Art. 18, LGPD)

Quando a AIVAX atua como Controlador, os titulares dos dados podem solicitar confirmação de processamento, acesso, correção, anonimização, bloqueio ou exclusão, portabilidade, informações sobre compartilhamento, revogação de consentimento quando aplicável, oposição ao processamento com base em interesse legítimo e revisão de decisões automatizadas quando aplicável.

Canal: **privacy@aivax.net** ou **wm@aivax.net** (Encarregado de Proteção de Dados). Podemos solicitar verificação de identidade. Para dados onde a AIVAX atua como Processador, a AIVAX pode direcionar o titular ao Controlador Gerente de Conta.

---

### 9. Encarregado de Proteção de Dados (DPO)

Encarregado de Proteção de Dados (Art. 41): **(Identidade anonimizada)**  
Contato: **wm@aivax.net**

Funções incluem comunicação com titulares e a ANPD, orientação interna de conformidade e suporte a avaliações de impacto de privacidade.

---

### 10. Subprocessadores e Provedores Terceirizados

A AIVAX usa serviços terceirizados para infraestrutura, armazenamento de objetos, e‑mail transacional, faturamento, busca na web, geração de imagens, reclassificação e inferência de modelo de IA. A lista técnica atual é mantida em [Data Processors](/docs/pt-br/legal/third-party-processors).

Ao selecionar um modelo ou habilitar uma ferramenta, o Gerente de Conta pode fazer com que o conteúdo seja enviado ao provedor de modelo, agregador ou provedor de ferramenta selecionado. A AIVAX não controla as políticas de terceiros e recomenda revisão prévia.

---

### 11. Transferências Internacionais de Dados

Os dados podem ser processados ou armazenados fora do Brasil dependendo da infraestrutura, provedor de modelo, provedor de busca, provedor de armazenamento de objetos ou provedor de pagamento selecionados. A AIVAX aplica salvaguardas técnicas e contratuais adequadas ao serviço, incluindo controles de acesso, criptografia em trânsito, minimização e segregação lógica quando aplicável.

---

### 12. Segurança da Informação

Medidas chave incluem:

- Criptografia em trânsito com HTTPS/TLS.  
- Autenticação por chave de API e autorização escopo de conta.  
- Acesso administrativo baseado em papéis.  
- Limitação de taxa para inferência, busca RAG, inserção de documentos, ferramentas e operações de pagamento.  
- Verificações de saldo, saldo mínimo e cota de armazenamento antes de operações que geram custos.  
- Logs operacionais e relatórios de erro para solução de problemas e prevenção de abuso.  
- Separação entre recursos de propriedade da conta, como coleções, documentos, conversas, memórias e arquivos shell.  
- Configuração segura de credenciais por parâmetros de inicialização da aplicação ao invés de segredos codificados.

Nenhuma medida de segurança é absoluta; a AIVAX mantém um processo de melhoria contínua.

---

### 13. Gerenciamento de Incidentes

Incidentes de segurança relevantes são avaliados com base em impacto, natureza dos dados e risco aos titulares. Quando necessário, a AIVAX notificará Gerentes de Conta afetados e autoridades competentes com as informações disponíveis sobre o evento, categorias de dados afetadas, medidas de mitigação e ações recomendadas.

---

### 14. Decisões Automatizadas

A AIVAX utiliza automação para limitação de taxa, verificações de saldo, verificações de cota de armazenamento, prevenção de abuso, prevenção de fraude, indexação, roteamento e monitoramento operacional. Essas automações podem restringir temporariamente requisições ou chaves. O Gerente de Conta pode solicitar revisão por meio dos canais de suporte.

---

### 15. Cookies e Tecnologias de Rastreamento

Interfaces de painel podem usar cookies estritamente necessários ou armazenamento equivalente do navegador para sessões, autenticação e preferências. A AIVAX não usa cookies de publicidade comportamental no fluxo de plataforma documentado.

---

### 16. Crianças, Adolescentes e Menores Emancipados

Os serviços não são destinados a pessoas menores de 18 anos, exceto menores emancidados legalmente com 16 anos ou mais conforme a lei brasileira. O Gerente de Conta é responsável por implementar verificações adequadas quando seu caso de uso possa envolver menores.

---

### 17. Dados Sensíveis

A AIVAX não requer dados sensíveis para usar a plataforma. O Gerente de Conta deve evitar enviar dados de saúde, biométricos, genéticos, crenças religiosas, opinião política ou outros dados sensíveis, a menos que possua base legal adequada e avisos claros para os titulares.

---

### 18. Limitações de Uso e Conteúdo Proibido

É proibido usar a plataforma para armazenar ou processar conteúdo ilegal, material que infrinja direitos, malware, material difamatório ou conteúdo que viole direitos de terceiros. A AIVAX pode suspender, restringir ou bloquear chaves diante de suspeita razoável de violação, preservando logs necessários para investigação.

---

### 19. Dados Agregados

A AIVAX pode gerar estatísticas agregadas como volume de tokens, taxa de erro, distribuição de modelos, uso de armazenamento e latência. As estatísticas agregadas são usadas para planejamento de capacidade, confiabilidade, faturamento e prevenção de abuso.

---

### 20. Exportação e Portabilidade

A AIVAX fornece APIs para exportar histórico de conversas em JSON ou JSONL dentro da janela de retenção configurada. Documentos de coleta podem ser exportados em formato JSONL. A disponibilidade de exportação está sujeita a autenticação, autorização, retenção e estado da conta.

---

### 21. Backups e Recuperação de Desastres

A AIVAX pode manter backups e processos de recuperação de desastres para continuidade operacional. Dados de produção excluídos podem permanecer em mídia de backup até que a rotação de backup ou os procedimentos de recuperação de desastres sejam concluídos.

---

### 22. Alterações a Esta Política

Alterações materiais podem ser notificadas por e‑mail, aviso no painel ou publicação de política atualizada. O uso contínuo após a data de vigência constitui aceitação onde permitido por lei e contrato.

---

### 23. Canal de Contato e Reclamações

Perguntas, solicitações de direitos ou reclamações: **privacy@aivax.net** / **wm@aivax.net**.  
Se insatisfeito, o titular pode recorrer à **ANPD** (Autoridade Nacional de Proteção de Dados).

---

### 24. Histórico de Revisões

| Versão | Data de Vigência | Principais Alterações |
| --- | --- | --- |
| 1.0 | 30/07/2025 | Versão inicial publicada |
| 1.1 | 05/10/2025 | Adição de bases legais, direitos, retenção detalhada, subprocessadores, transferências, segurança ampliada, incidentes, decisões automatizadas, cookies, dados sensíveis, versionamento |

---

### 25. Contato Geral

Legal / Privacidade: **legal@aivax.net**  
Encarregado de Proteção de Dados: **wm@aivax.net**

Sempre use canais oficiais para evitar engenharia social.

---

### 26. Disposições Finais

Se qualquer cláusula desta política for considerada inválida, as demais disposições permanecem em pleno vigor. Em caso de conflito entre esta política e termos específicos de produto, a disposição mais protetiva para os titulares prevalecerá, salvo obrigação legal diferente.

> Observação: Esta política pode ser complementada por um Acordo de Processamento de Dados (DPA) específico entre a AIVAX e o Gerente de Conta, quando aplicável.