# Logic

---

* If-Else Conditions: Use `{?}` and `{:else}` to create conditional statements. <br/>
* Existence Check: Employ `{?}` to check if a key exists in the context. <br/>
* Negation Check: Use `{^}` to check if a key does not exist in the context. <br/>

## Simple conditions

Render a section of text based on a simple condition.

```js
// Template
Hello {?test}World{/test} OK.

// Date
{
  test: true
}

// Output
Hello World OK.
```

You can also render a section of text based on a condition applied to an attribute.

```js
// Template
Hello {?test.a}World{/test.a} OK.

// Date
{
  test: { a: true }
}

// Output
Hello World OK.
```

## Nested conditions

Render nested conditions based on multiple conditions.

```js
// Template
{?world}World{?ok} OK{/ok}{/world}

// Date
{
  world: true,
  ok: true
}

// Output
World OK
```

## Else

Render different text based on a condition, with an alternative if the condition is not met.

```js
// Template
Hello {?test}World{:else}Good bye{/test} OK.

// Date
{
  test: false
}

// Output
Hello Good bye OK.
```

## ^ Condition

Render a section of text based on the absence of an attribute in the context.

```js
// Template
Hello {^test.a}World{/test.a} OK.

// Date
{
  test: false
}

// Output
Hello World OK.
```
You can also use `else` with the ^ condition.

```js
// Template
Hello {^test.a}World{:else}Planet{/test.a}.

// Date
{
  test: { a: true }
}

// Output
Hello Planet.
```

## Function

Execute a function as a condition and render text based on its result.

```js
// Template
Hello{?test world=w} World{/test}.

// Date
{
  w: true,
  test: (locals) => locals.world
}

// Output
Hello World.
```

## Array

Igo Dust consider empty arrays as `false`.

```js
// Template
OK {?users}{users.length} users{/users}.

// Date
{
  users: []
}

// Output
OK .
```



---