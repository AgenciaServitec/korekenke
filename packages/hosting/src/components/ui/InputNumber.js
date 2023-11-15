import React from "react";
import InputNumberAntd from "antd/lib/input-number";
import { ComponentContainer } from "./component-container";
import { toNumber } from "lodash";

// interface Props {
//   value?: string | number;
//   required?: boolean;
//   error?: FormError;
//   label?: string;
//   variant?: "outlined" | "filled";
//   disabled?: boolean;
// }

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
        bordered={false}
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
