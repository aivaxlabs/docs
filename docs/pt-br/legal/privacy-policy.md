# Política de Privacidade

Versão: 1.1  
Data de vigência: 5 de outubro de 2025  
Atualização anterior: 30 de julho de 2025

---

Bem-vindo à AIVAX. Esta Política de Privacidade descreve como a AIVAX coleta, usa, armazena, compartilha e protege informações em seus serviços de inferência de IA. Foi escrita para transparência e clareza técnica, e não constitui aconselhamento jurídico. Gerentes de Conta devem revisá-la com seu próprio consultor jurídico quando necessário.

Ao usar os serviços da AIVAX, o Gerente de Conta reconhece e concorda com os termos desta política.

### 1. Definições

- **AIVAX:** Empresa que fornece a plataforma e serviços de orquestração de modelos de IA.  
- **Gerente de Conta AIVAX ("Gerente de Conta"):** Pessoa física ou jurídica que cria e administra a conta e integra a API.  
- **Usuário Final:** Indivíduo que interage com a aplicação do Gerente de Conta que consome a API da AIVAX.  
- **Dados da Conta:** Dados de registro e administrativos, como nome, e‑mail, empresa, cargo, identificadores internos, preferências e configurações de chave de API.  
- **Dados de Faturamento:** Dados necessários para faturas, recibos, saldo da conta, créditos, eventos de pagamento e processamento de pagamentos por provedores terceiros.  
- **Dados de Inferência:** Entradas enviadas aos modelos e saídas resultantes. Nos Termos de Uso, isso corresponde a Conteúdo de Entrada e Conteúdo Gerado.  
- **Conversas:** Sequências armazenadas de interações de inferência, incluindo mensagens, metadados, nome do modelo, objeto de uso, ferramentas, recursos e informações de erro quando o registro de conversas está habilitado.  
- **Metadados Técnicos:** Registros de solicitações, informações de IP ou encaminhamento, carimbos de data/hora, latência, identificadores de sessão, uso de tokens, códigos de resposta, identificadores de solicitação e sinais de segurança ou abuso.  
- **Processador:** AIVAX quando processa dados de acordo com as instruções do Gerente de Conta.  
- **Controlador:** AIVAX quando define finalidades para dados de conta, faturamento, segurança e conformidade.  
- **Subprocessador:** Terceiro contratado ou configurado pela AIVAX para apoiar o processamento, como infraestrutura, e‑mail, faturamento, provedores de modelo, provedores de busca ou armazenamento de objetos.

---

### 2. Funções de Processamento

| Tipo de Dados | Função da AIVAX | Função do Gerente de Conta |
| --- | --- | --- |
| Dados da Conta | Controlador | Titular dos dados ou controlador de seu próprio relacionamento interno |
| Dados de Faturamento | Controlador para fins legais, contratuais e operacionais de faturamento | Fornece e verifica |
| Dados de Inferência / Conversas | Processador para processamento direcionado ao cliente; Controlador para segurança, prevenção de abuso e logs operacionais quando aplicável | Controlador de conteúdo e finalidade |
| Metadados Técnicos | Controlador para segurança, confiabilidade, prevenção de abuso e operações da plataforma; Processador quando gerado como parte da execução do serviço | Controlador do contexto da aplicação de origem |

Ao atuar como Processador, a AIVAX segue as instruções do Gerente de Conta expressas por meio de chamadas de API, configurações do painel, seleção de modelo e integrações configuradas.

Para consistência contratual, os Dados de Inferência nesta política correspondem ao Conteúdo de Entrada e Conteúdo Gerado nos Termos de Uso.

---

### 3. Categorias de Dados Coletados

