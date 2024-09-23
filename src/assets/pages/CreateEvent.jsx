import { Suspense } from "react";
import MainLayout from "../components/Layouts/MainLayout";
import CreateAndEditEventForm from "../components/Forms/CreateAndEditEventForm";
export default function CreateEventPage() {

  return (
    <MainLayout>
      <Suspense>
        <CreateAndEditEventForm isFor="creation" />
      </Suspense>
    </MainLayout>
  )
}
