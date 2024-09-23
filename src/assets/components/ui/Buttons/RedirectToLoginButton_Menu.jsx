import { useCallback } from "react";
import { CiLogin } from "react-icons/ci";
import { useNavigate } from "react-router-dom"


export default function RedirectToLoginButton_Menu() {
  const navigate = useNavigate();

  return (
    <div 
      onClick={ useCallback(() => navigate("/login")) }
      className="h-full w-full flex items-center gap-4 p-3 cursor-pointer hover:bg-hover_1" 
    >
      <div className="h-full aspect-square">
        <CiLogin fill="#fff" />
      </div>
      <span className="text-lg font-semibold text-white">Log in</span>
    </div>
  )
}