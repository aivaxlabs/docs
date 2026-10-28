Source: https://docs.aivax.net/pt-br/docs/inference/agentic-tests.html

# Testes Agênticos

Testes Agênticos avaliam como um gateway de IA se comporta ao longo de uma conversa completa e orientada a objetivo, em vez de avaliar uma única resposta isolada. AIVAX simula a próxima mensagem do usuário, envia cada turno ao gateway selecionado e utiliza um juiz independente para determinar se a conversa alcançou seu objetivo, permanece recuperável ou se afastou persistentemente do resultado esperado.

Use os Testes Agênticos para criar verificações de regressão repetíveis para suporte, vendas, integração, uso de ferramentas, RAG e outros fluxos de agente de múltiplas interações. Como um teste roda através do gateway de IA configurado, ele exercita o modelo, instruções, ferramentas, habilidades, conhecimento e configurações de inferência do gateway em conjunto.

## Testes persistentes no painel

Abra **Testes Agênticos** no painel da AIVAX para criar e gerenciar casos de teste reutilizáveis. Um teste armazena:

- o gateway de IA em teste;
- um objetivo que descreve o resultado conversacional esperado e é compartilhado com o usuário simulado e o juiz;
- critérios de validação opcionais usados apenas pelo juiz;
- mensagens iniciais opcionais, recursos externos e um identificador de usuário externo;
- amostragem do usuário simulado, limites de turnos, comportamento de saída e limites de avaliação;
- um cronograma recorrente opcional;
- configurações de notificação de falha e recuperação.

A definição do teste é reutilizável. Cada execução cria uma corrida separada, de modo que alterar um teste posteriormente não substitui o histórico já coletado para execuções anteriores.

### Crie um teste útil

Escreva o objetivo a partir da perspectiva do usuário simulado: descreva quem ele é, o que deseja e como deve progredir na conversa. Não o escreva como instruções para o assistente. O objetivo é compartilhado tanto com o usuário simulado, que o persegue, quanto com o juiz, que o avalia. Por exemplo:

> Você está escolhendo um plano para sua equipe. Explique o tamanho e as necessidades da sua equipe quando solicitado, pergunte qual plano se adequa e continue até entender a recomendação e como se inscrever.

Use **Critérios de validação** para requisitos opcionais que devem afetar apenas a avaliação do juiz, não o comportamento do usuário simulado. Por exemplo:

> A recomendação deve nomear o plano selecionado e vinculá-lo ao tamanho de equipe declarado. A resposta final deve incluir um passo direto de inscrição.

Manter esses critérios separados impede que o usuário simulado direcione artificialmente a conversa para as verificações que o juiz aplicará.

Use **Mensagens iniciais** quando o cenário exigir um contexto estabelecido, como uma objeção de cliente, uma resposta anterior do assistente ou um ponto específico em um fluxo existente. Use `external_user_id` quando o comportamento do gateway depender de uma identidade da sua própria aplicação. O valor é encaminhado para a inferência do gateway em cada execução desse teste.

