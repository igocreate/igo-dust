


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
  if (!block.selfClosedTag) {
    parser.stackBlock(block);
  }
};

const _body = (parser, block) => {
  parser.addBody(block.tag);
};

const _end = (parser, block) => {
  const opening = parser.pop();
  if (opening && opening.type !== '>' && opening.tag !== block.tag)  {
    console.error(`Open/close tag mismatch! ${opening.tag} <> ${block.tag} `);
  }
};

const _content = (parser, block) => {
  parser.pushBlock(block);
  parser.stackBlock(block);
};

const _include = (parser, block) => {
  block.file = block.param;
  parser.pushBlock(block);
};

const _insert = (parser, block) => {
  parser.pushBlock(block);
};



const TAGS = {
  '?': _if,
  '#': _loop,
  '^': _not,
  '@': _helper,
  ':': _body,
  '/': _end,
  '>': _include,
  '<': _content,
  '+': _insert,
};


module.exports = TAGS;
