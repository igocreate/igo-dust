## Line feed management

Preserve line returns if the htmltrim option is disabled.

```js
// Template
Hello \r\n World \r\n<meta name="description" content="{+description/}">\r\n OK.

// Data
{ }

// Output
Hello \r\n World \r\n<meta name="description" content="">\r\n OK.