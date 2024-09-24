import { memo } from "react";



export default function DefaultButton ({ onClick, className, children, disabled }) {

    return (
      <button 
        onClick={onClick}
        className={"text-white " + (className ?? "")}
        disabled={ disabled === true }
      >
        {children}
      </button>
    )

}