1. **Fornecido diretamente pelo Gerente de Conta:** Dados da Conta, preferências, configurações da conta, informações da organização, chaves de API geradas e credenciais armazenadas como hashes ou tokens quando aplicável.  
2. **Gerado pelo uso:** Metadados técnicos, registros de uso, contagem de tokens, latência, uso do modelo, recursos de solicitação, informações de erro e eventos de faturamento.  
3. **Dados de Inferência e Conversas:** Texto e outros conteúdos enviados aos modelos, saídas do modelo, histórico de mensagens, metadados de conversa e dados de uso relacionados.  
4. **Suporte e Comunicação:** Mensagens de tickets, e‑mails enviados ao suporte ou canais de contato e comunicações operacionais.  
5. **Faturamento:** Dados fiscais, pagamento, fatura, crédito, saldo da conta, intenção de pagamento e dados de webhook de pagamento.  
6. **Dados Agregados ou Anonimizados:** Métricas derivadas que não identificam o Gerente de Conta ou usuários finais.  

AIVAX não requer categorias especiais de dados pessoais sensíveis. Se o Gerente de Conta enviar dados pessoais sensíveis nos Dados de Inferência, o Gerente de Conta é responsável por ter a base legal adequada e os avisos necessários.

---

### 4. Propósitos, Bases Legais e Retenção

| Categoria | Propósito Primário | Base Legal (LGPD) | Retenção ou Limite Técnico |
| --- | --- | --- | --- |
| Dados da Conta | Criação de conta, autenticação, gerenciamento de conta, comunicações operacionais | Execução de contrato / interesse legítimo | Enquanto a conta estiver ativa; contas desativadas ou inativas podem ser excluídas por limpeza programada de acordo com as regras da plataforma |
| Dados de Faturamento | Faturas, créditos, confirmação de pagamento, prevenção de fraude, registros fiscais e contábeis | Obrigações legais / execução de contrato | De acordo com requisitos legais, contábeis e contratuais |
| Metadados Técnicos | Segurança, prevenção de abuso, depuração, confiabilidade, limitação de taxa, contabilidade de custos | Interesse legítimo / execução de contrato | Retidos conforme necessário para fluxos operacionais, de segurança, auditoria e faturamento |
| Dados de Inferência | Execução da inferência solicitada e integrações configuradas | Execução de contrato | Processados para a solicitação e podem ser armazenados nas Conversas quando o registro de conversas está habilitado |
| Conversas | Monitoramento, suporte, exportação, depuração, revisão de uso e histórico visível ao usuário | Interesse legítimo / execução de contrato | Visível/exportável de acordo com a retenção do plano: Gratuito até 2 horas, Pro até 2 dias, Max até 30 dias |
| Suporte | Resolver perguntas, incidentes e solicitações de conformidade | Execução de contrato / interesse legítimo | Retido conforme necessário para resolver a solicitação e manter registros comerciais |
| Dados Agregados ou Anonimizados | Planejamento de capacidade, confiabilidade, prevenção de abuso, melhoria de serviço | Fora do escopo da LGPD quando anonimizado irreversivelmente | Indeterminado enquanto anonimizado |

Os períodos de exportação de conversas são 2 horas, 1 dia, 7 dias e 30 dias, limitados pelo período de retenção do plano da conta.

---

### 5. Registro e Exclusão de Conversas

O registro de conversas está habilitado por padrão. Quando um Gerente de Conta o desativa, a AIVAX não armazena novos registros de conversa para essa conta.

O Gerente de Conta autenticado pode listar, visualizar, exportar e excluir conversas armazenadas através da API de conversas, sujeito a autorizações e janelas de retenção. Excluir uma conversa remove o registro de conversa correspondente para essa conta do armazenamento de produção.

---

### 6. RAG, Memórias e Armazenamento

AIVAX pode armazenar coleções RAG, documentos, embeddings, metadados de documentos, memórias de usuário, descrições de mídia, dados de sessão de chat web e arquivos de workspace shell quando esses recursos são usados.

A contagem de armazenamento atual inclui:

- Texto de documentos RAG e bytes de embedding.  
- Informações persistentes do usuário.  
- Descrições de mídia.  
- Mensagens de sessão de chat web, contexto extra e metadados.  
- Arquivos shell da conta.  

As cotas de armazenamento são baseadas no plano. O armazenamento incluído atual é 30 MB para o plano Gratuito, 2 GB para o Pro e 20 GB para o Max.

