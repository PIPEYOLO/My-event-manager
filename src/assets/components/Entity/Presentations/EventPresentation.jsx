import { useCallback, useContext, useState } from "react";
import useEventInfo from "../../../hooks/useEventInfo";
import DynamicPhoto from "../../ui/Photo/DynamicPhoto";
import { VisibleEventContext } from "../../../context/Event.";
import InfoBar from "../../ui/InfoBoxes/InfoBar";
import UsersContainer from "../Container/UsersContainer";
import CreateInvitationModal from "../../Modals/CreateInvitationModal";
import ManageSubscriptionStateButton from "../../ui/Buttons/ManageEventSubscriptionStateButton";
import DefaultDialogSet from "../../ui/Dialog/DefaultDialogSet";
import DefaultButton from "../../ui/Buttons/DefaultButton";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdModeEdit } from "react-icons/md";



export default function EventPresentation() {
  
  const user = useSelector( state => state.user );
  const { subscribe, unsubscribe, entity } = useContext(VisibleEventContext);
  const { _id, description, creator, photo, name, isPublic, subscribed, error, subscribedUsers, url } = entity;

  const { now, date, dateRepresentation } = useEventInfo(entity);

  return (
    <div className="relative grow h-full flex flex-col gap-5 p-5 overflow-y-auto scrollbar-1">
      <div className="w-full flex flex-wrap justify-center gap-x-10 gap-y-5">
        <div className="h-48 flex-none aspect-square rounded-full overflow-hidden">
          <DynamicPhoto src={ photo?.path } entityType="event" />
        </div>
        <div className="grow flex flex-col items-start gap-2">
          <h1>{name}</h1>
          <p>{ description }</p>

          <div className="font-semibold">
            - Creator: { creator.name } -
          </div>


          <div className="text-sm">
            The event starts the
            <span className={"ml-2 italic font-bold " + (now.getTime() < date.getTime() ? "text-green-600" : "text-red-600") }>
              { dateRepresentation }
            </span>
          </div>

          <div className="text-sm">
              This event is 
            <span className={"font-bold ml-1 italic " + (isPublic ? "text-gray-500" :"text-3")}>{ isPublic ? "Public" : "Private"}</span>
          </div>

          <div className="text-sm">
            <span className={"font-bold ml-1 italic"}>{ subscribedUsers.length } Subscribed users</span>
            
          </div>

          <div className="w-fit h-fit">
            <ManageSubscriptionStateButton
              subscribed={ subscribed } 
              changeState={() =>  subscribed ? unsubscribe() : subscribe()} 
            />
          </div>

          
          {
            error != undefined ? <InfoBar message={ error.message } type="error" /> : undefined
          }

        </div>

        <div className="grow h-full min-w-[200px] flex flex-col">
          <h5>Subscribed users:</h5>
          <UsersContainer users={ subscribedUsers } />
        </div>

      </div>
      

      <div className="fixed right-10 bottom-10 min-w-[150px] flex justify-end flex-wrap gap-x-10 gap-y-5">
        {
          user._id === creator._id // if user is the creator of the event show this button
          ? (
            <RedirectToEditEventPage event_id={ _id } />
          ) : undefined
        }

        <CreateInvitationModalOpener event_id={ _id } />
      </div>
    </div>
  )
}

function RedirectToEditEventPage({ event_id }) {
  const navigate = useNavigate();
  return (
    <DefaultButton onClick={ useCallback(() => navigate(`/edit-event/${event_id}`), [ event_id ])} className="flex items-center gap-3 border-2 hover:text-6 hover:border-6 bg-1" >
      <span className="h-6 aspect-square">
        <MdModeEdit />
      </span>
      Edit
    </DefaultButton>
  )
}

function CreateInvitationModalOpener({ event_id }) {
  const [ isOpen, setIsOpen ] = useState(false);
  
  return (
    <DefaultDialogSet
      reference={(
        <DefaultButton 
          className="h-16 w-fit flex tiems-center gap-4 p-4 font-bold hover:scale-110 bg-6"
        >
          <div className="h-7 aspect-square">
            <FaPlus fill="#000"/>
          </div>
          <span className="text-xl text-black">Create Invitation</span>
        </DefaultButton>
      )}
      isOpen={ isOpen }
      setIsOpen={ setIsOpen }
    >
      <CreateInvitationModal isOpen={ isOpen } setIsOpen={ setIsOpen } event_id={ event_id } />
    </DefaultDialogSet>
   
  )
}