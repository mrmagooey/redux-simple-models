
export const create = (modelName, autoPk) => {
  let autoId = 0;
  return (modelObject, id = undefined) => {
    autoId++;
    let modelId;
    if (autoPk === true) {
      modelId = autoId;
    } else {
      if (typeof id === 'undefined') {
        throw new Error(`id undefined for model ${modelName}`);
      }
      modelId = id;
    }
    return {
      type: `CREATE_${modelName.toUpperCase()}`,
      payload: {
        id: modelId,
        modelObject,
      },
    };
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

export const bulkUpdate = (modelName) => (entities) => {
  return {
    type: `BULK_UPDATE_${modelName.toUpperCase()}`,
    payload: {
      entities,
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
