import { useEffect, useMemo, useCallback, useRef, useState } from "react";
import { getSpecificUser } from "../../../../../utils/fetch/user";
import DynamicPhoto from "../Photo/DynamicPhoto";
import DynamicAlertCircle from "../Alerts/DynamicAlertCircle";
import MainLoadingSpinner from "../Spinners/MainLoadingSpinner";




export default function DefaultUserItem({ _id, user, extraSiblings }) {

  const [ userInfo, setUserInfo ] = useState(user ?? null);
  const [ error, setError ] = useState(null);

  const elementToObserveRef = useRef(null);

  const userWasFetched = userInfo !== null || error !== null;

  const fetchUser = useCallback(() => {
    getSpecificUser(_id)
    .then(response => {
      const { success, data, error } = response.data;
      if(success === false) return setError(error);
      return setUserInfo(data);
    });
  }, [ ]);

  const observer = useRef(new IntersectionObserver((entries, thisObserver) => {
    const entry = entries[0];
    if(entry.isIntersecting) {
      fetchUser();
      thisObserver.disconnect();
    }
  }));

  useEffect(() => {
    if(userWasFetched) return;
    observer.current.observe(elementToObserveRef.current);
  }, [ elementToObserveRef ]);

  const contentToShow = useMemo(() => {
    if(userWasFetched) {
      if(error !== null) {
        return (
          <> { /* Return unknown user Info */}
            <div className="h-full aspect-square">
              <DynamicPhoto src={ undefined } entityType={ "user" } />
            </div>
            <div className="flex gap-3">
              <span className="font-bold"> Unknown User </span> 
            </div>
            <div className="grow flex justify-end">
              <DynamicAlertCircle message={ error.message } type="error" />
            </div>
          </>
        )
      }
      else {
        return (
          <> { /* Return the user html info */}
            <div className="h-full aspect-square">
              <DynamicPhoto src={ userInfo.photo?.path } entityType={ "user" } />
            </div>
            <div className="flex gap-3">
              <span className="font-bold"> { userInfo.name } </span>
            </div>
          </>
        )
      }
    }
    else return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="h-8 aspect-square"><MainLoadingSpinner /></div> 
      </div>
    )
  }, [ userInfo, error ]);

  return (
    <div className="h-16 w-full flex-none flex gap-4 p-2">
      <div ref={ elementToObserveRef }></div>
      { contentToShow }
      { extraSiblings }
    </div>
  )
}