### 🚨 Error Summary

> **{{TITLE}}**  
> {{SUMMARY}}

**🔗 Link Sentry:** [Vezi în Sentry]({{SENTRY_URL}}) (`{{SHORT_ID}}` / ID: `{{ID}}`)  
**📍 URL / Pagină:** `{{URL}}` | **Release:** `{{RELEASE}}`  
**📊 Impact:** Apariții: **{{COUNT}}** | Utilizatori afectați: **{{USER_COUNT}}**

---

### 💻 Stack Trace

```
{{STACK_TRACE}}
```

---

### 🌐 HTTP Request

{{REQUEST}}

---

### ⚙️ Detalii Mediu & Status

| Câmp | Valoare | Câmp | Valoare |
| :--- | :--- | :--- | :--- |
| **Nivel (Level)** | `{{LEVEL}}` | **Fișier** | `{{FILENAME}}` |
| **Status** | `{{STATUS}}` | **Funcție** | `{{FUNCTION}}` |
| **Browser** | {{BROWSER}} | **Prima apariție** | {{FIRST_SEEN}} |
| **Sistem Operare (OS)** | {{OS}} | **Ultima apariție** | {{LAST_SEEN}} |
| **Locație (IP)** | {{IP_ADDRESS}} ({{LOCATION}}) | **Culprit** | `{{CULPRIT}}` |

---

<details>
<summary><b>🔍 Detalii Breadcrumbs ({{BREADCRUMB_COUNT}} acțiuni)</b></summary>

{{BREADCRUMBS}}

</details>

<details>
<summary><b>🏷️ Tag-uri Sentry & Context Utilizator</b></summary>

{{TAGS}}

{{USER_CONTEXT}}

</details>

<!-- Sentry ID: {{ID}} -->
