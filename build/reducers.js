'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var abstractReducer = function abstractReducer(modelName) {
  var stateNamespace = arguments.length <= 1 || arguments[1] === undefined ? 'entities' : arguments[1];
  return function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments[1];

    switch (action.type) {

      case 'CREATE_' + modelName.toUpperCase():
        return _extends({}, state, _defineProperty({}, action.payload.id, action.payload.modelObject));

      case 'UPDATE_' + modelName.toUpperCase():
        if (_.isFunction(action.payload.customReducer)) {
          return _extends({}, state, _defineProperty({}, action.payload.id, action.payload.customReducer(state[action.payload.id])));
        }
        return _extends({}, state, _defineProperty({}, action.payload.id, _extends({}, state[action.payload.id], action.payload.modelObject)));

      case 'DELETE_' + modelName.toUpperCase():
        return _.omit(state, action.payload.id);

      case 'BULK_UPDATE_' + modelName.toUpperCase():
        return _extends({}, state, action.payload.entities);

      case 'BULK_UPDATE':
        if (action.payload.entities[modelName]) {
          return _extends({}, state, action.payload.entities[modelName]);
        } else {
          return state;
        }

      default:
        return state;

    }
  };
};

exports.default = abstractReducer;