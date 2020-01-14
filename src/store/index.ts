import { createStore, applyMiddleware, Middleware, Store, AnyAction } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { rootReducer, rootSaga } from '../ducks';

const sagaMiddleware = createSagaMiddleware();
const middlewares: Middleware[] = [sagaMiddleware];
const store: Store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));

sagaMiddleware.run(rootSaga);
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
store.close = (): AnyAction => store.dispatch(END);

if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    module.hot.accept('reducers', () => {
      store.replaceReducer(rootReducer);
    });
  }
}

export default store;
