{{- /**/ -}}
# {{ .Title }}

Source: {{ .Permalink }}
{{ if eq .Path "/docs" }}{{ range partialCached "docs-groups.html" . .Lang }}
## {{ .title }}

{{ range .pages }}- [{{ .Title }}]({{ (.OutputFormats.Get "markdown").Permalink }})
{{ end }}{{ end }}{{ else }}{{ range .Pages.ByWeight }}{{ if eq .Kind "section" }}
## {{ .Title }}

{{ range .RegularPages.ByWeight }}- [{{ .Title }}]({{ (.OutputFormats.Get "markdown").Permalink }})
{{ end }}{{ else }}
- [{{ .Title }}]({{ (.OutputFormats.Get "markdown").Permalink }})
{{ end }}{{ end }}{{ end }}
