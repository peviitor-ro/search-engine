import * as React from "react";
import { cva } from "class-variance-authority";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const inputVariants = cva("", {
  variants: {
    inputType: {
      default: "",
      // `appearance-none` drops the OS checkbox so the box below renders
      // identically on every platform. `peer` drives the tick mark.
      checkBoxType:
        "peer h-full w-full cursor-pointer appearance-none rounded-[5px] border border-border_grey bg-white transition-colors hover:border-background_green checked:border-background_green checked:bg-background_green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background_green/40",
      searchType:
        "w-full border-0 bg-transparent py-2 text-sm outline-none placeholder:text-text_grey_darker focus:outline-none focus:ring-0"
    }
  },
  defaultVariants: {
    inputType: "default"
  }
});

// Styles for the row wrapping the input + its label.
const wrapperVariants = cva("flex items-center", {
  variants: {
    inputType: {
      default: "py-[2px] mb-[2px]",
      checkBoxType:
        "gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-custom_gray has-[:checked]:bg-background_green_light/30",
      searchType: "w-full gap-2"
    }
  },
  defaultVariants: {
    inputType: "default"
  }
});

const InputField = React.forwardRef(
  ({ children, className, inputType, item, label, ...otherProps }, ref) => {
    const input = (
      <input
        id={item}
        className={cn(inputVariants({ inputType }))}
        ref={ref}
        {...otherProps}
      />
    );

    return (
      <div className={cn(wrapperVariants({ inputType }), className)}>
        {inputType === "checkBoxType" ? (
          <span className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center">
            {input}
            <Check
              className="pointer-events-none absolute h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
              strokeWidth={3}
              aria-hidden="true"
            />
          </span>
        ) : (
          input
        )}

        {label && (
          <label
            htmlFor={item}
            title={label}
            className="flex-1 cursor-pointer select-none truncate text-sm text-text_grey"
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
