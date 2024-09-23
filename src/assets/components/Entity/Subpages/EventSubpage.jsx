import { useContext, useEffect, useMemo } from "react";
import { VisibleEventContext } from "../../../context/Event.";
import { getSpecificEvent } from "../../../../../utils/fetch/event";
import { useParams } from "react-router-dom";
import EventPresentation from "../Presentations/EventPresentation";
import ErrorPage from "../../../pages/ErrorPage";


export default function EventSubpage() {

  const { event_id } = useParams();
  const { entity, error, setEntity, setError } = useContext(VisibleEventContext);

  const eventWasFetched = error !== null || entity !== null;

  // Initialize entity state
  useEffect(() => {
    getSpecificEvent(event_id, {})
    .then(response => {
      const { success, data, error } = response.data;
      if(success === false) return setError(error);
      return setEntity(data);
    })

  }, [ event_id ]);

  const contentLoaded = useMemo(() => {
    if(eventWasFetched === false) return "Loading...";
    else if(entity !== null) return <EventPresentation />
    else return <ErrorPage error={ error } />; // if there´s an error return the Error page
  }, [ error, entity ]);

  return contentLoaded;

}
