
import DynamicPhoto from "../ui/Photo/DynamicPhoto";
import DefaultPopoverSet from "../ui/Popover/DefaultPopoverSet";
import { useState } from "react";
import ProfileIconPopoverMenu from "../Menus/ProfileIconPopoverMenu";
import { SlOptionsVertical } from "react-icons/sl";


export default function MainNavBar({ aside, showAsideButtonIsOpen }) {

  // States:
  const [ profileIconPopoverIsOpen, setProfileIconPopoverIsOpen ] = useState(false);

  return (
    <nav className="flex justify-end p-4 px-8 gap-5 z-[1000]">
      {
        showAsideButtonIsOpen ? (
          <div
          onClick={ aside.toggle }
          className={"h-6 aspect-square border-2 rounded-full cursor-pointer overflow-hidden hover:brightness-110 "}>
          <SlOptionsVertical />
        </div>
        )
        : undefined
      }


      <DefaultPopoverSet 
        open={ profileIconPopoverIsOpen }
        setOpen={ setProfileIconPopoverIsOpen }
        reference={(
          <div
            onClick={ ev => setProfileIconPopoverIsOpen(!profileIconPopoverIsOpen) }
            className="h-6 aspect-square border-2 rounded-full cursor-pointer overflow-hidden hover:brightness-110">
            <DynamicPhoto src={null} entityType="user" />
          </div>
        )}
      >
          <ProfileIconPopoverMenu />
      </DefaultPopoverSet>
      
    </nav>
  )
}