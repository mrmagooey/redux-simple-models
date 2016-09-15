
export const create = (modelName) => (id, modelObject) => {
  return {
    type: `CREATE_${modelName.toUpperCase()}`,
    payload: {
      id,
      modelObject,
    },
  };
};

export const update = (modelName) => (id, modelObject, customReducer) => {
  return {
    type: `UPDATE_${modelName.toUpperCase()}`,
    payload: {
      id,
      modelObject,
      customReducer,
    },
  };
};

export const bulkUpdate = (modelName) => (entities) => {
  return {
    type: `BULK_UPDATE_${modelName.toUpperCase()}`,
    payload: {
      entities,
    },
  };
};

export const del = (modelName) => (id) => {
  return {
    type: `DELETE_${modelName.toUpperCase()}`,
    payload: {
      id,
    },
  };
};

export const allModelBulkUpdate = (entities) => {
  return {
    type: "BULK_UPDATE",
    payload: {
      entities,
    },
  };
}
