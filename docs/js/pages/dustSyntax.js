window.onload = function () {
	const examples = [
		// need to look at this template, it don't work.
		new Example(
			'Reference',
			`{name} is a valid Dust reference.<br/>\n` +
				`0name is not a valid Dust reference.<br/>\n` +
				`{.name} is a valid Dust reference.<br/>\n` +
				`{.} is a valid dust reference.<br/>\n` +
				`{markup|s}: The |s filter does not escape HTML.<br/>\n` +
				`{markup}: HTML is escaped by default.`,
			`{\n` +
				`	"name": "name",\n` +
				`	"0name": "0name",\n` +
				`	"markup": '<span class=\"highlight\">Markup allowed</span>'\n` +
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
