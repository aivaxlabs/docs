---
{title: Começando,linkTitle: Começando,weight: 20,group: Introduction,aliases: [/docs/pt-br/platform/basics.html,/docs/pt-br/platform/models.html,/docs/pt-br/getting-started.html],sourceHash: 40b1a77d40c1f75e}
---

# Começando

Este guia leva você de uma conta AIVAX a uma conclusão de chat compatível com OpenAI verificada. O exemplo usa Python e uma chave de API privada de um ambiente do lado do servidor.

Ao final, você terá confirmado que sua chave e o modelo ou AI Gateway selecionado podem concluir uma solicitação.

## Antes de começar

Você precisa:

- Uma conta AIVAX com acesso ao painel e permissão para criar uma chave de API privada.
- Python 3.8 ou superior com `pip` disponível.

Para preços e limites operacionais, veja [Preços](pricing.md) e [Planos e limites](limits.md).

Production API base URL:

```text
https://inference.aivax.net
```

OpenAI-compatible SDK base URL:

```text
https://inference.aivax.net/v1
```

## 1. Crie uma chave de API privada

Crie uma chave **privada** na área de Chaves de API do painel AIVAX. Copie a chave quando ela for exibida e armazene-a como um segredo; não cole o valor real no código abaixo.

Chaves privadas são destinadas a aplicações confiáveis do lado do servidor. Chaves públicas são credenciais restritas para rotas do lado do cliente intencionalmente expostas e não substituem uma chave de backend.

Se você estiver criando um widget web público ou experiência de mensagens, revise [Chat clients](features/chat-clients.md) antes de expor qualquer credencial. As sessões de chat oferecem um limite mais claro para identidade do usuário, histórico de conversas e anexos.

Consulte [Authentication](authentication.md) para esquemas de autenticação suportados, comportamento de chaves privadas e públicas, e orientações sobre manuseio de segredos.

## 2. Instale o SDK OpenAI

Instale o SDK no ambiente Python que você usará para este exemplo:

```bash
python -m pip install openai
```

Mantenha a chave fora do seu arquivo fonte. Por exemplo, defina uma variável de ambiente chamada `AIVAX_API_KEY` usando o método de gerenciamento de segredos apropriado para seu shell ou plataforma de implantação.

## 3. Escolha um modelo ou AI Gateway

O campo `model` pode identificar:

- Um modelo hospedado retornado pelo endpoint de listagem de modelos.
- Um AI Gateway disponível na sua conta.

Use um **modelo hospedado** para uma chamada direta, pontual ou experimento inicial. Use um **AI Gateway** quando quiser reutilizar o mesmo modelo, instruções, coleções RAG, habilidades, ferramentas, moderação e configurações de saída em várias solicitações ou usuários.

Slugs de gateway são suportados com chaves privadas. Compleções de chat com chave pública devem usar o UUID completo do gateway e não podem chamar modelos integrados diretamente.

Use a referência de listagem de modelos abaixo para escolher um modelo hospedado. Se você já tem um AI Gateway, use seu identificador.

<script src="https://inference.aivax.net/apidocs?embed-target=Model%20listing&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Copie um nome de modelo ou identificador de gateway que esteja disponível na sua conta. Você o usará como `<MODEL_OR_GATEWAY_ID>` na próxima etapa.

## 4. Faça a primeira solicitação

Crie um arquivo chamado `quickstart.py` com o código a seguir:

```python
import os

from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key=os.environ["AIVAX_API_KEY"],
)

response = client.chat.completions.create(
    model="<MODEL_OR_GATEWAY_ID>",
    messages=[
        {"role": "user", "content": "Write a one-sentence welcome message."}
    ],
)

print(response.choices[0].message.content)
```

Substitua `<MODEL_OR_GATEWAY_ID>` pelo nome exato do modelo hospedado ou identificador de gateway selecionado na etapa anterior. Mantenha `AIVAX_API_KEY` inalterado no código: ele é o nome da variável de ambiente, não o valor da chave. Defina essa variável antes de executar o arquivo.

Execute o arquivo:

```bash
python quickstart.py
```

Uma solicitação bem-sucedida imprime uma frase gerada e sai sem erro de API.

Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## 5. Confirme a integração

Confirme que a resposta gerada corresponde ao prompt e vem do modelo ou AI Gateway selecionado na etapa anterior. Isso verifica o endpoint, a credencial e a seleção de modelo usada pela sua aplicação.

