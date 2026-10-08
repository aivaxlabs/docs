> **{{ T "interactiveDemo" }}: {{ .Get "title" | default (.Get "name") }}.** {{ T "demoUnavailable" }} {{ .Inner | strings.TrimSpace }}

