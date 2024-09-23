import eventsSlice from "./slices/events";
import invitationsSlice from "./slices/invitations";
import userSlice from "./slices/user";


const storeRootReducer  = {
  user: userSlice.reducer,
  invitations: invitationsSlice.reducer,
  events: eventsSlice.reducer,
};


export default storeRootReducer;