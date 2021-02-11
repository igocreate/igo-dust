window.onload = function () {
	const examples = [
		new Example(
			'Contexts',
			`{title}`,
			`{"title": '"All is <Fair> in Love & War"'}`
		),
		new Example(
			'Contexts',
			`{title|s}`,
			`{"title": '"All is <Fair> in Love & War"'}`
		),
		new Example(
			'Contexts',
			`{title|js|s}`,
			`{"title": '"All is <Fair> in Love & War"'}`
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
