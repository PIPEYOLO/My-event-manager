import { useMemo } from "react";
import { TiTick } from "react-icons/ti";
import { FiAlertTriangle } from "react-icons/fi";
import { IoIosAlert } from "react-icons/io";

export default function InfoBar({ message, type="error" }) {

  const renderedIcon = useMemo(()=> {
    if(type === "success") {
      return <TiTick fill="#16a34a" />
    }
    else if(type === "warning") {
      return <FiAlertTriangle fill="#fcd34d" />
    }
    else if(type === "error") {
      return <IoIosAlert fill="#fff" />
    }
    else { // just info
      return <IoIosAlert fill="#000" />;
    }
  }, [type]);

  const renderedClassColor = useMemo(() => {
    if(type === "success") {
      return "bg-green-500";
    }
    else if(type === "warning") {
      return "bg-yellow-500";
    }
    else if(type === "error") {
      return "bg-red-500";
    }
    else { // just info
      return  "bg-white border-2 border-white"
    }
  }, [type])

  return (
    <div className={"animate-appear flex gap-3 items-start p-4 text-sm font-semibold rounded-lg " + renderedClassColor + " " + (type === "error" ? "text-white" : "text-black")} >

      <div className="h-6 aspect-square">
        {renderedIcon}
      </div>

      <span>{message}</span>
    </div>
  );
}