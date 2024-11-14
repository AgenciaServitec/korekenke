import React from "react";
import { DatePicker as AntdDatePicker } from "antd";
import { ComponentContainer } from "./component-container";
import dayjs from "dayjs";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const DatePicker = ({
  value = undefined,
  name,
  required = false,
  disabled = false,
  hidden,
  error = false,
  helperText,
  dataTestId,
  label,
  variant = "filled",
  allowClear = true,
  onChange,
  prefix = null,
}) => {
  const Container = ComponentContainer[variant];

  value = value instanceof Date ? dayjs(value) : value;

  return (
    <Container
      value={value}
      required={required}
      disabled={disabled}
      hidden={hidden}
      error={error}
      label={label}
      helperText={helperText}
      dataTestId={dataTestId}
    >
      <AntdDatePicker
        size="large"
        format="DD/MM/YYYY"
        value={value}
        disabled={disabled}
        name={name}
        placeholder=""
        onChange={onChange}
        allowClear={allowClear}
        variant="borderless"
        prefix={prefix}
      />
    </Container>
  );
};
