import { Link } from "react-router-dom";
import DynamicPhoto from "../../ui/Photo/DynamicPhoto";
import { useCallback, useMemo } from "react";

import SeeMoreButton from "../../ui/Buttons/SeeMoreButton";
import { useSelector, useDispatch } from "react-redux";
import { manageInvitationAsyncThunk } from "../../../store/slices/invitations/thunks";

import { selectInvitation } from "../../../store/slices/invitations/selectors";
import InfoBar from "../../ui/InfoBoxes/InfoBar";
import DefaultButton from "../../ui/Buttons/DefaultButton";



export default function InvitationCard({ _id }) {

  const invitation = useSelector(selectInvitation(_id));

  const { url, description, usageState, creationDate, event, creator, error } = invitation;

  const creationDateRepresentation = useMemo(() => new Date(creationDate).toUTCString(), [ creationDate ]);
  return (
    <div className="h-full flex flex-col items-center gap-5 p-5 border-2 rounded-md shadow-sm shadow-white ">
      
      <div className="flex items-center gap-6">
        <div className="h-8 flex-none aspect-square rounded-full overflow-hidden">
          <DynamicPhoto src={ creator.photo?.path } entityType="user" />
        </div>
        <p>
          <span className="font-semibold italic">{ creator.name }</span> 
          <span> has invited you to '{event.name}' event </span>
          <br />
          <span className="italic text-gray-500">{ creationDateRepresentation }</span>
        </p>
      </div>

      {
        description != undefined && description.length > 0
        ? (
          <p>
            <span className="italic text-gray-500">Invitation desc: </span> { description }
          </p>
        )
        : ""
      }

      <div className="flex flex-col gap-3">
        <div className="flex justify-center items-center gap-5">
          <div className="h-12 aspect-square rounded-full overflow-hidden">
            <DynamicPhoto src={event.photo?.path} entityType="event" />
          </div>
          <Link to={ event.url } >{ event.name }</Link>
        </div>
        <div className="flex justify-center items-center gap-3">
          <SeeMoreButton url={ url } />
          
          {
            usageState === "pending"
            ? (
              (
                <>
                  <ManageEventInvitationButton managementType={"accept"} invitation_id={_id} />
                  <ManageEventInvitationButton managementType={"reject"} invitation_id={_id} />
                </>
              )
            )
            : (
              <span className={ "capitalize font-semibold " + (usageState === "accepted" ? "text-green-600" : "text-red-500") }>
                { usageState }
              </span>
            )
          }

        </div>
      </div>

      {
        error != undefined 
        ? (
          <InfoBar message={error.message} type="error" />
        )
        : ""
      }
    </div>
  )
}


function ManageEventInvitationButton({ managementType, invitation_id }) {


  const invitation = useSelector(selectInvitation(invitation_id));

  const dispatch = useDispatch();
  const manageFn = useCallback(async () => {
    if(invitation.error != undefined) return; 
    dispatch(manageInvitationAsyncThunk({ _id: invitation_id, managementType }));
  }, [ managementType, invitation_id ]);

  const classlistColors = useMemo(() => {
    let classListString = "";
    if(managementType === "accept") classListString += "text-green-600 hover:border-green-600";
    else classListString += "text-red-600 hover:border-red-600";

    if(invitation.error != undefined) classListString += " opacity-50";
  }, [ managementType ]);

  return (
    <>
      <DefaultButton
        onClick={ manageFn }
        className={"capitalize text-lg rounded-full py-1 px-2 border-2 border-transparent cursor-pointer transition-colors" + classlistColors}>
        { managementType }
      </DefaultButton>    
    </>

  );
}
