import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva("", {
  variants: {
    inputType: {
      default: "",
      checkBoxType:
        "accent-background_green cursor-pointer ml-[0.6rem] mr-[0.4rem]",
      searchType:
        "border-0 outline-none py-[0.4rem] text-sm w-[190px] rounded-full"
    }
  },
  defaultVariants: {
    inputType: "default"
  }
});

const InputField = React.forwardRef(
  ({ children, className, inputType, item, label, ...otherProps }, ref) => {
    return (
      <div className={cn("flex items-center py-[2px] mb-[2px]", className)}>
        <input
          id={item}
          className={cn(inputVariants({ inputType }), className)}
          ref={ref}
          {...otherProps}
        />

        {label && (
          <label
            htmlFor={item}
            className="cursor-pointer text-sm"
            {...otherProps}
          >
            {label}
          </label>
        )}

        {children}
      </div>
    );
  }
);
InputField.displayName = "InputField";

export { InputField };
export default InputField;
