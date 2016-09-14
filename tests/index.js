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



describe('e2e', ()=> {

  it('should add models', ()=> {
    
  });

});
