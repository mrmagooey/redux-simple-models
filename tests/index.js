import * as assert from "assert";
import { actions, reducer, selectors } from "../src/index.js";
import * as should from "should";
import { createStore, combineReducers } from "redux";

describe("actions", function() {
  describe("create action", () => {
    it("should create the correct action ", function() {
      const modelName = "testModel";
      const modelId = "some unique id";
      const modelObject = { a: 1, b: 2, c: { nested: "shenanigans" } };
      const expectedAction = {
        type: "CREATE_TESTMODEL",
        payload: { modelObject: modelObject }
      };
      assert.deepEqual(
        actions.create(modelName)(modelObject, modelId),
        expectedAction
      );
    });

    it(
      "should correctly increment integer pk's when autoPk option is selected",
      () => {
        const modelName = "anotherTestModel";
        const modelObject = { a: 1, b: 2, c: { nested: "shenanigans" } };
        const expectedAction1 = {
          type: "CREATE_ANOTHERTESTMODEL",
          payload: { modelObject: modelObject }
        };
        assert.deepEqual(
          actions.create(modelName)(modelObject),
          expectedAction1
        );

        const expectedAction2 = {
          type: "CREATE_ANOTHERTESTMODEL",
          payload: { modelObject: modelObject }
        };
      }
    );
  });

  describe("update action", () => {
    it("should create the correct action", () => {
      const modelName = "testModel";
      const modelId = "some unique id";
      const modelObject = { a: 1, b: 2, c: { nested: "shenanigans" } };
      const expectedAction = {
        type: "UPDATE_TESTMODEL",
        payload: {
          where: { id: modelId },
          modelObject: modelObject,
          customReducer: undefined
        }
      };
      assert.deepEqual(
        actions.update(modelName)({ id: modelId }, modelObject),
        expectedAction
      );
    });

    it(
      "should throw an execption if the `where` object is missing or not an object",
      () => {
        assert.throws(
          () => {
            actions.update("test")(undefined, {});
          },
          /needs to be an object/
        );
        assert.throws(
          () => {
            actions.update("test")("hello", {});
          },
          /needs to be an object/
        );
        assert.throws(
          () => {
            actions.update("test")(2, {});
          },
          /needs to be an object/
        );
      }
    );
  });

  describe("del action", () => {
    it("should create the correct action", () => {
      const modelName = "testModel";
      const modelId = "hello";
      const expectedAction = {
        type: "DELETE_TESTMODEL",
        payload: { where: { id: modelId } }
      };
      assert.deepEqual(actions.del(modelName)({ id: modelId }), expectedAction);
    });

    it(
      "should throw an execption if the `where` object is missing or not an object",
      () => {
        assert.throws(
          () => {
            actions.del("test")(undefined);
          },
          /needs to be an object/
        );
        assert.throws(
          () => {
            actions.update("test")("hello");
          },
          /needs to be an object/
        );
        assert.throws(
          () => {
            actions.update("test")(2);
          },
          /needs to be an object/
        );
      }
    );
  });

  describe("allModelBulkUpdate", () => {
    it("should create the correct action", () => {
      const entities = {
        model1: { 0: { stuff: 1 }, blah: { wew: "lad" } },
        model2: { stuff: { 1: 1 } }
      };
      assert.deepEqual(actions.allModelBulkCreate(entities), {
        type: "BULK_CREATE",
        payload: { entities }
      });
    });
  });
});

