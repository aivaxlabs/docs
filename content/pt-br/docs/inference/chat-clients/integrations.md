---
{title: Integrações do Cliente de Chat,linkTitle: Integrações,weight: 40,group: Chat Clients,sourceHash: 14ae5589083e72f3,aliases: [/docs/pt-br/inference/chat-clients/integrations.html]}
---

# Integrações de Cliente de Chat

As integrações conectam um cliente de chat a aplicativos de mensagens, permitindo que os usuários conversem com o assistente onde já estão. O AIVAX suporta:

- **Telegram**, por meio de um bot criado com o BotFather.
- **WhatsApp**, por meio do [Z-API](https://www.z-api.io/), [Evolution API](https://doc.evolution-api.com/) ou [Kapso](https://kapso.ai/).

O canal transporta apenas as mensagens. A inferência ainda é realizada pelo Gateway de IA vinculado ao cliente de chat, sob os mesmos [limites](overview.md#limits) de qualquer outra sessão.

## Como as mensagens fluem

1. O provedor envia cada nova mensagem para o [URL do webhook](#webhook-urls) da integração.
2. O AIVAX encontra a sessão daquela conversa ou cria uma e adiciona a mensagem ao seu histórico. Mídia é baixada e tratada como [anexos do cliente web](web-client.md#attachments-and-audio).
3. O gateway gera a resposta, que o AIVAX envia de volta por meio do provedor.

Cada conversa no aplicativo é sua própria [sessão](managing-sessions.md), identificada pelo chat ou pelo número de telefone do usuário, dependendo do provedor. As sessões de integração duram três horas por padrão. Altere `sessionDuration`, em segundos, nas configurações da integração para mantê-las mais longas ou curtas. Uma sessão que ainda está em uso é estendida automaticamente, portanto, uma conversa ativa não expira no meio de uma troca.

Cada canal adiciona seu próprio contexto à sessão. No Telegram, o assistente recebe instruções sobre formatação e comportamento esperado do canal. No WhatsApp, o assistente é instruído a escrever com a formatação do WhatsApp, como `*negrito*` e `_itálico_`, porque o Markdown não é convertido.

As integrações respondem com texto e imagens. Respostas de áudio estão disponíveis apenas no [chat web hospedado](web-client.md#attachments-and-audio).

## Configurar uma integração

Configure a integração nas configurações do cliente de chat no painel ou com **Editar Integrações do Cliente de Chat Web** na referência da API. Cada atualização altera uma integração, e apenas os campos enviados são substituídos. Para desconectar um canal, remova sua integração com **Excluir Integração do Cliente de Chat Web**.

O URL do webhook aparece após a integração ser salva pela primeira vez. Em seguida, conclua a configuração no lado do provedor, conforme descrito abaixo.

### Telegram

1. No Telegram, abra [@BotFather](https://t.me/BotFather) e envie `/newbot` para criar o bot. O BotFather responde com o token do bot. Para obter um novo token mais tarde, use `/token`.
2. No cliente de chat, abra a integração do Telegram e cole o token em **Token do bot**.
3. Salve e selecione **Atualizar hooks**. O AIVAX registra o webhook com o Telegram para você, incluindo um token secreto que prova que cada solicitação veio do Telegram. Mensagens que estavam aguardando antes do registro são descartadas.

| Campo | Obrigatório | Descrição |
|---|---|---|
| `botToken` | Sim | O token retornado pelo BotFather. |
| `sessionDuration` | Não | Duração da sessão, em segundos. Três horas por padrão. |

O bot recebe texto, fotos, mensagens de voz e áudio, vídeos e documentos PDF, incluindo legendas. Outros tipos de documento recebem uma resposta dizendo que o formato não é suportado; adesivos e outros tipos de mensagem são ignorados.

As respostas usam a formatação rica do Telegram, portanto, Markdown, tabelas e fórmulas são renderizados no aplicativo. Em chats privados, a resposta aparece enquanto está sendo escrita. Cada usuário tem sua própria sessão, inclusive em grupos. Em grupos, o modo de privacidade do Telegram decide quais mensagens o bot recebe; consulte `/setprivacy` no BotFather.

### Z-API

1. No painel do [Z-API](https://www.z-api.io/), abra **Instâncias**, conecte seu número do WhatsApp a uma instância e copie seu **ID da Instância** e **Token da Instância**.
2. Se você ativou o token de segurança da conta na aba **Segurança** do Z-API, copie-o também.
3. No cliente de chat, abra a integração do Z-API, preencha os campos e salve.
4. Nos webhooks da instância, cole o URL do webhook do AIVAX em **Ao receber**. Deixe **Notificar os enviados por mim também** desmarcado.

| Campo | Obrigatório | Descrição |
|---|---|---|
| `instanceId` | Sim | O ID da instância do Z-API conectada ao WhatsApp. |
| `instanceToken` | Sim | O token dessa instância. |
| `clientToken` | Não | O token de segurança da conta, necessário apenas se você o ativou no Z-API. |
| `sessionDuration` | Não | Duração da sessão, em segundos. Três horas por padrão. |

O assistente recebe texto, imagens com suas legendas e áudio. Outros tipos de mensagem, como documentos, vídeos, adesivos e localizações, são ignorados sem resposta. Mensagens enviadas pelo próprio número conectado são ignoradas, assim como webhooks de outra instância.

### Evolution API

1. No seu servidor [Evolution API](https://doc.evolution-api.com/), crie uma instância e conecte seu número do WhatsApp a ela.
2. No cliente de chat, abra a integração da Evolution API e preencha o URL do servidor, o nome da instância e a chave da API. Salve.
3. Nas configurações do webhook da instância, defina o URL do webhook do AIVAX, habilite o evento `MESSAGES_UPSERT` e deixe **Webhook por Eventos** e **Webhook Base64** desativados.

| Campo | Obrigatório | Descrição |
|---|---|---|
| `endpointUrl` | Sim | O URL base do seu servidor Evolution API. |
| `instanceName` | Sim | O nome da instância conectada ao WhatsApp. |
| `apiKey` | Sim | A chave da API que o AIVAX usa para chamar seu servidor, enviada no cabeçalho `apikey`. |
| `sessionDuration` | Não | Duração da sessão, em segundos. Três horas por padrão. |

A Evolution API tem o suporte mais amplo para mensagens recebidas: texto, imagens, áudio, vídeos, documentos PDF e adesivos. Outros tipos de documento recebem uma resposta pedindo ao usuário que reenvie o conteúdo como texto, imagem, áudio ou PDF. Mensagens enviadas pelo próprio número conectado são ignoradas.

### Kapso

1. No [Kapso](https://kapso.ai/), conecte seu número do WhatsApp Business e copie seu **ID do número de telefone**, o ID do número na API do Cloud do WhatsApp, não o número de telefone em si. Crie uma chave de API do projeto.
2. No cliente de chat, abra a integração do Kapso, preencha os campos e salve.
3. No Kapso, crie um webhook para o número de telefone com o URL do webhook do AIVAX e inscreva-o em `whatsapp.message.received`. Defina uma chave secreta no webhook e insira o mesmo valor em **Chave secreta do webhook**.

| Campo | Obrigatório | Descrição |
|---|---|---|
| `apiKey` | Sim | A chave de API do projeto Kapso. |
| `phoneNumberId` | Sim | O ID do número de telefone do WhatsApp do número conectado. |
| `webhookSecretKey` | Não | O segredo do webhook do Kapso. Quando definido, solicitações com assinatura inválida são rejeitadas. Recomendado. |
| `continuedMessagesTemplateId` | Não | O nome do modelo do WhatsApp usado para [mensagens agendadas](#scheduled-messages-on-whatsapp-business). |
| `sessionDuration` | Não | Duração da sessão, em segundos. Três horas por padrão. |

O assistente recebe texto, imagens e adesivos, áudio, vídeos, documentos PDF e respostas a botões interativos e listas. Para áudio sem arquivo, a transcrição do Kapso é usada. Outros tipos de documento são enviados ao modelo como um link quando `uploadUnsupportedFiles` está habilitado no cliente de chat; caso contrário, o assistente informa ao usuário que o formato não é suportado. Localizações, reações e contatos são ignorados. Mensagens de usuários que não têm número de telefone no webhook são ignoradas.

## URLs de Webhook

Cada integração tem seu próprio URL de webhook, que você copia das configurações da integração no painel. O URL contém uma chave de webhook gerada para essa integração, portanto, trate-a como um segredo.

Use **Rotacionar chave do webhook** para substituir a chave. O URL anterior deixa de funcionar imediatamente, portanto, atualize o URL no provedor logo após a rotação. Para o Telegram, rotacionar a chave também atualiza os hooks do bot.

Alguns provedores também podem provar que uma solicitação veio deles:

- **Telegram:** **Atualizar hooks** registra o webhook com um token secreto, e mensagens sem ele são rejeitadas.
- **Kapso:** defina **Chave secreta do webhook** para o segredo do seu webhook do Kapso. Solicitações cuja assinatura não corresponder são rejeitadas.
- **Z-API** e **Evolution API:** esses provedores não assinam solicitações de webhook, portanto, a chave do webhook no URL é o que os autoriza.

URLs de webhook sem uma chave de webhook continuam funcionando até 1º de dezembro de 2026. Após essa data, eles são rejeitados. Copie o URL atual do painel e atualize-o no provedor, ou use **Atualizar hooks** para o Telegram, antes dessa data.

## Comandos

Os usuários podem enviar dois comandos em qualquer integração:

- `/reset`: limpa o histórico da conversa e inicia uma nova [conversa](managing-sessions.md#conversation-token) na mesma sessão.
- `/usage`: quando `debug` está ativo no cliente de chat, mostra o uso atual do chat em tokens.

## Comportamento das mensagens

Estas opções do cliente de chat ajustam como o assistente se comporta em aplicativos de mensagens:

| Opção | Padrão | O que faz |
|---|---|---|
| `messageDebounceInterval` | 5 segundos | Quanto tempo o AIVAX espera após uma mensagem antes de responder, para que várias mensagens rápidas sejam respondidas juntas. |
| `splitAnswerIntoMessageChunks` | Desligado | Envia uma resposta como várias mensagens mais curtas, divididas por tópico, com uma breve pausa entre elas, em vez de um bloco único de texto. As respostas não são transmitidas enquanto estiver ativado. |
| `showToolCalls` | Ligado | Envia uma mensagem de progresso curta enquanto o assistente usa ferramentas. |

Quando um usuário envia uma mensagem enquanto uma resposta ainda está sendo gerada, o AIVAX a passa para a inferência em execução, para que o assistente possa levá-la em consideração sem esperar por uma nova rodada. `/reset` e `/usage` são sempre tratados separadamente.

## Mensagens agendadas

Mensagens agendadas permitem que o assistente escreva para o usuário primeiro, em um horário definido: um lembrete que o usuário pediu, um acompanhamento de um pedido aberto ou uma verificação diária. Elas estão disponíveis apenas em integrações, não no cliente web.

Habilite `allowScheduledContinuations` no cliente de chat. O assistente então obtém ferramentas para agendar uma única mensagem para uma data e hora, criar uma tarefa recorrente com uma expressão cron, listar o que está agendado para o usuário atual e cancelá-la. O assistente decide quando usá-las, com base na conversa e nas instruções do gateway. Descreva em suas instruções quando o agendamento é apropriado, como apenas quando o usuário pede um lembrete, para evitar mensagens indesejadas.

Os horários são interpretados no fuso horário do gateway, definido em `parameters.timeZone`, a menos que o assistente inclua um deslocamento UTC explícito. Tarefas recorrentes também seguem esse fuso horário. Consulte [Data e hora atuais](/docs/pt-br/tools/builtin-tools.md#current-date-and-time) para saber como o fuso horário é configurado.

### O que acontece no horário agendado

Quando uma mensagem vence, o AIVAX executa uma nova inferência com o mesmo Gateway de IA e o histórico de conversas do usuário, juntamente com o motivo e o contexto que o assistente salvou ao agendar. O assistente então escreve a mensagem e a envia pelo mesmo canal.

- **O assistente pode decidir não enviá-la.** Se, dada a conversa, a mensagem não for mais necessária, o assistente pode pulá-la e nada chega ao usuário.
- **O timing é aproximado.** As mensagens são enviadas dentro de alguns minutos do horário agendado. Uma mensagem que não pode ser enviada muito depois de seu horário é marcada como falha.
- **A sessão pode ser nova.** Se a sessão do usuário expirou, a mensagem agendada inicia uma nova sessão sem o histórico anterior.
- **É cobrada como uma inferência normal** na conta que possui o cliente de chat. Se a conta não tiver saldo disponível naquele momento, a mensagem não será enviada.
- **Respostas longas são enviadas como uma única mensagem.** `splitAnswerIntoMessageChunks` não se aplica a mensagens agendadas.

### Usuários inativos

`maxScheduledIgnoredZone` impede que o assistente escreva para usuários que pararam de conversar com ele. Quando uma mensagem agendada vence, o AIVAX verifica quando o usuário enviou a última mensagem. Se foi há mais tempo do que este intervalo, a mensagem é pulada. O padrão é 3 dias; `0` desativa a verificação.

Por exemplo, com o padrão, se o usuário escreveu pela última vez na segunda-feira às 10:00, uma mensagem agendada para quinta-feira às 09:00 é enviada, mas uma agendada para quinta-feira às 11:00 é pulada. Uma tarefa recorrente mantém seu agendamento, e suas mensagens são enviadas novamente assim que o usuário responde.

### Mensagens agendadas no WhatsApp Business

O WhatsApp só aceita mensagens de texto livre de uma empresa dentro de 24 horas da última mensagem do usuário. Depois disso, a empresa deve usar um modelo de mensagem aprovado. Z-API e Evolution API não usam modelos, portanto, uma mensagem agendada enviada fora dessa janela pode não ser entregue, dependendo do número e do provedor.

Com o Kapso, defina `continuedMessagesTemplateId` para o nome de um modelo aprovado. Quando definido, as mensagens agendadas são enviadas por meio desse modelo:

- O modelo deve estar em português (Brasil), `pt_BR`, e ter uma variável de corpo chamada `text`, que recebe a mensagem escrita pelo assistente.
- Quebras de linha e espaços longos na mensagem são substituídos por espaços únicos, porque o WhatsApp não os aceita em variáveis de modelo. Mantenha as mensagens agendadas curtas.
- Imagens na resposta ainda são enviadas como imagens regulares.

Sem um modelo, o Kapso envia mensagens agendadas como texto simples, o que só funciona dentro da janela de 24 horas.

### Revisar e cancelar mensagens agendadas

Os usuários podem pedir ao assistente para listar ou cancelar suas mensagens agendadas. Você também pode revisá-las por cliente de chat na referência da API: **Listar Agendamentos de Hook** mostra mensagens pendentes, tarefas recorrentes e usuários que pararam de responder a mensagens agendadas. **Obter Agendamento** mostra o resultado de uma mensagem, incluindo quando foi pulada, e **Cancelar Agendamento** e **Cancelar Tarefa Recorrente** a removem. Mensagens agendadas e tarefas recorrentes são excluídas junto com seu cliente de chat.
