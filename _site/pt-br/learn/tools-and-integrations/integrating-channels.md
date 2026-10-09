Source: https://docs.aivax.net/pt-br/learn/tools-and-integrations/integrating-channels.html

A customer may start a question in a website widget, send a photograph through WhatsApp and later call for an update. To the customer, these are different ways to reach the same business. To the software, they are different connections with different rules. Integrating channels means joining those experiences deliberately, not simply forwarding every message to the same model.

A **channel** is a medium through which a person communicates with an assistant, such as web chat or voice. You can share an agent's knowledge, business rules and authorised tools across channels while changing how it receives information and presents answers. Think of a service desk staffed through a counter, a telephone and a mailbox: the policy should be consistent, but the conversation should not sound identical everywhere.

## Separe o agente do canal

The shared part of the agent decides what the business knows and permits. A **channel adapter** is the software that translates between the channel's message format and the agent application's format. It receives incoming messages, handles attachments and sends replies in a form the destination supports.

That adapter is also where delivery realities become visible. A messaging platform may reject an outgoing message; a browser tab may close; an audio connection may break. A generated answer is not necessarily a delivered answer. Preserve the difference between prepared, sent and confirmed delivery where the channel exposes that information, and do not promise confirmation a channel cannot provide.


- **Comportamento compartilhado** — Mantenha a política de negócios, fontes de conhecimento, permissões de ferramentas e regras de escalonamento consistentes. Um reembolso não deve se tornar mais fácil de obter apenas porque o cliente mudou de canal.

- **Apresentação do canal** — Adapte comprimento, formatação, anexos e ritmo. Uma resposta falada precisa de estrutura diferente de um resumo por e‑mail ou de uma tabela de comparação na web.

- **Estado da conversa** — Rastreie a troca atual, identidade verificada e trabalho não resolvido. Compartilhe apenas as informações adequadas ao destino e ao usuário autorizado.




One shared agent does not require one unrestricted conversation history. An internal employee channel may expose tools that a public website must never offer. A family member using a shared phone may not be entitled to another person's records. Reuse the underlying behaviour while preserving different access boundaries.

## Projete para como as pessoas usam cada canal

**Latency** means the delay between an input and its useful response. **Media** means content beyond ordinary text, such as images, documents or audio. Both change expectations: a photograph may need interpretation, while someone on a live call cannot comfortably wait through a long silent search.


**WhatsApp**

Prefira mensagens curtas e legíveis e uma próxima pergunta clara. As pessoas podem enviar vários fragmentos, imagens ou notas de voz em vez de um pedido completo. Trate esses fragmentos como partes de uma conversa, em vez de iniciar tarefas não relacionadas para cada fragmento. As mensagens enviadas também devem respeitar as regras atuais de entrega, consentimento e modelos do provedor, quando aplicável.


**Chat web**

Use o contexto da página com cuidado e ofereça links legíveis, botões ou listas quando o widget permitir. Explique os limites de anexos antes do upload. Atualizações do navegador, abas fechadas e sessões anônimas precisam de comportamento de recuperação deliberado; um visitante que retorna não é automaticamente um cliente verificado.


**E-mail**

Escreva respostas autocontidas com assunto claro, resumo curto e ação seguinte explícita. Históricos longos citados podem conter instruções desatualizadas e informações não relacionadas. Preserve o fio da conversa sem tratar um endereço de remetente visível ou uma assinatura encaminhada como prova de propriedade da conta.


**Voz**

Use frases curtas, permita interrupções e confirme detalhes críticos. Leia de volta nomes, datas ou valores ambíguos antes de agir. Informe ao chamador quando uma consulta levará tempo. Uma nota de voz processada depois é diferente de uma conversa ao vivo que deve continuar respondendo enquanto as pessoas falam.





These differences should affect the response, not the underlying facts. A long policy can become a concise spoken explanation with an offer to send the details. It should not become a different policy. Likewise, unsupported formatting needs an intentional alternative: a table may become a short list, rather than unreadable fragments in a channel that does not render tables.


**Copiar a mesma saída em todos os lugares**

Envie uma tabela de comparação densa para uma sessão de voz ao vivo, ou divida um e‑mail formal em muitos fragmentos do tamanho de chat. O conteúdo pode ser preciso, mas o cliente tem que reconstruí‑lo.


**Preservar o significado, adaptar a entrega**

Fale a recomendação principal e pergunte se o chamador quer detalhes. Use uma lista compacta em mensagens e uma explicação completa e estruturada em e‑mail. Mantenha condições e incertezas intactas.





## Torne a espera compreensível

