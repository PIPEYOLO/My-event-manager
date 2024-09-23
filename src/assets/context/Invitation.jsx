import { useSelector } from "react-redux";
import { acceptInvitation, rejectInvitation } from "../../../utils/fetch/invitation";
import { createContext, useCallback, useReducer } from "react";




export const VisibleInvitationContext = createContext();



export function VisibleInvitationContext__Provider({ children }) {
  const user = useSelector( state => state.user );
  const [ state, dispatch ] = useReducer((state, action) => {
    if(action.type === "SET_ERROR"){
      state.error = action.payload;
    }
    else if(action.type === "SET_ENTITY"){
      state.entity = action.payload;
      const userUsageStateInfo = state.entity.invitedUsers.find(invitedUser => invitedUser._id === user._id); // tick if the invitation is acceted | rejected | pending 
      state.entity.usageState = userUsageStateInfo.usageState;
      state.entity = { ...state.entity };
    }
    else if(action.type === "SET_ENTITY_ERROR") {
      state.entity.error = action.payload;
      state.entity = { ...state.entity };
    }
    else if(action.type === "ACCEPT") {
      state.entity.usageState = "accepted";
      state.entity.error = null;
      state.entity = { ...state.entity };
    }
    else if(action.type === "REJECT") {
      state.entity.usageState = "rejected";
      state.entity.error = null;
      state.entity = { ...state.entity };
    }
    else return state;
    
    if(import.meta.env.MODE === "development") {
      console.log(state);
    }
    return { ...state };
  }, { error: null, entity: null });


  return (
    <VisibleInvitationContext.Provider value={{
      ...state,
      setError: useCallback((error) => dispatch({ type: "SET_ERROR", payload: error }), []),
      setEntity: useCallback((entity) => dispatch({ type: "SET_ENTITY", payload: entity }), []),
      accept: useCallback(async () => { 
        const response = await acceptInvitation(state.entity._id);
        const { success, data, error } = response.data;
        if(success === false) return dispatch({ type: "SET_ENTITY_ERROR", payload: error }); 
        return dispatch({ type: "ACCEPT" });
      }, []),
      reject: useCallback(async () => {
        const response = await rejectInvitation(state.entity._id);
        const { success, data, error } = response.data;
        if(success === false) return dispatch({ type: "SET_ENTITY_ERROR", payload: error }); 
        return dispatch({ type: "REJECT" });
      }, []),
    }}>
      { children }
    </VisibleInvitationContext.Provider>
  )
}