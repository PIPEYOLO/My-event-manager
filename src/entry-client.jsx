import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import storeRootReducer from './assets/store'
import { configureStore } from '@reduxjs/toolkit'
import logMiddleware from './assets/store/middlewares/log'

const store = configureStore({ 
  reducer: storeRootReducer, 
  preloadedState: window.__PRELOADED_STATE__,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware();
    if(import.meta.env.MODE === 'development') {
      middleware.push(logMiddleware);
    }
    return middleware;
  }
});

delete window.__PRELOADED_STATE__;

ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
