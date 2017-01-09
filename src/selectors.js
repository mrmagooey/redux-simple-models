// import * as _ from 'lodash';
import toPairs from 'lodash/toPairs';
import isNaN from 'lodash/isNaN';
import getAttr from 'lodash/get';

const pipe = functions => data => {
  return functions.reduce(
    (value, func) => func(value),
    data
  );
};

export const get = (entityName, stateNamespace = 'entities') => (state, where = {}) => {
  return toPairs(state[stateNamespace][entityName])
    .filter((pair) => { 
      // if there are no where clauses
      if (Object.keys(where).length === 0) {
        return true;
      }
      // this is trying to make integer ids into actual numbers,
      // because integers are getting converted to strings in the reducer,
      // which I think is a babel bug https://github.com/babel/babel/issues/4196
      const idNumber = isNaN(Number(pair[0]))? pair[0] : Number(pair[0]);
      const fullEntity = { id: idNumber,
                           ...pair[1] };
      return toPairs(where)
        .every((wherePair) => {
          const [whereKey, whereValue] = wherePair;
          return getAttr(fullEntity, whereKey, false);
        });

      // return _.chain(where)
      //   .toPairs()
      // // need every where key to be satisfied
      //   .every((wherePair) => {
      //     const [whereKey, whereValue] = wherePair;
      //     return _.has(fullEntity, whereKey) && _.get(fullEntity, whereKey) === whereValue;
      //   })
      //   .value();
    })
    .map((pair) => {
      const id = pair[0];
      const entityObject = pair[1];
      return {
        ...entityObject,
        id,
      };
    });

  // return _
  //   .chain()
  //   .toPairs()
  // // `where` filter
  //   .filter((pair) => { 
  //     // if there are no where clauses
  //     if (Object.keys(where).length === 0) {
  //       return true;
  //     }
  //     // this is trying to make integer ids into actual numbers,
  //     // because integers are getting converted to strings in the reducer,
  //     // which I think is a babel bug https://github.com/babel/babel/issues/4196
  //     const idNumber = _.isNaN(Number(pair[0]))? pair[0] : Number(pair[0]);
  //     const fullEntity = { id: idNumber,
  //                          ...pair[1] };
  //     return _.chain(where)
  //       .toPairs()
  //     // need every where key to be satisfied
  //       .every((wherePair) => {
  //         const [whereKey, whereValue] = wherePair;
  //         return _.has(fullEntity, whereKey) && _.get(fullEntity, whereKey) === whereValue;
  //       })
  //       .value();
  //   })
  //   .map((pair) => {
  //     const id = pair[0];
  //     const entityObject = pair[1];
  //     return {
  //       ...entityObject,
  //       id,
  //     };
  //   })
  //   .value();
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