describe("reducer", () => {
  let store;
  beforeEach(() => {
    // recreate the store for each test
    const modelName = "myModel";
    const myModel = reducer(modelName);
    const topLevelReducer = combineReducers({
      entities: combineReducers({
        myModel,
        anotherModel: reducer("anotherModel"),
        blah: reducer("blah")
      })
    });
    store = createStore(topLevelReducer);
  });

  it("can create reducers for models", () => {
    const modelName = "wew lad";
    const myReducer = reducer(modelName);
    const reducers = combineReducers({ [modelName]: myReducer });
  });

  it("can create new instances in the store", () => {
    store.dispatch(
      actions.create("myModel")({ test: "data", id: "something" })
    );
    // manual id
    store.dispatch(actions.create("myModel")({ test: "data" }));
    // auto id
    store.dispatch(actions.create("myModel")({ number: 3 }));
    // auto id
    assert.deepEqual(store.getState(), {
      entities: {
        myModel: {
          something: { test: "data" },
          1: { test: "data" },
          2: { number: 3 }
        },
        anotherModel: {},
        blah: {}
      }
    });
  });

  describe("can update instances in the store", () => {
    it("via parameters", () => {
      store.dispatch(
        actions.create("myModel")({ test: "data", id: "something" })
      );

      store.dispatch(actions.create("myModel")({ test: "data" }));

      store.dispatch(actions.create("myModel")({ number: 3 }));

      store.dispatch(
        actions.update("myModel")({ test: "data" }, { more: "data" })
      );
      assert.deepEqual(store.getState(), {
        entities: {
          myModel: {
            something: { test: "data", more: "data" },
            1: { test: "data", more: "data" },
            2: { number: 3 }
          },
          anotherModel: {},
          blah: {}
        }
      });
    });

    it("via id", () => {
      const modelName = "myModel";
      const myModel = reducer(modelName);
      const topLevelReducer = combineReducers({
        entities: combineReducers({
          myModel,
          anotherModel: reducer("anotherModel"),
          blah: reducer("blah")
        })
      });

      const store = createStore(topLevelReducer);
      store.dispatch(
        actions.create(modelName)({ test: "data", id: "something" })
      );

      store.dispatch(actions.create(modelName)({ test: "data" }));

      store.dispatch(actions.create(modelName)({ number: 3 }));

      store.dispatch(actions.update(modelName)({ id: 1 }, { blah: "blah" }));
      assert.deepEqual(store.getState(), {
        entities: {
          myModel: {
            something: { test: "data" },
            1: { test: "data", blah: "blah" },
            2: { number: 3 }
          },
          anotherModel: {},
          blah: {}
        }
      });
    });
  });

  it("can delete instances in the store", () => {
    store.dispatch(
      actions.create("myModel")({ test: "data", id: "something" })
    );

    store.dispatch(actions.create("myModel")({ test: "data" }));

    store.dispatch(actions.create("myModel")({ number: 3 }));

    store.dispatch(actions.del("myModel")({ id: 1 }));
    assert.deepEqual(store.getState(), {
      entities: {
        myModel: { something: { test: "data" }, 2: { number: 3 } },
        anotherModel: {},
        blah: {}
      }
    });
  });

  it("can use the customReducer when updating a model", () => {
    store.dispatch(
      actions.create("myModel")({ test: "data", id: "something" })
    );

    store.dispatch(actions.create("myModel")({ test: "data" }));

    store.dispatch(actions.create("myModel")({ number: 3, more: "data" }));

    store.dispatch(
      actions.update("myModel")({ id: 2 }, undefined, entity => {
        return { ...entity, number: entity.number + 1 };
      })
    );

    assert.deepEqual(store.getState(), {
      entities: {
        myModel: {
          something: { test: "data" },
          1: { test: "data" },
          2: { number: 4, more: "data" }
        },
        anotherModel: {},
        blah: {}
      }
    });
  });

  it("can bulk create invididual models", () => {
    store.dispatch(
      actions.bulkCreate("myModel")({
        0: { new: "data" },
        1: { foo: "bar" },
        something: { miami: "dolphins" }
      })
    );
    assert.deepEqual(store.getState(), {
      entities: {
        myModel: {
          0: { new: "data" },
          1: { foo: "bar" },
          something: { miami: "dolphins" }
        },
        anotherModel: {},
        blah: {}
      }
    });
  });

  it("can bulk create across entire store", () => {
    store.dispatch(
      actions.allModelBulkCreate({
        myModel: { 0: { new: "data" }, 1: { foo: "bar" } },
        anotherModel: { 0: { new: "data" }, 1: { foo: "bar" } },
        badModel: {
          0: {
            description: "there is no reducer for this model, so it won't get put in the store"
          }
        }
      })
    );
    assert.deepEqual(store.getState(), {
      entities: {
        myModel: { 0: { new: "data" }, 1: { foo: "bar" } },
        anotherModel: { 0: { new: "data" }, 1: { foo: "bar" } },
        blah: {}
      }
    });
  });
});

