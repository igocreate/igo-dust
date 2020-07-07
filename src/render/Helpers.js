
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

  "select": function() {
    console.log('Error : @select not supported !')
  },
  "first": function(params, context, locals) {
    return locals.$idx === 0;
  },
  "last": function(params, context, locals) {
    return locals.$length && locals.$length - 1 === locals.$idx;
  },
  "sep": function(params, context, locals) {
    return locals.$length && locals.$length - 1 !== locals.$idx;
  },
};

function truthTest(tag, test) {
  return function(params, context, locals) {
    const left = params.key;
    return test(left, params.value);
  };
};
