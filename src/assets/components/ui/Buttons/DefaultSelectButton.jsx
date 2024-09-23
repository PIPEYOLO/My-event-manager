import { useCallback, useState } from "react"
import DefaultButton from "./DefaultButton"
import DefaultPopoverSet from "../Popover/DefaultPopoverSet";
import { DefaultMenuBox, DefaultMenuItem } from "../Menus/DefaultMenu";


export default function DefaultSelectButton({ value, posibleValues, setValue, name }) {

  const [ menuIsOpen, setMenuIsOpen ] = useState(false);
  const myTriggerElement = (
    <div className="flex items-center gap-2 p-2 px-3 rounded-full bg-5">
      <DefaultButton className="p-0 border-0 rounded-full">
        { name ?? "Select" }
      </DefaultButton>
      <span className="italic text-gray-600">
        { value }
      </span>
    </div>
  )
  
  return (
    <>
      <DefaultPopoverSet 
        open={ menuIsOpen }
        setOpen={ setMenuIsOpen }
        reference={ myTriggerElement }
      >
        <DefaultMenuBox>
          {
            posibleValues.map(value => (
              <DefaultMenuItem key={ value }>
                <DefaultButton 
                  className="w-full h-full"
                  onClick={ useCallback(() => setValue(value) ,[ value ])}
                >
                  { value }
                </DefaultButton>
              </DefaultMenuItem>
            ))
          }
        </DefaultMenuBox>
      </DefaultPopoverSet>
    </>
  )
}