Antes de aumentar o tráfego ou processar entradas grandes, revise [Preços](pricing.md) e [Planos e limites](limits.md).

## Solucionar problemas da primeira solicitação

AIVAX usa dois estilos de resposta:

- Endpoints compatíveis com OpenAI retornam um objeto `error` no estilo OpenAI.
- Endpoints de conta e administrativos retornam um envelope de resposta AIVAX com um erro ou um valor `data` bem-sucedido.

| Status | O que verificar |
| --- | --- |
| `400 Bad Request` | Confirme o identificador do modelo ou gateway e remova parâmetros não suportados da solicitação. |
| `401 Unauthorized` | Confirme que a chave privada está presente, completa, ativa e enviada através da configuração do SDK. |
| `402 Payment Required` | Revise [Preços](pricing.md) e confirme que a conta está pronta para uma solicitação paga. |
| `403 Forbidden` | Confirme que o tipo de chave, modelo ou recurso selecionado permite esta operação. |
| `429 Too Many Requests` | Tente novamente mais tarde e revise [Planos e limites](limits.md) antes de aumentar o volume de solicitações. |
| `500 Internal Server Error` | Ocorreu uma falha inesperada da AIVAX. Tente novamente mais tarde; a resposta não inclui detalhes internos. |
| `503 Service Unavailable` | Um serviço do qual a AIVAX depende está temporariamente indisponível. Tente novamente após o intervalo no cabeçalho `Retry-After`. |

Se a solicitação ainda falhar, verifique nesta ordem:

1. `base_url` é `https://inference.aivax.net/v1`.
2. `AIVAX_API_KEY` está disponível para o processo Python e contém uma chave privada.
3. O modelo ou gateway selecionado existe e está disponível para a conta.
4. Para um gateway, teste um prompt simples antes de adicionar RAG, ferramentas, mídia ou saída estruturada para que você possa isolar problemas de configuração.

## Inferência de longa duração

Se uma solicitação terminar com HTTP `524` ou um timeout de proxy enquanto a AIVAX ainda a processa, use o host de inferência direta:

```text
https://direct.inference.aivax.net/v1
```

A solicitação permanece síncrona, não um trabalho em segundo plano: mantenha a conexão do cliente aberta até que a conclusão termine e configure um timeout do cliente que cubra o tempo de processamento esperado.

Use a mesma chave de API privada, identificador de modelo ou AI Gateway, mensagens e parâmetros de solicitação. Altere a URL base do SDK e o timeout:

```python
import os

from openai import OpenAI

client = OpenAI(
    base_url="https://direct.inference.aivax.net/v1",
    api_key=os.environ["AIVAX_API_KEY"],
    timeout=300.0,
)

response = client.chat.completions.create(
    model="<MODEL_OR_GATEWAY_ID>",
    messages=[
        {
            "role": "user",
            "content": "Analyze this case carefully and provide a detailed recommendation.",
        }
    ],
)

print(response.choices[0].message.content)
```

## Escolha o próximo produto

Depois que a solicitação mínima funcionar, adicione uma capacidade de cada vez:

- [AI Gateways](inference/ai-gateway.md) — torne a configuração do assistente reutilizável entre solicitações e usuários.
- [Structured responses](inference/structured-responses.md) — exija que o JSON gerado siga um esquema de aplicação.
- [RAG collections](rag/collections.md) — indexe seus documentos, teste recuperação e anexe conhecimento fundamentado a um gateway.
- [Built-in tools](tools/builtin-tools.md), [MCP](tools/mcp.md) ou [Protocol functions](tools/protocol-functions.md) — permita que o assistente recupere informações ao vivo ou execute ações.
- [Chat clients](features/chat-clients.md) — entregue um gateway via chat web ou canais de mensagem suportados.
- [Text and media products](overview.md#process-text-documents-and-media) — classifique ou segmente documentos, gere imagens ou fala, transcreva áudio e descreva mídia.
- [Batch](features/batch.md) — aplique o mesmo fluxo de trabalho a muitos registros independentes de forma assíncrona.
- [Agentic Tests](inference/agentic-tests.md) — avalie uma conversa completa de gateway antes e depois de alterações de configuração.

Antes de aumentar o tráfego ou processar entradas grandes, revise [Preços](pricing.md) e [Planos e limites](limits.md).
