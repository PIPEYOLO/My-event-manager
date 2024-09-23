import InvitationCard from "../Cards/InvitationCard";

import { useSelector } from "react-redux";
import EntitiesBaseSet from "./EntitiesBaseSet";
import { fetchInvitationsAsyncThunk } from "../../../store/slices/invitations/thunks";
import { invitationsSliceActions } from "../../../store/slices/invitations";
import InvitationSearchSet from "../SearchSets/InvitationSeachSet";
import useEntitiesSet from "../../../hooks/useEntitiesSet";



export default function MyInvitationsSet() {

  const state = useSelector(state => state.invitations);
  const { ids: invitationIds, error, allInvitationsObtained } = state;
  
  const { loadMore } = useEntitiesSet({ state, fetchMoreThunk: fetchInvitationsAsyncThunk, teardownThunk: invitationsSliceActions.teardownState });


  return (
    <div className="relative h-full grow flex flex-col items-center overflow-y-auto pb-16 scrollbar-1">
      <InvitationSearchSet />
      <section className="w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5 p-5 ">
        {
          invitationIds.map(_id => <InvitationCard key={ _id } _id={ _id } />)
        }
      </section>
      
      <EntitiesBaseSet 
        error={ error } 
        entitiesCount={ invitationIds.length }
        isOpenLoadMoreButton={ (allInvitationsObtained.current || invitationIds.length === 0 || error != null) }
        loadMoreFn={ loadMore } 
      />

    </div>
  )
}
