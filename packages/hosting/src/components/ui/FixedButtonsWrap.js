import React from "react";
import styled from "styled-components";
import { mediaQuery } from "../../styles";

export const FixedButtonsWrap = ({ children }) => {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem 4rem 1rem 4rem;
  width: 100%;
  margin: auto;
  background: #fff;
  ${mediaQuery.minDesktop} {
    width: 60%;
  }
`;
