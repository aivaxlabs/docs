# Política de Privacidade

Versão: 1.2  
Data de vigência: 20 de julho de 2026  
Atualização anterior: 5 de outubro de 2025

---

Bem‑vindo ao AIVAX. Esta Política de Privacidade descreve como o AIVAX coleta, usa, armazena, compartilha e protege informações em seus serviços de inferência de IA. Foi escrita para transparência e clareza técnica, e não constitui aconselhamento jurídico. Gerentes de Conta devem revisá‑la com seu próprio assessor jurídico quando necessário.

Ao usar os serviços do AIVAX, o Gerente de Conta reconhece e concorda com os termos desta política.

### 1. Definições

- **AIVAX:** Empresa que fornece a plataforma e serviços de orquestração de modelo de IA.  
- **Gerente de Conta da AIVAX ("Gerente de Conta"):** Pessoa física ou jurídica que cria e administra a conta e integra a API.  
- **Usuário Final:** Indivíduo que interage com a aplicação do Gerente de Conta que consome a API do AIVAX.  
- **Dados de Conta:** Dados de registro e administrativos, como nome, e‑mail, empresa, função, identificadores internos, preferências e configurações de chave de API.  
- **Dados de Faturamento:** Dados necessários para faturas, recibos, saldo da conta, créditos, eventos de pagamento e processamento de pagamento por provedores terceiros.  
- **Dados de Inferência:** Entradas enviadas aos modelos e saídas resultantes. Nos Termos de Uso, isso corresponde a Conteúdo de Entrada e Conteúdo Gerado.  
- **Dados de Treinamento Semântico:** Conteúdo de pesquisa RAG e Reflex elegível, desidentificado da conta, coletado após o Gerente de Conta habilitar a coleta de dados semânticos, conforme descrito em [Coleta de Dados](/docs/pt-br/data-collecting). Indexação e armazenamento de documentos estão excluídos.  
- **Conversas:** Sequências armazenadas de interações de inferência, incluindo mensagens, metadados, nome do modelo, objeto de uso, ferramentas, recursos e informações de erro quando o registro de conversas está habilitado.  
- **Metadados Técnicos:** Registros de solicitações, informações de IP ou encaminhamento, marcas de tempo, latência, identificadores de sessão, uso de tokens, códigos de resposta, identificadores de solicitação e sinais de segurança ou abuso.  
- **Processador:** AIVAX quando processa dados de acordo com as instruções do Gerente de Conta.  
- **Controlador:** AIVAX quando define finalidades para dados de conta, faturamento, segurança e conformidade.  
- **Subprocessador:** Terceiro contratado ou configurado pelo AIVAX para suportar o processamento, como infraestrutura, e‑mail, faturamento, provedores de modelo, provedores de busca ou armazenamento de objetos.  

### 2. Funções de Processamento

| Tipo de Dados | Função da AIVAX | Função do Gerente de Conta |
| --- | --- | --- |
| Dados de Conta | Controlador | Titular dos dados ou controlador de seu próprio relacionamento interno |
| Dados de Faturamento | Controlador para fins legais, contratuais e operacionais de faturamento | Fornece e verifica |
| Dados de Inferência / Conversas | Processador para processamento direcionado ao cliente; Controlador para segurança, prevenção de abuso e registros operacionais quando aplicável | Controlador do conteúdo e propósito |
| Dados de Treinamento Semântico | Controlador para desenvolvimento de modelo e sistema semântico com base no consentimento do Gerente de Conta | Controlador do conteúdo original e responsável pela base legal e avisos necessários aos usuários finais |
| Metadados Técnicos | Controlador para segurança, confiabilidade, prevenção de abuso e operações da plataforma; Processador quando gerado como parte da execução do serviço | Controlador do contexto da aplicação original |

Quando atua como Processador, a AIVAX segue as instruções do Gerente de Conta expressas por meio de chamadas de API, configurações do painel, seleção de modelo e integrações configuradas.

Para consistência contratual, Dados de Inferência nesta política correspondem a Conteúdo de Entrada e Conteúdo Gerado nos Termos de Uso.

### 3. Categorias de Dados Coletados