An immediate acknowledgement is different from an answer that completes the task. “I am checking the order” is useful only if the system is actually doing so and will return with a result or a failure. Avoid repeating empty progress messages while nothing changes. For longer work, agree how the customer will receive the outcome if they leave.


**Metas ilustrativas para uma primeira resposta útil**

| Item | Value |
| --- | --- |
| Live voice | 2 seconds |
| Web chat | 8 seconds |
| WhatsApp | 30 seconds |
| E-mail | 300 seconds |

Metas de planejamento inventadas para um cenário de suporte, não médias medidas ou garantias de canal. Uma primeira resposta útil pode reconhecer trabalho real; a resolução final pode levar mais tempo. Defina metas a partir dos seus clientes e compromissos de serviço.



The chart is a discussion aid, not a rule for how long an organisation should take. A critical e-mail can require faster attention than a routine chat. Measure the delay customers actually experience, including media processing, tool calls and delivery. A model that starts writing quickly does not solve a slow external lookup by itself.

For voice, the application may turn speech into text and text back into speech, or use a realtime audio service that exchanges audio continuously. Either approach must handle misunderstandings. A transcript is an interpretation of sound, not a verified statement of intent. Ask for confirmation before acting on an uncertain address or consequential instruction.

## Conecte sessões sem misturar pessoas

A **session** is a bounded conversation with its own history and state. An **identity** is the person or account the application has verified. These are related but not interchangeable. One customer can have several sessions, and a shared device can be used by several people. A persistent chat history alone should not grant access to private records.

Receive message → Find channel session → Verify identity when needed → Apply shared agent rules → Format and deliver reply


Use a stable internal reference to connect a verified person to the correct account. Do not merge histories solely because display names match. A phone number, e-mail address or browser identifier can help find a conversation, but the degree of verification needed depends on the sensitivity of the action. Reading public opening hours needs less assurance than changing a delivery address.

When a customer moves from web chat to messaging, explicitly decide what transfers. A short case summary and reference may be enough; the entire conversation may contain private attachments that should not appear on the new device. Explain any required verification without making the person repeat every non-sensitive detail. Continuity should reduce effort without weakening account security.

## Transfira a propriedade, não apenas o texto

**Human handover** means transferring responsibility for a case from the automated assistant to a person. It is more than generating “Someone will contact you.” The system needs a destination, a case record and a clear state indicating who should respond next. If the destination is unavailable, explain the real alternative rather than pretending the transfer succeeded.

A useful handover summary includes what the customer wants, which facts were verified, what tools already did, what remains unresolved and why help is needed. Keep uncertain interpretations labelled as uncertain. The receiving person should not have to guess whether the assistant merely proposed a refund or actually issued one.

While a human owns the conversation, prevent the assistant from sending competing replies or continuing consequential actions in the background. Define how the conversation returns to automation and tell the user when that happens. Test an explicit request for a person, a failed tool call and an interrupted conversation in each channel, not just the happy path on the website.

Attachments deserve their own channel checks. A customer may send an unreadable photograph, a very long recording or a document type the adapter cannot accept. Explain the specific limitation and offer an accessible alternative, such as pasting the relevant text or speaking to a person. Do not silently omit an attachment and then answer as if it had been reviewed. Where information is extracted from media, retain the distinction between what the customer supplied and what the system inferred. Test these cases on the actual channel: an attachment that works in a development screen may arrive differently through a messaging provider or mobile browser.

**Related:** On AIVAX, [chat clients](https://docs.aivax.net/pt-br/docs/features/chat-clients.md) provide a session layer and supported channel integrations around a gateway. [Voice Session](https://docs.aivax.net/pt-br/docs/inference/voice-session.md) covers live audio conversations; [speech generation](https://docs.aivax.net/pt-br/docs/generations/speech.md) turns prepared text into audio, and [audio transcriptions](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md) turn recordings into text. E-mail in this unit is a general integration pattern, not a claim of a built-in e-mail channel.

What's next: move beyond user messages to [webhooks, events and automations](https://docs.aivax.net/pt-br/learn/tools-and-integrations/webhooks-events-and-automations.md).

**Verifique seu conhecimento.** O que deve permanecer central quando um agente atende vários canais?

1. Usar um histórico compartilhado para qualquer pessoa com o mesmo nome exibido
2. Manter as regras de negócio consistentes, adaptar a apresentação e verificar a identidade antes de entrar em contexto privado
3. Dar a cada canal as mesmas ferramentas e permissões
4. Tratar uma resposta gerada como prova de entrega bem‑sucedida

Answer: option 2. A integração de canais deve preservar a política enquanto adapta a experiência. Correspondência de sessões, identidade verificada, permissões e entrega real da mensagem cada uma requer tratamento explícito.
