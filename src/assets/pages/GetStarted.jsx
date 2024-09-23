import { useCallback } from "react";

import { useNavigate } from "react-router-dom";
import DefaultButton from "../components/ui/Buttons/DefaultButton";


export default function GetStartedPage() {

  const navigate = useNavigate()

  return (
    <main className="h-full w-full flex flex-col items-center gap-4 md:gap-8 p-4 px-">
      <h1>{import.meta.env.PUBLIC_APP_NAME}</h1>
      <p className="mx-4 md:mx-10 lg:mx-20 font-semibold text-black p-3 rounded-lg bg-2">
        Welcome to our Social Event Management Application! Easily organize and join social events. Discover upcoming events, explore details, create your own, and manage invitations all in one place. Make event planning stress-free and enjoyable!
      </p>

      <div className="w-[300px] flex-initial">
        <DefaultButton className="w-full bg-gradient-1" onClick={useCallback(() => navigate("/login"))} >Get Started !!</DefaultButton>
      </div>
    </main>

  )
}