import React from "react";
import { Button, Spin } from "antd";
import "./Buttons.scss";

const Buttons = ({
  children,
  type,
  onClick,
  className,
  variant,
  style,
  disabled,
  loading,
  size = "large",
}) => {
  return (
    <Button
      type={variant} 
      onClick={onClick}
      className={`custom-button ${className} ${variant}`}
      style={style}
      disabled={disabled}
      loading={loading}
      htmlType={type}
      size={size}
    >
      {loading ? <Spin /> : children}
    </Button>
  );
};

export default Buttons;
