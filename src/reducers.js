import * as _ from 'lodash';

const abstractReducer = (modelName, stateNamespace = 'entities') => (state = {}, action) => {
  switch (action.type) {

    case `CREATE_${modelName.toUpperCase()}`:
      return {
        ...state,
        [action.payload.id]: action.payload.modelObject,
      };

    case `UPDATE_${modelName.toUpperCase()}`:
      if (_.isFunction(action.payload.customReducer)) {
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
      return _.omit(state, action.payload.id);

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
