import { Suspense } from "react";
import MainLayout from "../components/Layouts/MainLayout";
import { VisibleInvitationContext__Provider } from "../context/Invitation";
import InvitationSubPage from "../components/Entity/Subpages/InvitationSubPage";



export default function InvitationPage() {
  return (
    <MainLayout>
      <Suspense>
        <VisibleInvitationContext__Provider>
          <InvitationSubPage  />
        </VisibleInvitationContext__Provider>
      </Suspense>
    </MainLayout>
  )
}