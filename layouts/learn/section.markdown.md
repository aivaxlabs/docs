# {{ .Title }}

Source: {{ .Permalink }}
{{ with .Description }}
{{ . }}
{{ end }}{{ $path := .Path }}
{{ range partialCached "learn-modules.html" . .Lang }}{{ if or (eq $path "/learn") (eq .module.Path $path) }}
## {{ .module.Title }}

{{ range .units }}- [{{ .Title }}]({{ (.OutputFormats.Get "markdown").Permalink }})
{{ end }}{{ end }}{{ end }}
