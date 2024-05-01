import React from "react";
import styled, { css } from "styled-components";

const PAGE_SIZES = {
  portrait: { width: "210mm", height: "297mm" },
  landscape: { width: "297mm", height: "210mm" },
};

export const Sheet = ({ layout = "portrait", children, padding }) => (
  <Container layout={layout}>
    <LayoutContainer layout={layout} padding={padding}>
      <Children>{children}</Children>
    </LayoutContainer>
  </Container>
);

const Container = styled.section`
  ${({ layout }) => css`
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;

    ${PAGE_SIZES[layout]};

    margin: 1rem auto;
    display: block;
    overflow: hidden;
    background: white;
    page-break-after: always;

    @page {
      size: A4 portrait;
      margin: 0;
      padding: 0;
    }

    @media print {
      ${PAGE_SIZES.portrait}

      margin: 0;
      padding: 0;
      border: none;
      background: none;
    }
  `}
`;

const PortraitCSS = css`
  ${PAGE_SIZES.portrait}
`;

const LandscapeCss = css`
  ${PAGE_SIZES.landscape};

  @media print {
    transform-origin: 0 0;
    transform: rotate(270deg) translate(-${PAGE_SIZES.landscape.width}, 0);
  }
`;

const LayoutContainer = styled.div`
  ${({ layout, padding = "9mm" }) => css`
    padding: ${padding};
    ${layout === "portrait" ? PortraitCSS : LandscapeCss}
  `}
`;

const Children = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
`;
