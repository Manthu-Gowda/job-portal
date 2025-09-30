import React from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import "./SelectInputs.scss";

const SelectInputs = ({
  label,
  options,
  name,
  placeholder,
  className = "input",
  value,
  onChange,
  size = "large",
  defaultValue,
  style = { width: "100%" },
  loading = false,
  disabled
}) => {
  const handleChange = (selectedValue) => {
    onChange(selectedValue);
  };
  return (
    <div className="selectinputs">
      {label && <span>{label}</span>}
      <div className="input-container">
        <Select
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={className}
          popupClassName="custom-dropdown"
          size={size}
          defaultValue={defaultValue}
          style={style}
          options={options}
          loading={loading}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

SelectInputs.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  size: PropTypes.oneOf(["large", "middle", "small"]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
  loading: PropTypes.bool,
};

export default SelectInputs;
