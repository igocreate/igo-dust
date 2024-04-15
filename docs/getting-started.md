# Getting Started

## Introduction


> IGO DUST is a high-performance templating library built on Dust.js, offering simplicity and efficiency in rendering dynamic content. With its clean syntax and seamless integration with Express, Igo Dust simplifies template creation, ensuring fast and responsive user experiences for web applications.

## Installation

**1. Install Igo Dust in your project via npm:**

```bash
npm install --save igo-dust
```

**2. Create a Template file**

Create a template file with the `.dust` extension. For example, `index.dust`:

```dust
<h1>Hello, {name}!</h1>
```

**3. Compile the Template**

Compile the template using the `igo-dust` library:

```javascript
const dust = require('igo-dust');
const html = dust.renderFile('index.dust', { name: 'World' });
// => <h1>Hello, World!</h1>
```

That's it! You have now successfully installed Igo Dust and rendered your first template.