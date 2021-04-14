window.onload = function () {
  const examples = [
    new Example(
      '',
      `Dust does {#features}{.name}{@sep}, {/sep}{/features}!`,
      `{
  features: [
    { name: 'async' },
    { name: 'helpers' },
    { name: 'filters' },
    { name: 'a little bit of logic' },
    { name: 'and more.' }
  ]
}`),
    new Example(
      'Title',
      `Hello {w}!`,
      `{
  w: 'World'
}`),
    new Example(
      'If Else statement',
      `Have banana ? {?banana}yeah{:else}no{/banana}`,
      `{
  banana: true
}`
    ),
    new Example(
      'test',
      `Hello {w}!\n` +
        `<br/><br/>\n` +
        `My friends are {#friends}{@last} and {/last}{.}{@sep}, {/sep}{/friends}.\n` +
        `<br/>\n` +
        `{?hasFriends}Yay friends!{/hasFriends}`,
      `{
  w:          'World',
  friends:    ['Alice', 'Bob', 'Charlie'],
  hasFriends: (params, locals) => { return params.friends; }
}`
    ),
  ];
  examples.forEach((example, i) => {
    init(
      example.title,
      example.template,
      example.data,
      window.document,
      `Example${i + 1}`
    );
  });
  return;
};
