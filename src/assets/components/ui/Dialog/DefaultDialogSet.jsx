import { FloatingFocusManager, FloatingOverlay, useClick, useDismiss, useFloating, useInteractions, useRole } from "@floating-ui/react";
import React, { useState } from "react";




export default function DefaultDialogSet({ reference, children, isOpen, setIsOpen }) {
  
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "center",

  });

  const click = useClick(context);

  const role = useRole(context);
 
  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    role,
  ]);

  
  return (
    <>
      { React.cloneElement( reference, { ref: refs.setReference, ...getReferenceProps() }) }
      {isOpen && (
        <FloatingOverlay
          lockScroll
          style={ { background: 'rgba(0, 0, 0, 0.8)'} }
        >
          <FloatingFocusManager context={ context }>
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-fit w-fit"
              ref={ refs.setFloating }
              { ...getFloatingProps() }
            >
              { children }
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </>
  )

}