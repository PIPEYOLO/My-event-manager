
import Login_RegisterForm from "../components/Forms/Login_RegisterForm";
import ThemeBackdrop from "../components/ui/Backdrop/ThemeBackdrop";

export default function RegisterPage() {
  return (
    <main className="relative">


      <div className="absolute h-full w-full flex justify-center items-center z-10">
        <Login_RegisterForm isFor="register" />
      </div>

      <ThemeBackdrop />
    
    </main>
  )
}