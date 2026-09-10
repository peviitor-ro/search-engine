### 🚨 Error Summary

> **{{TITLE}}**  
> {{SUMMARY}}

**🔗 Sentry Link:** [View in Sentry]({{SENTRY_URL}}) (`{{SHORT_ID}}` / ID: `{{ID}}`)  
**📍 URL / Page:** `{{URL}}` | **Release:** `{{RELEASE}}`  
**📊 Impact:** Occurrences: **{{COUNT}}** | Affected Users: **{{USER_COUNT}}**

---

### 💻 Stack Trace

```
{{STACK_TRACE}}
```

---

### 🌐 HTTP Request

{{REQUEST}}

---

### ⚙️ Environment & Status Details

| Field | Value | Field | Value |
| :--- | :--- | :--- | :--- |
| **Level** | `{{LEVEL}}` | **Filename** | `{{FILENAME}}` |
| **Status** | `{{STATUS}}` | **Function** | `{{FUNCTION}}` |
| **Browser** | {{BROWSER}} | **First Seen** | {{FIRST_SEEN}} |
| **OS** | {{OS}} | **Last Seen** | {{LAST_SEEN}} |
| **Culprit** | `{{CULPRIT}}` | **Project** | `{{PROJECT_NAME}}` |

---

<details>
<summary><b>🔍 Breadcrumbs Details ({{BREADCRUMB_COUNT}} actions)</b></summary>

{{BREADCRUMBS}}

</details>

<details>
<summary><b>🏷️ Sentry Tags & User Context</b></summary>

{{TAGS}}

{{USER_CONTEXT}}

</details>

<!-- Sentry ID: {{ID}} -->
