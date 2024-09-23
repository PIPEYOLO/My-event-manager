import { autoUpdate, flip, offset, shift, useDismiss, useFloating, useFocus, useHover, useInteractions, useRole } from "@floating-ui/react";
import { FloatingArrow, arrow } from '@floating-ui/react';
import React, { useMemo, useRef, useState } from "react";





export default function DefaultTooltipSet({ reference, children, message }) {
  const [ isOpen, setIsOpen ] = useState(false);

  const arrowElemRef = useRef()

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [ offset(10), flip(), shift(), arrow({ element: arrowElemRef }) ],
    whileElementsMounted: autoUpdate,
    placement: "top"
  });
 
  const hover = useHover(context, {move: true});
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, {
    role: 'tooltip',
    role: 'label',
  });
 
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  const tooltipElement = useMemo(() => {
    if(children == undefined) {
      return (
        <div className="p-3 rounded-lg font-semibold text-black bg-2">
          { message }
        </div>
      )
    }
    else return children;
  }, [ children ]);

  return (
    <>
      {
        React.cloneElement( reference, { ref: refs.setReference, ...getReferenceProps() } )
      }
      {
        isOpen ? React.cloneElement( tooltipElement, { 
          ref: refs.setFloating, 
          style: floatingStyles, 
          ...getFloatingProps() 
        }) 
        : undefined
      }
    </>
  )


}