import { Link, useLocation } from "react-router-dom";




export default function LoginRequiredPage() {

  const location = useLocation();

  return (
    <div className="h-full w-full flex items-center justify-center bg-1">
      <div className="text-center">
        <h1 className="text-2xl font-normal text-2 mb-4">
          <span className="font-bold">'{ location.pathname }'</span> route requires the user to be logged in 
        </h1>


        <div className="w-full flex justify-center gap-10">
          <Link className="text-lg font-bold hover:text-6" to="/login">
            Login
          </Link>
          <Link className="text-lg font-bold hover:text-6" to="/register">
            Register
          </Link>
        </div>

      </div>
    </div>
  )
}