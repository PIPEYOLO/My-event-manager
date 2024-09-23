import { FiPlus } from "react-icons/fi";



export default function CreatePlusButton({ onClick, className }) {
  return (
    <div onClick={onClick} className={"h-8 aspect-square rounded-full cursor-pointer active:scale-105 transition-all duration-100 " + (className ?? "")}>
      <FiPlus stroke="#fff"/>
    </div>
  )
}