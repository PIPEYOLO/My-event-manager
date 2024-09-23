import { useMemo, useState } from "react"
import { BsFillCalendarEventFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";


export default function DynamicPhoto({ src, entityType }) {

  const [ error, setError ] = useState(null);
  const toShow = useMemo(()=> {
    if(error !== null) return <BsFillCalendarEventFill />;
    else if(src != undefined) return (
      <img 
        className="h-full w-full"
        src={ src } 
        onError={ev => setError({ message: "Error occured "}) }
      />
    )
    else if(entityType === "user") return <FaUser />
    else if(entityType === "event") return <BsFillCalendarEventFill />;
  }, [ src, error ]);

  return toShow;
}