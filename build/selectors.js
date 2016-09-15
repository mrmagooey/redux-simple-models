'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOne = exports.get = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var get = exports.get = function get(entityName) {
  var stateNamespace = arguments.length <= 1 || arguments[1] === undefined ? 'entities' : arguments[1];
  return function (state) {
    var where = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return _.chain(state[stateNamespace][entityName]).toPairs()
    // `where` filter
    .filter(function (pair) {
      // if there are no where clauses
      if (Object.keys(where).length === 0) {
        return true;
      }
      // this is trying to make integer ids into actual numbers,
      // because integers are getting converted to strings in the reducer,
      // which I think is a babel bug https://github.com/babel/babel/issues/4196
      var idNumber = _.isNaN(Number(pair[0])) ? pair[0] : Number(pair[0]);
      var fullEntity = _extends({ id: idNumber
      }, pair[1]);
      return _.chain(where).toPairs()
      // need every where key to be satisfied
      .every(function (wherePair) {
        var _wherePair = _slicedToArray(wherePair, 2);

        var whereKey = _wherePair[0];
        var whereValue = _wherePair[1];

        return _.has(fullEntity, whereKey) && _.get(fullEntity, whereKey) === whereValue;
      }).value();
    }).map(function (pair) {
      var id = pair[0];
      var entityObject = pair[1];
      return _extends({}, entityObject, {
        id: id
      });
    }).value();
  };
};

var getOne = exports.getOne = function getOne(entityName) {
  var stateNamespace = arguments.length <= 1 || arguments[1] === undefined ? 'entities' : arguments[1];
  return function (state) {
    var where = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var entities = get(entityName, stateNamespace)(state, where);
    if (entities.length > 1) {
      var errMsg = 'getOne(): More than one ' + entityName + ' instance found';
      console.warn(errMsg);
      return entities[0];
    } else if (entities.length === 0) {
      var _errMsg = 'getOne(): No ' + entityName + ' instances found';
      console.warn(_errMsg);
      return undefined;
    } else {
      return entities[0];
    }
  };
};