Source: https://docs.aivax.net/pt-br/docs/inference/chat-completions/moderation.html

# Moderação

A moderação aplica a política de segurança às solicitações dos usuários antes que o modelo principal as responda. Utilize-a para bloquear solicitações inseguras ou fora da política em assistentes voltados ao usuário. Configure-a na seção **Content Moderation** do editor do gateway ou em `parameters.moderationParameters`.

A moderação é uma configuração do AI Gateway; chamadas diretas a `chat/completions` com um nome de modelo não a executam, e as solicitações não podem alterá-la.

## Escolha um modo

O campo `moderationParameters.mode` seleciona como a moderação é executada:

| | `LayeredGuardrail` (padrão) | `SelfAssessment` |
| --- | --- | --- |
| Quem decide | Um modelo de salvaguarda independente, antes do modelo principal | O próprio modelo principal |
| Inferência extra | Sim, cobrada como uso de moderação | Não |
| Latência adicionada | Uma inferência de salvaguarda | Nenhuma |
| Isolamento | Independente do modelo principal e de suas instruções | Depende do julgamento do modelo principal |
| Requisitos do modelo | Nenhum | O modelo principal deve suportar chamada de ferramentas |

- `LayeredGuardrail`: Um modelo de salvaguarda independente analisa o texto de entrada da conversa antes do modelo principal. As conversas sinalizadas são bloqueadas, e o modelo principal responde com uma recusa. O uso de moderação é cobrado conforme descrito em [Preços de inferência](https://docs.aivax.net/pt-br/docs/inference/chat-completions/concepts.md#pricing).
- `SelfAssessment`: Nenhum modelo de salvaguarda separado é executado, portanto, não há cobrança por análise de moderação. O modelo principal recebe instruções de moderação construídas a partir dos mesmos níveis de sensibilidade das categorias e regras adicionais. Quando ele julga que a solicitação mais recente atinge o limite de uma categoria habilitada, a inferência termina com uma mensagem de recusa para o usuário e a resposta é marcada como recusa.

O `SelfAssessment` troca isolamento por menor latência e custo: a aplicação depende do julgamento do modelo principal. Prefira `LayeredGuardrail` quando tentativas de jailbreak forem um risco real.

## Categorias

No modo `LayeredGuardrail`, quando pelo menos uma categoria de moderação está habilitada, o AIVAX envia o texto disponível da conversa para um modelo de salvaguarda. A salvaguarda avalia a solicitação mais recente do usuário no contexto estabelecido pela conversa e retorna uma pontuação de 0 a 10 para cada categoria.

| Categoria | Propriedade do Gateway | O que a salvaguarda avalia |
| --- | --- | --- |
| **Violência e discurso de ódio** | `violenceThreshold` | Violência, ódio, extremismo, ameaças ou incentivo a danos físicos. |
| **Conteúdo sexual e explícito** | `sexualExplicitThreshold` | Conteúdo sexualmente explícito ou adulto. |
| **Tópicos políticos** | `politicalThreshold` | Persuasão política, campanhas, manipulação ou conteúdo altamente político. |
| **Conteúdo perigoso** | `dangerousContentThreshold` | Armas, explosivos, abuso cibernético, autolesão ou outros atos e instruções perigosas. |
| **Tentativas de jailbreak** | `jailbreakThreshold` | Tentativas de ignorar instruções, revelar instruções protegidas, exfiltrar dados ou injetar prompts. |

## Entenda os níveis de sensibilidade

O valor configurado no gateway é um **nível de sensibilidade** de `0` a `10`, não a pontuação da salvaguarda em si. Um nível mais alto reduz a pontuação necessária para bloquear a entrada. Valores fora dessa faixa são rejeitados quando o gateway é salvo.

| Nível de sensibilidade | Pontuações da salvaguarda que bloqueiam |
| ---: | --- |
| `0` | Categoria desabilitada |
| `1` | `10` |
| `3` | `8`–`10` |
| `5` | `6`–`10` |
| `8` | `3`–`10` |
| `10` | `1`–`10` |

Para categorias habilitadas, o corte de bloqueio é `11 - nível de sensibilidade`. Uma pontuação de salvaguarda de `0` nunca bloqueia. Configure cada categoria independentemente; a solicitação é bloqueada quando qualquer categoria habilitada atinge seu corte.

No modo `SelfAssessment`, os mesmos níveis de sensibilidade definem o limite que o modelo principal deve aplicar, embora não haja uma pontuação numérica de salvaguarda.

## Adicione regras específicas do gateway

As **regras adicionais de moderação** permitem que um administrador do gateway descreva políticas que não estão totalmente expressas pelas descrições das categorias integradas. A salvaguarda lê essas regras junto com a política integrada e as usa para calibrar todas as cinco pontuações. No modo `SelfAssessment`, o modelo principal recebe as mesmas regras com suas instruções de moderação.

Por exemplo:

```text
Permita que os usuários descrevam acidentes e lesões ao solicitar cobertura ou assistência de seguro.
Trate solicitações de instruções para causar um acidente ou prejudicar alguém como conteúdo perigoso.
```

Regras adicionais orientam a classificação; elas não criam uma pontuação separada nem bloqueiam uma entrada diretamente. Pelo menos uma categoria deve ter um nível de sensibilidade acima de `0` para que a moderação seja executada. No exemplo acima, habilite **Conteúdo perigoso** para que a pontuação da salvaguarda possa produzir uma decisão de bloqueio.

Escreva regras como declarações de política curtas com casos permitidos e proibidos explícitos. Não inclua segredos, credenciais ou dados operacionais privados, pois as regras são armazenadas com a configuração do gateway e enviadas ao modelo de salvaguarda durante a moderação.

O seguinte fragmento de gateway habilita diferentes níveis de sensibilidade e fornece orientação específica do domínio à salvaguarda. Os valores são um exemplo, não uma linha de base recomendada para produção:

```json
{
  "moderationParameters": {
    "mode": "LayeredGuardrail",
    "violenceThreshold": 4,
    "sexualExplicitThreshold": 4,
    "politicalThreshold": 2,
    "dangerousContentThreshold": 6,
    "jailbreakThreshold": 7,
    "additionalRules": "Allow descriptions of accidents and injuries for insurance support. Treat instructions to cause accidents or harm someone as dangerous content."
  }
}
```

## O que acontece quando uma entrada é bloqueada

Quando qualquer categoria habilitada atinge seu corte:

1. As mensagens originais da conversa não são enviadas ao modelo principal.
2. O modelo principal recebe uma instrução identificando as categorias que causaram o bloqueio.
3. O modelo principal gera uma recusa em vez de responder à solicitação original.

A recusa é gerada pelo modelo; a moderação não retorna um corpo de resposta fixo. Solicitações bloqueadas ainda são cobradas pela análise de moderação e pela geração da recusa.

## Se a moderação não puder ser executada

No modo `LayeredGuardrail`, se a moderação não puder produzir um resultado, a solicitação não será rejeitada: o modelo principal aplica a política configurada por conta própria. Se seu aplicativo deve falhar de forma segura (fail closed) quando a moderação estiver indisponível, imponha isso no seu aplicativo ou em um worker.

## Onde a moderação é executada no pipeline

A moderação é executada uma vez por solicitação, antes que o loop agentic comece. Veja [Pipeline de processamento](https://docs.aivax.net/pt-br/docs/inference/chat-completions/processing-pipeline.md) para a ordem completa. Como consequência:

- [Workers](https://docs.aivax.net/pt-br/docs/inference/workers.md) são executados primeiro. Um worker pode bloquear uma solicitação antes que a moderação seja executada, e a moderação avalia a conversa conforme alterada pelo worker.
- Documentos recuperados por injeção de [estratégias RAG](https://docs.aivax.net/pt-br/docs/inference/chat-completions/processing-pipeline.md#rag) já estão na última mensagem do usuário, então a salvaguarda os avalia junto com o texto do usuário.
- Resultados de ferramentas produzidos posteriormente na mesma solicitação, incluindo resultados de pesquisa `QueryFunction`, não são moderados.
- [Pré-processamento multimodal](https://docs.aivax.net/pt-br/docs/inference/chat-completions/multimodal-pre-processing.md) é executado depois, então as descrições de mídia não são moderadas.

## Escopo

No modo `LayeredGuardrail`, a salvaguarda lê todo o histórico da conversa, não apenas a mensagem mais recente. A moderação cobre apenas texto de entrada:

- Saída gerada não é moderada.
- Imagens, áudio, vídeo e conteúdos de arquivo não são analisados. A salvaguarda recebe apenas um marcador indicando que havia mídia presente.
- Autorização de ferramentas ou workers ainda requer política em nível de aplicativo; a moderação não é um mecanismo de autorização.

Use a moderação para políticas amplas de segurança. Use workers quando a decisão depender de identidade externa, estado da conta ou política específica do negócio.

Para saber quando a autoavaliação é suficiente e quando a salvaguarda separada permanece necessária, com tempos de execução em ambientes reais, consulte [API de moderação LLM: camada separada ou autoavaliação do modelo?](https://aivax.net/blog/aivax-gateway-moderation/).
