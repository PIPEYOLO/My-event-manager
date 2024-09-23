import { useCallback, useMemo, useReducer, useState } from "react"
import DefaultInputBox from "../ui/Input/DefaultInputBox";
import NamedSwitch from "../ui/Switches/NamedSwitch";
import SingleFileInputBox from "../ui/Input/SingleFileInputBox";
import DefaultButton from "../ui/Buttons/DefaultButton";
import dayjs from "dayjs";
import MainDateTimePicker from "../ui/TimePickers/MainDateTimePicker";
import InfoBar from "../ui/InfoBoxes/InfoBar";
import { createEvent, editEvent } from "../../../../utils/fetch/event";
import { useNavigate } from "react-router-dom";
import MainLoadingSpinner from "../ui/Spinners/MainLoadingSpinner";




export default function CreateAndEditEventForm({ isFor, eventData }) {

  const navigate = useNavigate();

  const [ error, setError ] = useState(null);
  const [ eventState, dispatch ] = useReducer((state, action) => {
    if(action.type === "SET_NAME") {
      state.name = action.payload;
    }
    else if(action.type === "SET_DESCRIPTION") {
      state.description = action.payload;
    }
    else if(action.type === "SET_PHOTO") {
      state.photo = action.payload;
    }
    else if(action.type === "SET_IS_PUBLIC") {
      state.isPublic = action.payload;
    }
    else if(action.type === "SET_START_DATE") {
      state.startDate = action.payload;
    }
    else return state;


    return { ...state };
  }, 
  { name: "", description: "", isPublic: false, startDate: new Date(Date.now() + 1000 * 3600 * 24 * 7) },
  (initialState)=> {
    if(isFor === "creation") return initialState;

    const eventDataToUse = { ...eventData };
    delete eventDataToUse._id;
    delete eventDataToUse.creator; 
    delete eventDataToUse.subscribedUSers;
    eventDataToUse.photo = undefined;

    return Object.assign(initialState, eventDataToUse);
  }
  );
  const [ isUpdatingEvent, setIsUpdatingEvent ] = useState(false);
  
  const { name, description, photo, isPublic, startDate } = eventState;

  const propsThatChanged = useMemo(() => {
    if(isFor !== "edition") return eventState;
    let changedProps = {};
    for(let prop in eventState) {
      const newValue = eventState[prop];
      const prevValue = eventData[prop];

      if(newValue !== prevValue) {
        changedProps[prop] = newValue;
      }
    };

    return changedProps;
  }, [ eventData, eventState ]);

  const isEditable = useMemo(() => {
    if(Object.keys(propsThatChanged).length === 0) return false;
    return true;
  }, [ propsThatChanged ]);

  const sendFn = useCallback(async () => {
    if(isUpdatingEvent === true) return;
    let response;

    if(isFor === "creation") {
      response = createEvent(eventState)
    }
    else {
      if(isEditable === false) return; // avoid sending any changes
      // We use props to change just the changed properties
      const propsToChange = { ...propsThatChanged };
      if(propsToChange.photo === null) {
        propsToChange.photoAction = "delete";
      }
      else if(propsToChange.photo instanceof File) {
        propsToChange.photoAction = "update";
      }
      response = editEvent({ _id: eventData._id, ...propsToChange});
    }
    
    setIsUpdatingEvent(true);
    response = await response;
    setIsUpdatingEvent(false);

    const { success, data, error } = response.data;
    if(success === false) return setError(error);
  
    return navigate(`/event/${data._id}`);


  }, [ isFor, eventState ])

  return (
    <form className="h-full w-full flex flex-col gap-10 p-5 md:p-10" onSubmit={ ev => ev.preventDefault() }>

      <div className="flex flex-wrap justify-center gap-20">
        <div className="h-48 w-48 border-2 rounded-lg overflow-hidden shadow-md">

          <SingleFileInputBox 
            value={ photo }
            setValue={ useCallback((file) => dispatch({ type: "SET_PHOTO", payload: file }), []) } 
            initialFileUrl={ isFor === "edition" ? eventData.photo?.path : undefined }
          />

        </div>
        
        <div className="grow min-w-[400px] flex flex-col gap-4">
          <DefaultInputBox 
            labelText="Name"
            value={ name } 
            onChange={ useCallback((ev) => dispatch({ type: "SET_NAME", payload: ev.target.value }, [])) } 
          />
          <DefaultInputBox 
            labelText="Description"
            value={ description } 
            onChange={ useCallback((ev) => dispatch({ type: "SET_DESCRIPTION", payload: ev.target.value }, [])) } 
          />
        </div>
      </div>



      <div className="flex justify-center gap-20">
        <NamedSwitch 
          name="Public Event" 
          isOn={ isPublic } 
          switchState={ useCallback(() => dispatch({ type: "SET_IS_PUBLIC", payload: !isPublic }, [ isPublic ])) }
        />
        <MainDateTimePicker
          label="Start date"
          value={ useMemo(()=> dayjs(startDate), [ startDate ]) }
          onChange={ useCallback((newDate) => dispatch({ type: "SET_START_DATE", payload: newDate }, [ ] )) }
        />
      </div>

      { error !== null ? <InfoBar message={ error.message } type="error" /> : undefined }
      { isUpdatingEvent ? (
          <div className="w-full flex justify-center">
            <div className="h-12 aspect-square"><MainLoadingSpinner /></div> 
          </div>
        ) : undefined 
      }
      <DefaultButton 
        className={ isEditable ? "bg-green-600" : "bg-gray-500" }
        onClick={ sendFn }
      >
        { isFor === "creation" ? "Create" : "Update"}
      </DefaultButton>
    </form>
  )
}