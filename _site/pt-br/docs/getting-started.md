Source: https://docs.aivax.net/pt-br/docs/getting-started.html

# Iniciando

Este guia leva você de uma conta AIVAX a um chat de conclusão compatível com OpenAI verificado. O exemplo usa Python e uma chave de API privada de um ambiente servidor.

Ao final, você terá confirmado que sua chave e o modelo ou AI Gateway selecionado podem concluir uma solicitação.

## Antes de começar

Você precisa:

- Uma conta AIVAX com acesso ao painel e permissão para criar uma chave de API privada.
- Python 3.8 ou superior com `pip` disponível.

Para preços e limites operacionais, veja [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) e [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md).

URL base da API de produção:

```text
https://inference.aivax.net
```

URL base do SDK compatível com OpenAI:

```text
https://inference.aivax.net/v1
```

## 1. Crie uma chave de API privada

Crie uma chave **privada** na área de Chaves de API do painel AIVAX. Copie a chave quando ela for exibida e armazene‑a como um segredo; não cole o valor real no código abaixo.

Chaves privadas são destinadas a aplicações servidoras confiáveis. Chaves públicas são credenciais restritas para rotas cliente expostas intencionalmente e não substituem uma chave de backend.

Se você está criando um widget web público ou experiência de mensagens, revise [Clientes de chat](https://docs.aivax.net/pt-br/docs/features/chat-clients.md) antes de expor qualquer credencial. As sessões de chat fornecem um limite mais claro para identidade do usuário, histórico de conversas e anexos.

Veja [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md) para esquemas de autenticação suportados, comportamento de chaves privadas e públicas e orientações sobre manejo de segredos.

## 2. Instale o SDK OpenAI

Instale o SDK no ambiente Python que você usará para este exemplo:

```bash
python -m pip install openai
```

Mantenha a chave fora do seu arquivo fonte. Por exemplo, defina uma variável de ambiente chamada `AIVAX_API_KEY` usando o método de gerenciamento de segredos adequado ao seu shell ou plataforma de implantação.

## 3. Escolha um modelo ou AI Gateway

O campo `model` pode identificar:

- Um modelo hospedado retornado pelo endpoint de listagem de modelos.
- Um AI Gateway disponível na sua conta.

Use um **modelo hospedado** para uma chamada direta, única ou experimento inicial. Use um **AI Gateway** quando quiser reutilizar o mesmo modelo, instruções, coleções RAG, habilidades, ferramentas, moderação e configurações de saída em várias solicitações ou usuários.

Slugs de gateway são suportados com chaves privadas. Compleções de chat com chave pública devem usar o UUID completo do gateway e não podem chamar modelos integrados diretamente.

Referência:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Model%20listing)

Copie um nome de modelo ou identificador de gateway que esteja disponível na sua conta. Você o usará como `<MODEL_OR_GATEWAY_ID>` na próxima etapa.

## 4. Faça a primeira solicitação

Crie um arquivo chamado `quickstart.py` com o seguinte código:

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

Substitua `<MODEL_OR_GATEWAY_ID>` pelo nome exato do modelo hospedado ou identificador de gateway selecionado na etapa anterior. Não substitua `AIVAX_API_KEY` pela própria chave; o código lê o segredo do ambiente.

Execute o arquivo:

```bash
python quickstart.py
```

Uma solicitação bem‑sucedida imprime uma frase gerada e sai sem erro de API.

Referência:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Inference%20(chat%20completions))

## 5. Confirme a integração

Confirme que a resposta gerada corresponde ao prompt e provém do modelo ou AI Gateway selecionado na etapa anterior. Isso verifica o endpoint, credencial e seleção de modelo usados pela sua aplicação.

Antes de aumentar o tráfego ou processar entradas grandes, revise [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) e [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md).

## Solucionar problemas da primeira solicitação

AIVAX usa dois estilos de resposta:

- Endpoints compatíveis com OpenAI retornam um objeto `error` no estilo OpenAI.
- Endpoints de conta e administrativos retornam um envelope de resposta AIVAX com um erro ou um valor `data` bem‑sucedido.

| Status | O que verificar |
| --- | --- |
| `400 Bad Request` | Confirme o identificador do modelo ou gateway e remova parâmetros não suportados da solicitação. |
| `401 Unauthorized` | Confirme que a chave privada está presente, completa, ativa e enviada via configuração do SDK. |
| `402 Payment Required` | Revise [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) e confirme que a conta está pronta para uma solicitação cobrável. |
| `403 Forbidden` | Confirme que o tipo de chave, modelo ou recurso selecionado permite esta operação. |
| `429 Too Many Requests` | Tente novamente mais tarde e revise [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md) antes de aumentar o volume de solicitações. |
| `500 Internal Server Error` | Ocorreu uma falha inesperada da AIVAX. Tente novamente mais tarde; a resposta não inclui detalhes internos. |
| `503 Service Unavailable` | Um serviço do qual a AIVAX depende está temporariamente indisponível. Tente novamente após o intervalo indicado no cabeçalho `Retry-After`. |

Se a solicitação ainda falhar, verifique na seguinte ordem:

1. `base_url` é `https://inference.aivax.net/v1`.
2. `AIVAX_API_KEY` está disponível para o processo Python e contém uma chave privada.
3. O modelo ou gateway selecionado existe e está disponível para a conta.
4. Para um gateway, teste um prompt simples antes de adicionar RAG, ferramentas, mídia ou saída estruturada, assim você pode isolar problemas de configuração.

## Inferência de longa duração

Se uma solicitação terminar com HTTP `524` ou um timeout de proxy enquanto a AIVAX ainda a processa, use o host de inferência direta:

```text
https://direct.inference.aivax.net/v1
```

A solicitação permanece síncrona, não um trabalho em segundo plano: mantenha a conexão do cliente aberta até que a conclusão termine e configure um timeout do cliente que cubra o tempo de processamento esperado.

Use a mesma chave de API privada, modelo ou identificador de AI Gateway, mensagens e parâmetros de solicitação. Altere a URL base do SDK e o timeout:

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

Depois que a solicitação mínima funcionar, adicione uma capacidade por vez:

- [AI Gateways](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md) — torne a configuração do assistente reutilizável entre solicitações e usuários.
- [Structured responses](https://docs.aivax.net/pt-br/docs/inference/structured-responses.md) — exija que o JSON gerado siga um esquema de aplicação.
- [RAG collections](https://docs.aivax.net/pt-br/docs/rag/collections.md) — indexe seus documentos, teste a recuperação e anexe conhecimento fundamentado a um gateway.
- [Built-in tools](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md), [MCP](https://docs.aivax.net/pt-br/docs/tools/mcp.md) ou [Protocol functions](https://docs.aivax.net/pt-br/docs/tools/protocol-functions.md) — permita que o assistente recupere informações ao vivo ou execute ações.
- [Chat clients](https://docs.aivax.net/pt-br/docs/features/chat-clients.md) — entregue um gateway via chat web ou canais de mensagens suportados.
- [Text and media products](https://docs.aivax.net/pt-br/docs/overview.md#process-text-documents-and-media) — classifique ou segmente documentos, gere imagens ou fala, transcreva áudio e descreva mídia.
- [Batch](https://docs.aivax.net/pt-br/docs/features/batch.md) — aplique o mesmo fluxo de trabalho a muitos registros independentes de forma assíncrona.
- [Agentic Tests](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md) — avalie uma conversa completa de gateway antes e depois de alterações de configuração.

Antes de aumentar o tráfego ou processar entradas grandes, revise [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) e [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md).