---

### 7. Não Uso para Treinamento de Modelo Proprietário

AIVAX não usa Dados de Inferência ou Conversas do Gerente de Conta para treinar modelos proprietários da AIVAX. Provedores de modelo de terceiros e agregadores podem ter seus próprios termos de processamento, termos de retenção e políticas de melhoria de modelo. O Gerente de Conta deve revisar a política do provedor selecionado antes de enviar dados pessoais ou sensíveis.

---

### 8. Direitos do Titular dos Dados (Art. 18, LGPD)

Quando a AIVAX atua como Controlador, os titulares dos dados podem solicitar confirmação do processamento, acesso, correção, anonimização, bloqueio ou exclusão, portabilidade, informações sobre compartilhamento, revogação de consentimento quando aplicável, oposição ao processamento baseado em interesse legítimo e revisão de decisões automatizadas quando aplicável.

Canal: **privacy@aivax.net** ou **wm@aivax.net** (Encarregado de Proteção de Dados). Podemos solicitar verificação de identidade. Para dados onde a AIVAX atua como Processador, a AIVAX pode direcionar o titular dos dados ao Gerente de Conta Controlador.

---

### 9. Encarregado de Proteção de Dados (DPO)

Encarregado de Proteção de Dados (Art. 41): **(Identidade anonimizada)**  
Contato: **wm@aivax.net**

Funções incluem comunicação com titulares dos dados e a ANPD, orientação interna de conformidade e suporte a avaliações de impacto de privacidade.

---

### 10. Subprocessadores e Provedores Terceiros

AIVAX usa serviços de terceiros para infraestrutura, armazenamento de objetos, e‑mail transacional, faturamento, busca web, geração de imagens, reranqueamento e inferência de modelo de IA. A lista técnica atual é mantida em [Data Processors](/docs/pt-br/legal/third-party-processors).

Ao selecionar um modelo ou habilitar uma ferramenta, o Gerente de Conta pode fazer com que o conteúdo seja enviado ao provedor de modelo selecionado, agregador ou provedor de ferramenta. A AIVAX não controla as políticas de terceiros e recomenda revisão prévia.

---

### 11. Transferências Internacionais de Dados

Os dados podem ser processados ou armazenados fora do Brasil dependendo da infraestrutura selecionada, provedor de modelo, provedor de busca, provedor de armazenamento de objetos ou provedor de pagamento. A AIVAX aplica salvaguardas técnicas e contratuais adequadas ao serviço, incluindo controles de acesso, criptografia em trânsito, minimização e segregação lógica quando aplicável.

---

### 12. Segurança da Informação

Medidas principais incluem:

- Criptografia em trânsito com HTTPS/TLS.  
- Autenticação por chave de API e autorização limitada à conta.  
- Acesso administrativo baseado em funções.  
- Limitação de taxa para inferência, busca RAG, inserção de documentos, ferramentas e operações de pagamento.  
- Verificações de saldo, saldo mínimo e cota de armazenamento antes de operações que geram custos.  
- Registros operacionais e relatório de erros para solução de problemas e prevenção de abuso.  
- Separação entre recursos de propriedade da conta, como coleções, documentos, conversas, memórias e arquivos shell.  
- Configuração segura de credenciais por meio de parâmetros de inicialização da aplicação ao invés de segredos codificados.  

Nenhuma medida de segurança é absoluta; a AIVAX mantém um processo de melhoria contínua.

---

### 13. Gerenciamento de Incidentes

Incidentes de segurança relevantes são avaliados com base no impacto, natureza dos dados e risco para os titulares dos dados. Quando necessário, a AIVAX notificará os Gerentes de Conta afetados e as autoridades competentes com as informações disponíveis sobre o evento, categorias de dados afetadas, medidas de mitigação e ações recomendadas.

---

### 14. Decisões Automatizadas

