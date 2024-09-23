import { Suspense } from "react";
import MainLayout from "../components/Layouts/MainLayout";
import MyEventsSet from "../components/Entity/Sets/MyEventsSet";



export default function MyEventsPage() {
  return (
    <MainLayout>
      <Suspense>
        <MyEventsSet />
      </Suspense>
    </MainLayout>
  );
}