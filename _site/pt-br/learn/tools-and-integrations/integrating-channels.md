Source: https://docs.aivax.net/pt-br/learn/tools-and-integrations/integrating-channels.html

Um cliente pode iniciar uma pergunta em um widget de site, enviar uma fotografia pelo WhatsApp e, depois, ligar para obter uma atualização. Para o cliente, essas são formas diferentes de alcançar o mesmo negócio. Para o software, são conexões diferentes com regras distintas. Integrar canais significa juntar essas experiências deliberadamente, não simplesmente encaminhar cada mensagem para o mesmo modelo.

Um **canal** é um meio pelo qual uma pessoa se comunica com um assistente, como chat web ou voz. Você pode compartilhar o conhecimento, as regras de negócio e as ferramentas autorizadas do agente entre canais, alterando como ele recebe informações e apresenta respostas. Pense em um balcão de atendimento atendido por um balcão físico, um telefone e uma caixa de correio: a política deve ser consistente, mas a conversa não deve soar idêntica em todos os lugares.

## Separe o agente do canal

A parte compartilhada do agente decide o que o negócio conhece e permite. Um **adaptador de canal** é o software que traduz entre o formato de mensagem do canal e o formato da aplicação do agente. Ele recebe mensagens entrantes, trata anexos e envia respostas em um formato que o destino suporta.

Esse adaptador também é onde as realidades de entrega se tornam visíveis. Uma plataforma de mensagens pode rejeitar uma mensagem enviada; uma aba do navegador pode fechar; uma conexão de áudio pode quebrar. Uma resposta gerada não é necessariamente uma resposta entregue. Preserve a diferença entre preparação, envio e confirmação de entrega onde o canal expõe essa informação, e não prometa confirmação que o canal não pode fornecer.


- **Comportamento compartilhado** — Mantenha a política de negócio, fontes de conhecimento, permissões de ferramentas e regras de escalonamento consistentes. Um reembolso não deve se tornar mais fácil de obter apenas porque o cliente mudou de canal.

- **Apresentação do canal** — Adapte o comprimento, a formatação, os anexos e o ritmo. Uma resposta falada precisa de estrutura diferente de um resumo por e‑mail ou de uma tabela comparativa na web.

- **Estado da conversa** — Rastreie a troca atual, a identidade verificada e o trabalho não resolvido. Compartilhe apenas a informação que é apropriada para o destino e para o usuário autorizado.




Um agente compartilhado não requer um histórico de conversa ilimitado. Um canal interno pode expor ferramentas que um site público nunca deve oferecer. Um familiar usando um telefone compartilhado pode não ter direito aos registros de outra pessoa. Reutilize o comportamento subjacente preservando limites de acesso diferentes.

## Projete como as pessoas usam cada canal

**Latência** significa o atraso entre uma entrada e sua resposta útil. **Mídia** significa conteúdo além do texto comum, como imagens, documentos ou áudio. Ambos mudam as expectativas: uma fotografia pode precisar de interpretação, enquanto alguém em uma chamada ao vivo não pode esperar confortavelmente por uma longa busca silenciosa.


**WhatsApp**

Prefira mensagens curtas e legíveis e uma próxima pergunta clara. As pessoas podem enviar vários fragmentos, imagens ou notas de voz ao invés de um pedido completo. Trate esses fragmentos como partes de uma conversa, em vez de iniciar tarefas não relacionadas para cada fragmento. O envio de mensagens também deve respeitar as regras atuais de entrega, consentimento e modelos do provedor, quando aplicável.


**Web chat**

Use o contexto da página com cuidado e suporte links, botões ou listas legíveis quando o widget permitir. Explique os limites de anexos antes do upload. Atualizações do navegador, abas fechadas e sessões anônimas precisam de comportamento de recuperação deliberado; um visitante que retorna não é automaticamente um cliente verificado.


**E-mail**

