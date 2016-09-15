import * as assert from 'assert';
import { actions, reducer, selectors } from '../src/index.js';
import * as should from 'should';
import { createStore, combineReducers } from 'redux';

describe('actions', function() {

  describe('create action', () => {
    it('should create the correct action ', function() {
      const modelName = "testModel";
      const modelId = 'some unique id';
      const modelObject = {
        a:1,
        b:2,
        c: {
          nested: "shenanigans",
        }
      };
      const expectedAction = {
        type: "CREATE_TESTMODEL",
        payload: {
          id: modelId,
          modelObject: modelObject,
        },
      };
      assert.deepEqual(actions.create(modelName)(modelId, modelObject), expectedAction);
    });
  });

  describe('update action', () => {
    it('should create the correct action', ()=>{
      const modelName = "testModel";
      const modelId = 'some unique id';
      const modelObject = {
        a:1,
        b:2,
        c: {
          nested: "shenanigans",
        }
      };
      const expectedAction = {
        type: "UPDATE_TESTMODEL",
        payload: {
          id: modelId,
          modelObject: modelObject,
          customReducer: undefined,
        },
      };
      assert.deepEqual(actions.update(modelName)(modelId, modelObject), expectedAction);
    });
  });

  describe('del action', () => {
    it('should create the correct action', ()=>{
      const modelName = "testModel";
      const modelId = 'hello';
      const expectedAction = {
        type: "DELETE_TESTMODEL",
        payload: {
          id: modelId,
        },
      };
      assert.deepEqual(actions.del(modelName)(modelId), expectedAction);
    });
  });

}); 

describe('reducer', ()=> {
  
  it('can create reducers for models', () => {
    const modelName = 'wew lad';

    const myReducer = reducer(modelName);
    
    const reducers = combineReducers({
      [modelName]: myReducer,
    });
    

  });

});

describe('readme getting started examples', ()=> {

  it('should work as advertised', ()=> {
    // store setup
    const modelNameString = 'my model';
    const model2 = reducer('model2');
    const entityReducers = combineReducers({
      [modelNameString]: reducer(modelNameString), 
      model2, 
      model3 : reducer('model3'),
    });
    const topLevelReducer = combineReducers({
      entities: entityReducers,
    });
    const store = createStore(topLevelReducer);

    const modelInstance = {hello: 'world', example: true };
    const storeAction = actions.create('my model')(1, modelInstance);
    store.dispatch(storeAction);
    assert.deepEqual(store.getState(),
                     {
                       entities: {
                         'my model': {
                           1: {hello: 'world', example: true}
                         },
                         'model2': {},
                         'model3': {},
                       }
                     });

    store.dispatch(actions.create('my model')(2, { a: 1, example: false }));
    assert.deepEqual(store.getState(),
                     {
                       entities: {
                         'my model': {
                           1: {hello: 'world', example: true},
                           2: {a: 1, example: false},
                         },
                         'model2': {},
                         'model3': {},
                       }
                     });

    store.dispatch(actions.create('my model')(3, { b: 2, c: true, example: true }));
    assert.deepEqual(store.getState(),
                     {
                       entities: {
                         'my model': {
                           1: {hello: 'world', example: true},
                           2: {a: 1, example: false},
                           3: { b: 2, c: true, example: true }, 
                         },
                         'model2': {},
                         'model3': {},
                       }
                     });

    store.dispatch(actions.bulkUpdate('my model')(
      {
        2: {new: 'model data', overrides: 'old data', for: 'model id 2' },
        4: {'this': 'is a new model'},
      }
    ));
    assert.deepEqual(store.getState(),
                     {
                       entities: {
                         'my model': {
                           1: {hello: 'world', example: true},
                           2: {new: 'model data', overrides: 'old data', for: 'model id 2'},
                           3: { b: 2, c: true, example: true },
                           4: {this: 'is a new model'},
                         },
                         'model2': {},
                         'model3': {},
                       }
                     });

    const model2Updates = {1: {a:1}, 2: {b:1}};
    const model3Updates = {1: {c:1}, 2: {d:1}, 'non integer id': {blah: 'blah'}};
    store.dispatch(actions.allModelBulkUpdate({
      model2: model2Updates,
      model3: model3Updates,
    }));
    
    assert.deepEqual(store.getState(),
                     {
                       entities: {
                         'my model': {
                           1: {hello: 'world', example: true},
                           2: {new: 'model data', overrides: 'old data', for: 'model id 2'},
                           3: { b: 2, c: true, example: true },
                           4: {this: 'is a new model'},
                         },
                         'model2': {1: {a:1}, 2: {b:1}},
                         'model3': {1: {c:1}, 2: {d:1}, 'non integer id': {blah: 'blah'}},
                       }
                     });

    store.dispatch(actions.update('my model')(1, {newProperty: 'hello'}));
    
    assert.deepEqual(store.getState(),
                     {
                       entities: {
                         'my model': {
                           1: {hello: 'world', example: true, newProperty: 'hello'},
                           2: {new: 'model data', overrides: 'old data', for: 'model id 2'},
                           3: { b: 2, c: true, example: true },
                           4: {this: 'is a new model'},
                         },
                         'model2': {1: {a:1}, 2: {b:1}},
                         'model3': {1: {c:1}, 2: {d:1}, 'non integer id': {blah: 'blah'}},
                       }
                     });

    store.dispatch(actions.update('my model')(1, undefined, (entity)=> ({...entity, a: 3}) ));
    assert.deepEqual(store.getState(),
                     {
                       entities: {
                         'my model': {
                           1: {hello: 'world', example: true, newProperty: 'hello', a: 3 },
                           2: {new: 'model data', overrides: 'old data', for: 'model id 2'},
                           3: { b: 2, c: true, example: true },
                           4: {this: 'is a new model'},
                         },
                         'model2': {1: {a:1}, 2: {b:1}},
                         'model3': {1: {c:1}, 2: {d:1}, 'non integer id': {blah: 'blah'}},
                       }
                     });
    const myModels = selectors.get('my model')(store.getState());
    assert.equal(myModels.length, 4);
    
    const myModels1 = selectors.get('my model')(store.getState(), {example: true});
    assert.deepEqual(myModels1, [
      {hello: 'world', example: true, newProperty: 'hello', a: 3, id: 1},
      { b: 2, c: true, example: true, id: 3}
    ]);
    
    const model2s = selectors.get('model2')(store.getState());
    assert.deepEqual(model2s, [
      {a:1, id: 1},
      {b:1, id: 2},
    ]);
    console.log(store.getState());
    const getOneExample = selectors.getOne('my model')(store.getState(), { id: '1' });
    console.log(getOneExample);

  });
});
