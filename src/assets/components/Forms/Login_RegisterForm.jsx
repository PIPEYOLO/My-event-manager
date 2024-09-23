import { useCallback, useMemo, useState } from "react";
import DefaultInputBox from "../ui/Input/DefaultInputBox";

import { validatePassword, validateUsername } from "../../../../utils/validators/loginInputs";
import { login, register } from "../../../../utils/fetch/loginAndRegister";
import { Link, useNavigate } from "react-router-dom";
import InfoBar from "../ui/InfoBoxes/InfoBar";
import DefaultButton from "../ui/Buttons/DefaultButton";



export default function Login_RegisterForm({ isFor="login"}) {


  const navigate = useNavigate()
  const [ name, setName ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ confirmedPassword, setConfirmedPassword ] = useState("");

  const [ error, setError ] = useState();

  const validateAndSend = useCallback(async   () => {
    const nameValidation = validateUsername(name);
    if(nameValidation.isValid === false) return setError({ message: nameValidation.message });

    const passwordValidation = validatePassword(password);
    if(passwordValidation.isValid === false) return setError({ message: passwordValidation.message });
    
    if(isFor === "register" && password !== confirmedPassword) return setError({ message: "Password differs from confirmation" });


    // if all is correct

    const info = { name, password };

    let response;
    if(isFor === "register") {
      info.confirmedPassword = confirmedPassword;

      response = await register(info);

    }
    else {
      response = await login(info);
    }
    

    if(response.status === 200 || response.status === 201) {
      return location.assign("/"); // go home and reload
    }

    return setError(response.data.error);


  }, [name, password, confirmedPassword]);

  
  return (
    <form className={ (isFor === "register" ? "w-[500px]" : "w-[400px]") + " h-auto flex flex-col gap-2 p-10 rounded-xl text-black bg-white"} onSubmit={ev => ev.preventDefault()}>
      <h1>{isFor}</h1>
      <DefaultInputBox labelText="Name" value={name} onChange={useCallback((ev) => setName(ev.target.value), [])} />
      <DefaultInputBox labelText="Password" value={password} onChange={useCallback((ev) => setPassword(ev.target.value), [])} />
      
      {isFor === "register" &&
        <DefaultInputBox labelText="Confirm Password" value={confirmedPassword} onChange={useCallback((ev) => setConfirmedPassword(ev.target.value), [])} />
      }


      {error && (
        <InfoBar message={error.message} type="error" />
      )}


      <DefaultButton
        className="my-5 bg-gradient-1"
        onClick={ ev => validateAndSend() }
      >
        Submit
      </DefaultButton>

      {
        useMemo(() => {
          if(isFor === "login") return <Link to="/register">Dont you have an account?</Link>;
          else return <Link to="/login">Do you already have an account?</Link>;
        }, [ isFor ])
      }

    </form>
  )
}