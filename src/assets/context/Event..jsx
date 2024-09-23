import { createContext, useCallback, useReducer } from "react";
import { setError } from "../store/slices/user";
import { useSelector } from "react-redux";
import { joinEvent, leaveEvent } from "../../../utils/fetch/event";




export const VisibleEventContext = createContext();



export function VisibleEventContext__Provider({ children }) {
  const user = useSelector( state => state.user );
  const [ state, dispatch ] = useReducer((state, action) => {
    if(action.type === "SET_ERROR"){
      state.error = action.payload;
    }
    else if(action.type === "SET_ENTITY"){
      state.entity = action.payload;
      if(state.entity.subscribedUsers.find(subscriber => subscriber._id === user._id) !== undefined) {
        state.entity.subscribed = true;
      }
      else {
        state.entity.subscribed = false;
      }
      state.entity = { ...state.entity };
    }
    else if(action.type === "SET_ENTITY_ERROR") {
      state.entity.error = action.payload;
      state.entity = { ...state.entity };
    }
    else if(action.type === "SUBSCRIBE") {
      state.entity.subscribedUsers = [ ...state.entity.subscribedUsers, { _id: user._id, date: new Date().toISOString() }];
      state.entity.subscribed = true;
      state.entity.error = null;
      state.entity = { ...state.entity };
    }
    else if(action.type === "UNSUBSCRIBE") {
      state.entity.subscribedUsers = state.entity.subscribedUsers.filter(subscriber => subscriber._id !== user._id);
      state.entity.subscribed = false;
      state.entity.error = null;
      state.entity = { ...state.entity };
    }
    else return state;

    if(import.meta.env.MODE === "development") {
      console.log(state, typeof state);
    }
    return { ...state };
  }, { error: null, entity: null });


  return (
    <VisibleEventContext.Provider value={{
      ...state,
      setError: useCallback((error) => dispatch({ type: "SET_ERROR", payload: error }), []),
      setEntity: useCallback((entity) => dispatch({ type: "SET_ENTITY", payload: entity }), []),
      subscribe: useCallback(async () => { 
        const response = await joinEvent(state.entity._id);
        const { success, data, error } = response.data;
        if(success === false) return dispatch({ type: "SET_ENTITY_ERROR", payload: error });
        dispatch({ type: "SUBSCRIBE" })
      }, []),
      unsubscribe: useCallback(async () => { 
        const response = await leaveEvent(state.entity._id);
        const { success, data, error } = response.data;
        if(success === false) return dispatch({ type: "SET_ENTITY_ERROR", payload: error });
        dispatch({ type: "UNSUBSCRIBE" })
      }, []),
    }}>
      { children }
    </VisibleEventContext.Provider>
  )
}