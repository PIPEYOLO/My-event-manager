import { useMemo, useRef } from "react";
import DefaultTooltipSet from "../Tooltip/DefaultTooltipSet";
import { IoIosAlert } from "react-icons/io";




export default function DynamicAlertCircle({ message, type="error" }) {

  const dynamicClassname = useMemo(() => {
    if(type === "success") return "bg-green-600";
    else if(type === "error") return "bg-red-600";
    else return "bg-white";

  }, [ type ])

  const referenceCircle = <div className={"p-1 rounded-full overflow-hidden " }><IoIosAlert className={ dynamicClassname }/></div>;

  return (
    <div className="h-full aspect-square">
      <DefaultTooltipSet 
        reference={ referenceCircle }
        message={ message }
      />
    </div>
  );
}