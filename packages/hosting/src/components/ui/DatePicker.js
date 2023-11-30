import React from "react";
import AntdDatePicker from "antd/lib/date-picker";
import { ComponentContainer } from "./component-container";
import moment from "moment";

export const DatePicker = ({
  value,
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
}) => {
  const Container = ComponentContainer[variant];

  value = value instanceof Date ? moment(value) : value;

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
        bordered={false}
      />
    </Container>
  );
};