describe("selectors", () => {
  const myModel = reducer("myModel");
  const topLevelReducer = combineReducers({
    entities: combineReducers({ myModel })
  });
  const models = {
    1: { c: 1, z: 1 },
    2: { d: 1, z: 1 },
    "non integer id": { blah: "blah", z: 1 }
  };

  let store;
  beforeEach(() => {
    store = createStore(topLevelReducer);
    store.dispatch(actions.bulkCreate("myModel")(models));
  });

  it("can get models", () => {
    const a = selectors.get("myModel")(store.getState());
    assert.equal(a.length, 3);
  });

  it("can getOne models", () => {
    const a = selectors.getOne("myModel")(store.getState(), { id: 1 });
    assert.deepEqual(a, { id: 1, c: 1, z: 1 });
  });

  it("can check arrays", () => {
    const newStore = createStore(
      combineReducers({ entities: combineReducers({ asdf: reducer("asdf") }) })
    );
    newStore.dispatch(
      actions.bulkCreate("asdf")({
        0: { test: [ 1, 2, 3 ] },
        1: { test: [ 2, 3, 4 ] },
        2: { test: [ 3, 4, 5 ] },
        3: { test: [ 9, 10, 11 ], blah: "blah" }
      })
    );
    const a = selectors.get("asdf")(newStore.getState(), { test: [ 1 ] });
    assert.deepEqual(a, [ { id: 0, test: [ 1, 2, 3 ] } ]);
    const b = selectors.get("asdf")(newStore.getState(), { test: [ 2 ] });
    assert.deepEqual(b, [
      { id: 0, test: [ 1, 2, 3 ] },
      { id: 1, test: [ 2, 3, 4 ] }
    ]);
  });

  it("getOne will throw an error if it finds more than one model", () => {
    assert.throws(
      () => {
        const a = selectors.getOne("myModel")(store.getState(), { z: 1 });
      },
      /More than one/
    );
  });

  it("getOne will throw an error if it doesn't find any models", () => {
    assert.throws(
      () => {
        const a = selectors.getOne("myModel")(store.getState(), { wew: 1 });
      },
      /No .+? instances found/
    );
  });
});

describe("readme getting started examples", () => {
  it("the full examples should work as advertised", () => {
    // store setup
    const entityReducers = combineReducers({
      // a single model called 'myModel'
      myModel: reducer("myModel")
    });

    const topLevelReducer = combineReducers({ entities: entityReducers });

    const store = createStore(topLevelReducer);

    const modelInstance = { hello: "world", example: true };
    const storeAction = actions.create("myModel")(modelInstance);
    store.dispatch(storeAction);
    assert.deepEqual(store.getState(), {
      "entities": { "myModel": { 1: { hello: "world", example: true } } }
    });
    const myModelCreate = actions.create("myModel");

    store.dispatch(myModelCreate({ some: "test", data: "here" }));
    store.dispatch(myModelCreate({ some: "more test", data: "here" }));
    assert.deepEqual(store.getState(), {
      "entities": {
        "myModel": {
          1: { hello: "world", example: true },
          2: { some: "test", data: "here" },
          3: { some: "more test", data: "here" }
        }
      }
    });

    const manualModelCreate = actions.create("myModel");

    store.dispatch(
      manualModelCreate({ a: 1, example: false, id: "my custom model id" })
    );
    // manual model id here
    store.dispatch(manualModelCreate({ a: 1, example: false, id: "custom1" }));
    store.dispatch(manualModelCreate({ b: 2, c: true, id: "custom2" }));

    assert.deepEqual(store.getState(), {
      "entities": {
        "myModel": {
          1: { hello: "world", example: true },
          2: { some: "test", data: "here" },
          3: { some: "more test", data: "here" },
          "my custom model id": { a: 1, example: false },
          "custom1": { a: 1, example: false },
          "custom2": { b: 2, c: true }
        }
      }
    });
  });
  it(": old example", () => {
    // the bit we don't show
    const store = createStore(
      combineReducers({
        entities: combineReducers({ myModel: reducer("myModel") })
      })
    );
    const myModelCreate = actions.create("myModel", true);
    const myModelUpdate = actions.update("myModel");
    const myModelDelete = actions.del("myModel");
    const myModelGet = selectors.get("myModel");
    const myModelGetOne = selectors.getOne("myModel");
    // the bit we do show
    store.dispatch(myModelCreate({ "some": "model data" }));

    store.dispatch(myModelCreate({ "example": "usage", "asdf": true }));
    assert.deepEqual(
      [
        { id: 1, "some": "model data" },
        { id: 2, "example": "usage", "asdf": true }
      ],
      myModelGet(store.getState())
    );
    assert.deepEqual(myModelGet(store.getState(), { "example": "usage" }), [
      { id: 2, "example": "usage", "asdf": true }
    ]);

    store.dispatch(myModelUpdate({ id: 2 }, { "example": "new" }));
    assert.deepEqual(myModelGetOne(store.getState(), { "example": "new" }), {
      id: 2,
      "example": "new",
      "asdf": true
    });
    // delete model by id
    store.dispatch(myModelDelete({ id: 1 }));
    // get all models
    assert.deepEqual(myModelGet(store.getState()), [
      { id: 2, "example": "new", "asdf": true }
    ]);
  });
});

