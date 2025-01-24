import React from "react";
import { InputNumber as InputNumberAntd } from "antd";
import { ComponentContainer } from "./component-container";
import { toNumber } from "lodash";

export const InputNumber = ({
  value,
  required,
  disabled,
  error,
  label,
  variant = "filled",
  helperText,
  animation,
  onChange,
  ...props
}) => {
  const Container = ComponentContainer[variant];

  const onInputChange = (value) => onChange(value ? toNumber(value) : null);

  return (
    <Container
      value={value}
      required={required}
      error={error}
      label={label}
      helperText={helperText}
      animation={animation}
    >
      <InputNumberAntd
        type="number"
        variant="borderless"
        placeholder=""
        size="large"
        value={value}
        defaultValue={value}
        disabled={disabled}
        onChange={(value) => onInputChange(value)}
        {...props}
      />
    </Container>
  );
};
