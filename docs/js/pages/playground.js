window.onload = function () {
	const examples = [
		new Example('', `Template go here`, `{\n` + `	"Data go here":""\n` + `}`),
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
