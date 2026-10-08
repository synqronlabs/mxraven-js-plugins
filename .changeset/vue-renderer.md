---
"@mxraven/vue": patch
---

Implement the Vue template renderer. `vue()` now converts a Vue node into HTML
with `@vue-email/render` and derives a plain-text alternative from that HTML
with `html-to-text`, so messages rendered through `Message.render()` are sent
as `multipart/alternative`.
