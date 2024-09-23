import { useCallback, useContext, useMemo, useState } from "react";
import DynamicPhoto from "../../ui/Photo/DynamicPhoto";
import { VisibleInvitationContext } from "../../../context/Invitation";
import useEventInfo from "../../../hooks/useEventInfo";
import { Link } from "react-router-dom";
import DefaultButton from "../../ui/Buttons/DefaultButton";
import SeeMoreButton from "../../ui/Buttons/SeeMoreButton";
import InfoBar from "../../ui/InfoBoxes/InfoBar";



export default function InvitationPresentation() {

  const { entity, accept, reject } = useContext(VisibleInvitationContext);

  const { event, creator, description, creationDate, usageState } = entity;
  
  const { now, date, dateRepresentation } = useEventInfo(entity.event);

  const creationDateRepresentation = useMemo(() => new Date(creationDate).toUTCString(), [ creationDate ]);


  return ( 
    <div className="h-full w-full flex flex-col md:p-8">
      <div className="flex justify-evenly flex-wrap gap-4">
        <div className="flex">
          <div className="h-24 aspect-square flex-none  rounded-full overflow-hidden">
            <DynamicPhoto src={ creator.photo?.path } entityType="user" />
          </div>
          <p>
            <span className="font-semibold italic">{ creator.name }</span> 
            <span> has invited you to '{ event.name }' event </span>
            <br />
            <span className="italic text-gray-500">{ creationDateRepresentation }</span>
          </p>
        </div>

        <div className="flex justify-center items-center gap-3">
          <SeeMoreButton url={ event.url } />
          
          {
            usageState === "pending"
            ? (
              <>
                <DefaultButton
                  onClick={ () => accept() }
                  className={"capitalize text-lg rounded-full py-1 px-2 border-2 border-transparent cursor-pointer transition-colors text-green-600 hover:border-green-600" }>
                  Accept
                </DefaultButton>
                <DefaultButton
                  onClick={ () => reject() }
                  className={"capitalize text-lg rounded-full py-1 px-2 border-2 border-transparent cursor-pointer transition-colors text-red-600 hover:border-red-600" }>
                  Reject
                </DefaultButton>    
              </>
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
        description != undefined && description.length > 0
        ? (
          <p>
            <span className="font-md italic text-gray-500"> Invitation Description: </span> { description }
          </p>
        )
        : ""
      }

      <hr className="my-10" />
      <div className="flex flex-col gap-10">
        <div className="flex justify-center items-center gap-5">
          <div className="h-48 aspect-square rounded-full overflow-hidden">
            <DynamicPhoto src={event.photo?.path} entityType="event" />
          </div>
          <Link to={ event.url } >
            <h1 className="text-white no-underline">
              { event.name }
            </h1>
          </Link>
        </div>
        <div className="flex flex-col justify-between items-center gap-10">
          <p className="w-4/5 text-wrap text-base italic text-gray-600">
            Event description: 
            <span className="text-white font-light">{event.description}</span>
          </p>
          <div className="flex gap-3 italic font-bold">
            <span className="font-normal italic text-gray-600">Event Creator: </span>
            <div className="h-8 aspect-square rounded-full overflow-hidden">
              <DynamicPhoto src={event.photo?.path} entityType="user" />
            </div>
            { event.creator.name }
          </div>
          <div className="text-sm">
            <span className={"ml-2 italic font-bold " + (now.getTime() < date.getTime() ? "text-green-600" : "text-red-600") }>
              { dateRepresentation }
            </span>
          </div>
        </div>
      </div>

      {
        entity.error != undefined 
        ? (
          <InfoBar message={entity.error.message} type="error" />
        )
        : ""
      } 
    </div>
  )
  
}