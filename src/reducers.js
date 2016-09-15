import * as _ from 'lodash';

const abstractReducer = (modelName, stateNamespace = 'entities') => (state = {}, action) => {
  switch (action.type) {

    case `CREATE_${modelName.toUpperCase()}`:
      // acts like upsert, will silently override existing things
      return {
        ...state,
        [action.payload.id]: action.payload.modelObject,
      };

    case `UPDATE_${modelName.toUpperCase()}`:
      console.log(action);
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
    case 'BULK_UPDATE':
      if (action.payload.entities && action.payload.entities[modelName]) {
        // bulk update
        return { ...state,
                 ...action.payload.entities[modelName] };
      } else {
        return state;
      }

    default:
      return state;

  }
};

export default abstractReducer;
