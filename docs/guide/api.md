# API

## Render

Render a Dust.js template with the given context.

```js
const igodust = require('igo-dust');

igodust.render('Hello, {name}!', { name: 'World' });
// => Hello, World!
```

## Render File

Render a Dust.js template file with the given context.

```js
const igodust = require('igo-dust');

