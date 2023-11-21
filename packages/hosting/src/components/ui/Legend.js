import React, { memo } from "react";
import styled, { css } from "styled-components";

export const Legend = ({ title, children }) => {
  return (
    <Container>
      <Content>
        <label className="legend-title">{title}</label>
        <div className="legend-content">{children}</div>
      </Content>
    </Container>
  );
};

export default memo(Legend);

const Container = styled.section`
  padding-top: 7px;
`;

const Content = styled.div`
  ${({ theme }) => css`
    border-radius: ${theme.border_radius.xx_small};
    border: 1px solid ${theme.colors.bordered};
    padding: ${theme.paddings.xxx_large} ${theme.paddings.medium}
      ${theme.paddings.medium} ${theme.paddings.medium};
    background: #fafafa85;
    position: relative;

    .legend-title {
      position: absolute;
      top: -16px;
      z-index: 100;
      pointer-events: none;
      display: flex;
      background-color: white;
      font-weight: ${theme.font_weight.large};
      font-size: ${theme.font_sizes.large};
      padding: 0 ${theme.border_radius.xx_small};
    }
  `}
`;
