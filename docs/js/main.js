'use strict';

/* global IgoDust */
const BROWSERWIDTH = 1370;

// class that define the format of a example of dust functionality
class Example {
  constructor(title, template, data) {
    this.title 		= title;
    this.template = template;
    this.data 		= data;d
  }
}

function init(contentTitle, tpl, data, document, prefix) {
  if (!document) return;

  const prefixToUse = !prefix ? '' : prefix;
  const template 		= document.getElementById(`${prefixToUse}template`);
  const title 			= document.getElementById(`${prefixToUse}title`);
  const locals 			= document.getElementById(`${prefixToUse}locals`);
  const button 			= document.getElementById(`${prefixToUse}compile`);
  const result 			= document.getElementById(`${prefixToUse}result`);

  template.value 	= tpl;
  locals.value 		= data;
  title.innerHTML = contentTitle;
  auto_grow(template);
  auto_grow(locals);

  button.onclick = function () {
    const compiled	= IgoDust.compile(template.value);
    let data 				= locals.value;
    if (!data) {
      result.innerHTML = IgoDust.render(compiled);
      return;
    }

    try {
      const f = new Function('return' + data + ';');
      data 		= f();
      result.innerHTML = IgoDust.render(compiled, data);
    } catch (e) {
      result.innerHTML = `Error while compiling - ${e.message}`;
      console.error(e); // eslint-disable-line
    }
    return false;
  };
}

// Function that size the textArea with the current value
function auto_grow(element) {
  element.style.height = '1rem';
  element.style.height = element.scrollHeight + 'px';
}

// Control the navbar, resize it when the size change
document.addEventListener('DOMContentLoaded', function () {
  const navButton = document.getElementById('navButton');
  const navbarNav = document.getElementById('navbarNav');
  const navBar 		= document.getElementById('navbar');

  function resize() {
    const browserWidth = document.documentElement.clientWidth;
    if (browserWidth > BROWSERWIDTH) {
      navButton.hidden = true;
      navbarNav.classList.remove('collapse');
      navbarNav.classList.add('fullHeight');
      navBar.classList.remove('col-12');
    } else {
      navButton.hidden = false;
      navbarNav.classList.add('collapse');
      navbarNav.classList.remove('fullHeight');
      navBar.classList.add('col-12');
    }
  }

  resize();
  window.addEventListener('resize', resize);
});
