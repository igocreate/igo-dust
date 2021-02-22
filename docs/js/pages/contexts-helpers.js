window.onload = function () {
  const examples = [
    // need to look at this template, sections don't work like dustjs.
    new Example(
      'helper',
      `{#friends}{.} {/friends}<br/>\n` +
      `{#friendsHelper}{.} {/friendsHelper}<br/>\n` +
      `{?hasFriends}Yay friends!{/hasFriends}<br/>\n` +
      `{?hasFriendsHelper}Yay friends!{/hasFriendsHelper}`,
      `{\n` +
      ` "friends": ["Alice", "Bob", "Charlie"],\n` +
      ` "friendsHelper": function() {\n` +
      `  return ["Bob", "Charlie", "Alice"];\n` +
      ` },\n` +
      ` "hasFriends": true,\n` +
      `}`
    ),
    new Example(
      'helper',
      ``,
      `{ }`
    ),
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
