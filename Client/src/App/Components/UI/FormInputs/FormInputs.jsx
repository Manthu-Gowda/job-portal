import React from "react";
import "./FormInputs.scss";
import { Input } from "antd";

const FormInputs = ({
  title,
  type,
  value,
  onChange,
  name,
  placeholder,
  onKeyDown,
  disabled,
  maxLength,
  size = "large",
}) => {
  return (
    <div className="forminput">
      <span>{title}</span>
      <div className="input-container">
        {type === "password" ? (
          <Input.Password
            className="input"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            maxLength={maxLength}
            disabled={disabled}
            size={size}
          />
        ) : (
          <Input
            className="input"
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            maxLength={maxLength}
            disabled={disabled}
            size={size}
            min={type === "number" ? 0 : undefined}
            step={type === "number" ? "any" : undefined}
          />
        )}
      </div>
    </div>
  );
};

export default FormInputs;
