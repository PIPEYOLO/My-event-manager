import { 
  useFloating, 
  useInteractions, 
  useClick as useClickHook, 
  useHover as useHoverHook,
  useDismiss as useDismissHook,
  flip as flipMiddleware, 
  shift as shiftMiddleware, 
  offset as offsetMiddleware,
  useRole,
  autoUpdate, 

} from "@floating-ui/react";
import React from "react";



export default function DefaultPopoverSet({ children, reference, open, setOpen, options }) {
  // Options Setup:
  const { offset, flip, shift, useClick, useHover } = options ?? {};

  // Floating things:
  const middleware = [];
  if(flip !== false) middleware.push(flipMiddleware()); // if its not false apply flip

  if(shift !== false) middleware.push(shiftMiddleware()); // if its not false apply shift 

  if(offset != undefined) middleware.push(offsetMiddleware(offset)); // apply offset
  else middleware.push(offsetMiddleware(10)); // default

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware,

    whileElementsMounted: autoUpdate
  })

  // Interactions:
  const interactions = [];
  if(useClick !== false) interactions.push(useClickHook(context));
  if(useHover === true) interactions.push(useHoverHook(context));

  interactions.push(useDismissHook(context));
  interactions.push(useRole("popover"));

  const { getReferenceProps, getFloatingProps } = useInteractions(interactions);



  return (
    <>
        { // Popover
          open ?
          React.cloneElement(<div className="z-50">{ children }</div>, { 
            ref: refs.setFloating, 
            context: context,
            style: floatingStyles,
            ...getFloatingProps(), 
          }) 
          : undefined
        }

      { // Trigger
        
        React.cloneElement(reference, { 
          ref: refs.setReference, 
          ...getReferenceProps() 
        }) 
      }
    </>
  )
}