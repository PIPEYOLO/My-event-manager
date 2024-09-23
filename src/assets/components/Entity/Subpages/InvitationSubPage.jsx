import { useContext, useEffect, useMemo } from "react";
import { VisibleInvitationContext } from "../../../context/Invitation";
import { getSpecificInvitation } from "../../../../../utils/fetch/invitation";
import InvitationPresentation from "../Presentations/InvitationPresentation";
import ErrorPage from "../../../pages/ErrorPage";
import { useParams } from "react-router-dom";




export default function InvitationSubPage() {
  const { invitation_id } = useParams();
  const { entity, error, setEntity, setError } = useContext(VisibleInvitationContext);

  const invitationWasFetched = error !== null || entity !== null;

  // Initialize entity state
  useEffect(() => {
    getSpecificInvitation(invitation_id, {})
    .then(response => {
      const { success, data, error } = response.data;
      if(success === false) return setError(error);
      return setEntity(data);
    })

  }, [ invitation_id ]);

  const contentLoaded = useMemo(() => {
    if(invitationWasFetched === false) return "Loading...";
    else if(entity !== null) return <InvitationPresentation />
    else return <ErrorPage error={ error } />; // if there´s an error return the Error page
  }, [ error, entity ]);

  return contentLoaded;
}