A AIVAX usa automação para limitação de taxa, verificações de saldo, verificações de cota de armazenamento, prevenção de abuso, prevenção de fraude, indexação, roteamento e monitoramento operacional. Essas automações podem restringir temporariamente solicitações ou chaves. O Gerente de Conta pode solicitar revisão através dos canais de suporte.

---

### 15. Cookies e Tecnologias de Rastreamento

Interfaces do painel podem usar cookies estritamente necessários ou armazenamento equivalente do navegador para sessões, autenticação e preferências. A AIVAX não usa cookies de publicidade comportamental no fluxo de plataforma documentado.

---

### 16. Crianças, Adolescentes e Menores Emancipados

Os serviços não são destinados a pessoas menores de 18 anos, exceto menores emancipados legalmente a partir de 16 anos, conforme a lei brasileira. O Gerente de Conta é responsável por implementar verificações adequadas quando seu caso de uso puder envolver menores.

---

### 17. Dados Sensíveis

A AIVAX não requer dados sensíveis para usar a plataforma. O Gerente de Conta deve evitar enviar dados de saúde, biométricos, genéticos, crenças religiosas, opinião política ou outros dados sensíveis, a menos que tenha uma base legal adequada e avisos claros para os titulares dos dados.

---

### 18. Limitações de Uso e Conteúdo Proibido

É proibido usar a plataforma para armazenar ou processar conteúdo ilegal, material que infringe direitos, malware, material difamatório ou conteúdo que infringe direitos de terceiros. A AIVAX pode suspender, restringir ou bloquear chaves diante de suspeita razoável de violação, preservando logs necessários para investigação.

---

### 19. Dados Agregados

A AIVAX pode gerar estatísticas agregadas como volume de tokens, taxa de erro, distribuição de modelos, uso de armazenamento e latência. As estatísticas agregadas são usadas para planejamento de capacidade, confiabilidade, faturamento e prevenção de abuso.

---

### 20. Exportação e Portabilidade

A AIVAX fornece APIs para exportar o histórico de conversas em JSON ou JSONL dentro da janela de retenção configurada. Documentos de coleção podem ser exportados em formato JSONL. A disponibilidade de exportação está sujeita à autenticação, autorização, retenção e estado da conta.

---

### 21. Backups e Recuperação de Desastres

A AIVAX pode manter backups e processos de recuperação de desastres para continuidade operacional. Dados de produção excluídos podem permanecer em mídia de backup até que a rotação de backup ou os procedimentos de recuperação de desastres sejam concluídos.

---

### 22. Alterações a Esta Política

Alterações materiais podem ser notificadas por e‑mail, aviso no painel ou publicação de uma política atualizada. O uso continuado após a data de vigência constitui aceitação onde permitido por lei e contrato.

---

### 23. Canal de Contato e Reclamações

Perguntas, solicitações de direitos ou reclamações: **privacy@aivax.net** / **wm@aivax.net**.  
Se insatisfeito, o titular dos dados pode recorrer à **ANPD** (Autoridade Nacional de Proteção de Dados).

---

### 24. Histórico de Revisões

| Versão | Data de Vigência | Principais Alterações |
| --- | --- | --- |
| 1.0 | 30/07/2025 | Versão inicial publicada |
| 1.1 | 05/10/2025 | Adicionadas bases legais, direitos, retenção detalhada, subprocessadores, transferências, segurança ampliada, incidentes, decisões automatizadas, cookies, dados sensíveis, versionamento |

---

### 25. Contato Geral

Legal / Privacidade: **legal@aivax.net**  
Encarregado de Proteção de Dados: **wm@aivax.net**  
Sempre use canais oficiais para evitar engenharia social.

---

### 26. Disposições Finais

Se qualquer cláusula desta política for considerada inválida, as demais disposições permanecem em pleno vigor. Em caso de conflito entre esta política e termos de produto específicos, a disposição mais protetora para os titulares dos dados prevalecerá, a menos que se aplique uma obrigação legal diferente.

> Nota: Esta política pode ser complementada por um Acordo de Processamento de Dados (DPA) específico entre a AIVAX e o Gerente de Conta, quando aplicável.