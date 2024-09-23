import { useCallback } from "react";
import DefaultButton from "../ui/Buttons/DefaultButton";
import { useNavigate } from "react-router-dom";
import CreatePlusButton from "../ui/Buttons/CreatePlusButton";


export default function AsideLeftSection() {
  const navigate = useNavigate();
  return (
    <aside className="relative h-full flex flex-col gap-5 bg-1">
      <div className="flex gap-3 items-center">
        <DefaultButton onClick={ useCallback(()=> navigate("/events"), []) } className="w-36 rounded-full font-normal p-2 border border-white hover:scale-100 hover:brightness-105" >
          My Events
        </DefaultButton>
        <CreatePlusButton onClick={useCallback(()=> navigate("/create-event"), [])} />
      </div>

      <div className="flex gap-3 items-center">
        <DefaultButton onClick={ useCallback(()=> navigate("/invitations"), []) } className="w-36 rounded-full font-normal p-2 border border-white hover:scale-100 hover:brightness-105" >
          My Invitations
        </DefaultButton>
      </div>
    </aside>
  )
}