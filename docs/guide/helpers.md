# Helpers

---

* `@eq`: strictly equal to
* `@ne`: not strictly equal to
* `@gt`: greater than
* `@lt`: less than
* `@gte` : greater than or equal to
* `@lte` : less than or equal to

## Equal

Render content if the key equals the specified value.

```js
// Template
Hello {@eq key=w value="World"}{w}{/eq}

// Data
{
  w: 'World'
}

// Output
Hello World
```

## Not Equal

Render content if the key does not equal the specified value.

```js
// Template
Hello {@ne key=w value="Planet"}{w}{/ne}

// Data
{
  w: 'World'
}

// Output
Hello World
```

## Greater Than

Render content if the key is greater than the specified value.

```js
// Template
'Hello {@gt key=w value="2" {! or value=2 !} }World{/gt}'

// Data
{
  w: 3
}

// Output
Hello World
```

> Note: You can use `@gte` to render content if the key is greater than or equal to the specified value !

## Less than

Render content if the key is less than the specified value.

```js
// Template
'Hello {@lt key=w value="2"}World{/lt}'

// Data
{
  w: 1
}

// Output
Hello World
```
> Note: You can use `@lte` to render content if the key is less than or equal to the specified value !

## Else

Render different text based on a condition, with an alternative if the condition is not met.

```js
// Template
Hello {@eq key=w value="World"}World{:else}Planet{/eq}

// Data
{
  w: 'Planet'
}

// Output
Hello Planet
```

## Custom Helpers

You can define `custom helpers` to extend the functionality of Igo Dust.js.

```js
// Define custom helpers
const Helpers = require('../../src/render/Helpers');

const HELPERS = {

  nl2br: function(params) {
    if (params.value) {
      return params.value.replace(/(\r\n|\n\r|\r|\n)/g, '<br/>');
    }
  },

  boolean: function(params) {
    const color = params.value ? 'success' : 'danger';
    return `<div class="bullet bullet-sm bullet-${color}"></div>`;
  }
};

// Add custom helpers
Helpers.nl2br   = HELPERS.nl2br; // @nl2br
Helpers.boolean = HELPERS.boolean; // @boolean
```

You can now use the `custom helpers` in your templates.

```js
// Template
Hello ? {@boolean value=b /}
{@nl2br value=text /}

// Data
{
  b: true,
  text: 'Hello\nWorld'
}

// Output
Hello ? <div class="bullet bullet-sm bullet-success"></div>
Hello<br/>World
```

## Handling non-existent helpers

Handle errors gracefully when using non-existent custom helpers.

```js
// Template
Hello {@foo value=obj /} !

// Data
{ 
  obj: 'World'
}

// Output
Error: helper @foo not found!
```

---