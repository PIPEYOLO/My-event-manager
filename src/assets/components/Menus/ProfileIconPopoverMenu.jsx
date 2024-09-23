import { useSelector } from "react-redux";
import LogoutButton from "../ui/Buttons/LogoutButton";
import RedirectToLoginButton_Menu from "../ui/Buttons/RedirectToLoginButton_Menu";
import { DefaultMenuBox, DefaultMenuItem } from "../ui/Menus/DefaultMenu";



export default function ProfileIconPopoverMenu() {
  const user = useSelector(state => state.user);

  return (
    <DefaultMenuBox>
      {
        user._id != null
        ? ( // logout
          <DefaultMenuItem>
            <LogoutButton />
          </DefaultMenuItem>
        )
        : ( // redirect to login
          <DefaultMenuItem>
            <RedirectToLoginButton_Menu />
          </DefaultMenuItem>
        )
      }
    </DefaultMenuBox>
  )
};