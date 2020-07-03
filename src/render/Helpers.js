
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

};

function truthTest(tag, test) {
  return function(tag, params, context) {
    return test(params.key, params.value);
  };
};
