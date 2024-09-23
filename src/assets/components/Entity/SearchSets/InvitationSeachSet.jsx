import { useCallback } from "react";
import SearchInputBox from "../../ui/Input/SearchInputBox";
import { useDispatch, useSelector } from "react-redux";
import NamedSwitch from "../../ui/Switches/NamedSwitch";
import { invitationsSliceActions } from "../../../store/slices/invitations";
import DefaultSelectButton from "../../ui/Buttons/DefaultSelectButton";



export default function InvitationSearchSet() {
  const dispatch = useDispatch();
  const invitationsOptionsState = useSelector( state => state.invitations.options);
  const { search, filter, recent } = invitationsOptionsState; 

  return (
    <div className="sticky top-0 w-full flex flex-col justify-between gap-3 py-5 px-2 bg-1 z-30">
      <SearchInputBox value={ search } onChange={ useCallback((ev) => dispatch(invitationsSliceActions.setOptions({ search: ev.target.value })), [])} />
      
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <NamedSwitch name="recent" isOn={ recent } switchState={ useCallback(() => dispatch(invitationsSliceActions.setOptions({ recent: !recent })), [ recent ])} />
        <DefaultSelectButton 
          name="type" 
          value={ filter.type }
          posibleValues={ [ "pending", "received", "accepted", "rejected" ]} 
          setValue={ useCallback((newValue) => dispatch(invitationsSliceActions.setOptions({ filter: { type: newValue } }))) }
        />
      </div>
    </div>
  )
}