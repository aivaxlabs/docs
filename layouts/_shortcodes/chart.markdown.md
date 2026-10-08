{{- $type := .Get "type" | default "bar" -}}
{{- $data := .Get "data" | transform.Unmarshal -}}
{{- $unit := .Get "unit" | default "" }}
{{ with .Get "title" }}**{{ . }}**
{{ end }}
{{- if eq $type "line" }}
| | {{ delimit $data.labels " | " }} |
| --- |{{ range $data.labels }} --- |{{ end }}
{{ range $data.series }}| {{ .name }} |{{ range .values }} {{ . }}{{ $unit }} |{{ end }}
{{ end }}
{{- else }}
| Item | Value |
| --- | --- |
{{ range $data }}| {{ .label }} | {{ .value }}{{ $unit }} |
{{ end }}
{{- end }}
{{ with .Get "caption" }}{{ . }}
{{ end }}
