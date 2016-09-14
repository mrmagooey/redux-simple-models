# redux-models

Simple interface for setting and getting data from a redux store.
 
We care about two things:

1. How to insert data into the redux store
1. How to get data from the redux store

For these things to be possible we need:

* A standard reducer
* A standard data structure in the store (we follow normalizr's example)
* A common set of actions (create, update and delete)
* And finally, some standard interface for getting data from the store

## Usage
### Reducer and store setup
First setup the store with the required model reducers. Each model needs its own reducer, and we put all of our models within a store namespace (default is `entities`).

    import { actions, reducer, selectors } from 'redux-models';
    import { createStore } from 'redux';
    
    // due to es6 there's a few ways we can define new reducers, pick whatever you like
    const modelNameString = 'my model';
    const model2 = reducer('model2');
    
    const entityReducers = combineReducers({
        [modelNameString]: reducer(modelNameString), // es6 computed property names
        model2, // es6 shorthand
        model3 : reducer('model3'), // normal object literal usage
    })
    
    const topLevelReducer = combineReducers({
        entities: entityReducers,
    })

    const store = createStore(topLevelReducer)

Note that each reducer expects to be mounted at the same name as it is passed.

### Creating instances

Adding a model to the store:

    const modelInstance = {hello: 'world', example: true };
    const storeAction = actions.create('my model')(1, modelInstance);
    store.dispatch(storeAction);

We've given our new modelInstance the unique id `1`, and stored it in the store. If we add additional instances we will need to give these unique id's as well, unless we want to overwrite previous models.

    store.dispatch(actions.create('my model')(2, { a: 1, example: false }))
    store.dispatch(actions.create('my model')(3, { b: 2, c: true }))

### Updating instances

Updating instances has a similar interface. It takes the instances unique id and an object containing the instance properties you want to overwrite.
    
    store.dispatch(actions.update('my model')(1, {newProperty: 'hello'}))

If you have some real fancy models that need to do more than just update a property, you can provide a `customReducer` function as the last argument. This function takes the single entity, and returns the updated entity.

    store.dispatch(actions.update('my model')(1, undefined, (entity)=> ({...entity, a: 3}) ))

### Retrieving instances

Retrieving data from the store is done via the selectors interface. The selectors interface takes the store state, and a `where` object, specifying the attributes that the model objects need to contain in order to be returned. To return all instances, just omit a `where` object from the second argument.

    // get everything
    selectors.get('my model')(store.getState())
    > [{hello:'world', example:true}, {a:1,example:false}, {b:2, c: true}]
    
    // only get items where example is true
    selectors.get('my model')(store.getState(), {example: true})
    > [{hello:'world', example:true}]
    
If we want data from another model, we just specify that model name first.

    selectors.get('model2')(store.getState())
    > [] // we haven't added any instances of this model type
    
If we only want a single model instance the `getOne` interface is provided.

    selectors.getOne('my model')(store.getState(), { id:1 })
    > {}

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
    myModelActions.create(1, {test:true});

The same idea (producing specialised functions via closures) goes for reducers:

    // reducers.js
    import { reducer } from 'redux-models';
    const reducer = reducer('myModel');
    export default reducer;

And for selectors:

    // selectors.js
    import { selectors } from 'redux-models';
    let modelName = 'myModel';
    export const get = selectors.get(modelName);
    export const getOne = selectors.getOne(modelName);

In this way everything relating to getting and setting data on a particular model is kept in the same spot, and they all share a common interface.

Final suggestions:

* At some point you will need custom actions (e.g. for api responses). Use the redux-models versions as building blocks for these custom functions and add these to the actions.js file.
* You can also keep your Normalizr schema in this directory `schema.js`, useful for wrangling api responses.

### React-Redux

The reducers and actions are agnostic what presentation framework is being used.

The selectors can be directly used within any context that has access to state, whether it be within `mapStateToProps`, or within a thunk that has access to `getState()`. 

