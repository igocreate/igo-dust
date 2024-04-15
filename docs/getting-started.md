![Build Status](https://github.com/igocreate/igo-dust/actions/workflows/node.js.yml/badge.svg) ![npm](https://img.shields.io/badge/version-0.3.5-0879BA) ![npm](https://img.shields.io/npm/dt/igo-dust)


# Igo Dust.js 

## Introduction

Igo Dust.js is a high-performance templating library built on Dust.js, offering simplicity and efficiency in rendering dynamic content. With its clean syntax and seamless integration with Express, Igo Dust.js simplifies template creation, ensuring fast and responsive user experiences for web applications.



### Differences from Dust.js

* **Simpler Syntax**: Igo Dust.js offers a simpler syntax compared to Dust.js, making it easier to create and manage templates.
* **Improved Performance**: Igo Dust.js is optimized for performance, ensuring fast rendering of dynamic content.
* **Modern JavaScript**: Igo Dust.js is built using modern JavaScript, offering compatibility with the latest ECMAScript standards.

> Note: The VSCode extension for Igo Dust.js is available [here](https://marketplace.visualstudio.com/items?itemName=IGOCREATE.igo-dust-language-support).

<!-- > Benchmark [here](https://www.example.com) -->

## Installation

```bash
npm install --save igo-dust
```

## Using Express

You can use Igo Dust.js with Express by setting the view engine to `dust` and rendering templates using the `res.render` method.

```js
const express = require('express');
const app     = express();

// Igo Dust configuration
const igodust = require('igo-dust');

app.engine('dust', igodust.engine);
app.set('view engine', 'dust');
app.set('views', './views');

app.get('/', (req, res) => {
  // renders ./views/welcome/index.dust
  res.render('welcome/index');
});

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
});
```

That's it! You have now successfully set up Igo Dust.js with Express.


## Using API

You can also use Igo Dust.js without Express by rendering templates using the `render` and `renderFile` methods:

```js
const igodust = require('igo-dust');

igodust.render('<h1>Hello, {name}!</h1>', { name: 'World' });
// => <h1>Hello, World!</h1>

igodust.renderFile('template.dust', { name: 'World' });
// => <h1>Hello, World!</h1>
```

That's it! You have now successfully rendered a template using Igo Dust.js.



---