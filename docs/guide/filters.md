# Filters

---

Filters are used to transform a variable before outputting it. You can attach one or many filters to a variable, and you can add your own filters to augment the ones built-in to Dust.

Filters are attached to a Dust reference by adding a pipe `|` and the filter name after the reference name. You can chain filters by adding multiple pipes. The filters will be run from left-to-right.

## Built-in Filters

* `h` – HTML-encode
* `s` – turn off automatic HTML encoding
* `j` – Javascript string encode
* `u` – encodeURI
* `uc` – encodeURIComponent
* `js` – JSON.stringify
* `jp` – JSON.parse

!> Dust applies the `h` filter to all references by default, ensuring that variables are HTML-escaped. You can undo this autoescaping by appending the `s` filter.

## Examples

No filter:

```js
// Template
{title}

// Data
{
  title: '"All is <Fair> in Love & War"'
}

// Output
"All is <Fair> in Love & War"
```

`turn off automatic HTML encoding` filter:

```js
// Template
{title|s}

// Data
{
  title: '"All is <Fair> in Love & War"'
}

// Output
"All is in Love & War"
```

`JSON.stringify` & `turn off automatic HTML encoding`:

```js
// Template
{title|js|s}

// Data
{
  title: '"All is <Fair> in Love & War"'
}

// Output
"\"All is \u003cFair> in Love & War\""
```

---