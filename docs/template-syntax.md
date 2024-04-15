# Template Syntax

## References // basics

* A reference is used to insert values from your context (or JSON data) into your template.
* A Dust path is one or more Dust keys, separated by dots (`.`).
* A Dust key is one or more of the following characters: `a-z`, `A-Z`, `_`(underscore), `$`, `0-9`, or `=`.
* The first character of a reference cannot be `0-9` or `-`.

### Example

```dust
{name} is a valid Dust reference.
{user.name} is also a valid Dust reference.
{0name} is not a valid Dust reference.
```

## Comments

Comments are enclosed in `{!` and `!}`.

### Example

```dust
Comments {! in Dust !}can be used for documentation.<br/>
{! comment are  
 multiline !}
Comments can also be used {! <button>Click me!</button> !}to test or remove features.
```

## Sections // loop

Sections are used to conditionally render blocks of content based on the value of a key in your context.

### Example

```dust
{! 
 Outside of the section, Dust looks for values
 at the root of the JSON context
!} 
The value of name is: {name} <br/>
{#extraData }
 {! 
  Inside this section, Dust looks for 
  values within the extraData object 
 !} 
 Inside the section, the value of name is: {.name} <br/>
{/extraData}
The value of name is: {name}, again. <br/>
{#nonExistentContext}
 This is only output if "nonExistentContext" exists. <br/>
{:else}
 Because "nonExistentContext" does not exist, the else body is output. <br/>
{/nonExistentContext}
```

```javascript
{
 "name": "Jimmy",
 "extraData": {
  "name": "Kate"
 }
}
```

Output:


```
The value of name is: Jimmy
Inside the section, the value of name is: Kate
The value of name is: Jimmy, again.
Because "nonExistentContext" does not exist, the else body is output.
```

## Exists

The exists tag is used to check if the context exists or is false.

### Example



```dust
{?name} 
  The name key exists in the context.
{:else}
  The name key does not exist in the context.
{/name}
```

```javascript
{
 "name": "Jimmy"
}
```

Output:

```
The name key exists in the context.
```

## Not Exists

The not exists tag is used to check if a key does not exist or is false.

### Example

```dust
{^isReady}
  Not ready yet.
{:else}
  I'm ready to go!
{/isReady}
```

```javascript
{
 "isReady": "False"
}
```

output:

```
Not ready yet.
```

## Helpers

Helpers are used to perform operations on the data in your context.

### Example

```dust
The answer is {@eq key=answer value=42}42{:else}wrong{/eq}.
```

```javascript
{
 "answer": 42
}
```

Output:

```
The answer is 42.
```

## Special

Special tags are used to escape Dust tags.

### Example

```dust
{~lb}Hello!{~rb}
```

Output:

```
{Hello!}
```

---