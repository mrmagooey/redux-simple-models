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
  
  it('can create reducers for models', () =>{
    const modelName = 'wew lad';

    const myReducer = reducer(modelName);
    
    const reducers = combineReducers({
      [modelName]: myReducer,
    });
    

  });

});



describe('readme getting started examples', ()=> {

  it('should work as advertised', ()=> {
    
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

    store.dispatch(actions.create('my model')(2, { a: 1, example: false }));

    store.dispatch(actions.create('my model')(3, { b: 2, c: true }));
    
    store.dispatch(actions.update('my model')(1, {newProperty: 'hello'}));

    store.dispatch(actions.update('my model')(1, undefined, (entity)=> ({...entity, a: 3}) ));

    selectors.get('my model')(store.getState());

    selectors.get('my model')(store.getState(), {example: true});

    selectors.get('model2')(store.getState());

    selectors.getOne('my model')(store.getState(), { id:1 });

    
  });

});
