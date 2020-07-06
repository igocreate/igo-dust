
//
module.exports = {

  "eq": truthTest('eq', function(left, right) {
    return left === right;
  }),
  "ne": truthTest('ne', function(left, right) {
    return left !== right;
  }),
  "lt": truthTest('lt', function(left, right) {
    return parseInt(left, 10) < parseInt(right, 10);
  }),
  "lte": truthTest('lte', function(left, right) {
    return parseInt(left, 10) <= parseInt( right, 10);
  }),
  "gt": truthTest('gt', function(left, right) {
    return parseInt(left, 10) > parseInt(right, 10);
  }),
  "gte": truthTest('gte', function(left, right) {
    return parseInt(left, 10) >= parseInt( right, 10);
  }),

  "select": function(tag, params, context) {
    return params.key;
  },
  "first": function(tag, params, context) {
    const prev = context.stack[context.stack.length - 2];
    if (prev && context.index === 0) {
      return  context.stack[context.stack.length - 1];
    }
    return false;
  },
  "last": function(tag, params, context) {
    const prev = context.stack[context.stack.length - 2];
    if (prev && prev.length && context.index === prev.length - 1) {
      return context.stack[context.stack.length - 1];
    }
    return false;
  },
  "sep": function(tag, params, context) {
    const prev = context.stack[context.stack.length - 2];
    if (prev && prev.length && context.index !== prev.length - 1) {
      return context.stack[context.stack.length - 1];
    }
    return false;
  },
};

function truthTest(tag, test) {
  return function(tag, params, context) {
    const left = params.key || context.stack[context.stack.length - 1];
    return test(left, params.value);
  };
};
