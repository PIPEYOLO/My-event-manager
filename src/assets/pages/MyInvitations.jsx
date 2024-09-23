
import MainLayout from "../components/Layouts/MainLayout";
import MyInvitationsSet from "../components/Entity/Sets/MyInvitationsSet";
import { Suspense } from "react";


export default function MyInvitationsPage() {
  return (
    <MainLayout>
      <Suspense>
        <MyInvitationsSet />
      </Suspense>
    </MainLayout>
  )
}