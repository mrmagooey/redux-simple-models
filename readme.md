# redux-simple-models

[![Coverage Status](https://coveralls.io/repos/github/mrmagooey/redux-simple-models/badge.svg?branch=master)](https://coveralls.io/github/mrmagooey/redux-simple-models?branch=master)
[![Build Status](https://travis-ci.org/mrmagooey/redux-simple-models.svg?branch=master)](https://travis-ci.org/mrmagooey/redux-simple-models)

## Introduction

`redux-simple-models` is a simple interface for creating, updating, deleting (aka CRUD) and retrieving data from a redux store. It takes care of creating a default set of actions, a standard reducer, and a set of selectors for retrieving data.

We set up our store with a reducer for our example model `myModel`, like so:

    > import { createStore, combineReducers } from 'redux';
    > import { actions, reducer, selectors } from 'redux-simple-models';
    > const store = createStore(combineReducers({
        entities: combineReducers({ myModel: reducer('myModel') })
      }))
      
This adds our standard reducer to the store, tailored for the `myModel` model.

To store data in redux store:
     
    > store.dispatch(actions.create('myModel')({ some: 'model data' }));
    > store.dispatch(actions.create('myModel')({ example: 'usage', asdf: true }));
    
Get data from store (note automatic integer ids, this is optional):

    > selectors.get('myModel')(store.getState());
    [{ id: 1, 'some': 'model data'}, {id: 2, 'example': 'usage', 'asdf': true }]
    
Get data from store satisfying some `where` parameters, in this case, that :

    > selectors.get('myModel')(store.getState(), {'example': 'usage'})
    [{ id: 1, 'example': 'usage', 'asdf': true }]
    
Update data:

    > store.dispatch(actions.update('myModel')({ id:1 }, {'example': 'new'}))
    > selectors.getOne('myModel')(store.getState(), {'example': 'new'})
    { id: 1, 'example': 'new', 'asdf': true }

Delete model by id

    > store.dispatch(delete('myModel')({ id:1 }))
    // now there is only a single remaining model in the store
    > selectors.get('myModel')(store.getState())
    [{ id: 2, 'example': 'usage', 'asdf': true }]

## Installation

    $ npm install redux-simple-models --save

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
    const storeAction = actions.create('myModel')(modelInstance);
    store.dispatch(storeAction);

But, for convenience, we create a customised `create` function for our model:

    const myModelCreate = actions.create('myModel', true);

Then we simply pass model data directly to this closure:

    store.dispatch(myModelCreate({some: 'test', data: 'here'}));
    store.dispatch(myModelCreate({some: 'more test', data: 'here'}));

The above `create` calls result in the store data structure looking like:

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
    
If you don't want automatic integer ids, simply pass an `id` property in the model data:

    >> store.dispatch(myModelCreate({ id: 'hello', some: 'test data' }))
    >> store.getState()
    {
       "entities": {
           "myModel": {
               1: { hello: 'world', example: true },
               2: {some: 'test', data: 'here'},
               3: {some: 'more test', data: 'here'},
               hello: {some: 'test data'},
           }
       }
    }

### Bulk creating instances

We can bulk create instances using the `bulkUpdate()` action. This will directly set the contents of the models store, overwriting existing models with the same id.

    let bulkCreateMyModel = actions.bulkCreate('myModel');
    store.dispatch(bulkCreateMyModel(
        {
            2: {new: 'model data', overrides: 'old data', for: 'model instance id 2' },
            4: {'this': 'is a new model instance'},
        }
    ));
    
If there are multiple models that we want to bulk create for (i.e. when rehydrating the application state), we can use `allModelBulkCreate()` achieve this.

    const newData = actions.allModelBulkCreate({
      myModel: {
        rehydrated: { model: 'data' },
      },
      anotherModel: {
        more: { data: 'here' }
      },
      etc: {}
    });
    store.dispatch(newData);

You still need reducers in the store for each model, any model in the `allModelBulkCreate` call that does not have a corresponding reducer in the store will be ignored. This call will also overwrite any existing model data for any model that has data in the call.

This function is the only one that does take a model name as the first call, as it updates all models and does not require specialisation for one.

### Updating instances

Updating instances has a similar interface. It takes an object `where` clause as the first argument, and  the instance properties you want to add or overwrite as the second argument. If the `where` clause matches multiple models, all of these models will be updated.
    
    let updateMyModel = actions.update('myModel');
    store.dispatch(updateMyModel({ id: 1 }, { 
        newProperty: 'asdf',
        hello: 'new data',
    }));

If you have some fancy models that need to do more than just update a property, you can provide a `customReducer` function as the last argument. This `customReducer` function takes the single entity, and returns the updated entity.

    store.dispatch(updateMyModel({ id: 1 }, undefined, (entity) => ({
        a: 3,
    })));
    
### Retrieving instances

Retrieving data from the store is done via the selectors interface. The selectors interface takes the store state, and a `where` object, specifying the attributes that the model objects need to contain in order to be returned. To return all instances, just omit a `where` object from the second argument.

    
    // create our customised selector
    const myModelGet = selectors.get('myModel');

    // get everything
    myModelGet(state)
    
    // only get items that satisfy some 'where' conditions
    myModelGet(state, { data: 'here' })
    
If we only want a single model instance the `getOne` interface is provided.

    const myModelGetOne = selectors.getOne('myModel');
    myModelGetOne(state, { id:1 })

If more than one instance is found, it will warn you in the console and return the first instance. If nothing is found it will warn you and return `undefined`.

## Suggested Usage
### Project setup
All of these functions are closures that specialise themselves based on the first function call. This is done because it is expected that a specialised version will live within its own file and be exported. 

For example, your directory structure might look like:

	├── models
	│   ├── myModel
	│   │   ├── actions.js
	│   │   ├── reducers.js
    │   │   ├── schema.js
	│   │   └── selectors.js
	│   ├── forms
	│   │   ├── actions.js
	│   │   ├── reducers.js
    │   │   ├── schema.js
	│   │   └── selectors.js
	│   ├── widgets
	│   │   ├── actions.js
	│   │   ├── reducers.js
    │   │   ├── schema.js
	│   │   └── selectors.js

A script for creating model folders is shipped with this package (`rsm-create`), and can be used like:

   $ rsm-create <model name>

This script will create a folder in the terminal current working directory with customised files for the model name, i.e. if you called `$ rsm-create myModel`, in the actions.js file you would have:

    // actions.js
    import { actions } from 'redux-models';
    export const create = actions.create('myModel');
    export const update = actions.update('myModel');
    export const del = actions.del('myModel');

Now the `myModel` actions can be imported and used directly wherever they are needed.
    
    import * as myModelActions from './models/myModel/actions.js';
    myModelActions.create({ test: true });


