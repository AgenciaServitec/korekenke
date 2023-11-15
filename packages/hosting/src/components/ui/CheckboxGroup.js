import React from "react";
import styled from "styled-components";
import CheckboxAntd from "antd/lib/checkbox";
import { ComponentContainer } from "./component-container";

export const CheckboxGroup = ({
  required,
  error,
  label,
  variant = "outlined",
  ...props
}) => {
  const Container = ComponentContainer[variant];

  return (
    <Container required={required} error={error} label={label} animation={true}>
      <CheckboxGroupStyled {...props} />
    </Container>
  );
};

const CheckboxGroupStyled = styled(CheckboxAntd.Group)`
  padding: 10px;
`;
