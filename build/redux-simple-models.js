(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("babel-runtime/helpers/typeof"), require("babel-runtime/helpers/extends"), require("babel-runtime/helpers/defineProperty"), require("babel-runtime/helpers/objectWithoutProperties"), require("babel-runtime/helpers/slicedToArray"), require("babel-runtime/core-js/object/keys"), require("lodash"), require("lodash/has"));
	else if(typeof define === 'function' && define.amd)
		define(["babel-runtime/helpers/typeof", "babel-runtime/helpers/extends", "babel-runtime/helpers/defineProperty", "babel-runtime/helpers/objectWithoutProperties", "babel-runtime/helpers/slicedToArray", "babel-runtime/core-js/object/keys", "lodash", "lodash/has"], factory);
	else if(typeof exports === 'object')
		exports["redux-simple-models"] = factory(require("babel-runtime/helpers/typeof"), require("babel-runtime/helpers/extends"), require("babel-runtime/helpers/defineProperty"), require("babel-runtime/helpers/objectWithoutProperties"), require("babel-runtime/helpers/slicedToArray"), require("babel-runtime/core-js/object/keys"), require("lodash"), require("lodash/has"));
	else
		root["redux-simple-models"] = factory(root["babel-runtime/helpers/typeof"], root["babel-runtime/helpers/extends"], root["babel-runtime/helpers/defineProperty"], root["babel-runtime/helpers/objectWithoutProperties"], root["babel-runtime/helpers/slicedToArray"], root["babel-runtime/core-js/object/keys"], root["lodash"], root["lodash/has"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_10__, __WEBPACK_EXTERNAL_MODULE_11__) {
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

	var _reducers = __webpack_require__(3);

	var _reducers2 = _interopRequireDefault(_reducers);

	var _selectors = __webpack_require__(7);

	var selectors = _interopRequireWildcard(_selectors);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	exports.actions = actions;
	exports.reducer = _reducers2.default;
	exports.selectors = selectors;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.allModelBulkCreate = exports.bulkCreate = exports.del = exports.update = exports.create = undefined;

	var _typeof2 = __webpack_require__(2);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var create = exports.create = function create(modelName) {
	  return function (modelObject) {
	    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

	    return {
	      type: "CREATE_" + modelName.toUpperCase(),
	      payload: {
	        modelObject: modelObject
	      }
	    };
	  };
	};

	var update = exports.update = function update(modelName) {
	  return function (where, modelObject, customReducer) {
	    if ((typeof where === "undefined" ? "undefined" : (0, _typeof3.default)(where)) !== "object") {
	      throw new Error("Update() `where` argument needs to be an object");
	    }
	    return {
	      type: "UPDATE_" + modelName.toUpperCase(),
	      payload: {
	        where: where,
	        modelObject: modelObject,
	        customReducer: customReducer
	      }
	    };
	  };
	};

	var del = exports.del = function del(modelName) {
	  return function (where) {
	    if ((typeof where === "undefined" ? "undefined" : (0, _typeof3.default)(where)) !== "object") {
	      throw new Error("Delete() `where` argument needs to be an object");
	    }
	    return {
	      type: "DELETE_" + modelName.toUpperCase(),
	      payload: {
	        where: where
	      }
	    };
	  };
	};

	var bulkCreate = exports.bulkCreate = function bulkCreate(modelName) {
	  return function (entities) {
	    return {
	      type: "BULK_CREATE_" + modelName.toUpperCase(),
	      payload: {
	        entities: entities
	      }
	    };
	  };
	};

	var allModelBulkCreate = exports.allModelBulkCreate = function allModelBulkCreate(entities) {
	  return {
	    type: "BULK_CREATE",
	    payload: {
	      entities: entities
	    }
	  };
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/typeof");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends5 = __webpack_require__(4);

	var _extends6 = _interopRequireDefault(_extends5);

	var _defineProperty2 = __webpack_require__(5);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _objectWithoutProperties2 = __webpack_require__(6);

	var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

	var _selectors = __webpack_require__(7);

	var _has = __webpack_require__(11);

	var _has2 = _interopRequireDefault(_has);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var omit = function omit(obj, prop) {
	  var omit = obj[prop],
	      res = (0, _objectWithoutProperties3.default)(obj, [prop]);

	  return res;
	};

	var update = function update(modelName, namespace, state, action) {
	  // in order for get() to work we need to recreate the state a bit
	  var fakeState = (0, _defineProperty3.default)({}, namespace, (0, _defineProperty3.default)({}, modelName, state));
	  var models = (0, _selectors.get)(modelName)(fakeState, action.payload.where);
	  var ids = models.map(function (x) {
	    return x.id;
	  });
	  ids.map(function (id) {
	    if (typeof action.payload.customReducer === 'function') {
	      state = (0, _extends6.default)({}, state, (0, _defineProperty3.default)({}, id, action.payload.customReducer(state[id])));
	    } else {
	      state = (0, _extends6.default)({}, state, (0, _defineProperty3.default)({}, id, (0, _extends6.default)({}, state[id], action.payload.modelObject)));
	    }
	  });
	  return state;
	};

	var del = function del(modelName, namespace, state, action) {
	  // same as for update, recreate the state a bit
	  var models = (0, _selectors.get)(modelName)((0, _defineProperty3.default)({}, namespace, (0, _defineProperty3.default)({}, modelName, state)), action.payload.where);
	  var ids = models.map(function (x) {
	    return x.id;
	  });
	  ids.map(function (id) {
	    state = omit(state, id);
	  });
	  return state;
	};

	var abstractReducer = function abstractReducer(modelName) {
	  var namespace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'entities';

	  var autoId = 0;
	  return function () {
	    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var action = arguments[1];

	    switch (action.type) {

	      case 'CREATE_' + modelName.toUpperCase():
	        var modelId = void 0;
	        var modelObject = void 0;
	        // if the modelObject has an id, this is the canonical id to use
	        if (action.payload.modelObject.id) {
	          modelId = action.payload.modelObject.id;
	          modelObject = omit(action.payload.modelObject, 'id');
	        } else {
	          // otherwise create one
	          var found = false;
	          while (!found) {
	            autoId++;
	            if (!(0, _has2.default)(state, [namespace, modelName, autoId])) {
	              found = true;
	            }
	          }
	          modelId = autoId;
	          modelObject = action.payload.modelObject;
	        }
	        return (0, _extends6.default)({}, state, (0, _defineProperty3.default)({}, modelId, modelObject));

	      case 'UPDATE_' + modelName.toUpperCase():
	        return update(modelName, namespace, state, action);

	      case 'DELETE_' + modelName.toUpperCase():
	        return del(modelName, namespace, state, action);

	      case 'BULK_CREATE_' + modelName.toUpperCase():
	        return (0, _extends6.default)({}, state, action.payload.entities);

	      // this will match in multiple reducers, which is how it updates all the models
	      case 'BULK_CREATE':
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
/* 4 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/extends");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/defineProperty");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/objectWithoutProperties");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getOne = exports.get = undefined;

	var _slicedToArray2 = __webpack_require__(8);

	var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

	var _extends2 = __webpack_require__(4);

	var _extends3 = _interopRequireDefault(_extends2);

	var _keys = __webpack_require__(9);

	var _keys2 = _interopRequireDefault(_keys);

	var _lodash = __webpack_require__(10);

	var _ = _interopRequireWildcard(_lodash);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var get = exports.get = function get(entityName) {
	  var stateNamespace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'entities';
	  return function (state) {
	    var where = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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
	        var _wherePair = (0, _slicedToArray3.default)(wherePair, 2),
	            whereKey = _wherePair[0],
	            whereValue = _wherePair[1];

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
	  var stateNamespace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'entities';
	  return function (state) {
	    var where = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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
/* 8 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/slicedToArray");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/object/keys");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("lodash/has");

/***/ }
/******/ ])
});
;