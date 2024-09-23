import EventCard from "../Cards/EventCard";
import { eventsSliceActions } from "../../../store/slices/events";
import useEntitiesSet from "../../../hooks/useEntitiesSet";
import { useSelector } from "react-redux";
import EventSearchSet from "../SearchSets/EventSearchSet";
import EntitiesBaseSet from "./EntitiesBaseSet";
import { fetchEventsAsyncThunk } from "../../../store/slices/events/thunks";



export default function MyEventsSet() {
  
  const state = useSelector( state => state.events );
  const { ids: eventIds, error, allEventsObtained } = state;
  
  const { loadMore } = useEntitiesSet({ state, fetchMoreThunk: fetchEventsAsyncThunk, teardownThunk: eventsSliceActions.teardownState });

  return (
    <div className="relative h-full grow flex flex-col items-center overflow-y-auto pb-16 scrollbar-1">
      <EventSearchSet />
      <section className="w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5 p-5 ">
        {
          eventIds.map(_id => <EventCard key={ _id } _id={ _id } />)
        }
      </section>
      
      <EntitiesBaseSet 
        error={ error } 
        entitiesCount={ eventIds.length }
        isOpenLoadMoreButton={ (allEventsObtained.current || eventIds.length === 0 || error != null) }
        loadMoreFn={ loadMore } 
      />

    </div>
  )
}