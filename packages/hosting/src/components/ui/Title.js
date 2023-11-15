import React from "react";
import styled, { css } from "styled-components";
import Typography from "antd/lib/typography";

export const Title = ({ align = "left", children, ...props }) => (
  <TitleAntd align={align} {...props}>
    {children}
  </TitleAntd>
);

const TitleAntd = styled(Typography.Title)`
  ${({ align }) => css`
    text-align: ${align};
  `}
`;
