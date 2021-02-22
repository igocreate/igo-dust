window.onload = function () {
  const examples = [
    // need to look at this template, it don't work.
    new Example(
      'reference',
      `{name} is a valid Dust reference.<br/>\n` +
        `0name is not a valid Dust reference.<br/>\n` +
        `{.name} is a valid Dust reference.<br/>\n` +
        `{.} is a valid dust reference.<br/>\n` +
        `{markup|s}: The |s filter does not escape HTML.<br/>\n` +
        `{markup}: HTML is escaped by default.`,
      `{\n` +
        ` "name": "name",\n` +
        ` "0name": "0name",\n` +
        ` "markup": '<span class=\"highlight\">Markup allowed</span>'\n` +
        `}`
    ),
    new Example(
      `comments`,
      `Comments {! in Dust !}can be used for documentation.<br/>\n` +
      `{! comment are  \n`+
      ` multiline !}\n` +
      `Comments can also be used {! <button>Click me!</button> !}to test or remove features.`,
      `{ }`
    ),
    new Example (
      `section`,
      `{! \n` +
      ` Outside of the section, Dust looks for values\n` +
      ` at the root of the JSON context\n` +
      `!} \n` +
      `The value of name is: {name} <br/>\n` +
      `{#extraData }\n` +
      ` {! \n` +
      `  Inside this section, Dust looks for \n` +
      `  values within the extraData object \n` +
      ` !} \n` +
      ` Inside the section, the value of name is: {.name} <br/>\n` +
      `{/extraData}\n` +
      `The value of name is: {name}, again. <br/>\n` +
      `{#nonExistentContext}\n` +
      ` This is only output if "nonExistentContext" exists. <br/>\n` +
      `{:else}\n` +
      ` Because "nonExistentContext" does not exist, the else body is output. <br/>\n` +
      `{/nonExistentContext}`,
      `{\n` +
      ` "name": "Jimmy",\n` +
      ` "extraData": {\n` +
      `  "name": "Kate"\n` +
      ` }\n` +
      `}`
    ),
    new Example (
      `exists`,
      `{?isReady}Ready!{:else}Wait a minute...{/isReady}`,
      `{ \n`+
      ` "isReady": false\n`+
      `}`
    ),
    new Example (
      `not-exists`,
      `{^isReady}Not ready yet.{:else}I'm ready to go!{/isReady}`,
      `{ \n`+
      `	"isReady": false\n`+
      `}`
    ),
    new Example (
      `helper`,
      `The answer is {@eq key=answer value=42}42{:else}wrong{/eq}.{~lb}`,
      `{ \n`+
      ` "answer": 42\n`+
      `}`
    ),
    new Example (
      `inline-partial`,
      `{+greeting}Hello!{/greeting} world.\n` +
      `{<greeting}Howdy{/greeting}`,
      `{ }`
    )
  ];

  examples.forEach((example, index) => {
    init(
      example.title,
      example.template,
      example.data,
      window.document,
      `Example${index + 1}`
    );
  });
  return;
};
