window.onload = function () {
	const examples = [
		new Example(
			'',
			`Dust does {#features}{name}{@sep}, {/sep}{/features}!`,
			`{\n` +
				`	features: [\n` +
				`		{name: "async"},\n` +
				`		{name: "helpers"},\n` +
				`		{name: "filters"},\n` +
				`		{name: "a little bit of logic"},\n` +
				`		{name: "and more"}\n` +
				`	]\n` +
				`}`
		),
		new Example('Title', `Hello, {w}!`, `{"w": "world"}`),
		new Example(
			'If Else statement',
			`Have banana ? {?banana } yeah {:else} no {/banana}`,
			`{banana : true}`
		),
		new Example(
			'test',
			`Hello {w}!\n` +
				`<br/><br/>\n` +
				`My friends are {#friends}{@last} and {/last}{.}{@sep}, {/sep}{/friends}.\n` +
				`<br/>\n` +
				`{?hasFriends}Yay friends!{/hasFriends}`,
			`{"w": "World","friends": ["Alice", "Bob", "Charlie"],"hasFriends": function(p, l) {return p.friends;}}`
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
