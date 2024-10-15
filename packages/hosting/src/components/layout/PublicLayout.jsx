import React from "react";
import styled from "styled-components";
import { Layout } from "../ui";

export const PublicLayout = ({ children }) => {
  return (
    <LayoutContainer>
      <div className="site-layout-background" style={{ padding: 24 }}>
        {children}
      </div>
    </LayoutContainer>
  );
};

const LayoutContainer = styled(Layout)`
  .site-layout-background {
    min-height: 100svh;
    background: #fff;
  }
`;
