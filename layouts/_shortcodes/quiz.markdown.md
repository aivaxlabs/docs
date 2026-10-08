**{{ T "knowledgeCheck" }}.** {{ .Inner | strings.TrimSpace }}

{{ range $index, $option := split (.Get "options") "|" }}{{ add $index 1 }}. {{ trim $option " " }}
{{ end }}
Answer: option {{ .Get "answer" }}.{{ with .Get "explanation" }} {{ . }}{{ end }}

