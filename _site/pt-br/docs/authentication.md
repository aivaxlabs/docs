Source: https://docs.aivax.net/pt-br/docs/authentication.html

# Autenticação

AIVAX autentica solicitações de API com chaves de API de conta. AIVAX aceita chaves de API via:

- `Authorization: Bearer <API_KEY>`
- `Authorization: Basic <BASE64_USERNAME_COLON_API_KEY>`
- `?api-key=<API_KEY>`

Prefira o cabeçalho `Authorization` para chamadas servidor‑para‑servidor. Use o parâmetro de consulta apenas quando um cliente ou integração não puder enviar cabeçalhos, pois URLs podem ser registradas por proxies, navegadores e ferramentas de monitoramento.

## Tipos de chave de API

AIVAX possui duas famílias de chaves porque os casos de uso voltados para navegador e para servidor têm perfis de risco diferentes. Se seu código roda no seu servidor, use uma chave privada e mantenha‑a fora de bundles de cliente, logs e repositórios públicos. Se seu código roda em um navegador ou outro ambiente onde a chave pode ser inspecionada pelo usuário final, use uma chave pública e limite o fluxo a rotas projetadas para acesso público.

| Tipo | Prefixo | Uso pretendido | Acesso |
| --- | --- | --- | --- |
| Chave privada | `sk-aiv-acc` | Integrações do lado do servidor e chamadas de API administrativas. | APIs de conta autenticadas e inferência compatível com OpenAI. |
| Chave pública | `pk-aiv-` | Chamadas do lado do cliente restritas a rotas explicitamente públicas. | Rotas públicas de consulta/resposta RAG e chamadas restritas de conclusão de chat. |

Chaves públicas podem ser usadas para pesquisa semântica RAG, geração de respostas RAG, geração de fala, descrições de mídia, geração de imagens e conclusões de chat. Quando uma chave pública chama conclusões de chat:

