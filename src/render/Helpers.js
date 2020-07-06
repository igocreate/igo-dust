
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

};

function truthTest(tag, test) {
  return function(tag, params, context) {
    const left = params.key || context.stack[context.stack.length - 1];
    return test(left, params.value);
  };
};
