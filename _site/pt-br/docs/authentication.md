Source: https://docs.aivax.net/pt-br/docs/authentication.html

# Autenticação

A AIVAX autentica solicitações de API com chaves de API da conta. A AIVAX aceita chaves de API via:

- `Authorization: Bearer <API_KEY>`
- `Authorization: Basic <BASE64_USERNAME_COLON_API_KEY>`
- `?api-key=<API_KEY>`

Prefira o cabeçalho `Authorization` para chamadas de servidor para servidor. Use o parâmetro de consulta apenas quando um cliente ou integração não puder enviar cabeçalhos, pois as URLs podem ser registradas por proxies, navegadores e ferramentas de monitoramento.

## Tipos de chave de API

A AIVAX possui duas famílias de chaves porque os casos de uso voltados para o navegador e do lado do servidor têm perfis de risco diferentes. Se o seu código for executado no seu servidor, use uma chave privada e mantenha-a fora dos pacotes do cliente, logs e repositórios públicos. Se o seu código for executado em um navegador ou em outro ambiente onde a chave pode ser inspecionada pelo usuário final, use uma chave pública e mantenha o fluxo limitado às rotas projetadas para acesso público.

| Tipo | Prefixo | Uso pretendido | Acesso |
| --- | --- | --- | --- |
| Chave privada | `sk-aiv-acc` | Integrações do lado do servidor e chamadas administrativas de API. | Todas as APIs de conta autenticadas, exceto gerenciamento de chaves de API e credenciais. |
| Chave pública | `pk-aiv-` | Chamadas restritas do lado do cliente. | Inferência de texto, gerações e recuperação RAG. |
| Chave de aplicativo | `sk-aiv-apk` | Aplicativos de terceiros autorizados pelo titular da conta. | As permissões aprovadas por meio do [OAuth](https://docs.aivax.net/pt-br/docs/oauth.md), além da identidade da conta. |

Cada tipo de chave concede um conjunto fixo de permissões, e cada rota exige algumas delas. Uma solicitação cuja chave não possui uma permissão exigida pela rota retorna `403 Forbidden`, e a mensagem de erro nomeia as permissões ausentes.

Chaves privadas não podem listar, criar ou excluir chaves de API, rodar o sal da conta, gerenciar autenticadores ou redefinir a chave de login. Use o painel para essas operações.

Chaves públicas podem ser usadas para conclusões de chat, os endpoints `/api/v1/generations/*`, pesquisa semântica RAG e geração de respostas RAG. Elas não podem ler ou alterar recursos da conta, abrir sessões de voz ou usar os endpoints de pesquisa na web e busca. Quando uma chave pública chama conclusões de chat:

- O `model` deve ser um UUID completo do AI Gateway; chamadas diretas de modelo integrado e lookup de slug do gateway estão desativadas.
- Fontes MCP, funções de protocolo, ferramentas integradas, Bash, habilidades e opções sentinel são removidas da solicitação.
- Apenas estes parâmetros de solicitação são aceitos: `model`, `messages`, `prompt`, `temperature`, `top_p`, `top_k`, `seed`, `tools`, `reasoning_effort`, `max_completion_tokens`, `conversation_token`, `idempotency_key` e `stream`.
- Limites de taxa de solicitação e token são aplicados globalmente por chave e por endereço remoto. Consulte [Chaves de API públicas](https://docs.aivax.net/pt-br/docs/limits.md#public-api-keys) para os valores atuais.

Use chaves privadas para serviços backend, gerenciamento de conta, listagem de modelos, gerenciamento de coleções, operações em lote e qualquer fluxo que precise da superfície completa de ferramentas do gateway.

Para a primeira solicitação do lado do servidor, continue com [Faça sua primeira solicitação](https://docs.aivax.net/pt-br/docs/overview.md#make-your-first-request). Se você estiver expondo uma experiência de navegador ou widget aos usuários finais, revise [Clientes de Chat](https://docs.aivax.net/pt-br/docs/inference/chat-clients.md) antes de decidir se uma chave pública é o limite certo.

## Gerenciar chaves

Crie e revogue chaves de API na área Chaves de API do painel da AIVAX. As chaves pertencem a uma conta e podem ter um rótulo, expiração e tipo; chaves expiradas são rejeitadas pela autenticação.

Crie chaves separadas para aplicativos separados. Isso torna a rotação mais segura: se uma integração for comprometida, você pode revogar apenas essa chave em vez de interromper todos os serviços vinculados à conta. Use rótulos para identificar o proprietário e o aplicativo de cada chave, e datas de expiração para planejar quando renová-la ou substituí-la.

## Autorização OAuth

Um aplicativo de terceiros pode solicitar ao titular de uma conta AIVAX uma chave de aplicativo em vez de pedir que ele copie uma chave de API. O titular da conta revisa a solicitação no console, escolhe quanto tempo o acesso durará e pode revogá-la a qualquer momento. Consulte [OAuth](https://docs.aivax.net/pt-br/docs/oauth.md) para o fluxo completo, permissões e tratamento de callback.

## Enviar uma chave com autenticação Bearer

Para SDKs compatíveis com OpenAI, passe a chave AIVAX como a chave de API do SDK e defina a URL base como `https://inference.aivax.net/v1`.

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="<AIVAX_API_KEY>"
)
```

## Autenticação de gancho (Hook)

A AIVAX pode autenticar solicitações de saída para seus serviços, como trabalhadores do AI Gateway e funções de protocolo do lado do servidor.

Esta é a direção reversa da autenticação normal de API. Em uma chamada de API normal, seu aplicativo prova que tem permissão para chamar a AIVAX enviando uma chave de API. Em um callback de trabalhador ou função de protocolo, a AIVAX está chamando seu serviço, então seu serviço precisa de uma maneira de verificar se a solicitação realmente veio da configuração da conta que você controla. É isso que o `X-Request-Nonce` serve.

Se sua conta tiver uma chave de hook, a AIVAX envia:

```text
X-Request-Nonce: <BCrypt hash>
```

O nonce é um hash BCrypt derivado da chave de hook da conta. Valide o cabeçalho verificando a chave de hook de texto puro armazenada contra o hash. Se a conta não tiver uma chave de hook, o cabeçalho não será enviado.

A rotação da chave de hook invalida os segredos de validação existentes de trabalhadores e integrações.

### Exemplo C#

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

### Exemplo Python

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

### Exemplo JavaScript

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

## Login no console

O console em `console.aivax.net` faz login com a chave de login enviada por e-mail quando a conta foi criada. Uma chave de login não é uma chave de API. Ela apenas abre uma sessão de console. As chaves de API continuam a chamar a API sem uma chave de login ou código de autenticador.

### Autenticação de dois fatores

Os titulares da conta podem adicionar um ou mais aplicativos autenticadores em **Minha conta**, **Segurança**. O código QR e o segredo são mostrados apenas enquanto o código de seis dígitos desse aplicativo é confirmado. Após a confirmação, o segredo não pode ser visualizado novamente.

Quando pelo menos um autenticador é confirmado, o login no console e a alternância para essa conta salva solicitam um código atual de seis dígitos. `POST /api/v1/auth/login` aceita um `totpCode` opcional. Se a chave de login for válida e o código estiver ausente, a resposta terá `requiresTwoFactor: true` e não criará uma sessão. Envie a mesma chave de login novamente com `totpCode`. Contas sem um autenticador permanecem inalteradas.

Remover o último autenticador desativa o prompt. Desativar a autenticação de dois fatores sem um código atual é tratado pelo [Suporte AIVAX](https://aivax.net/contact/).

### Recuperar acesso

A página de login oferece links para o suporte da conta.

- **Recuperar chave de login** solicita o e-mail de registro. A AIVAX mostra a mesma confirmação independentemente de esse e-mail pertencer ou não a uma conta. Quando pertence, a mensagem contém um link de login único e um link para redefinir a chave de login. Ambos expiram em uma hora. O link de login ainda solicita um código de autenticador quando a autenticação de dois fatores está habilitada. O link de redefinição cria uma nova chave de login, envia-a por e-mail e desconecta a conta de todas as sessões do console. Ele não desativa a autenticação de dois fatores nem revoga chaves de API.
- **Desativar autenticação de dois fatores** abre o [Suporte AIVAX](https://aivax.net/contact/).
- Se o e-mail de registro não estiver mais disponível, use a mesma página de suporte.

Redefinir a chave de login em **Segurança** solicita confirmação, depois realiza a mesma rotação: uma nova chave é enviada por e-mail, as sessões do console são encerradas e o login salvo no navegador é limpo. As chaves de API continuam funcionando.
