{{ delimit (apply (split (.Get "items" | default (.Get 0)) "|") "strings.TrimSpace" ".") " → " }}
