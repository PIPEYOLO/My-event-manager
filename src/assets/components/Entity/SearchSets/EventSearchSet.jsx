import { useDispatch, useSelector } from "react-redux";
import SearchInputBox from "../../ui/Input/SearchInputBox";
import { useCallback } from "react";
import { eventsSliceActions } from "../../../store/slices/events";
import NamedSwitch from "../../ui/Switches/NamedSwitch";
import DefaultSelectButton from "../../ui/Buttons/DefaultSelectButton";



export default function EventSearchSet() {
  const dispatch = useDispatch();
  const eventsOptionsState = useSelector( state => state.events.options);
  const { search, filter, closest } = eventsOptionsState; 
  const { type, subscribed } = filter;

  const setValue_eventType_button = useCallback((newValue) => dispatch(eventsSliceActions.setOptions({ filter: { type: newValue } })), [ type ]);

  return (
    <div className="sticky top-0 w-full flex flex-col justify-between gap-3 py-5 px-2 bg-1 z-30">
      <SearchInputBox value={ search } onChange={ useCallback((ev) => dispatch(eventsSliceActions.setOptions({ search: ev.target.value })), [])} />
      
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <NamedSwitch name="closest" isOn={ closest } switchState={ useCallback(() => dispatch(eventsSliceActions.setOptions({ closest: !closest })), [ closest ])} />
        <NamedSwitch name="subscribed" isOn={ subscribed } switchState={ useCallback(() => dispatch(eventsSliceActions.setOptions({ filter: { subscribed: !subscribed } })), [ subscribed ])} />
        
        <DefaultSelectButton 
          name="type" 
          value={ type }
          posibleValues={ [ "pending", "outOfDate", "all" ]} 
          setValue={ setValue_eventType_button }
        />


        

      </div>
    </div>
  )
}