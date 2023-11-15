import React from "react";
import InputAntd from "antd/lib/input";
import { ComponentContainer } from "./component-container";

export const InputPassword = ({
  value,
  required,
  disabled,
  error,
  label,
  variant = "filled",
  helperText,
  animation,
  ...props
}) => {
  const Container = ComponentContainer[variant];

  return (
    <Container
      value={value}
      required={required}
      disabled={disabled}
      error={error}
      label={label}
      helperText={helperText}
      animation={animation}
    >
      <InputAntd.Password
        bordered={false}
        placeholder=""
        size="large"
        value={value}
        disabled={disabled}
        {...props}
      />
    </Container>
  );
};
