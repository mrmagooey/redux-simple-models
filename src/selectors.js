import has from "lodash/has";
import objGet from "lodash/get";
import isArray from "lodash/isArray";
import difference from "lodash/difference";

const toPairs = obj => {
  return Object.keys(obj).map(k => [ k, obj[k] ]);
};

export const get = (entityName, stateNamespace = "entities") =>
  (state, where = {}) => {
    // `where` filter
    return toPairs(state[stateNamespace][entityName])
      .filter(pair => {
        // if there are no where clauses
        if (Object.keys(where).length === 0) {
          return true;
        }
        // try and cast id to a Number
        const idNumber = isNaN(Number(pair[0])) ? pair[0] : Number(pair[0]);
        const fullEntity = { ...pair[1], id: idNumber };
        return toPairs(where).every(wherePair => {
          // need every where key to be satisfied
          const [ whereKey, whereValue ] = wherePair;
          // early return if the key is not present
          if (!has(fullEntity, whereKey)) {
            return false;
          }
          // special checking behaviour for arrays
          // will return true if the whereValue array is a subset of the entity value
          if (isArray(whereValue)) {
            const diff = difference(whereValue, objGet(fullEntity, whereKey));
            return diff.length === 0;
          } else {
            // string or number
            return objGet(fullEntity, whereKey) === whereValue;
          }
        });
      })
      .map(pair => {
        const id = pair[0];
        const entityObject = pair[1];
        return { ...entityObject, id };
      });
  };

export const getOne = (entityName, stateNamespace = "entities") =>
  (state, where = {}) => {
    const entities = get(entityName, stateNamespace)(state, where);
    if (entities.length > 1) {
      throw new Error(`getOne(): More than one ${entityName} instance found`);
    } else if (entities.length === 0) {
      throw new Error(`getOne(): No ${entityName} instances found`);
    } else {
      return entities[0];
    }
  };

