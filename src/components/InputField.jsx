import React from "react";

const INPUT_TYPE_CLASSES = {
  checkBoxList: "accent-background_green cursor-pointer mx-1",
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
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "2px 0",
        marginBottom: "2px",
      }}
    >
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