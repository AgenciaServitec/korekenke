import React from "react";
import { DatePicker as AntdDatePicker } from "antd";
import { ComponentContainer } from "./component-container";
import dayjs from "dayjs";

export const DatePicker = ({
  value = undefined,
  name,
  required = false,
  disabled = false,
  hidden = false,
  error = false,
  helperText = "",
  dataTestId,
  label,
  variant = "filled",
  allowClear = true,
  onChange,
  prefix = null,
  disabledDate = false,
  format = "DD/MM/YYYY HH:mm",
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
        format={format}
        value={value}
        disabled={disabled}
        name={name}
        placeholder=""
        onChange={onChange}
        allowClear={allowClear}
        variant="borderless"
        prefix={prefix}
        disabledDate={disabledDate}
      />
    </Container>
  );
};