1. **Fornecidos diretamente pelo Gerente de Conta:** Dados de Conta, preferências, configurações da conta, informações da organização, chaves de API geradas e credenciais armazenadas como hashes ou tokens quando aplicável.  
2. **Gerados pelo uso:** Metadados técnicos, registros de uso, contagem de tokens, latência, uso de modelo, recursos de solicitação, informações de erro e eventos de faturamento.  
3. **Dados de Inferência e Conversas:** Texto e outros conteúdos enviados aos modelos, saídas do modelo, histórico de mensagens, metadados da conversa e dados de uso relacionados.  
4. **Dados de Treinamento Semântico:** Termos de consulta RAG, conteúdos e pontuações de relevância de documentos retornados por uma busca, reranker selecionado, consultas Reflex, documentos enviados ao Reflex e resultados de classificação coletados enquanto a coleta de dados semânticos está habilitada. Indexação e armazenamento de documentos não são coletados. Esses registros excluem identificadores de conta, chave de API, solicitação, coleção e documento, nomes de documentos, dados de faturamento e marcas de tempo da coleta.  
5. **Suporte e Comunicação:** Mensagens de tickets, e‑mails enviados ao suporte ou canais de contato e comunicações operacionais.  
6. **Faturamento:** Dados fiscais, pagamento, fatura, crédito, saldo da conta, intenção de pagamento e dados de webhook de pagamento.  
7. **Dados Agregados ou Anonimizados:** Métricas derivadas que não identificam o Gerente de Conta ou usuários finais.  

A AIVAX não requer categorias especiais de dados pessoais sensíveis. Se o Gerente de Conta enviar dados pessoais sensíveis em Dados de Inferência, o Gerente de Conta é responsável por possuir a base legal adequada e os avisos necessários.

### 4. Finalidades, Bases Legais e Retenção

| Categoria | Finalidade Principal | Base Legal (LGPD) | Retenção Técnica ou Limite |
| --- | --- | --- | --- |
| Dados de Conta | Criação de conta, autenticação, gerenciamento de conta, comunicações operacionais | Execução de contrato / interesse legítimo | Enquanto a conta está ativa; contas desativadas ou inativas podem ser excluídas por limpeza programada de acordo com as regras da plataforma |
| Dados de Faturamento | Faturas, créditos, confirmação de pagamento, prevenção de fraude, registros fiscais e contábeis | Obrigações legais / execução de contrato | De acordo com requisitos legais, contábeis e contratuais |
| Metadados Técnicos | Segurança, prevenção de abuso, depuração, confiabilidade, limitação de taxa, contabilidade de custos | Interesse legítimo / execução de contrato | Retido conforme necessário para fluxos operacionais, de segurança, auditoria e faturamento |
| Dados de Inferência | Execução da inferência solicitada e integrações configuradas | Execução de contrato | Processado para a solicitação e pode ser armazenado nas Conversas quando o registro de conversas está habilitado |
| Dados de Treinamento Semântico | Desenvolver, treinar, ajustar finamente, avaliar, testar e melhorar modelos e sistemas de recuperação ou classificação semântica | Consentimento | Retido enquanto razoavelmente necessário para esses propósitos, obrigações legais, segurança e auditorias; depois excluído ou anonimizado irreversivelmente |
| Conversas | Monitoramento, suporte, exportação, depuração, revisão de uso e histórico visível ao usuário | Interesse legítimo / execução de contrato | Visível/exportável de acordo com a retenção do plano: Gratuito até 2 horas, Pro até 2 dias, Max até 30 dias |
| Suporte | Resolver perguntas, incidentes e solicitações de conformidade | Execução de contrato / interesse legítimo | Retido conforme necessário para resolver a solicitação e manter registros comerciais |
| Dados Agregados ou Anonimizados | Planejamento de capacidade, confiabilidade, prevenção de abuso, melhoria de serviço | Fora do escopo da LGPD quando anonimizado irreversivelmente | Indeterminado enquanto anonimizado |

Os períodos de exportação de conversas são 2 horas, 1 dia, 7 dias e 30 dias, limitados pelo período de retenção do plano da conta.

### 5. Registro de Conversas e Exclusão

O registro de conversas está habilitado por padrão. Quando um Gerente de Conta o desativa, a AIVAX não armazena novos registros de conversa para essa conta.

O Gerente de Conta autenticado pode listar, visualizar, exportar e excluir conversas armazenadas através da API de conversas, sujeito a autorizações e janelas de retenção. Excluir uma conversa remove o registro de conversa correspondente para essa conta do armazenamento de produção.

### 6. RAG, Memórias e Armazenamento

A AIVAX pode armazenar coleções RAG, documentos, embeddings, metadados de documentos, memórias de usuário, descrições de mídia, dados de sessões de chat web e arquivos de workspace de shell quando esses recursos são usados.

Contagem de armazenamento atual inclui:

- Texto de documento RAG e bytes de embedding.  
- Informações persistentes do usuário.  
- Descrições de mídia.  
- Mensagens de sessão de chat web, contexto extra e metadados.  
- Arquivos de shell da conta.  

As cotas de armazenamento são baseadas no plano. O armazenamento incluído atual é 30 MB para Gratuito, 2 GB para Pro e 20 GB para Max.

