import { Suspense, useEffect, useMemo, useState } from "react";
import MainLayout from "../components/Layouts/MainLayout";
import CreateAndEditEventForm from "../components/Forms/CreateAndEditEventForm";
import { useParams } from "react-router-dom";
import { getSpecificEvent } from "../../../utils/fetch/event";
import ErrorPage from "./ErrorPage";
import { createFileFromUrl } from "../utils/files";

export default function EditEventPage() {

  const { event_id } = useParams();
  const [ event, setEvent ] = useState(null);
  const [ error, setError ] = useState(null);

  const eventWasFetched = error !== null || event !== null;

  // Initialize event state
  useEffect(() => {
    getSpecificEvent(event_id, {})
    .then(async response => {
      const { success, data, error } = response.data;
      if(success === false) return setError(error);

      return setEvent(data);
    })

  }, [ event_id ]);

  const contentLoaded = useMemo(() => {
    if(eventWasFetched === false) return "Loading...";
    else if(event !== null)  {
      return <CreateAndEditEventForm isFor="edition" eventData={ event } />
    }
    else return <ErrorPage error={ error } />; // if there´s an error return the Error page
  }, [ error, event ]);

  return (
    <MainLayout>
      <Suspense>
        { contentLoaded }
      </Suspense>
    </MainLayout>
  )
}
