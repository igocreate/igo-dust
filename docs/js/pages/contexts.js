window.onload = function () {
	const examples = [
		// need to look at this template, sections don't work like dustjs.
		new Example(
			'sections',
			`Parent: {firstName} {lastName}<br/>\n` +
				`Children: {#children}{firstName} {lastName} {/children}`,
			`{\n` +
				`	"firstName": "John",\n` +
				`	"lastName": "Smith",\n` +
				`	"children": [\n` +
				`		{ "firstName": "Alice" },\n` +
				`		{ "firstName": "Bobby" },\n` +
				`		{ "firstName": "Charlie" }\n` +
				`	]\n` +
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