Use `resources` para fornecer ao usuário simulado e ao juiz um contexto compartilhado que não pertence à conversa inicial. Forneça objetos com um `type` e um valor `data` não vazio; um teste aceita até 16 recursos (veja [Pricing and limits](#pricing-and-limits)). `Text` usa `data` como contexto literal; `RemoteResource` recupera o conteúdo da URL em `data`. Por exemplo:

```json
{
  "resources": [
    {
      "type": "Text",
      "data": "The customer has a 14-day refund window."
    },
    {
      "type": "RemoteResource",
      "data": "https://example.com/refund-policy"
    }
  ]
}
```

Recursos são visíveis ao usuário simulado e ao juiz; eles não são enviados ao gateway em teste como histórico de conversa. Eles não adicionam conhecimento ao gateway. Se o assistente precisar recuperar o mesmo material, disponibilize-o através do próprio conhecimento ou ferramentas do gateway. O usuário simulado ainda pode revelar informações do recurso naturalmente em suas mensagens, portanto não trate os recursos como critérios ocultos apenas para o juiz.

Conteúdo remoto pode mudar entre execuções de teste e contribui para o uso. Use apenas URLs confiáveis e publicamente acessíveis cujo conteúdo seja adequado para o teste.

Um teste focado geralmente fornece resultados mais acionáveis que um cenário amplo. Separe objetivos não relacionados em testes diferentes para que uma falha identifique o comportamento que regrediu.

Siga o [multi-turn conversation testing walkthrough](https://aivax.net/blog/introducing-agentic-tests/) para definir objetivos observáveis, executar uma conversa simulada e inspecionar a recuperação.

### Ganchos de validação

Testes Agênticos persistentes podem chamar ganchos de validação externos durante uma execução. Configure o array `hooks` ao criar ou atualizar um teste:

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
| `after-test` | Depois que o teste atinge um resultado terminal normal e antes que o evento final seja emitido. | O resultado final, razão, estado, número do turno, pontuação, delta da conversa e sequência de perdas. |
| `before-inference` | Uma vez antes da inferência primária do gateway em cada turno. | `turn_number` e o array `messages` atual. |
| `after-inference` | Uma vez após a inferência primária do gateway em cada turno. | `turn_number` e o array `messages` atual. |
| `context-changed` | Uma vez por turno após a resposta do gateway ser concluída. | `turn_number` e o array `messages` atual. |

`before-inference` e `after-inference` estão disponíveis apenas quando o teste tem como alvo um gateway de IA. Ganchos são suportados para testes persistentes no painel e execuções agendadas; o endpoint de validação SSE direto não aceita `hooks`.

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

A URL do gancho deve ser um URL HTTP ou HTTPS absoluto sem credenciais incorporadas e não deve resolver para localhost, loopback, privado, link-local ou outros endereços locais bloqueados. Quando a conta tem uma chave de gancho, a AIVAX também envia `X-Request-Nonce`; valide-a antes de confiar na carga útil. As solicitações de gancho usam `POST` com `Content-Type: application/json`.

Respostas de gancho seguem a convenção do worker: qualquer resposta `2xx` continua a execução; uma resposta não-`2xx` ou falha na requisição HTTP a interrompe imediatamente. O corpo da resposta não seleciona outra ação. A execução interrompida é armazenada como `failed`, emite um resultado terminal com `reason: "validation_hook_interrupted"`, e inclui entradas de auditoria de chamada de gancho no array `result.hooks` da execução. As entradas de auditoria contêm o evento, URL, timestamp, status ou erro, se a execução continuou, e até 4.000 caracteres do corpo da resposta.

### Execute e inspecione um teste

Selecione **Run test** para enfileirar uma execução. Execuções podem ser `pending`, `running`, `succeeded`, `failed` ou `cancelled`. Tanto a taxa de novas execuções quanto a concorrência ao nível da conta dependem do plano atual. Veja [Pricing and limits](#pricing-and-limits) para valores atuais.

Execuções manuais, execuções agendadas e avaliações diretas via API compartilham uma única cota de novas execuções nas chaves de API da conta. Uma execução persistente conta quando está enfileirada e não conta novamente quando a execução começa. Turnos de conversa não consomem unidades de execução adicionais, embora limites de inferência aplicáveis ainda se apliquem. Uma solicitação de execução manual acima da cota devolve HTTP 429 sem criar uma execução; aguarde a janela de limite de taxa limpar antes de tentar novamente.

Uma execução processa sua conversa sequencialmente, enquanto execuções elegíveis da mesma conta podem ser executadas simultaneamente. Cada turno verifica se a conta pode continuar operando. Uma execução pode falhar se o saldo for esgotado ou a inferência não puder continuar, e uma execução pendente ou em execução pode ser cancelada a partir do painel.

O inspetor de execução retém:

- mensagens do usuário simulado, assistente e juiz em ordem cronológica;
- um timestamp preciso para cada mensagem retida;
- uso de tokens de prompt, prompt em cache e conclusão por mensagem;
- toda opinião do juiz, incluindo seu raciocínio, pontuação, estado e valores de trajetória;
- o resultado final da avaliação, informações de falha e custo total cobrado na execução.

Use as opiniões do juiz para identificar o turno em que a conversa melhorou, ficou em risco, teve sucesso ou entrou em perda persistente. O detalhe da execução também pode ser exportado como JSON para revisão offline.

### Agendar testes recorrentes

Um teste pode ser executado automaticamente a partir de uma expressão cron padrão de cinco campos. O intervalo mínimo suportado é cinco minutos. Por exemplo, `*/15 * * * *` roda a cada 15 minutos.

Se a cota de novas execuções da conta for esgotada, um teste agendado devido aguarda uma verificação de agendamento posterior sem criar uma execução. O agendamento não contorna a cota nem reserva capacidade separadamente das execuções manuais e avaliações diretas.

Desative o agendamento quando quiser preservar a definição do teste sem criar novas execuções agendadas. Execuções manuais permanecem disponíveis na página do teste.

### Notificações de falha e recuperação

Ative notificações de falha quando falhas repetidas de execução devem alertar o proprietário da conta. **Notification threshold** controla quantas execuções consecutivas no estado `failed` são necessárias antes que a AIVAX envie um alerta. O padrão é `1`.

Essas notificações acompanham erros de execução, não falhas de teste comportamentais. Uma execução no estado `succeeded` concluiu sem erro de execução, mas seu resultado comportamental ainda pode ser `loss` ou `incomplete`. Esses resultados não contam para o limite de notificação de falha.

Quando a **Recovery notification** está ativada, a AIVAX também notifica a conta após uma execução concluir com sucesso após falhas de execução consecutivas suficientes para atingir o limite configurado. Uma execução concluída com sucesso redefine o contador de falhas consecutivas, mesmo que seu resultado comportamental seja `loss` ou `incomplete`. Portanto, recuperação significa que a execução se recuperou, não que o assistente passou nas verificações comportamentais.

### Retenção

Execuções bem-sucedidas e falhas são mantidas por um mês. Execuções canceladas são mantidas por um dia. Exporte qualquer resultado que de permanecer disponível além desses períodos.

## Configurações de avaliação

| Configuração | Padrão | Valores aceitos | Descrição |
|---|---|---|---|
| `validation_criteria` | `null` | String, parte de mensagem ou lista de partes de mensagem | Requisitos opcionais fornecidos apenas ao juiz. Eles não orientam o usuário simulado nem o gateway em teste. |
| `resources` | `[]` | objetos `{ "type", "data" }` | Contexto adicional fornecido ao usuário simulado e ao juiz. Use `Text` para `data` literal ou `RemoteResource` para conteúdo recuperado da URL em `data`. |
| `hooks` | `[]` | objetos `{ "event", "url" }` | Callbacks externos para execuções persistentes. Eventos suportados são `before-test`, `after-test`, `before-inference`, `after-inference` e `context-changed`; `before-inference` e `after-inference` requerem um gateway de IA. |
| `profile` | `medium` | `low`, `medium`, `high` | Seleciona a capacidade e o nível de preço usados pelo usuário simulado e pelo juiz. Não substitui o modelo configurado no gateway em teste. |
| `max_turns` | `10` | `2`–`64` | Número máximo de turnos do usuário simulado antes que a execução termine. |
| `minimum_turns` | `1` | `1`–`63`, menor que `max_turns` | Primeiro turno em que o usuário simulado pode receber a opção de encerrar a conversa. |
| `allow_user_exit` | `true` | Boolean | Quando habilitado, o prompt do usuário simulado expõe o token de saída da conversa a partir de `minimum_turns`. Quando desabilitado, essa opção é omitida de todo prompt do usuário simulado. |
| `judge_start_turn` | `1` | `1`–`63`, menor que `max_turns` | Primeiro turno avaliado pelo juiz. O turno final é sempre avaliado. |
| `loss_threshold` | `0.2` | `0.01`–`0.99` | Limite usado para identificar uma trajetória persistentemente malsucedida. |
| `base_threshold` | `0.9` | `0.01`–`0.99` | Pontuação igual ou superior à qual o objetivo é considerado alcançado. Deve ser maior que `loss_threshold`, com mais de `0.1` entre eles. |
| `user_sampling.top_k` | `0.4` | `0`–`2` | Controla quantas características de comunicação amostradas guiam o usuário simulado. Valores maiores aumentam a variação. |
| `user_sampling.max_decay` | `0.02` | `0`–`1` | Controla como as características amostradas do usuário podem mudar entre turnos. |

Reduza `max_turns` para verificações de regressão rápidas e delimitadas. Aumente para fluxos que naturalmente requerem descoberta ou várias chamadas de ferramenta. `minimum_turns` e `judge_start_turn` devem ser menores que `max_turns`; caso contrário são independentes. Adie `judge_start_turn` quando se espera esclarecimento precoce e pontuações intermediárias não são úteis. Desative `allow_user_exit` quando somente o juiz ou o orçamento de turnos deve encerrar o teste; `minimum_turns` controla apenas quando o usuário simulado vê sua opção de saída e não atrasa decisões do juiz. Mantenha uma grande diferença entre os limites de perda e sucesso, a menos que a política tenha sido calibrada contra conversas representativas.

## Preços e limites

Cada teste inclui as cobranças de inferência do modelo ou gateway de IA selecionado, mais o uso do usuário simulado e do juiz nas taxas do perfil selecionado. O [plan multiplier](https://docs.aivax.net/pt-br/docs/pricing.md#plan-multipliers) se aplica.

| Descrição | Preço |
|---|---|
| Modelo ou gateway de IA em teste | Taxas de inferência regulares |
| Perfil baixo - usuário simulado | Entrada **$0.25/M tokens**; cache **$0.025/M tokens**; saída **$1.50/M tokens** |
| Perfil baixo - juiz | Entrada **$0.30/M tokens**; cache **$0.03/M tokens**; saída **$2.50/M tokens** |
| Perfil médio - usuário simulado | Entrada **$0.75/M tokens**; cache **$0.075/M tokens**; saída **$3.75/M tokens** |
| Perfil médio - juiz | Entrada **$0.75/M tokens**; cache **$0.075/M tokens**; saída **$3.75/M tokens** |
| Perfil alto - usuário simulado | Entrada **$0.75/M tokens**; cache **$0.075/M tokens**; saída **$3.75/M tokens** |
| Perfil alto - juiz | Entrada **$1.25/M tokens**; cache **$0.15/M tokens**; saída **$4.25/M tokens** |

Um travessão (`—`) significa que o plano não impõe limite. Contas personalizadas suportam 8 execuções simultâneas por conta.

| Limite | Gratuito | Pro | Máx |
|---|---|---|---|
| Novas execuções por conta | 5/min | 30/min | — |
| Execuções simultâneas por conta | 1 | 4 | 8 |

Esses limites por minuto são compartilhados entre chaves de API pertencentes à mesma conta. Eles são independentes das permissões de assinatura e faturamento. Execuções manuais, execuções agendadas e avaliações diretas compartilham uma única cota de novas execuções. Uma execução persistente consome sua unidade quando está enfileirada, não novamente quando a execução começa; turnos individuais de conversa não consomem unidades de execução adicionais. Solicitações excessivas de execuções manuais e avaliações diretas retornam `429 Too Many Requests`. Um teste agendado sem cota disponível aguarda uma verificação de agendamento posterior ao invés de criar uma execução extra. Execuções existentes permanecem sujeitas aos seus limites de concorrência e inferência separados.

Regule as solicitações na conta e use tentativas limitadas com backoff após um 429. Uma tentativa imediata ainda encontra a janela de limite de taxa ativa. O Max não tem limite imposto por plano para novas execuções, mas outros limites aplicáveis permanecem em vigor.

Cada teste aceita até 16 `resources` e 16 `hooks`.

## Execução direta via API

Cada avaliação direta consome uma unidade da mesma cota de conta que execuções persistentes. Se essa cota for excedida, a solicitação retorna HTTP 429 antes de abrir o stream SSE. Verifique o status HTTP antes de processar eventos e use tentativas limitadas com backoff. Veja [Pricing and limits](#pricing-and-limits).

Use o endpoint de geração direta quando um aplicativo precisa executar um teste efêmero e consumir seus eventos imediatamente. Uma execução direta **não** cria um caso de teste persistente ou execução no painel.

Autentique-se com uma chave de API privada da AIVAX, envie `Accept: text/event-stream` e mantenha a chave em um backend confiável. Não exponha uma chave privada em código de navegador ou pacote de aplicativo distribuído.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Evaluate%20Agentic%20Test)

A solicitação aceita as mesmas configurações principais de avaliação de um teste persistente. Use `model` para o slug do gateway de IA, `goal` para o resultado desejado compartilhado com o usuário simulado e o juiz, `validation_criteria` para requisitos opcionais apenas do juiz, `minimum_turns` e `allow_user_exit` para controlar quando o usuário simulado vê sua opção de saída, `judge_start_turn` para agendar a avaliação do juiz, `start` para mensagens iniciais opcionais, `resources` para contexto adicional `Text` ou `RemoteResource`, e `external_user_id` para uma identidade encaminhada à inferência do gateway.

Every Server-Sent Events message contains this envelope:

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

Roteie mensagens por `event.type` e concatene os blocos de conteúdo transmitidos em ordem. Os exemplos abaixo mostram o objeto `event` dentro do envelope SSE. Marcadores de ciclo de vida (`start_generation`, `end_generation`, `turn_analysis_start`, `turn_analysis_end`) carregam um objeto vazio (`data: {}`); blocos de raciocínio compartilham a forma `{ "reasoning_content": "..." }`. Apenas eventos com conteúdo são mostrados integralmente.

- **`chat.start`** — Inicia um turno e relata seu número e o orçamento de turnos restante.

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

- **`chat.user_message.reasoning`** — Transmite um bloco de raciocínio exposto pelo modelo do usuário simulado. Use apenas para depuração.

- **`chat.user_message.content`** — Transmite um bloco de conteúdo da mensagem do usuário simulado. Concatene blocos consecutivos na ordem de chegada.

  ```json
  {
    "type": "chat.user_message.content",
    "data": {
      "content": "Can you explain the refund policy?"
    }
  }
  ```

- **`chat.user_message.end_generation`** — Marca o fim da geração da mensagem do usuário simulado (`data: {}`).

- **`chat.user_message.end_conversation`** — Relata uma saída permitida do usuário simulado após `minimum_turns`. Este evento não é emitido quando `allow_user_exit` está desativado.

  ```json
  {
    "type": "chat.user_message.end_conversation",
    "data": {
      "reason": "simulated_user_ended_conversation"
    }
  }
  ```

- **`chat.assistant_message.start_generation`** — Marca o início da resposta do gateway selecionado (`data: {}`).

- **`chat.assistant_message.reasoning`** — Transmite um bloco de raciocínio exposto pelo modelo do gateway (mesma forma `reasoning_content`).

- **`chat.assistant_message.refusal`** — Relata uma recusa retornada pelo modelo do gateway.

- **`chat.assistant_message.tool_call`** — Relata uma chamada de ferramenta do assistente, incluindo seu ID, nome e argumentos.

- **`chat.assistant_message.tool_result`** — Relata um resultado de ferramenta, incluindo o ID da chamada associada, nome e conteúdo.

- **`chat.assistant_message.content`** — Transmite um bloco de conteúdo da resposta do assistente. Concatene blocos consecutivos na ordem de chegada.

  ```json
  {
    "type": "chat.assistant_message.content",
    "data": {
      "content": "Refunds are available within 30 days."
    }
  }
  ```

- **`chat.assistant_message.end_generation`** — Marca o fim da resposta do gateway selecionado (`data: {}`).

- **`chat.judge.turn_analysis_start`** — Marca o início de uma avaliação contra o objetivo e quaisquer critérios de validação apenas do juiz (`data: {}`).

- **`chat.judge.turn_analysis_result_ready`** — Retorna o raciocínio do juiz, pontuação normalizada, estado atual, medições de trajetória e decisão de continuação. `score` varia de `0.001` a `0.999`; `pass` é falso somente após uma perda persistente ser estabelecida.

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

- **`usage_updated`** — Relata uso de tokens de prompt, prompt em cache e conclusão. `role` é `user`, `assistant` ou `judge` dependendo da inferência que produziu o uso.

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

- **`unhandled_error`** — Relata um erro de inferência, seu escopo e se a operação será repetida. `scope` é `user_inference`, `gateway_inference` ou `judge_analysis`.

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

- **`chat.validation.end`** — Relata o resultado final e encerra a avaliação. O nome do evento legado é preservado para compatibilidade. `score` é incluído quando o resultado final segue uma avaliação do juiz, mas pode estar ausente quando o orçamento de turnos se esgota.

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

O estado do juiz pode ser `active`, `at_risk`, `success` ou `loss`. Um turno fraco não falha imediatamente uma conversa recuperável: a pontuação baixa e a trajetória cumulativa devem permanecer iguais ou abaixo do limite de perda configurado para as avaliações consecutivas necessárias.

Os resultados finais são:

| Resultado | Significado |
|---|---|
| `success` | O juiz alcançou `base_threshold`. Uma saída permitida do usuário simulado dispara a avaliação mas não passa o teste por si; sem o limite o resultado é `incomplete`. |
| `loss` | A pontuação e a trajetória cumulativa permaneceram iguais ou abaixo de `loss_threshold` nas avaliações consecutivas necessárias. |
| `incomplete` | A conversa esgotou `max_turns` sem alcançar sucesso ou uma perda persistente. |
| `interrupted` | Uma regra de validação interrompeu a avaliação antes de ser concluída. |

Uma chave ausente ou inválida retorna `401 Unauthorized`; uma chave de API pública retorna `403 Forbidden`; saldo insuficiente retorna `402 Payment Required`; campos malformados, slugs de gateway indisponíveis ou combinações de limites inválidas retornam `400 Bad Request`. Uma falha de inferência pode chegar como um evento SSE após o início da transmissão.

Para investigar uma falha de inferência, revise a [AI Gateway configuration](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md) usada pelo teste.
