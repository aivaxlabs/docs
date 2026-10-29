Source: https://docs.aivax.net/pt-br/docs/inference/agentic-tests.html

# Testes Agênticos

Testes Agênticos avaliam como um Gateway de IA se comporta ao longo de uma conversa completa e orientada a objetivos, em vez de classificar uma única resposta isolada. Em cada turno, o AIVAX:

1. simula a próxima mensagem do usuário;
2. envia-a para o gateway selecionado;
3. pergunta a um juiz independente se a conversa atingiu seu objetivo, permanece recuperável ou se afastou persistentemente do resultado esperado.

Você pode executar testes de duas maneiras: como [testes persistentes no painel](#persistent-tests-in-the-dashboard), com histórico, agendamentos e notificações, ou como avaliações efêmeras por meio da [execução direta via API](#direct-api-execution).

Use Testes Agênticos para criar verificações de regressão repetíveis para suporte, vendas, onboarding, uso de ferramentas, RAG e outros fluxos de agentes multi-turno. Como um teste é executado através do Gateway de IA configurado, ele exercita o modelo do gateway, instruções, ferramentas, habilidades, conhecimento e configurações de inferência juntos.

## Testes persistentes no painel

Abra **Agentic Tests** (Testes Agênticos) no painel do AIVAX para criar e gerenciar casos de teste reutilizáveis. Um teste armazena:

- o Gateway de IA sob teste;
- um objetivo que descreve o resultado conversacional esperado e é compartilhado com o usuário simulado e o juiz;
- critérios de validação opcionais usados apenas pelo juiz;
- mensagens iniciais opcionais, recursos externos e um identificador de usuário externo;
- amostragem do usuário simulado, limites de turno, comportamento de saída e limiares de avaliação;
- um agendamento recorrente opcional;
- configurações de notificação de falha e recuperação.

A definição do teste é reutilizável. Cada execução cria uma corrida (run) separada, portanto, alterar um teste posteriormente não substitui o histórico já coletado para execuções anteriores.

### Criar um teste útil

Escreva o objetivo da perspectiva do usuário simulado: descreva quem ele é, o que deseja e como deve progredir na conversa. Não o escreva como instruções para o assistente. O objetivo é compartilhado tanto com o usuário simulado, que o persegue, quanto com o juiz, que o avalia. Por exemplo:

> Você está escolhendo um plano para sua equipe. Explique o tamanho e as necessidades da sua equipe quando perguntado, pergunte qual plano se encaixa e continue até entender a recomendação e como se inscrever.

Use **Critérios de Validação** para requisitos opcionais que devem afetar apenas a avaliação do juiz, não o comportamento do usuário simulado. Por exemplo:

> A recomendação deve nomear o plano selecionado e conectá-lo ao tamanho da equipe declarado. A resposta final deve incluir um passo direto de inscrição.

Manter esses critérios separados impede que o usuário simulado direcione artificialmente a conversa em direção às verificações que o juiz aplicará.

Use **Mensagens Iniciais** quando o cenário exigir um contexto estabelecido, como uma objeção de cliente, uma resposta anterior do assistente ou um ponto específico em um fluxo existente.

Use `external_user_id` quando o comportamento do gateway depender de uma identidade do seu próprio aplicativo. O valor é encaminhado para a inferência do gateway em cada execução desse teste.

Use `resources` para fornecer ao usuário simulado e ao juiz um contexto compartilhado que não pertence à conversa inicial. Forneça objetos com um `type` e um valor `data` não vazio; um teste aceita até 16 recursos (veja [Preços e limites](#pricing-and-limits)). `Text` usa `data` como contexto literal; `RemoteResource` recupera o conteúdo da URL em `data`. Por exemplo:

```json
{
  "resources": [
    {
      "type": "Text",
      "data": "O cliente tem uma janela de reembolso de 14 dias."
    },
    {
      "type": "RemoteResource",
      "data": "https://example.com/refund-policy"
    }
  ]
}
```

Tenha em mente como os recursos são usados:

- Eles são visíveis apenas para o usuário simulado e o juiz. Eles não são enviados ao gateway sob teste como histórico de conversa e não adicionam conhecimento ao gateway. Se o assistente precisar recuperar o mesmo material, disponibilize-o por meio do próprio conhecimento ou ferramentas do gateway.
- O usuário simulado ainda pode revelar informações dos recursos naturalmente em suas mensagens, portanto, não trate os recursos como critérios ocultos apenas para o juiz. Use **Critérios de Validação** para isso.

Conteúdo remoto pode mudar entre execuções de teste e contribui para o uso. Use apenas URLs confiáveis, publicamente acessíveis, cujo conteúdo seja apropriado para o teste.

Um teste focado geralmente fornece resultados mais acionáveis do que um cenário amplo. Separe objetivos não relacionados em testes diferentes para que uma falha identifique o comportamento que sofreu regressão.

Siga o [tutorial de teste de conversa multi-turno](https://aivax.net/blog/introducing-agentic-tests/) para definir objetivos observáveis, executar uma conversa simulada e inspecionar a recuperação.

### Ganchos de validação

Ganchos de validação permitem que seu próprio serviço observe uma corrida persistente e a interrompa quando uma verificação falhar, por exemplo, para inspecionar a conversa após cada resposta do gateway. Configure o array `hooks` ao criar ou atualizar um teste:

```json
{
  "hooks": [
    {
      "event": "before-test",
      "url": "https://validator.example/hooks/agentic-tests"
    },
    {
      "event": "after-test",
      "url": "https://validator.example/hooks/agentic-tests"
    },
    {
      "event": "before-inference",
      "url": "https://validator.example/hooks/gateway"
    },
    {
      "event": "after-inference",
      "url": "https://validator.example/hooks/gateway"
    },
    {
      "event": "context-changed",
      "url": "https://validator.example/hooks/agentic-tests"
    }
  ]
}
```

Os eventos suportados são:

| Evento | Quando é enviado | Dados do evento |
|---|---|---|
| `before-test` | Antes do primeiro turno simulado. | `gateway`, `goal` e `metadata`. |
| `after-test` | Após o teste atingir um resultado terminal normal e antes do evento final ser emitido. | O resultado final, motivo, estado, número do turno, pontuação, delta da conversa e sequência de perdas. |
| `before-inference` | Uma vez antes da inferência principal do gateway em cada turno. | `turn_number` e o array atual de `messages`. |
| `after-inference` | Uma vez após a inferência principal do gateway em cada turno. | `turn_number` e o array atual de `messages`. |
| `context-changed` | Uma vez por turno após a conclusão da resposta do gateway. | `turn_number` e o array atual de `messages`. |

`before-inference` e `after-inference` estão disponíveis apenas quando o teste direciona um Gateway de IA. Ganchos são suportados para testes persistentes do painel e execuções agendadas; o endpoint de validação SSE direto não aceita `hooks`.

Cada gancho recebe um envelope JSON compatível com worker:

```json
{
  "testId": "<AGENTIC_TEST_ID>",
  "runId": "<AGENTIC_TEST_RUN_ID>",
  "gatewayId": "<GATEWAY_ID>",
  "moment": "2026-08-16T03:00:00Z",
  "event": {
    "name": "before-inference",
    "data": {
      "turn_number": 1,
      "messages": []
    }
  }
}
```

A URL do gancho deve ser uma URL HTTP ou HTTPS absoluta sem credenciais embutidas e não deve resolver para localhost, loopback, privado, link-local ou outros endereços locais bloqueados. Quando a conta possui uma chave de gancho, o AIVAX também envia `X-Request-Nonce`; valide-o antes de confiar no payload. As solicitações de gancho usam `POST` com `Content-Type: application/json`.

As respostas do gancho seguem a convenção do [worker](https://docs.aivax.net/pt-br/docs/inference/workers.md):

- Qualquer resposta `2xx` continua a corrida.
- Uma resposta não-`2xx` ou uma falha na solicitação HTTP interrompe a corrida imediatamente.
- O corpo da resposta não seleciona outra ação.

Uma corrida interrompida é armazenada como `failed` e emite um resultado terminal com `reason: "validation_hook_interrupted"`. O `result.hooks` da corrida registra uma entrada de auditoria para cada chamada de gancho, com o evento, URL, timestamp, status ou erro, se a execução continuou e até 4.000 caracteres do corpo da resposta.

### Executar e inspecionar um teste

Selecione **Run test** (Executar teste) para enfileirar uma execução. As corridas podem estar `pending` (pendente), `running` (em execução), `succeeded` (bem-sucedida), `failed` (falha) ou `cancelled` (cancelada). Tanto a taxa de novas corridas quanto a concorrência em nível de conta dependem do plano atual. Veja [Preços e limites](#pricing-and-limits) para valores atuais.

Corridas manuais, corridas agendadas e avaliações diretas via API compartilham uma cota de nova corrida entre as chaves de API da conta. Uma corrida persistente conta quando é enfileirada e não conta novamente quando a execução começa. Os turnos de conversa não consomem unidades adicionais de corrida, embora os limites de inferência aplicáveis ainda se apliquem. Uma solicitação de corrida manual acima da cota retorna HTTP 429 sem criar uma corrida; aguarde a janela de limite de taxa ser limpa antes de tentar novamente.

Uma corrida processa sua conversa turno a turno, enquanto corridas elegíveis da mesma conta podem executar simultaneamente. Antes de cada turno, o AIVAX verifica se a conta pode continuar operando. Uma corrida pode falhar se o saldo for esgotado ou se a inferência não puder continuar. Você pode cancelar uma corrida pendente ou em execução no painel.

O inspetor de corrida retém:

- mensagens do usuário simulado, assistente e juiz em ordem cronológica;
- um timestamp preciso para cada mensagem retida;
- uso de tokens de prompt, prompt em cache e conclusão por mensagem;
- todas as opiniões do juiz, incluindo seu raciocínio, pontuação, estado e valores de trajetória;
- o resultado final da avaliação, informações de falha e custo total cobrado na corrida.

Use as opiniões do juiz para identificar o turno em que a conversa melhorou, ficou em risco, foi bem-sucedida ou entrou em uma perda persistente. O detalhe da corrida também pode ser exportado como JSON para revisão offline.

### Agendar testes recorrentes

Um teste pode ser executado automaticamente a partir de uma expressão cron padrão de cinco campos. O intervalo mínimo suportado é de cinco minutos. Por exemplo, `*/15 * * * *` executa a cada 15 minutos.

Se a cota de nova corrida da conta estiver esgotada, um teste agendado devido aguarda uma verificação de agendamento posterior sem criar uma corrida. O agendamento não contorna a cota nem reserva capacidade separadamente das corridas manuais e avaliações diretas.

Desative o agendamento quando quiser preservar a definição do teste sem criar novas corridas agendadas. Corridas manuais permanecem disponíveis na página do teste.

### Notificações de falha e recuperação

Ative notificações de falha quando falhas repetidas na execução da corrida deveriam alertar o proprietário da conta. O **Limite de notificação** controla quantas corridas consecutivas no estado `failed` são necessárias antes que o AIVAX envie um alerta. O padrão é `1`.

Essas notificações rastreiam erros de execução, não falhas de teste comportamental. Uma corrida no estado `succeeded` foi concluída sem um erro de execução, mas seu resultado comportamental ainda pode ser `loss` (perda) ou `incomplete` (incompleto). Esses resultados não contam para o limite de notificação de falha.

Quando a **Notificação de recuperação** está habilitada, o AIVAX também notifica a conta após uma corrida ser concluída com sucesso seguindo suficientemente muitas falhas de execução consecutivas para atingir o limite configurado. Uma corrida concluída com sucesso redefine o contador de falhas consecutivas, mesmo que seu resultado comportamental seja `loss` ou `incomplete`. Recuperação significa, portanto, que a execução se recuperou, não que o assistente passou nas verificações comportamentais.

### Retenção

Corridas bem-sucedidas e com falha são retidas por um mês. Corridas canceladas são retidas por um dia. Exporte qualquer resultado que deva permanecer disponível além desses períodos.

## Configurações de avaliação

Essas configurações controlam a conversa simulada e o juiz. Testes persistentes as usam; [execução direta via API](#direct-api-execution) aceita as mesmas configurações principais, mas não `hooks`.

| Configuração | Padrão | Valores aceitos | Descrição |
| --- | ---: | --- | --- |
| `validation_criteria` | `null` | String, parte da mensagem ou lista de partes da mensagem | Requisitos opcionais fornecidos apenas ao juiz. Eles não orientam o usuário simulado nem o gateway sob teste. |
| `resources` | `[]` | Objetos `{ "type", "data" }` | Contexto adicional fornecido ao usuário simulado e ao juiz. Use `Text` para `data` literal ou `RemoteResource` para conteúdo recuperado da URL em `data`. |
| `hooks` | `[]` | Objetos `{ "event", "url" }` | Callbacks externos para corridas persistentes. Eventos suportados são `before-test`, `after-test`, `before-inference`, `after-inference` e `context-changed`; `before-inference` e `after-inference` requerem um Gateway de IA. |
| `profile` | `medium` | `low`, `medium`, `high` | Seleciona o nível de capacidade e preço usado pelo usuário simulado e pelo juiz. Não substitui o modelo configurado no gateway sob teste. |
| `max_turns` | `10` | `2`–`64` | Número máximo de turnos do usuário simulado antes que a corrida termine. |
| `minimum_turns` | `1` | `1`–`63`, menor que `max_turns` | Primeiro turno em que o usuário simulado pode receber a opção de encerrar a conversa. |
| `allow_user_exit` | `true` | Booleano | Quando habilitado, o prompt do usuário simulado expõe o token de saída da conversa a partir de `minimum_turns` em diante. Quando desabilitado, essa opção é omitida de todos os prompts do usuário simulado. |
| `judge_start_turn` | `1` | `1`–`63`, menor que `max_turns` | Primeiro turno avaliado pelo juiz. O turno final é sempre avaliado. |
| `loss_threshold` | `0.2` | `0.01`–`0.99` | Limite usado para identificar uma trajetória persistentemente malsucedida. |
| `base_threshold` | `0.9` | `0.01`–`0.99` | Pontuação na qual ou acima da qual o objetivo é considerado alcançado. Deve ser maior que `loss_threshold`, com mais de `0.1` entre eles. |
| `user_sampling.top_k` | `0.4` | `0`–`2` | Controla quantas características de comunicação amostradas orientam o usuário simulado. Valores mais altos aumentam a variação. |
| `user_sampling.max_decay` | `0.02` | `0`–`1` | Controla como as características do usuário amostrado podem mudar entre turnos. |

Orientações de ajuste:

- **`max_turns`**: reduza-o para verificações de regressão rápidas e limitadas; aumente-o para fluxos que naturalmente exigem descoberta ou várias chamadas de ferramenta.
- **`minimum_turns` e `judge_start_turn`**: cada um deve ser menor que `max_turns`; caso contrário, são independentes. `minimum_turns` controla apenas quando o usuário simulado vê sua opção de saída e não atrasa as decisões do juiz.
- **`judge_start_turn`**: atrase-o quando a clarificação inicial for esperada e as pontuações intermediárias não forem úteis.
- **`allow_user_exit`**: desabilite-o quando apenas o juiz ou o orçamento de turno deve encerrar o teste.
- **`loss_threshold` e `base_threshold`**: mantenha uma ampla lacuna entre eles, a menos que a política tenha sido calibrada contra conversas representativas.

## Preços e limites

Cada teste inclui os custos de inferência do modelo ou Gateway de IA selecionado, mais o uso do usuário simulado e do juiz nas taxas do perfil selecionado. O [multiplicador de plano](https://docs.aivax.net/pt-br/docs/pricing.md#plan-multipliers) se aplica.

| Descrição | Preço |
| --- | ---: |
| Modelo ou Gateway de IA sob teste | Taxas regulares de inferência |
| Perfil baixo - usuário simulado | Entrada **$0,25/M tokens**; cache **$0,025/M tokens**; saída **$1,50/M tokens** |
| Perfil baixo - juiz | Entrada **$0,30/M tokens**; cache **$0,03/M tokens**; saída **$2,50/M tokens** |
| Perfil médio - usuário simulado | Entrada **$0,75/M tokens**; cache **$0,075/M tokens**; saída **$3,75/M tokens** |
| Perfil médio - juiz | Entrada **$0,75/M tokens**; cache **$0,075/M tokens**; saída **$3,75/M tokens** |
| Perfil alto - usuário simulado | Entrada **$0,75/M tokens**; cache **$0,075/M tokens**; saída **$3,75/M tokens** |
| Perfil alto - juiz | Entrada **$1,25/M tokens**; cache **$0,15/M tokens**; saída **$4,25/M tokens** |

Um travessão (`—`) significa que o plano não impõe um limite. Contas personalizadas suportam 8 corridas simultâneas por conta.

| Limite | Gratuito | Pro | Máx |
| --- | --- | --- | --- |
| Novas corridas por conta | 5/min | 30/min | — |
| Corridas simultâneas por conta | 1 | 4 | 8 |

Esses limites por minuto são compartilhados entre chaves de API pertencentes à mesma conta. Eles são independentes de subsídios de assinatura e faturamento. Corridas manuais, corridas agendadas e avaliações diretas compartilham uma única cota de nova corrida. Uma corrida persistente consome sua unidade quando é enfileirada, não novamente quando a execução começa; turnos individuais de conversa não consomem unidades adicionais de corrida. Solicitações de corrida manual e avaliações diretas excedentes retornam `429 Too Many Requests` (Muitas Solicitações). Um teste agendado sem cota disponível aguarda uma verificação de agendamento posterior em vez de criar uma corrida extra. Corridas existentes permanecem sujeitas aos seus limites de concorrência e inferência separados.

Pace as solicitações em toda a conta e use retries limitados com backoff após um 429. Um retry imediato ainda encontra a janela de limite de taxa ativa. Max não tem limite imposto pelo plano para novas corridas, mas outros limites aplicáveis permanecem em vigor.

Cada teste aceita até 16 `resources` e 16 `hooks`.

## Execução direta via API

Use o endpoint de avaliação direta quando um aplicativo precisar executar um teste efêmero e consumir seus eventos imediatamente como um stream de Server-Sent Events (SSE). Uma execução direta **não** cria um caso de teste persistente nem uma corrida no painel.

Autentique-se com uma chave de API privada do AIVAX, envie `Accept: text/event-stream` e mantenha a chave em um backend confiável. Não exponha uma chave privada no código do navegador ou em um pacote de aplicativo distribuído.

Cada avaliação direta consome uma unidade da mesma cota de conta das corridas persistentes. Se essa cota for excedida, a solicitação retorna HTTP 429 antes que o stream SSE seja aberto. Verifique o status HTTP antes de processar os eventos e use retries limitados com backoff. Veja [Preços e limites](#pricing-and-limits).

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Evaluate%20Agentic%20Test)

A solicitação aceita as mesmas [configurações de avaliação](#evaluation-settings) principais de um teste persistente, exceto `hooks`. Os campos principais são:

- `model`: o slug do Gateway de IA.
- `goal`: o resultado desejado, compartilhado com o usuário simulado e o juiz.
- `validation_criteria`: requisitos opcionais apenas para o juiz.
- `minimum_turns` e `allow_user_exit`: quando o usuário simulado vê sua opção de saída.
- `judge_start_turn`: quando a avaliação do juiz começa.
- `start`: mensagens iniciais opcionais.
- `resources`: contexto adicional `Text` ou `RemoteResource`.
- `external_user_id`: uma identidade encaminhada para a inferência do gateway.

### Eventos de stream

Cada mensagem de Server-Sent Events contém este envelope:

```json
{
  "timestamp": 1786329000000,
  "event": {
    "type": "chat.start",
    "data": {
      "turn_number": 1,
      "max_remaining_turns": 10
    }
  }
}
```

Encaminhe as mensagens por `event.type` e concatene os chunks de conteúdo streamed em ordem. Os exemplos abaixo mostram o objeto `event` dentro do envelope SSE. Marcadores de ciclo de vida (`start_generation`, `end_generation`, `turn_analysis_start`, `turn_analysis_end`) carregam um objeto vazio (`data: {}`); chunks de raciocínio compartilham a forma `{ "reasoning_content": "..." }`. Apenas eventos com conteúdo são mostrados em full.

- **`chat.start`** — Inicia um turno e relata seu número e orçamento de turno restante.

  ```json
  {
    "type": "chat.start",
    "data": {
      "turn_number": 1,
      "max_remaining_turns": 10
    }
  }
  ```

- **`chat.user_message.start_generation`** — Marca o início da geração da mensagem do usuário simulado (`data: {}`).

- **`chat.user_message.reasoning`** — Stream de um chunk de raciocínio exposto pelo modelo do usuário simulado. Use isso apenas para depuração.

- **`chat.user_message.content`** — Stream de um chunk de conteúdo da mensagem do usuário simulado. Concatene chunks consecutivos na ordem de chegada.

  ```json
  {
    "type": "chat.user_message.content",
    "data": {
      "content": "Can you explain the refund policy?"
    }
  }
  ```

- **`chat.user_message.end_generation`** — Marca o fim da geração da mensagem do usuário simulado (`data: {}`).

- **`chat.user_message.end_conversation`** — Relata uma saída permitida do usuário simulado após `minimum_turns`. Este evento não é emitido quando `allow_user_exit` está desabilitado.

  ```json
  {
    "type": "chat.user_message.end_conversation",
    "data": {
      "reason": "simulated_user_ended_conversation"
    }
  }
  ```

- **`chat.assistant_message.start_generation`** — Marca o início da resposta do gateway selecionado (`data: {}`).

- **`chat.assistant_message.reasoning`** — Stream de um chunk de raciocínio exposto pelo modelo do gateway (mesma forma `reasoning_content`).

- **`chat.assistant_message.refusal`** — Relata uma recusa retornada pelo modelo do gateway.

- **`chat.assistant_message.tool_call`** — Relata uma chamada de ferramenta do assistente, incluindo seu ID, nome e argumentos.

- **`chat.assistant_message.tool_result`** — Relata um resultado de ferramenta, incluindo o ID de chamada associado, nome e conteúdo.

- **`chat.assistant_message.content`** — Stream de um chunk de conteúdo da resposta do assistente. Concatene chunks consecutivos na ordem de chegada.

  ```json
  {
    "type": "chat.assistant_message.content",
    "data": {
      "content": "Refunds are available within 30 days."
    }
  }
  ```

- **`chat.assistant_message.end_generation`** — Marca o fim da resposta do gateway selecionado (`data: {}`).

- **`chat.judge.turn_analysis_start`** — Marca o início de uma avaliação contra o objetivo e quaisquer critérios de validação apenas para o juiz (`data: {}`).

- **`chat.judge.turn_analysis_result_ready`** — Retorna o raciocínio do juiz, pontuação normalizada, estado atual, medições de trajetória e decisão de continuação. `score` varia de `0.001` a `0.999`; `pass` é falso apenas após uma perda persistente ser estabelecida.

  ```json
  {
    "type": "chat.judge.turn_analysis_result_ready",
    "data": {
      "result": {
        "reasoning": "The response satisfied the requested outcome and validation criteria.",
        "score": 0.92,
        "pass": true,
        "should_continue": false,
        "state": "success",
        "turn_delta": 0.84,
        "conversation_delta": 1.0,
        "loss_streak": 0,
        "required_loss_streak": 2
      }
    }
  }
  ```

- **`chat.judge.turn_analysis_end`** — Marca o fim da avaliação do turno atual (`data: {}`).

- **`usage_updated`** — Relata o uso de tokens de prompt, prompt em cache e conclusão. `role` é `user`, `assistant` ou `judge` dependendo da inferência que produziu o uso.

  ```json
  {
    "type": "usage_updated",
    "data": {
      "role": "judge",
      "usage": {
        "prompt_tokens": 1240,
        "cached_prompt_tokens": 320,
        "completion_tokens": 180
      }
    }
  }
  ```

- **`unhandled_error`** — Relata um erro de inferência, seu escopo e se a operação será tentada novamente. `scope` é `user_inference`, `gateway_inference` ou `judge_analysis`.

  ```json
  {
    "type": "unhandled_error",
    "data": {
      "error": "The inference provider is temporarily unavailable.",
      "scope": "gateway_inference",
      "will_retry": true
    }
  }
  ```

- **`chat.validation.end`** — Relata o resultado final e fecha a avaliação. O nome de evento legado é preservado para compatibilidade. `score` é incluído quando o resultado final segue uma avaliação do juiz, mas pode estar ausente quando o orçamento de turno é esgotado.

  ```json
  {
    "type": "chat.validation.end",
    "data": {
      "outcome": "success",
      "reason": "baseline_reached",
      "state": "success",
      "turn_number": 3,
      "score": 0.92,
      "conversation_delta": 1.0,
      "loss_streak": 0
    }
  }
  ```

### Estados e resultados do juiz

O estado do juiz pode ser `active` (ativo), `at_risk` (em risco), `success` (sucesso) ou `loss` (perda). Um turno fraco não falha imediatamente uma conversa recuperável: a pontuação baixa e a trajetória cumulativa devem permanecer no ou abaixo do limite de perda configurado para as avaliações consecutivas necessárias.

Resultados finais são:

| Resultado | Significado |
| --- | --- |
| `success` | O juiz atingiu `base_threshold`. Uma saída permitida do usuário simulado aciona o julgamento, mas não passa o teste por si só; sem o limite, o resultado é `incomplete`. |
| `loss` | A pontuação e a trajetória cumulativa permaneceram no ou abaixo de `loss_threshold` para os turnos julgados consecutivos necessários. |
| `incomplete` | A conversa esgotou `max_turns` sem alcançar o sucesso ou uma perda persistente. |
| `interrupted` | Uma regra de validação parou a avaliação antes que ela fosse concluída. |

### Erros

Uma chave ausente ou inválida retorna `401 Unauthorized`; uma chave de API pública retorna `403 Forbidden`; saldo insuficiente retorna `402 Payment Required`; e campos malformados, slugs de gateway indisponíveis ou combinações de limite inválidas retornam `400 Bad Request`. Uma falha de inferência pode, em vez disso, chegar como um evento SSE após o streaming começar.

Para investigar uma falha de inferência, revise a [configuração do Gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md) usada pelo teste.
