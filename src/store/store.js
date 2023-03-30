import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { push } from "redux-first-history";
import persistState from "redux-localstorage";
import createSagaMonitor from "@clarketm/saga-monitor";

import * as reducers from "./reducers";
import * as actions from "./actions";
import rootSaga from "./sagas/rootSaga";

const config = {
  level: "debug", // logging level
  verbose: true, // verbose mode
  color: "#03A9F4", // default color
  rootSagaStart: false, // show root saga start effect
  effectTrigger: false, // show triggered effects
  effectResolve: false, // show resolved effects
  effectReject: false, // show rejected effects
  effectCancel: false, // show cancelled effects
  actionDispatch: false, // show dispatched actions
};
export default function configureStore(
  initialState = {},
  routerReducer,
  routerMiddleware
) {
  const saga = createSagaMiddleware({ sagaMonitor: createSagaMonitor(config) });

  const staticReducers = {
    router: routerReducer,
    ...reducers,
  };

  const createReducer = (asyncReducers) =>
    combineReducers({
      ...staticReducers,
      ...asyncReducers,
    });

  const actionCreators = {
    ...actions,
    push,
  };

  const middlewares = [saga, routerMiddleware];

  const composeEnhancers = (() => {
    const compose_ = window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    if (import.meta.env.MODE === "development" && compose_) {
      return compose_({
        actionCreators,
        actionsBlacklist: ["SET_PARTICIPANT_LOCATION", "UPDATE_PARTICIPANT"],
      });
    }
    return compose;
    // Enable devtools in production mode! (extension needs to be installed first)
    // const compose_ = window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    // return compose_({ actionCreators });
  })();

  const merge = (initialState, persistState) => {
    /* const mergeState = {
          ...persistState,
          ["application"]: {
            ...persistState["application"],
            ["@@/data"]: {
              ...persistState["application"]["@@/data"],
              ...persistState,
            },
          },

        };*/

    //FIXME: we should merge objects as above.
    return {
      application: {
        // eslint-disable-next-line
        ["@@/data"]: {
          currentDeviceID: persistState && persistState.currentDeviceID,
        },
      },
    };
  };

  const slicer = (paths) => (state) => {
    return {
      currentDeviceID: state["application"]["@@/data"]["currentDeviceID"],
    };
  };

  const enhancer = composeEnhancers(
    applyMiddleware(...middlewares),
    persistState(null, {
      merge,
      slicer,
    })
  );

  const store = createStore(createReducer(), initialState, enhancer);

  // Add a dictionary to keep track of the registered async reducers
  store.asyncReducers = {};

  // Create an inject reducer function
  // This function adds the async reducer, and creates a new combined reducer
  store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = asyncReducer;
    store.replaceReducer(createReducer(this.asyncReducers));
  };

  saga.run(rootSaga);

  store.registerSagas = (...sagas) => {
    sagas.forEach(saga.run);
  };

  return store;
}
