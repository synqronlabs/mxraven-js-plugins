# @mxraven/react

## 0.0.1

### Patch Changes

- 4b07cb0: Implement the React template renderer. `react()` now converts React elements
  into HTML with `@react-email/render` and derives a plain-text alternative with
  `toPlainText`, so messages rendered through `Message.render()` are sent as
  `multipart/alternative`.