- O `model` deve ser um UUID completo de gateway de IA; chamadas diretas a modelos integrados e busca por slug de gateway são desativadas.
- Fontes MCP, funções de protocolo, ferramentas incorporadas, Bash, habilidades e opções de sentinela são removidas da solicitação.
- Apenas os seguintes parâmetros de solicitação são aceitos: `model`, `messages`, `prompt`, `temperature`, `top_p`, `top_k`, `seed`, `tools`, `reasoning_effort`, `max_completion_tokens`, `idempotency_key` e `stream`.
- Limites de taxa de requisição e de tokens são aplicados tanto globalmente por chave quanto por endereço remoto. Consulte [Public API keys](https://docs.aivax.net/pt-br/docs/limits.md#public-api-keys) para os valores atuais.

Use chaves privadas para serviços de backend, gerenciamento de conta, listagem de modelos, gerenciamento de coleções, operações em lote e qualquer fluxo que necessite da superfície completa de ferramentas do gateway.

Para a primeira solicitação do lado do servidor, continue com [Make your first request](https://docs.aivax.net/pt-br/docs/overview.md#make-your-first-request). Se você estiver expondo uma experiência de navegador ou widget para usuários finais, revise [Chat Clients](https://docs.aivax.net/pt-br/docs/inference/chat-clients.md) antes de decidir se uma chave pública é o limite adequado.

## Gerenciar chaves

Crie e revogue chaves de API na área API Keys do painel da AIVAX. As chaves pertencem a uma conta e podem ter um rótulo, validade e tipo; chaves expiradas são rejeitadas pela autenticação.

Crie chaves separadas para aplicações separadas. Isso torna a rotação mais segura: se uma integração for comprometida, você pode revogar apenas essa chave sem quebrar todos os serviços vinculados à conta. Use rótulos para identificar o proprietário e a aplicação de cada chave, e datas de validade para planejar quando renová‑la ou substituí‑la.

## Enviar uma chave com autenticação Bearer

Para SDKs compatíveis com OpenAI, passe a chave AIVAX como a chave de API do SDK e configure a URL base para `https://inference.aivax.net/v1`.

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="<AIVAX_API_KEY>"
)
```

## Autenticação de hook

AIVAX pode autenticar solicitações de saída para seus serviços, como workers de AI Gateway e funções de protocolo do lado do servidor.

Esta é a direção reversa da autenticação de API normal. Em uma chamada de API normal, sua aplicação prova que tem permissão para chamar a AIVAX enviando uma chave de API. Em um callback de worker ou função de protocolo, a AIVAX está chamando seu serviço, portanto seu serviço precisa de um meio de verificar que a solicitação realmente veio da configuração de conta que você controla. É para isso que serve o `X-Request-Nonce`.

Se sua conta possui uma chave de hook, a AIVAX envia:

```text
X-Request-Nonce: <BCrypt hash>
```

O nonce é um hash BCrypt derivado da chave de hook da conta. Valide o cabeçalho verificando a chave de hook em texto plano armazenada contra o hash. Se a conta não possuir chave de hook, o cabeçalho não é enviado.

Rotacionar a chave de hook invalida segredos de validação existentes de workers e integrações.

### Exemplo em C#

```csharp
using BCrypt.Net;

var nonce = request.Headers["X-Request-Nonce"];
var hookKey = Environment.GetEnvironmentVariable("AIVAX_HOOK_SECRET");

if (nonce is null || hookKey is null)
{
    return Results.Unauthorized();
}

if (!BCrypt.Net.BCrypt.Verify(hookKey, nonce, enhancedEntropy: false))
{
    return Results.Forbid();
}
```

### Exemplo em Python

```python
import os
import bcrypt
from flask import abort, request

nonce = request.headers.get("X-Request-Nonce")
hook_key = os.getenv("AIVAX_HOOK_SECRET")

if nonce is None or hook_key is None:
    abort(401)

if not bcrypt.checkpw(hook_key.encode("utf-8"), nonce.encode("utf-8")):
    abort(403)
```

### Exemplo em JavaScript

```javascript
import bcrypt from "bcrypt";

const nonce = req.header("X-Request-Nonce");
const hookKey = process.env.AIVAX_HOOK_SECRET;

if (!nonce || !hookKey) {
  return res.sendStatus(401);
}

if (!(await bcrypt.compare(hookKey, nonce))) {
  return res.sendStatus(403);
}
```

## Entrada no console

O console em `console.aivax.net` faz login com a chave de login enviada por e‑mail quando a conta é criada. Uma chave de login não é uma chave de API. Ela apenas abre uma sessão no console. As chaves de API continuam a chamar a API sem uma chave de login ou código de autenticador.

### Autenticação de dois fatores

Os titulares de conta podem adicionar um ou mais aplicativos autenticadores em **My account**, **Security**. O código QR e o segredo são mostrados apenas enquanto o código de seis dígitos desse aplicativo é confirmado. Após a confirmação, o segredo não pode ser visualizado novamente.

Quando ao menos um autenticador está confirmado, o login no console e a troca para aquela conta salva solicitam um código atual de seis dígitos. `POST /api/v1/auth/login` aceita um `totpCode` opcional. Se a chave de login for válida e o código estiver ausente, a resposta contém `requiresTwoFactor: true` e não cria uma sessão. Envie novamente a mesma chave de login com `totpCode`. Contas sem autenticador permanecem inalteradas.

Remover o último autenticador desativa o prompt. Desativar a autenticação de dois fatores sem um código atual é tratado pelo [AIVAX support](https://aivax.net/contact/).

### Recuperar acesso

A página de login contém um link para o suporte da conta.

- **Recover login key** solicita o e‑mail de registro. AIVAX exibe a mesma confirmação independentemente de esse e‑mail pertencer ou não a uma conta. Quando pertence, a mensagem contém um link de login de uso único e um link para redefinir a chave de login. Ambos expiram em uma hora. O link de login ainda solicita um código de autenticador quando a autenticação de dois fatores está habilitada. O link de redefinição cria uma nova chave de login, envia‑a por e‑mail e encerra todas as sessões de console da conta. Não desativa a autenticação de dois fatores nem revoga chaves de API.
- **Disable two-factor authentication** abre o [AIVAX support](https://aivax.net/contact/).
- Se o e‑mail de registro não estiver mais disponível, use a mesma página de suporte.

Redefinir a chave de login em **Security** solicita confirmação e, em seguida, realiza a mesma rotação: uma nova chave é enviada por e‑mail, as sessões de console são encerradas e o login salvo no navegador é apagado. As chaves de API continuam funcionando.
