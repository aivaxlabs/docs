# {{ .Title }}

Source: {{ .Permalink }}
{{ $path := .Path }}
{{ range partialCached "docs-groups.html" . .Lang }}{{ if or (eq $path "/docs") (eq .section.Path $path) }}
## {{ .title }}

{{ range .pages }}- [{{ .Title }}]({{ (.OutputFormats.Get "markdown").Permalink }})
{{ end }}{{ end }}{{ end }}
