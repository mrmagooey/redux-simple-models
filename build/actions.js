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