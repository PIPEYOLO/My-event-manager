import { RxCross1 } from "react-icons/rx";


export default function RemoveCrossButton({ onClick, className }) {
  return (
    <div onClick={onClick} className={"h-8 aspect-square rounded-full cursor-pointer active:scale-105 transition-all duration-100 " + (className ?? "")}>
      <RxCross1 stroke="#f00"/>
    </div>
  )
}