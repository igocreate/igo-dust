


var template = document.getElementById('template');
var button = document.getElementById('compile');
var result = document.getElementById('result');

document.getElementById('compile').onclick = function() {
  var compiled  = IgoDust.compile(template.value);
  result.innerHTML = IgoDust.render(compiled, {w: 'world'});
};