Escreva respostas autônomas com assunto claro, resumo curto e ação seguinte explícita. Históricos longos citados podem conter instruções desatualizadas e informações não relacionadas. Preserve o fluxo da conversa sem tratar um endereço de remetente visível ou uma assinatura encaminhada como prova de propriedade da conta.


**Voice**

Use frases curtas, permita interrupções e confirme detalhes críticos. Leia novamente nomes, datas ou valores ambíguos antes de agir. Avise ao interlocutor quando uma consulta levará tempo. Uma nota de voz processada depois é diferente de uma conversa ao vivo que deve continuar respondendo à medida que as pessoas falam.





Essas diferenças devem afetar a resposta, não os fatos subjacentes. Uma política longa pode se tornar uma explicação falada concisa com a oferta de enviar os detalhes. Ela não deve se tornar uma política diferente. Da mesma forma, formatação não suportada requer uma alternativa intencional: uma tabela pode se transformar em uma lista curta, em vez de fragmentos ilegíveis em um canal que não renderiza tabelas.


**Copiar a mesma saída em todos os lugares**

Envie uma tabela comparativa densa para uma sessão de voz ao vivo, ou divida um e‑mail formal em muitos fragmentos do tamanho de chat. O conteúdo pode ser preciso, mas o cliente precisa reconstruí‑lo.


**Preservar o significado, adaptar a entrega**

Fale a recomendação principal e pergunte se o interlocutor deseja detalhes. Use uma lista compacta em mensagens e uma explicação completa e estruturada por e‑mail. Mantenha as condições e incertezas intactas.





## Torne a espera compreensível

Um reconhecimento imediato é diferente de uma resposta que conclui a tarefa. “Estou verificando o pedido” é útil somente se o sistema realmente estiver fazendo isso e retornará com um resultado ou falha. Evite repetir mensagens de progresso vazias enquanto nada muda. Para trabalhos mais longos, concorde como o cliente receberá o resultado caso ele se afaste.


**Alvos ilustrativos para uma primeira resposta útil**

| Item | Value |
| --- | --- |
| Live voice | 2segundos |
| Web chat | 8segundos |
| WhatsApp | 30segundos |
| E-mail | 300segundos |

Alvos de planejamento inventados para um cenário de suporte, não médias medidas ou garantias de canal. Uma primeira resposta útil pode reconhecer trabalho real; a resolução final pode levar mais tempo. Defina alvos a partir dos seus clientes e compromissos de serviço.



O gráfico é um auxílio à discussão, não uma regra de quanto tempo uma organização deve levar. Um e‑mail crítico pode exigir atenção mais rápida que um chat rotineiro. Meça o atraso que os clientes realmente experimentam, incluindo processamento de mídia, chamadas de ferramentas e entrega. Um modelo que começa a escrever rapidamente não resolve, por si só, uma consulta externa lenta.

Para voz, a aplicação pode transformar fala em texto e texto de volta em fala, ou usar um serviço de áudio em tempo real que troca áudio continuamente. Qualquer abordagem deve lidar com mal‑entendidos. Uma transcrição é uma interpretação do som, não uma declaração verificada de intenção. Peça confirmação antes de agir sobre um endereço incerto ou instrução consequente.

## Conecte sessões sem misturar pessoas

Uma **sessão** é uma conversa delimitada com seu próprio histórico e estado. Uma **identidade** é a pessoa ou conta que a aplicação verificou. Elas são relacionadas, mas não intercambiáveis. Um cliente pode ter várias sessões, e um dispositivo compartilhado pode ser usado por várias pessoas. Um histórico de chat persistente sozinho não deve conceder acesso a registros privados.

Receber mensagem → Encontrar sessão do canal → Verificar identidade quando necessário → Aplicar regras compartilhadas do agente → Formatar e entregar resposta


