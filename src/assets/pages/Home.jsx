import { Suspense, useCallback } from "react";

import MyEventsSet from "../components/Entity/Sets/MyEventsSet";
import MainLayout from "../components/Layouts/MainLayout";
import DefaultButton from "../components/ui/Buttons/DefaultButton";
import { useNavigate } from "react-router-dom";


export default function HomePage() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="h-full w-full flex items-center">
        <div className="w-full flex flex-wrap justify-center gap-20">
          <DefaultButton 
            onClick={ useCallback( () => navigate("/events"), [ ] ) }
            className="font-bold text-xl border-2 p-6 hover:border-6 hover:text-6">
            Your Events
          </DefaultButton>

          <DefaultButton 
            onClick={ useCallback( () => navigate("/invitations"), [ ] ) }
            className="font-bold text-xl border-2 p-6 hover:border-6 hover:text-6">
            Your Invitations
          </DefaultButton>
        </div>
      </div>
    </MainLayout>
  )
}
