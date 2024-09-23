import { memo, useRef } from "react";
import InputContainer from "./InputContainer";



const DefaultInputBox = memo(
  function ({ value, onChange, placeholder="", labelText, siblingElements }) {

    const inputRef = useRef();

    
    return (
      <div className="h-fit flex flex-col gap-3">
        {labelText && (
          <label onClick={ (ev)=> inputRef.current.focus() } >{labelText}</label>
        )}
        <InputContainer>
          <input 
            ref={inputRef}
            className="w-full p-3 bg-transparent" 
            placeholder={placeholder} 
            value={value} 
            onChange={onChange}
            />
            {
              siblingElements
            }
        </InputContainer>
      </div>

    )
});


export default DefaultInputBox;