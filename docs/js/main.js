'use strict';

/* global IgoDust */

$(function() {
  const template = document.getElementById('template');
  const locals = document.getElementById('locals');
  const button = document.getElementById('compile');
  const result = document.getElementById('result');
  
  const initial =
      'Hello {w}!'+
      '<br/><br/>'+
      'My friends are {#friends}{@last} and {/last}{.}{@sep}, {/sep}{/friends}.'+
      '<br/>'+
      '{?hasFriends}Yay friends!{/hasFriends}';
  
  template.value = initial;
  
  button.onclick = function() {
    const compiled  = IgoDust.compile(template.value);
    let data = locals.value;
    if (!data) {
      result.innerHTML = IgoDust.render(compiled);
      return;
    }
  
    try {
      const f = new Function('return ' + data + ';');
      data = f();
      result.innerHTML = IgoDust.render(compiled, data);
    } catch (e) {
      result.innerHTML = `Error while compiling - ${e.message}`;
      console.error(e); // eslint-disable-line
    }
    return false;
  };
  
});
