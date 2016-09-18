(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("babel-runtime/helpers/defineProperty"), require("babel-runtime/helpers/extends"), require("lodash"), require("babel-runtime/helpers/slicedToArray"), require("babel-runtime/core-js/object/keys"));
	else if(typeof define === 'function' && define.amd)
		define(["babel-runtime/helpers/defineProperty", "babel-runtime/helpers/extends", "lodash", "babel-runtime/helpers/slicedToArray", "babel-runtime/core-js/object/keys"], factory);
	else if(typeof exports === 'object')
		exports["redux-simple-models"] = factory(require("babel-runtime/helpers/defineProperty"), require("babel-runtime/helpers/extends"), require("lodash"), require("babel-runtime/helpers/slicedToArray"), require("babel-runtime/core-js/object/keys"));
	else
		root["redux-simple-models"] = factory(root["babel-runtime/helpers/defineProperty"], root["babel-runtime/helpers/extends"], root["lodash"], root["babel-runtime/helpers/slicedToArray"], root["babel-runtime/core-js/object/keys"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.selectors = exports.reducer = exports.actions = undefined;

	var _actions = __webpack_require__(1);

	var actions = _interopRequireWildcard(_actions);

	var _reducers = __webpack_require__(2);

	var _reducers2 = _interopRequireDefault(_reducers);

	var _selectors = __webpack_require__(6);

	var selectors = _interopRequireWildcard(_selectors);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	exports.actions = actions;
	exports.reducer = _reducers2.default;
	exports.selectors = selectors;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var create = exports.create = function create(modelName) {
	  return function (id, modelObject) {
	    return {
	      type: "CREATE_" + modelName.toUpperCase(),
	      payload: {
	        id: id,
	        modelObject: modelObject
	      }
	    };
	  };
	};

	var update = exports.update = function update(modelName) {
	  return function (id, modelObject, customReducer) {
	    return {
	      type: "UPDATE_" + modelName.toUpperCase(),
	      payload: {
	        id: id,
	        modelObject: modelObject,
	        customReducer: customReducer
	      }
	    };
	  };
	};

	var bulkUpdate = exports.bulkUpdate = function bulkUpdate(modelName) {
	  return function (entities) {
	    return {
	      type: "BULK_UPDATE_" + modelName.toUpperCase(),
	      payload: {
	        entities: entities
	      }
	    };
	  };
	};

	var del = exports.del = function del(modelName) {
	  return function (id) {
	    return {
	      type: "DELETE_" + modelName.toUpperCase(),
	      payload: {
	        id: id
	      }
	    };
	  };
	};

	var allModelBulkUpdate = exports.allModelBulkUpdate = function allModelBulkUpdate(entities) {
	  return {
	    type: "BULK_UPDATE",
	    payload: {
	      entities: entities
	    }
	  };
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _defineProperty2 = __webpack_require__(3);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _extends5 = __webpack_require__(4);

	var _extends6 = _interopRequireDefault(_extends5);

	var _lodash = __webpack_require__(5);

	var _ = _interopRequireWildcard(_lodash);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var abstractReducer = function abstractReducer(modelName) {
	  var stateNamespace = arguments.length <= 1 || arguments[1] === undefined ? 'entities' : arguments[1];
	  return function () {
	    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var action = arguments[1];

	    switch (action.type) {

	      case 'CREATE_' + modelName.toUpperCase():
	        return (0, _extends6.default)({}, state, (0, _defineProperty3.default)({}, action.payload.id, action.payload.modelObject));

	      case 'UPDATE_' + modelName.toUpperCase():
	        if (_.isFunction(action.payload.customReducer)) {
	          return (0, _extends6.default)({}, state, (0, _defineProperty3.default)({}, action.payload.id, action.payload.customReducer(state[action.payload.id])));
	        }
	        return (0, _extends6.default)({}, state, (0, _defineProperty3.default)({}, action.payload.id, (0, _extends6.default)({}, state[action.payload.id], action.payload.modelObject)));

	      case 'DELETE_' + modelName.toUpperCase():
	        return _.omit(state, action.payload.id);

	      case 'BULK_UPDATE_' + modelName.toUpperCase():
	        return (0, _extends6.default)({}, state, action.payload.entities);

	      case 'BULK_UPDATE':
	        if (action.payload.entities[modelName]) {
	          return (0, _extends6.default)({}, state, action.payload.entities[modelName]);
	        } else {
	          return state;
	        }

	      default:
	        return state;

	    }
	  };
	};

	exports.default = abstractReducer;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/defineProperty");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/extends");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getOne = exports.get = undefined;

	var _slicedToArray2 = __webpack_require__(7);

	var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

	var _extends2 = __webpack_require__(4);

	var _extends3 = _interopRequireDefault(_extends2);

	var _keys = __webpack_require__(8);

	var _keys2 = _interopRequireDefault(_keys);

	var _lodash = __webpack_require__(5);

	var _ = _interopRequireWildcard(_lodash);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var get = exports.get = function get(entityName) {
	  var stateNamespace = arguments.length <= 1 || arguments[1] === undefined ? 'entities' : arguments[1];
	  return function (state) {
	    var where = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    return _.chain(state[stateNamespace][entityName]).toPairs()
	    // `where` filter
	    .filter(function (pair) {
	      // if there are no where clauses
	      if ((0, _keys2.default)(where).length === 0) {
	        return true;
	      }
	      // this is trying to make integer ids into actual numbers,
	      // because integers are getting converted to strings in the reducer,
	      // which I think is a babel bug https://github.com/babel/babel/issues/4196
	      var idNumber = _.isNaN(Number(pair[0])) ? pair[0] : Number(pair[0]);
	      var fullEntity = (0, _extends3.default)({ id: idNumber
	      }, pair[1]);
	      return _.chain(where).toPairs()
	      // need every where key to be satisfied
	      .every(function (wherePair) {
	        var _wherePair = (0, _slicedToArray3.default)(wherePair, 2);

	        var whereKey = _wherePair[0];
	        var whereValue = _wherePair[1];

	        return _.has(fullEntity, whereKey) && _.get(fullEntity, whereKey) === whereValue;
	      }).value();
	    }).map(function (pair) {
	      var id = pair[0];
	      var entityObject = pair[1];
	      return (0, _extends3.default)({}, entityObject, {
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

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/slicedToArray");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/object/keys");

/***/ }
/******/ ])
});
;