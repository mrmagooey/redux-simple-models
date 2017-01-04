
export const create = (modelName) => {
  return (modelObject, id = undefined) => {
    return {
      type: `CREATE_${modelName.toUpperCase()}`,
      payload: {
        modelObject,
      },
    };
  };
};

export const update = (modelName) => (where, modelObject, customReducer) => {
  if (typeof where !== "object") {
    throw new Error("Update() `where` argument needs to be an object");
  }
  return {
    type: `UPDATE_${modelName.toUpperCase()}`,
    payload: {
      where,
      modelObject,
      customReducer,
    },
  };
};

export const del = (modelName) => (where) => {
  if (typeof where !== "object") {
    throw new Error("Delete() `where` argument needs to be an object");
  }
  return {
    type: `DELETE_${modelName.toUpperCase()}`,
    payload: {
      where,
    },
  };
};

export const bulkCreate = (modelName) => (entities) => {
  return {
    type: `BULK_CREATE_${modelName.toUpperCase()}`,
    payload: {
      entities,
    },
  };
};

export const allModelBulkCreate = (entities) => {
  return {
    type: "BULK_CREATE",
    payload: {
      entities,
    },
  };
};
