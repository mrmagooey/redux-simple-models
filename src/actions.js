
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

export const del = (modelName) => (id) => {
  return {
    type: `DELETE_${modelName.toUpperCase()}`,
    payload: {
      id,
    },
  };
};

