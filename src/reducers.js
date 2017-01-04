import { get } from './selectors';
import has from 'lodash/has';

const omit = (obj, prop) => {
  let {[prop]: omit, ...res} = obj;
  return res;
};

const update = (modelName, namespace, state, action) => {
  // in order for get() to work we need to recreate the state a bit
  const fakeState = {
    [namespace]: {
      [modelName]: state
    }
  };
  let models = get(modelName)(fakeState, action.payload.where);
  let ids = models.map(x => x.id);
  ids.map((id) => {
    if (typeof action.payload.customReducer === 'function') {
      state = {
        ...state,
        [id]: action.payload.customReducer(state[id]),
      };
    } else {
      state = {
        ...state,
        [id]: {
          ...state[id],
          ...action.payload.modelObject,
        },
      };
    }
  });
  return state;
};

const del = (modelName, namespace, state, action) => {
  // same as for update, recreate the state a bit
  const models = get(modelName)({
    [namespace]: {
      [modelName]: state
    }
  }, action.payload.where);
  const ids = models.map(x => x.id);
  ids.map((id) => {
    state = omit(state, id);
  });
  return state;
};

const abstractReducer = (modelName, namespace = 'entities') => {
  let autoId = 0;
  return (state = {}, action) => {
    switch (action.type) {

      case `CREATE_${modelName.toUpperCase()}`:
        let modelId;
        let modelObject;
        // if the modelObject has an id, this is the canonical id to use
        if (action.payload.modelObject.id) {
          modelId = action.payload.modelObject.id;
          modelObject = omit(action.payload.modelObject, 'id');
        } else {
          // otherwise create one
          let found = false;
          while(!found) {
            autoId++;
            if (!has(state, [namespace, modelName, autoId])) {
              found = true;
            }
          }
          modelId = autoId;
          modelObject = action.payload.modelObject;
        }
        return {
          ...state,
          [modelId]: modelObject,
        };

      case `UPDATE_${modelName.toUpperCase()}`:
        return update(modelName, namespace, state, action);

      case `DELETE_${modelName.toUpperCase()}`:
        return del(modelName, namespace, state, action);

      case `BULK_CREATE_${modelName.toUpperCase()}`:
        return {
          ...state,
          ...action.payload.entities
        };

      // this will match in multiple reducers, which is how it updates all the models
      case 'BULK_CREATE': 
        if (action.payload.entities[modelName]) {
          return {
            ...state,
            ...action.payload.entities[modelName]
          };
        } else {
          return state;
        }

      default:
        return state;

    }
  };
};

export default abstractReducer;
