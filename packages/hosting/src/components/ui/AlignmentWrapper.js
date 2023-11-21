import React from "react";
import styled from "styled-components";

export const AlignmentWrapper = ({ children, align = "center" }) => {
  return <Container align={align}>{children}</Container>;
};

const Container = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: ${({ align = "center" }) => align};
`;
