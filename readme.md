# redux-simple-models

[![Coverage Status](https://coveralls.io/repos/github/mrmagooey/redux-simple-models/badge.svg?branch=master)](https://coveralls.io/github/mrmagooey/redux-simple-models?branch=master)
[![Build Status](https://travis-ci.org/mrmagooey/redux-simple-models.svg?branch=master)](https://travis-ci.org/mrmagooey/redux-simple-models)

## Introduction

`redux-simple-models` is a simple interface for creating, updating, deleting and retrieving data from a redux store. It takes care of creating a default set of actions, a standard reducer, and a set of selectors for retrieving data.

Store data in redux store:

    > dispatch(myModelCreate({ some: 'model data' }));
    > dispatch(myModelCreate({ example: 'usage', asdf: true }));
    
Get data from store (note automatic integer ids):

    > myModelGet(state);
    [{ id: 1, 'some': 'model data'}, {id: 2, 'example': 'usage', 'asdf': true }]
    
Get data from store satisfying some `where` parameters:

    > myModelGet(state, {'example': 'usage'})
    [{ id: 1, 'example': 'usage', 'asdf': true }]
    
Update data:

    > dispatch(myModelUpdate(1, {'example': 'new'}))
    > myModelGetOne(state, {'example': 'new'})
    { id: 1, 'example': 'new', 'asdf': true }

Delete model by id

    > dispatch(myModelDelete(1))
    > myModelGet(state)
    [{ id: 2, 'example': 'usage', 'asdf': true }]

These examples assume we have a model called `myModel`, and have created our model functions incorporating this model name. These `myModel*` functions could be called whatever the user desires.

Below are more complete instructions on how to get up and running with `redux-simple-models`.

## Installation

    npm install redux-simple-models --save

This is a UMD build file, and should work across various build systems and javascript environments.

## Usage
### Reducer and store setup
First setup the store with the required model reducers. Each model needs its own reducer, and we put all of our models within a store namespace (default is `entities`).

    import { actions, reducer, selectors } from 'redux-models';
    import { createStore } from 'redux';
    
    const entityReducers = combineReducers({
        myModel: reducer('myModel'), // a single model called 'myModel'
    });
    
    const topLevelReducer = combineReducers({
        entities: entityReducers, 
    });

    const store = createStore(topLevelReducer);

### Creating model instances

We can add instances to the store using `actions.create` and telling it the name of the model each time:

    const modelInstance = { hello: 'world', example: true };
    const storeAction = actions.create('myModel', true)(modelInstance);
    store.dispatch(storeAction);

But, for convenience, we create a customised `create` function for our model:

    const myModelCreate = actions.create('myModel', true);

Then we simply pass model data directly to this customised function (technically a closure):

    store.dispatch(myModelCreate({some: 'test', data: 'here'}));
    store.dispatch(myModelCreate({some: 'more test', data: 'here'}));

The `true` argument in `actions.create` is for the autoPk option which provides us with automatically incrementing integer primary keys, resulting in the store data structure looking like:

    >> store.getState()
    {
       "entities": {
           "myModel": {
               1: { hello: 'world', example: true },
               2: {some: 'test', data: 'here'},
               3: {some: 'more test', data: 'here'},
           }
       }
    }

#### Without automatic integer ids

Sometimes it is easier to use non-integer keys, particularly when the model has an attribute that you would naturally refer to it by (e.g. a 'name' attribute). To use manual pks, omit the `true` argument to actions.create, and remember to add in your custom model id.

    const manualModelCreate = actions.create('myModel'); // note the missing true argument
    store.dispatch(manualModelCreate({ a: 1, example: false },
                                     'my custom model id')) // manual model id here

We've given our new instance the unique id `my custom model id`, and stored it in the store. If we add additional instances we will need to give these unique id's as well, unless we want to overwrite previous models.

    store.dispatch(manualModelCreate({ a: 1, example: false }, 'custom1'));
    store.dispatch(manualModelCreate({ b: 2, c: true }, 'custom2'));

After these updates, the store looks like:

    >> store.getState()
    {
       "entities": {
           "myModel": {
               1: { hello: 'world', example: true },
               2: {some: 'test', data: 'here'},
               3: {some: 'more test', data: 'here'},
               "my custom model id": { a: 1, example: false },
               "custom1": { a: 1, example: false },
               "custom2": { b: 2, c: true },
           }
       }
    }

### Bulk creating instances

We can bulk create instances using the `bulkUpdate()` action. This will directly set the contents of the models store, overwriting existing models with the same id.

    let bulkUpdateMyModel = actions.bulkUpdate('myModel');
    store.dispatch(bulkUpdateMyModel(
        {
            2: {new: 'model data', overrides: 'old data', for: 'model instance id 2' },
            4: {'this': 'is a new model instance'},
        }
    ));
    
If there are multiple models that we want to bulk create for (i.e. when rehydrating the application state), we can use `allModelBulkUpdate()` achieve this.

### Updating instances

Updating instances has a similar interface. It takes the instance's unique id and an object containing the instance properties you want to add or overwrite.
    
    let updateMyModel = actions.update('myModel');
    store.dispatch(updateMyModel(1, { 
        newProperty: 'asdf',
        hello: 'new data',
    }));

The model instance `1` will now be:

    {
        example: true,
        hello: 'new data',
        newProperty: 'asdf',
    }

If you have some real fancy models that need to do more than just update a property, you can provide a `customReducer` function as the last argument. This `customReducer` function takes the single entity, and returns the updated entity.

    store.dispatch(updateMyModel(1, undefined, (entity) => ({
        a: 3,
    })));
    
The model instance with pk `1` will now only contain what the `customReducer` returned:

    {
        a: 3,
    }

### Retrieving instances

Retrieving data from the store is done via the selectors interface. The selectors interface takes the store state, and a `where` object, specifying the attributes that the model objects need to contain in order to be returned. To return all instances, just omit a `where` object from the second argument.

    
    // create our customised selector
    const myModelGet = selectors.get('myModel');

    // get everything
    myModelGet(state)
    
    // only get items that satisfy 'where' conditions
    myModelGet(state, { data: 'here' })
    > [{some: 'more test', data: 'here', id: 3}]
    
If we only want a single model instance the `getOne` interface is provided.

    const myModelGetOne = selectors.getOne('myModel');

    myModelGetOne(state, { id:1 })
    > { a: 3 }

If more than one instance is found, it will warn you in the console and return the first instance. If nothing is found it will warn you and return `undefined`.

## Suggested Real World Usage
### Project setup
All of these functions are closures that specialise themselves based on the first function call. This is done because it is expected that a specialised version will live within its own file and be exported. 

For example, your directory structure might look like:

	├── models
	│   ├── myModel
	│   │   ├── actions.js
	│   │   ├── reducers.js
	│   │   └── selectors.js
	│   ├── forms
	│   │   ├── actions.js
	│   │   ├── reducers.js
	│   │   └── selectors.js
	│   ├── widgets
	│   │   ├── actions.js
	│   │   ├── reducers.js
    │   │   ├── schema.js
	│   │   └── selectors.js

In each actions file, you have something like:

    // actions.js
    import { actions } from 'redux-models';
    let modelName = 'myModel';
    export const create = actions.create(modelName);
    export const update = actions.update(modelName);
    export const del = actions.del(modelName);

Now the `myModel` actions can be imported and used directly wherever they are needed.
    
    import * as myModelActions from './models/myModel/actions.js';
    myModelActions.create(1, { test: true });

The same idea (producing specialised functions via closures) goes for reducers:

    // reducers.js
    import { reducer } from 'redux-models';
    export default reducer('myModel');;

And for selectors:

    // selectors.js
    import { selectors } from 'redux-models';
    let modelName = 'myModel';
    export const get = selectors.get(modelName);
    export const getOne = selectors.getOne(modelName);

In this way everything relating to getting and setting data on a particular model is kept in the same spot, and they all share a common interface.

