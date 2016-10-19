import { omit } from 'lodash';

const abstractReducer = (modelName, stateNamespace = 'entities') => (state = {}, action) => {
  switch (action.type) {

    case `CREATE_${modelName.toUpperCase()}`:
      return {
        ...state,
        [action.payload.id]: action.payload.modelObject,
      };

    case `UPDATE_${modelName.toUpperCase()}`:
      if (typeof action.payload.customReducer === 'function') {
        return {
          ...state,
          [action.payload.id]: action.payload.customReducer(state[action.payload.id]),
        };
      }
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload.modelObject,
        },
      };

    case `DELETE_${modelName.toUpperCase()}`:
      return omit(state, action.payload.id);

    case `BULK_UPDATE_${modelName.toUpperCase()}`:
      return {
        ...state,
        ...action.payload.entities
      };

    case 'BULK_UPDATE':
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

export default abstractReducer;
