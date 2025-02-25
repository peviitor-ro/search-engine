import { useState, Children, cloneElement } from "react";
import { useFloating, useHover, useInteractions } from "@floating-ui/react";

export function Tooltip({ children, tooltipText }) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen
  });
  const hover = useHover(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  let child;
  try {
    child = Children.only(children);
  } catch (_err) {
    console.error("The Tooltip Component accepts only one child");
  }

  const clonedChild = cloneElement(child, {
    ref: refs.setReference,
    ...getReferenceProps()
  });
  
  return (
    <>
      {clonedChild}
      {isOpen && (
        <div
          className="bg-background_green_light text-[12px] rounded p-1.5 px-2 mt-2"
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {tooltipText}
        </div>
      )}
    </>
  );
}
