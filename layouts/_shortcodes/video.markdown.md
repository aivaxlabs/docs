[Video: {{ .Get "title" }}]({{ .Get "src" }}){{ if eq (.Get "lang") "pt-BR" }} — {{ T "videoPortugueseOnly" }}{{ end }}{{ with .Get "caption" }}

*{{ . }}*{{ end }}