Use uma referência interna estável para conectar uma pessoa verificada à conta correta. Não mescle históricos apenas porque os nomes exibidos coincidem. Um número de telefone, endereço de e‑mail ou identificador de navegador podem ajudar a encontrar uma conversa, mas o grau de verificação necessário depende da sensibilidade da ação. Ler horário de funcionamento público requer menos garantia que alterar um endereço de entrega.

Quando um cliente passa de chat web para mensagem, decida explicitamente o que será transferido. Um resumo curto do caso e referência podem ser suficientes; a conversa inteira pode conter anexos privados que não devem aparecer no novo dispositivo. Explique a verificação necessária sem fazer a pessoa repetir cada detalhe não sensível. A continuidade deve reduzir o esforço sem enfraquecer a segurança da conta.

## Transferência de propriedade, não apenas texto

**Transferência humana** significa transferir a responsabilidade de um caso do assistente automatizado para uma pessoa. É mais do que gerar “Alguém entrará em contato”. O sistema precisa de um destino, um registro de caso e um estado claro indicando quem deve responder a seguir. Se o destino estiver indisponível, explique a alternativa real em vez de fingir que a transferência foi bem‑sucedida.

Um resumo útil da transferência inclui o que o cliente deseja, quais fatos foram verificados, quais ferramentas já foram usadas, o que resta não resolvido e por que a ajuda é necessária. Mantenha interpretações incertas rotuladas como incertas. A pessoa que recebe não deve ter que adivinhar se o assistente apenas propôs um reembolso ou realmente o concedeu.

Enquanto um humano possui a conversa, impeça o assistente de enviar respostas concorrentes ou continuar ações consequentes em segundo plano. Defina como a conversa retorna à automação e informe o usuário quando isso acontecer. Teste uma solicitação explícita por uma pessoa, uma chamada de ferramenta falha e uma conversa interrompida em cada canal, não apenas o caminho feliz no site.

Anexos merecem suas próprias verificações de canal. Um cliente pode enviar uma fotografia ilegível, uma gravação muito longa ou um tipo de documento que o adaptador não aceita. Explique a limitação específica e ofereça uma alternativa acessível, como colar o texto relevante ou falar com uma pessoa. Não omita silenciosamente um anexo e depois responda como se ele tivesse sido revisado. Onde a informação é extraída da mídia, mantenha a distinção entre o que o cliente forneceu e o que o sistema inferiu. Teste esses casos no canal real: um anexo que funciona em uma tela de desenvolvimento pode chegar de forma diferente através de um provedor de mensagens ou navegador móvel.

**Relacionado:** No AIVAX, [chat clients](https://docs.aivax.net/pt-br/docs/inference/chat-clients.md) fornecem uma camada de sessão e integrações de canal suportadas ao redor de um gateway. [Voice Session](https://docs.aivax.net/pt-br/docs/inference/voice-session.md) cobre conversas de áudio ao vivo; [speech generation](https://docs.aivax.net/pt-br/docs/generations/speech.md) transforma texto preparado em áudio, e [audio transcriptions](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md) transformam gravações em texto. O e‑mail nesta unidade é um padrão de integração geral, não uma afirmação de um canal de e‑mail embutido.

Próximo passo: vá além das mensagens de usuário para [webhooks, events and automations](https://docs.aivax.net/pt-br/learn/tools-and-integrations/webhooks-events-and-automations.md).

**Verifique seu conhecimento.** O que deve permanecer central quando um agente atende a vários canais?

1. Use um histórico compartilhado para quem tem o mesmo nome exibido
2. Mantenha as regras de negócio consistentes, adapte a apresentação e verifique a identidade antes de entrar em contexto privado
3. Dê a cada canal as mesmas ferramentas e permissões
4. Trate uma resposta gerada como prova de entrega bem‑sucedida

Answer: option 2. A integração de canais deve preservar a política ao adaptar a experiência. Correspondência de sessões, identidade verificada, permissões e entrega real da mensagem cada uma requer tratamento explícito.
