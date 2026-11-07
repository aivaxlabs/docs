---
{title: Autenticação,linkTitle: Autenticação,weight: 20,group: Introduction,sourceHash: 08e1a748439a7891,aliases: [/docs/pt-br/authentication.html]}
---

# Autenticação

A AIVAX autentica solicitações de API com chaves de API da conta. Uma chave de login é uma credencial separada e serve apenas para abrir o console.

A AIVAX aceita chaves de API via:

- `Authorization: Bearer <API_KEY>`
- `Authorization: Basic <BASE64_USERNAME_COLON_API_KEY>`
- `?api-key=<API_KEY>`

Escolha como enviar a chave:

- Prefira `Authorization: Bearer <API_KEY>` para chamadas de servidor para servidor.
- `Authorization: Basic <BASE64_USERNAME_COLON_API_KEY>` também é aceito.
- Use `?api-key=<API_KEY>` apenas quando um cliente ou integração não puder enviar cabeçalhos, pois URLs podem ser registradas por proxies, navegadores e ferramentas de monitoramento.

## Tipos de chave de API

O tipo de chave determina quais rotas o solicitante pode usar. Escolha-o com base em onde o código é executado e quem é o proprietário da conta.

A AIVAX possui duas famílias de chaves porque os casos de uso voltados para o navegador e para o lado do servidor têm perfis de risco diferentes. Se o seu código for executado no seu servidor, use uma chave privada e mantenha-a fora dos pacotes do cliente, logs e repositórios públicos. Se o seu código for executado em um navegador ou em outro ambiente onde a chave pode ser inspecionada pelo usuário final, use uma chave pública e mantenha o fluxo limitado às rotas projetadas para acesso público. As chaves de aplicativo são um terceiro tipo: o titular da conta as aprova para um aplicativo de terceiros por meio do [OAuth](oauth.md).

| Tipo | Prefixo | Uso pretendido | Acesso |
| --- | --- | --- | --- |
| Chave privada | `sk-aiv-acc` | Integrações do lado do servidor e chamadas administrativas de API. | Todas as APIs de conta autenticadas, exceto gerenciamento de chaves de API e credenciais. |
| Chave pública | `pk-aiv-` | Chamadas restritas do lado do cliente. | Inferência de texto, gerações e recuperação RAG. |
| Chave de aplicativo | `sk-aiv-apk` | Aplicativos de terceiros autorizados pelo titular da conta. | As permissões aprovadas por meio do [OAuth](oauth.md), além da identidade da conta. |

Cada tipo de chave concede um conjunto fixo de permissões, e cada rota exige algumas delas. Uma solicitação cuja chave não possui uma permissão exigida pela rota retorna `403 Forbidden`, e a mensagem de erro nomeia as permissões ausentes.

### Chaves privadas

Use uma chave privada para serviços backend, gerenciamento de conta, listagem de modelos, gerenciamento de coleções, operações em lote e qualquer fluxo que precise da superfície completa de ferramentas do gateway.

Chaves privadas não podem listar, criar ou excluir chaves de API, rodar o sal da conta, gerenciar autenticadores ou redefinir a chave de login. Use o painel para essas operações.

