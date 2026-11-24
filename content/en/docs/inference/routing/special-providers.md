---
{title: Special Providers,linkTitle: Special providers,weight: 40,group: Routing}
---

# Special providers

Some integrated models are also offered by special providers, which serve them at discounted prices. Special providers are never selected unless you opt in:

| Routing preference | Special providers |
|---|---|
| `Balanced` | Never used. |
| `Cheapest`, `Fastest`, `Quality` | Considered only when **Allow special providers** is enabled in the dashboard account privacy settings. New accounts allow special providers by default, and the choice can be changed in the welcome dialog or the account settings. |
| `Special` | Always considered, regardless of the account setting. Selects the lowest applicable combined input and output token price among eligible regular and special providers. |

## When a model is only available through special providers

When a model is currently available only through special providers, requests that do not allow them fail. To keep using the model, do one of the following:

- Use the `Special` preference.
- Enable **Allow special providers** and use a preference other than `Balanced`.

[Zero data retention providers only](zdr.md) and `allowed_providers` still apply to special providers.

## Select a special provider directly

Listing a special provider's tag in `allowed_providers`, or as a `#tag` suffix on the model name, routes to it under any preference, including `Balanced`.
