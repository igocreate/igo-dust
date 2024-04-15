# Basics

---

## Replace simple text

Replace a placeholder `{w}` with a specified value in the template.

```js
// Template
Hello, {w}!

// Data
{ 
  w: 'world'
}

// Output
Hello, world!
```

Igo Dust.js will not crash when a key is missing in the data object.

```js
// Template
Hello, {w}!

// Data
{ }

// Output
Hello, !
```

## Comments

Comments are enclosed in `{!` and `!}`.

```js
// Template
Hello, {! comment !}world!

// Data
{ }

// Output
Hello, world!
```

Igo Dust.js will ignore data that are inside comments.

```js
// Template
Hello, {! comment {name} !}world!

// Data
{ 
  name: 'John'
}

// Output
Hello, world!
```

## Special characters

Special characters are escaped with a backslash `\`.

```js
// Template
Hello, \' \\ " " World!

// Data
{ }

// Output
Hello, ' \ " " World!
```

You can also use special tags to escape Igo Dust.js tags.

```js
// Template
{~lb}Hello!{~rb}

// Data
{ }

// Output
{Hello!}
```

## Function

You can use a function to replace a placeholder. (invoked without arguments)

```js
// Template
Hello, {w}!

// Data
{ 
  w: () => 'world'
}

// Output
Hello, world!
```

## Objects

Access objects by key in references in the template.

```js
// Template
Hello, {users[hello].lastname}!

// Data
{ 
  users: { 
    john : { 
      lastname: 'World' 
    }
  },
  hello: 'john'
}

// Output 
Hello, World!
```

Access objects by complex key in references in the template.

```js
// Template
Hello, {users[hello.one].lastname}!

// Data
{
  users: { 
    john : { 
      lastname: 'World' 
    }
  },
  hello: { one: 'john' } 
}

// Output 
Hello, World!
```

## Arrays

Access arrays by index in references in the template.

```js
// Template
Hello, {users[1]}!

// Data
{ 
  users: [ 'john', 'World' ]
}

// Output
Hello, World!
```


---