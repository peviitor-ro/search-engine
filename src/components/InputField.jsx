import React from "react";

const INPUT_TYPE_CLASSES = {
  checkBoxType: "accent-background_green cursor-pointer mx-1",
  // searchType will be added
};

const InputField = ({
  children,
  className,
  inputType,
  item,
  label,
  ...otherProps
}) => {
  const inputProps = { ...otherProps };
  const labelProps = { ...otherProps };

  return (
    <div className={`flex items-center py-[2px] mb-[2px] ${className}`}>
      <input
        id={item}
        className={`${className} ${INPUT_TYPE_CLASSES[inputType]}`}
        {...inputProps} />

      {label && (
        <label
          htmlFor={item}
          className="cursor-pointer text-sm"
          {...labelProps}
        >
          {label}
        </label>
      )}

      {children}
    </div>
  );
};

export default InputField;