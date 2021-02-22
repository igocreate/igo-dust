window.onload = function () {
  const examples = [
    new Example(
      '',
      `{@eq key=level value="master"}You are no longer a Padawan. {/eq}\n` +
        `{@gt key=age value=starfighterRentalAge}Rent a Starfighter!{/gt}`,
      `{\n` +
        ` "level": "master",\n` +
        ` "age": 27,\n` +
        ` "starfighterRentalAge": 25\n` +
        `}`
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
