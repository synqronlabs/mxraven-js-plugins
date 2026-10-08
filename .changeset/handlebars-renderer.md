---
"@mxraven/handlebars": patch
---

Implement the Handlebars template renderer. `handlebars()` compiles a template
source with `handlebars` and renders it with the given data, then derives a
plain-text alternative with `html-to-text`, so messages rendered through
`Message.render()` are sent as `multipart/alternative`.
