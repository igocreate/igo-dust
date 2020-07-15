
# Syntax Basics

## References
A reference in igo-dust is written by surrounding a key with a single set of curly braces `{}`.


Data:
```json
{
  "name": "John"
}
```

Template:
```
Hello {name}!
```

Output:
```html
Hello John!
```

## Nested references
If you need to reference values within nested objects, you can use dot-notation.

Data:
```json
{
  "user": {
    "name": "John"
  }
}
```

Template:
```
Hello {user.name}!
```

Output:
```html
Hello John!
```

## Conditionals
If you need to include content conditionnaly you can use `?` (if) or `^` (if not).

Data: 
```json
{
  "isChecked": true,
}
```

Template:
```
<input type="checkbox" {?isChecked}checked{/isChecked} />
```

Output:
```html
<input type="checkbox" checked />
```

You can also use `{:else}` tag with conditionals.

Data: 
```json
{
  "isPrimary": false,
}
```

Template:
```
<button class="btn-{?isPrimary}primary{:else}secondary{/isPrimary}">OK</button>
```

Output:
```html
<button class="btn-secondary">OK</button>
```

## Comment
Everything between `{!` and `!}` is ignored.
Template:
```
{! OK Button !}
<button>OK</button>
```

Output:
```html
<button>OK</button>
```