### 7. Coleta Opcional de Dados Semânticos e Treinamento de Modelo

Por padrão, a AIVAX não usa Dados de Inferência ou Conversas do Gerente de Conta para treinar modelos proprietários da AIVAX. Quando um Gerente de Conta autorizado habilita a coleta de dados semânticos, a AIVAX pode usar registros elegíveis de busca RAG e Reflex gerados enquanto a configuração está habilitada para os propósitos descritos em [Coleta de Dados](/docs/pt-br/data-collecting). Indexação e armazenamento de documentos RAG não estão incluídos e não recebem desconto no programa.

Antes do armazenamento, a AIVAX remove o relacionamento da conta e exclui identificadores operacionais, nomes de documentos, dados de faturamento e marcas de tempo da coleta desses registros. A conta é consultada apenas para verificar o consentimento e aplicar o desconto elegível. A AIVAX não mantém um mapeamento conta‑para‑registro. Essa anonimização ao nível da conta não inspeciona nem redige informações identificadoras que o Gerente de Conta inclui dentro da consulta ou texto do documento.

A configuração está desativada por padrão. Desativá‑la interrompe a coleta nova, mas não exclui automaticamente os registros coletados enquanto o consentimento estava ativo ou reverte o treinamento já concluído. Como os mapeamentos conta‑para‑registro não são armazenados, a AIVAX não pode localizar um registro de treinamento a partir apenas de um ID de conta. O Gerente de Conta continua responsável pela base legal, avisos e permissões necessários para os dados pessoais submetidos por seus usuários finais. Solicitações referentes a dados pessoais presentes em conteúdo semântico podem ser enviadas para **privacy@aivax.net** ou **wm@aivax.net** com informações suficientes para localizar o conteúdo, quando aplicável.

Fornecedores de modelos e agregadores de terceiros podem ter seus próprios termos de processamento, termos de retenção e políticas de melhoria de modelo independentemente deste programa opcional. O Gerente de Conta deve revisar a política do provedor selecionado antes de enviar dados pessoais ou sensíveis.

### 8. Direitos dos Titulares de Dados (Art. 18, LGPD)

Quando a AIVAX atua como Controlador, os titulares de dados podem solicitar confirmação do processamento, acesso, correção, anonimização, bloqueio ou exclusão, portabilidade, informações sobre compartilhamento, revogação de consentimento quando aplicável, oposição ao processamento baseado em interesse legítimo e revisão de decisões automatizadas quando aplicável.

Canal: **privacy@aivax.net** ou **wm@aivax.net** (Encarregado de Proteção de Dados). Podemos solicitar verificação de identidade. Para dados onde a AIVAX atua como Processador, a AIVAX pode direcionar o titular de dados ao Gerente de Conta Controlador.

### 9. Encarregado de Proteção de Dados (DPO)

Encarregado de Proteção de Dados (Art. 41): **(Identidade anonimizada)**  
Contato: **wm@aivax.net**  

As funções incluem comunicação com titulares de dados e a ANPD, orientação interna de conformidade e suporte para avaliações de impacto de privacidade.

### 10. Subprocessadores e Provedores Terceiros

A AIVAX utiliza serviços de terceiros para infraestrutura, armazenamento de objetos, e‑mail transacional, faturamento, busca web, geração de imagens, reranking e inferência de modelo de IA. A lista técnica atual é mantida em [Processadores de Dados](/docs/pt-br/legal/third-party-processors).

Ao selecionar um modelo ou habilitar uma ferramenta, o Gerente de Conta pode fazer com que o conteúdo seja enviado ao provedor de modelo selecionado, agregador ou provedor de ferramenta. A AIVAX não controla as políticas de terceiros e recomenda revisão prévia.

### 11. Transferências Internacionais de Dados

Os dados podem ser processados ou armazenados fora do Brasil dependendo da infraestrutura selecionada, provedor de modelo, provedor de busca, provedor de armazenamento de objetos ou provedor de pagamento. A AIVAX aplica salvaguardas técnicas e contratuais adequadas ao serviço, incluindo controles de acesso, criptografia em trânsito, minimização e segregação lógica quando aplicável.

### 12. Segurança da Informação

Principais medidas incluem:

- Criptografia em trânsito com HTTPS/TLS.  
- Autenticação por chave de API e autorização limitada à conta.  
- Acesso administrativo baseado em funções.  
- Limitação de taxa para inferência, busca RAG, inserção de documentos, ferramentas e operações de pagamento.  
- Verificações de saldo, saldo mínimo e cota de armazenamento antes de operações que geram custos.  
- Registros operacionais e relatório de erros para solução de problemas e prevenção de abuso.  
- Separação entre recursos de propriedade da conta, como coleções, documentos, conversas, memórias e arquivos de shell.  
- Configuração segura de credenciais por meio de parâmetros de inicialização da aplicação ao invés de segredos codificados.  

