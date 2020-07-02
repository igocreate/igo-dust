

const _if = (parser, block) => {
  parser.pushBlock(block);
  parser.stackBlock(block)
};

const _loop = (parser, block) => {
  parser.pushBlock(block);
  parser.stackBlock(block)

};

const _not = (parser, block) => {
  parser.pushBlock(block);
  parser.stackBlock(block)
};

const _helper = (parser, block) => {
  parser.pushBlock(block);
  parser.stackBlock(block);
};

const _body = (parser, block) => {
  parser.addBody(block.tag);

  //   const current   = this.ctx.stack[this.ctx.stack.length - 1];
  //   current.bodies  = current.bodies || {};
  //   current.bodies[block.tag] = [];
  //   this.ctx.buffer = current.bodies[block.tag];
  //   block.skip = true;
};

const _end = (parser, block) => {
  const opening = parser.pop();
  if (opening && opening.type !== '>' && opening.tag !== block.tag)  {
    console.error(`Open/close tag mismatch! ${opening.tag} <> ${block.tag} `);
  }
  
};

const _layout = (parser, block) => {
  parser.pushBlock(block);
  parser.stackBlock(block);
};

const _content = (parser, block) => {
  parser.addBody(block.tag);
};



const TAGS = {
  '?': _if,       // { in:  true },
  '#': _loop,     // { in:  true },
  '^': _not,      // { in:  true },
  '@': _helper,   // { in:  true },
  ':': _body,     // { bodies: true },
  '/': _end,      // { out: true },
  '>': _layout,   // { root: true },
  '<': _content,  // { bodies:  true },
};
// TODO: +' ];


module.exports = TAGS;
