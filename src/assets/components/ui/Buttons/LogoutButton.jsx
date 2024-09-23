import { useCallback, useRef } from "react";
import { FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { setError, unsetAllData } from "../../../store/slices/user";
import { logout } from "../../../../../utils/fetch/loginAndRegister";


export default function LogoutButton() {

  const dispatch = useDispatch();
  const isLoggingOut = useRef(false);
  const logoutFn = useCallback(async () => {
    if(isLoggingOut.current === true) return;
    isLoggingOut.current = true;
    
    const response = await logout();
    const { data } = response;
    if(data.success === false) {
      dispatch(setError(data.error));
    }
    else {
      dispatch(unsetAllData());
    }

    isLoggingOut.current = false;
  }, []);

  return (
    <div 
      onClick={ logoutFn }
      className="h-full w-full flex items-center gap-4 p-3 cursor-pointer hover:bg-hover_1" 
    >
      <div className="h-full aspect-square">
        <FiLogOut fill="#f00" />
      </div>
      <span className="text-lg font-semibold text-red-600">Log out</span>
    </div>
  );
};