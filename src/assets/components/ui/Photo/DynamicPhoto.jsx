import { useCallback, useMemo, useState } from "react"
import { BsFillCalendarEventFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";


export default function DynamicPhoto({ src, entityType }) {

  const [ error, setError ] = useState(null);

  const renderDefaults = useCallback(() => {
    if(entityType === "user") return <FaUser />
    else if(entityType === "event") return <BsFillCalendarEventFill />;
  }, [ entityType ]);
  
  const toShow = useMemo(()=> {
    if(error !== null) return renderDefaults();
    else if(src != undefined) return (
      <img 
        className="h-full w-full"
        src={ src } 
        onError={ev => setError({ message: "Error occured "}) }
      />
    )
    else return renderDefaults();
  }, [ src, error ]);



  return toShow;
}