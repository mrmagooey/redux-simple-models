import * as _ from 'lodash';

export const get = (entityName, stateNamespace = 'entities') => (state, where = {}) => {
  return _.chain(state[stateNamespace][entityName])
    .toPairs()
  // `where` filter
    .filter((pair) => { 
      // if there are no where clauses
      if (Object.keys(where).length === 0) {
        return true;
      }
      const fullEntity = { id: pair[0],
                           ...pair[1] };
      return _.chain(where)
        .toPairs()
      // need every where key to be satisfied
        .every((wherePair) => {
          const [whereKey, whereValue] = wherePair;
          return _.has(fullEntity, whereKey) && _.get(fullEntity, whereKey) === whereValue;
        })
        .value();
    })
    .map((pair) => {
      const id = pair[0];
      const entityObject = pair[1];
      return {
        ...entityObject,
        id,
      };
    })
    .value();
};

export const getOne = (entityName, stateNamespace = 'entities') => (state, where = {}) => {
  const entities = get(entityName, stateNamespace)(state, where);
  if (entities.length > 1) {
    const errMsg = `getOne(): More than one ${entityName} instance found`;
    console.warn(errMsg);
    return entities[0];
  } else if (entities.length === 0) {
    const errMsg = `getOne(): No ${entityName} instances found`;
    console.warn(errMsg);
    return undefined;
  } else {
    return entities[0];
  }
};

