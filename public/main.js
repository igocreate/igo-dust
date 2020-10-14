


var template = document.getElementById('template');
var locals = document.getElementById('locals');
var button = document.getElementById('compile');
var result = document.getElementById('result');

document.getElementById('compile').onclick = function() {
  var compiled  = IgoDust.compile(template.value);

  var data = locals.value;
  if (!data) {
    result.innerHTML = IgoDust.render(compiled);
    return 
  }

  try {
    const f = new Function('return ' + data + ';');
    data = f();
    result.innerHTML = IgoDust.render(compiled, data);
  } catch {
    result.innerHTML = 'Invalid data :('
  }
};
