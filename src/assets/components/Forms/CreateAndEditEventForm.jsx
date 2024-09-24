import { useCallback, useMemo, useReducer, useState } from "react"
import DefaultInputBox from "../ui/Input/DefaultInputBox";
import NamedSwitch from "../ui/Switches/NamedSwitch";
import SingleFileInputBox from "../ui/Input/SingleFileInputBox";
import DefaultButton from "../ui/Buttons/DefaultButton";
import dayjs from "dayjs";
import MainDateTimePicker from "../ui/TimePickers/MainDateTimePicker";
import InfoBar from "../ui/InfoBoxes/InfoBar";
import { createEvent, deleteEvent, editEvent } from "../../../../utils/fetch/event";
import { useNavigate } from "react-router-dom";
import MainLoadingSpinner from "../ui/Spinners/MainLoadingSpinner";
import DefaultDialogSet from "../ui/Dialog/DefaultDialogSet";




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
    <form className="h-full w-full flex flex-col gap-10 pb-20 sm:pb-5 p-5 md:p-10 overflow-y-auto scrollbar-1" onSubmit={ ev => ev.preventDefault() }>

      <div className="flex flex-wrap justify-center gap-20">
        <div className="h-48 w-48 border-2 rounded-lg overflow-hidden shadow-md">

          <SingleFileInputBox 
            value={ photo }
            setValue={ useCallback((file) => dispatch({ type: "SET_PHOTO", payload: file }), []) } 
            initialFileUrl={ isFor === "edition" ? eventData.photo?.path : undefined }
          />

        </div>
        
        <div className="grow md:min-w-[400px] flex flex-col gap-4">
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
      <div className="w-full flex justify-end gap-10">
        <DefaultButton 
          className={ "px-6 " + (isEditable ? "bg-green-600" : "bg-gray-500") }
          onClick={ sendFn }
        >
          { isFor === "creation" ? "Create" : "Update"}
        </DefaultButton>

        {
          isFor === "edition" ? <DeleteEventSet _id={ eventData._id } onSuccess={ () => navigate("/") } onError={ (err) => setError(err) } /> : undefined
        }

      </div>

    </form>
  )
}


function DeleteEventSet({ _id, onError, onSuccess }) {
  const [ confirmationOpen, setConfirmationOpen ] = useState(false);
  const [ isDeleting, setIsDeleting ] = useState(false);

  return (
    <DefaultDialogSet
      isOpen={ confirmationOpen }
      setIsOpen={ setConfirmationOpen }
      reference={(
        <DefaultButton 
          className="text-red-600 border-2 border-red-600 bg-transparent"
          onClick={ useCallback( () =>  setConfirmationOpen(false), [ ]) }
        >
          Delete
        </DefaultButton>
      )}
    >
      <div className="flex flex-col gap-10 p-10 bg-1">
        <h3>Are you sure you want to delete this event</h3>

        { isDeleting ? <div className="h-10 aspect-square"> <MainLoadingSpinner /> </div> : undefined }

        <div className="flex justify-center gap-10">
          <DefaultButton
            className="font-bold text-white bg-4"
            onClick={ useCallback( async () => {
              if(isDeleting) return;
              
              setIsDeleting(true);
              const response = await deleteEvent(_id);
              setIsDeleting(false);

              const { success, data, error } = response.data;
              if(success === false ) {
                setConfirmationOpen(false); // close the modal
                onError(error); // set an error
                return;
              }
              onSuccess(data);
            }, [ _id, isDeleting ])}
          >
            Delete
          </DefaultButton>

          <DefaultButton
            className="font-bold text-white border-2 bg-transparent"
            onClick={ useCallback(() => setConfirmationOpen(false), [ _id ])}
          >
            Cancel
          </DefaultButton>
        </div>
      </div>
    </DefaultDialogSet>
  )
}