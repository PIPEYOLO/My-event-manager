import { FloatingPortal } from "@floating-ui/react";
import { useEffect } from "react";



export default function FloatingElement({ timeOut, close, children }) {

  useEffect(() => {
    if(timeOut != undefined) return;
    // if timeout is present it means that the element should be temporaly shown
    const closeTimeOut = setTimeout(close, timeOut);
    return () => {
      clearTimeout(closeTimeOut);
    };
  }, []);

  return (
    <FloatingPortal>
      { children }
    </FloatingPortal>
  )
}