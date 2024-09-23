import { Suspense } from "react";
import EventSubpage from "../components/Entity/Subpages/EventSubpage";
import MainLayout from "../components/Layouts/MainLayout";
import { VisibleEventContext__Provider } from "../context/Event.";


export default function EventPage() {

  return (
    <MainLayout>
      <Suspense>
        <VisibleEventContext__Provider>
          <EventSubpage  />
        </VisibleEventContext__Provider>
      </Suspense>
    </MainLayout>
  )
}