Nenhuma medida de segurança é absoluta; a AIVAX mantém um processo de melhoria contínua.

### 13. Gestão de Incidentes

Incidentes de segurança relevantes são avaliados com base no impacto, natureza dos dados e risco para os titulares de dados. Quando necessário, a AIVAX notificará os Gerentes de Conta afetados e as autoridades competentes com informações disponíveis sobre o evento, categorias de dados afetadas, medidas de mitigação e ações recomendadas.

### 14. Decisões Automatizadas

A AIVAX utiliza automação para limitação de taxa, verificações de saldo, verificações de cota de armazenamento, prevenção de abuso, prevenção de fraude, indexação, roteamento e monitoramento operacional. Essas automações podem restringir temporariamente solicitações ou chaves. O Gerente de Conta pode solicitar revisão através dos canais de suporte.

### 15. Cookies e Tecnologias de Rastreamento

As interfaces do painel podem usar cookies estritamente necessários ou armazenamento equivalente no navegador para sessões, autenticação e preferências. A AIVAX não usa cookies de publicidade comportamental no fluxo de plataforma documentado.

### 16. Crianças, Adolescentes e Menores Emancipados

Os serviços não são destinados a pessoas menores de 18 anos, exceto menores emancipados legalmente a partir de 16 anos, conforme a lei brasileira. O Gerente de Conta é responsável por implementar verificações adequadas quando seu caso de uso puder envolver menores.

### 17. Dados Sensíveis

A AIVAX não requer dados sensíveis para usar a plataforma. O Gerente de Conta deve evitar enviar dados de saúde, biométricos, genéticos, crença religiosa, opinião política ou outros dados sensíveis, a menos que possua uma base legal adequada e avisos claros para os titulares de dados.

### 18. Limitações de Uso e Conteúdo Proibido

É proibido usar a plataforma para armazenar ou processar conteúdo ilegal, material que viole direitos, malware, material difamatório ou conteúdo que infrinja direitos de terceiros. A AIVAX pode suspender, restringir ou bloquear chaves diante de suspeita razoável de violação, preservando logs necessários para investigação.

### 19. Dados Agregados

A AIVAX pode gerar estatísticas agregadas como volume de tokens, taxa de erro, distribuição de modelos, uso de armazenamento e latência. Estatísticas agregadas são usadas para planejamento de capacidade, confiabilidade, faturamento e prevenção de abuso.

### 20. Exportação e Portabilidade

A AIVAX fornece APIs para exportar o histórico de conversas em JSON ou JSONL dentro da janela de retenção configurada. Documentos de coleção podem ser exportados em formato JSONL. A disponibilidade de exportação está sujeita à autenticação, autorização, retenção e estado da conta.

### 21. Backups e Recuperação de Desastres

A AIVAX pode manter backups e processos de recuperação de desastres para continuidade operacional. Dados de produção excluídos podem permanecer em mídia de backup até que a rotação de backups ou os procedimentos de recuperação de desastres sejam concluídos.

### 22. Alterações a Esta Política

Mudanças materiais podem ser notificadas por e‑mail, aviso no painel ou publicação de uma política atualizada. O uso continuado após a data de vigência constitui aceitação onde permitido por lei e contrato.

### 23. Canal de Contato e Reclamações

Perguntas, solicitações de direitos ou reclamações: **privacy@aivax.net** / **wm@aivax.net**.  
Se insatisfeito, o titular de dados pode recorrer à **ANPD** (Autoridade Nacional de Proteção de Dados).

### 24. Histórico de Revisões

| Versão | Data de Vigência | Principais Mudanças |
| --- | --- | --- |
| 1.0 | 07/30/2025 | Versão publicada |
| 1.1 | 10/05/2025 | Adicionadas bases legais, direitos, retenção detalhada, subprocessadores, transferências, segurança ampliada, incidentes, decisões automatizadas, cookies, dados sensíveis, versionamento |

### 25. Contato Geral

Legal / Privacidade: **legal@aivax.net**  
Encarregado de Proteção de Dados: **wm@aivax.net**  

Sempre use canais oficiais para evitar engenharia social.

### 26. Disposições Finais

Se qualquer cláusula desta política for considerada inválida, as disposições restantes permanecerão em pleno vigor. Em caso de conflito entre esta política e termos de produto específicos, a disposição mais protetora para os titulares de dados prevalecerá, a menos que se aplique uma obrigação legal diferente.

> Observação: Esta política pode ser complementada por um Acordo de Processamento de Dados (DPA) específico entre a AIVAX e o Gerente de Conta, quando aplicável.