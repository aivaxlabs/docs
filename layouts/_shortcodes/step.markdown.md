{{ .Ordinal | add 1 }}. **{{ .Get "title" }}**

{{ .Inner | strings.TrimSpace }}

