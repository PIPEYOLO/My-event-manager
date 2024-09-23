import { useCallback, useMemo } from "react"
import DynamicPhoto from "../../ui/Photo/DynamicPhoto";
import SeeMoreButton from "../../ui/Buttons/SeeMoreButton";
import { useDispatch, useSelector } from "react-redux";
import { selectEvent } from "../../../store/slices/events/selectors";
import useEventInfo from "../../../hooks/useEventInfo";
import { manageEventSuscriptionAsyncThunk } from "../../../store/slices/events/thunks";
import ManageSubscriptionStateButton from "../../ui/Buttons/ManageEventSubscriptionStateButton";
import { useMediaQuery } from "react-responsive";



export default function EventCard({ _id }) {

  const mq_portrait = useMediaQuery({ query: "(orientation: portrait)"});

  const dispatch = useDispatch();
  const eventInfo = useSelector(selectEvent(_id));
  const { url, name, description="", creator, photo, startDate, subscribed } = eventInfo;

  const { now, date, dateRepresentation } = useEventInfo(eventInfo);

  const descriptionRepresentation = useMemo(()=> {
    if(description.length > 50) return description.slice(0, 50) + "...";
    return description;
  }, [ description ]);


  return (
    <div className="relative h-fit flex justify-center items-center gap-5 p-5 border-2 rounded-md shadow-sm shadow-white ">
      
      {
        mq_portrait ? ( // if portrait we would put a background with the photo of the event
          <div className="absolute h-full w-full opacity-30">
            <DynamicPhoto src={ photo?.path } type="event" />
          </div>
        )
        : ( // If landscape we would put a circled photo
          <div className="h-12 md:h-24 aspect-square  flex-none rounded-full overflow-hidden">
            <DynamicPhoto  entityType="event" />
          </div>
        ) 
      }

      <div className="flex flex-col z-[1]">
        <h3>{name}</h3>
        <p>{descriptionRepresentation}</p>
        <div className="w-full flex justify-end">
          <div className="italic font-bold">
            - { creator.name } -
          </div>
        </div>
        <div className="text-sm">
          <span className={"ml-2 italic font-bold " + (now.getTime() < date.getTime() ? "text-green-600" : "text-red-600") }>
            { dateRepresentation }
          </span>
        </div>

        <div className="flex justify-end gap-4 mt-5 ">
          <ManageSubscriptionStateButton 
            subscribed={ subscribed } 
            changeState={ 
              useCallback(() => {
                const actionToDo = subscribed ? "unsubscribe" : "subscribe";
                dispatch(manageEventSuscriptionAsyncThunk({ _id, managementType: actionToDo })); 
              }, [ _id, subscribed ])
            } 
          />

          <SeeMoreButton url={ url } />
        </div>
      </div>

    </div>
  )
}