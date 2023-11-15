import React from "react";
import styled, { css } from "styled-components";
import { capitalize, startCase } from "lodash";
import { keyframes } from "../../../styles/constants/keyframes";
import Typography from "antd/lib/typography";
import SpaceAntd from "antd/lib/space";

const { Text } = Typography;

// interface Props {
//   required?: boolean;
//   name?: string;
//   error?: FormError;
//   label?: string;
//   children?: React.ReactNode;
// }

export const Group = ({ label, required, error, helperText, children }) => (
  <>
    <Container error={error}>
      <Legend required={required} error={error}>
        {label}
      </Legend>
      <SpaceStyled size="middle" direction="vertical">
        {children}
      </SpaceStyled>
    </Container>
    {helperText && (
      <Error error={error}>{capitalize(startCase(helperText))}</Error>
    )}
  </>
);

const Container = styled.fieldset`
  border-radius: ${({ theme }) => theme.border_radius.x_small};
  border: solid 1px
    ${({ error, theme }) => (error ? theme.colors.error : theme.colors.light)};
  padding: 0.3em 1em;
  margin-top: -7px;
`;

const Legend = styled.legend`
  ${({ error, theme, required }) => css`
    background: ${theme.colors.primary3};
    color: ${error ? theme.colors.error : theme.colors.heading};
    border-radius: ${theme.border_radius.x_small};
    font-size: ${theme.font_sizes.x_small};
    font-family: "DINPro-regular", sans-serif;
    padding: 0.1rem 0.5rem;
    width: auto;
    margin: 0.6em 0;

    ${required &&
    css`
      ::after {
        display: inline-block;
        margin-left: 0.2rem;
        color: ${error ? theme.colors.error : theme.colors.error};
        font-size: ${theme.font_sizes.small};
        line-height: 1;
        content: "*";
      }
    `}
  `}
`;

const SpaceStyled = styled(SpaceAntd)`
  width: 100%;
`;

const Error = styled(Text)`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.font_sizes.x_small};
  ${({ error }) =>
    error &&
    css`
      animation: ${keyframes.shake} 340ms;
    `};
`;