Para uma primeira solicitação do lado do servidor, continue com [Faça sua primeira solicitação](overview.md#make-your-first-request).

### Chaves públicas

Use uma chave pública apenas para rotas projetadas para acesso público. Uma chave pública pode chamar:

- conclusões de chat;
- os endpoints `/api/v1/generations/*`;
- busca semântica RAG;
- geração de respostas RAG.

Uma chave pública não pode:

- ler ou alterar recursos da conta;
- abrir sessões de voz;
- usar os endpoints de busca na web e fetch.

Quando uma chave pública chama conclusões de chat:

- O `model` deve ser um UUID completo do AI Gateway; chamadas diretas de modelo integrado e pesquisa de slug do gateway estão desativadas.
- Fontes MCP, funções de protocolo, ferramentas integradas, Bash, habilidades e opções sentinel são removidas da solicitação.
- Apenas estes parâmetros de solicitação são aceitos: `model`, `messages`, `prompt`, `temperature`, `top_p`, `top_k`, `seed`, `tools`, `reasoning_effort`, `max_completion_tokens`, `conversation_token`, `idempotency_key` e `stream`.
- Limites de taxa de solicitação e token são aplicados globalmente por chave e por endereço remoto. Consulte [Chaves de API públicas](limits.md#public-api-keys) para os valores atuais.

Se você estiver expondo uma experiência de navegador ou widget aos usuários finais, revise [Clientes de Chat](/docs/pt-br/inference/chat-clients) antes de decidir se uma chave pública é o limite adequado.

### Chaves de aplicativo

Use uma chave de aplicativo quando um aplicativo de terceiros deve chamar a AIVAX com a permissão do titular da conta. A chave recebe as permissões aprovadas por meio do [OAuth](oauth.md), além da identidade da conta. Consulte [Autorização OAuth](#oauth-authorization) para a versão curta e [OAuth](oauth.md) para o fluxo completo.

## Gerenciar chaves

Crie e revogue chaves de API na área Chaves de API do painel da AIVAX. Use esta área quando precisar de uma nova chave, um rótulo, uma data de expiração ou uma revogação.

As chaves pertencem a uma conta e podem ter um rótulo, expiração e tipo. Chaves expiradas são rejeitadas pela autenticação.

Crie chaves separadas para aplicativos separados. Isso torna a rotação mais segura: se uma integração for comprometida, você pode revogar apenas essa chave em vez de interromper todos os serviços vinculados à conta. Use rótulos para identificar o proprietário e o aplicativo de cada chave, e datas de expiração para planejar quando renová-la ou substituí-la.

## Autorização OAuth

O OAuth permite que um aplicativo de terceiros solicite ao titular de uma conta AIVAX uma chave de aplicativo em vez de pedir que ele copie uma chave de API. Use-o quando a pessoa que possui a conta não for o desenvolvedor do aplicativo.

O titular da conta revisa a solicitação no console, escolhe quanto tempo o acesso durará e pode revogá-la a qualquer momento. Consulte [OAuth](oauth.md) para o fluxo completo, permissões e tratamento de callback.

## Enviar uma chave com autenticação Bearer

Use este padrão quando um SDK compatível com OpenAI deve chamar a AIVAX. Passe a chave AIVAX como a chave de API do SDK e defina a URL base como `https://inference.aivax.net/v1`.

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="<AIVAX_API_KEY>"
)
```

## Autenticação de Hook

A autenticação de hook permite que seu serviço verifique solicitações de saída da AIVAX. Use-o para trabalhadores do AI Gateway e funções de protocolo do lado do servidor.

Esta é a direção reversa da autenticação normal de API:

1. Em uma chamada de API normal, seu aplicativo prova que tem permissão para chamar a AIVAX enviando uma chave de API.
2. Em um callback de trabalhador ou função de protocolo, a AIVAX chama seu serviço.
3. Seu serviço precisa de uma maneira de verificar se a solicitação realmente veio da configuração da conta que você controla.

É isso que `X-Request-Nonce` faz.

Se sua conta tiver uma chave de hook, a AIVAX envia:

```text
X-Request-Nonce: <BCrypt hash>
```

O nonce é um hash BCrypt derivado da chave de hook da conta. Valide o cabeçalho verificando a chave de hook em texto puro armazenada contra o hash. Se a conta não tiver uma chave de hook, o cabeçalho não será enviado.

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

O console em `console.aivax.net` faz login com a chave de login enviada por e-mail quando a conta foi criada. Use esta seção quando precisar abrir o console, adicionar um autenticador ou recuperar uma chave de login.

Uma chave de login não é uma chave de API. Ela apenas abre uma sessão de console. As chaves de API continuam chamando a API sem uma chave de login ou código de autenticador.

### Autenticação de dois fatores

Os titulares da conta podem adicionar um ou mais aplicativos autenticadores em **Minha conta**, **Segurança**. Use um autenticador quando o login no console exigir um código atual além da chave de login.

1. Adicione um ou mais aplicativos autenticadores em **Minha conta**, **Segurança**.
2. Confirme o código de seis dígitos desse aplicativo. O código QR e o segredo são mostrados apenas enquanto esse código é confirmado.
3. Após a confirmação, o segredo não pode ser visualizado novamente.

Quando pelo menos um autenticador é confirmado:

- O login no console solicita um código atual de seis dígitos.
- A alternância para essa conta salva solicita um código atual de seis dígitos.
- `POST /api/v1/auth/login` aceita um `totpCode` opcional.
- Se a chave de login for válida e o código estiver ausente, a resposta terá `requiresTwoFactor: true` e não criará uma sessão.
- Envie a mesma chave de login novamente com `totpCode`.

Contas sem um autenticador permanecem inalteradas.

Remover o último autenticador desativa o prompt. Desabilitar a autenticação de dois fatores sem um código atual é tratado pelo [Suporte AIVAX](https://aivax.net/contact/).

### Recuperar acesso

A página de login oferece links para o suporte da conta. Use esses caminhos quando o titular da conta não conseguir fazer login.

#### Recuperar chave de login

**Recuperar chave de login** solicita o e-mail de registro. A AIVAX mostra a mesma confirmação independentemente de esse e-mail pertencer ou não a uma conta.

Quando o e-mail pertence a uma conta, a mensagem contém:

- um link de login único;
- um link para redefinir a chave de login.

Ambos os links expiram em uma hora.

- O link de login ainda solicita um código de autenticador quando a autenticação de dois fatores está habilitada.
- O link de redefinição cria uma nova chave de login, envia-a por e-mail e desconecta a conta de todas as sessões do console.
- O link de redefinição não desabilita a autenticação de dois fatores nem revoga chaves de API.

#### Desabilitar autenticação de dois fatores

**Desabilitar autenticação de dois fatores** abre o [Suporte AIVAX](https://aivax.net/contact/).

#### E-mail de registro indisponível

Se o e-mail de registro não estiver mais disponível, use a mesma [página de suporte](https://aivax.net/contact/).

#### Redefinir a chave de login em Segurança

Redefinir a chave de login em **Segurança** solicita confirmação e, em seguida, executa a mesma rotação:

- Uma nova chave é enviada por e-mail.
- As sessões do console são encerradas.
- O login salvo no navegador é limpo.

As chaves de API continuam funcionando.
