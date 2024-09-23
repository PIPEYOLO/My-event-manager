

const logMiddleware = store => next => action => {
  if(import.meta.env.MODE === "development") {
    console.group(action.type);
    console.info('dispatching', action);
    next(action);
    console.log('next state', store.getState());
    console.groupEnd();
  }
  else {
    next(action);
  }
}

export default logMiddleware;