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
      assert.deepEqual(actions.create(modelName)(modelObject, modelId), expectedAction);
    });

    it('should correctly increment integer pk\'s when autoPk option is selected', () => {
      const modelName = "anotherTestModel";
      const modelObject = {
        a:1,
        b:2,
        c: {
          nested: "shenanigans",
        }
      };
      const expectedAction1 = {
        type: "CREATE_ANOTHERTESTMODEL",
        payload: {
          id: 1,
          modelObject: modelObject,
        },
      };
      assert.deepEqual(actions.create(modelName, true)(modelObject), expectedAction1);

      const expectedAction2 = {
        type: "CREATE_ANOTHERTESTMODEL",
        payload: {
          id: 2,
          modelObject: modelObject,
        },
      };
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

describe('selectors', ()=> {
  const myModel = reducer('myModel');
  const topLevelReducer = combineReducers({
    entities: combineReducers({myModel}),
  });
  const store = createStore(topLevelReducer);
  const models = {
    1: {
      c:1,
      z:1,
    },
    2: {
      d:1,
      z:1,
    },
    'non integer id': {
      blah: 'blah',
      z:1,
    }
  };
  store.dispatch(actions.bulkUpdate('myModel')(models));

  it('can get models', () => {
    const a = selectors.get('myModel')(store.getState());
    assert.equal(a.length, 3);
  });

  it('can getOne models', () => {
    const a = selectors.getOne('myModel')(store.getState(), {id:1});
    assert.deepEqual(a, {id: 1, c:1, z:1});
  });

  it('getOne will complain about more than one model, but still return the first one', () => {
    const a = selectors.getOne('myModel')(store.getState(), {z:1});
    assert.deepEqual(a, {id: 1, c:1, z:1});
  });

  it('getOne will complain about not finding any models, and will return undefined', () => {
    const a = selectors.getOne('myModel')(store.getState(), {wew:1});
    assert.equal(a, undefined);
  });

});

describe('readme getting started examples', ()=> {

  it('the abridged introduction example should work as advertised', () => {
    // the bit we don't show
    const store = createStore(combineReducers({
      entities: combineReducers({ myModel: reducer('myModel')}),
    }));
    const myModelCreate = actions.create('myModel', true);
    const myModelUpdate = actions.update('myModel');
    const myModelDelete = actions.del('myModel');
    const myModelGet = selectors.get('myModel');
    const myModelGetOne = selectors.getOne('myModel');

    // the bit we do show
    store.dispatch(myModelCreate({'some': 'model data'})); 
    store.dispatch(myModelCreate({'example': 'usage', 'asdf': true}));
    assert.deepEqual([{id: 1, 'some': 'model data'}, {id: 2, 'example': 'usage', 'asdf': true}],
                     myModelGet(store.getState()));

    assert.deepEqual(myModelGet(store.getState(), {'example': 'usage'}),
                     [{id: 2, 'example': 'usage', 'asdf': true}]);

    store.dispatch(myModelUpdate(2, {'example': 'new'}));
    assert.deepEqual(myModelGetOne(store.getState(), {'example': 'new'}),
                     {id: 2, 'example': 'new', 'asdf': true});

    // delete model by id
    store.dispatch(myModelDelete(1));
    // get all models
    assert.deepEqual(myModelGet(store.getState()),
                     [{id: 2, 'example': 'new', 'asdf': true}]);

  });

  it('should work as advertised', ()=> {
    // store setup
    
  });

});
