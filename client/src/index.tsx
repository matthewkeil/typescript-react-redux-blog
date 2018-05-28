import createHistory         from 'history/createBrowserHistory';
import * as React            from 'react';
import * as ReactDOM         from 'react-dom';
import {Provider}            from 'react-redux';
import {
    ConnectedRouter,
    routerMiddleware,
    routerReducer
}                            from 'react-router-redux';
import {
    createStore,
    applyMiddleware,
    combineReducers
}                            from 'redux';
import App                   from './App';
import middleware            from './common/store/middleware';
import reducers              from './common/store/reducers';
import './index.css';
import registerServiceWorker from './registerServiceWorker';



const history           = createHistory();
const routingMiddleware = routerMiddleware(history);
const store             = createStore(
    combineReducers(Object.assign({...reducers}, {router: routerReducer})),
    applyMiddleware(...middleware, routingMiddleware)
);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
