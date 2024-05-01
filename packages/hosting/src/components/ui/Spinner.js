import React from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export const Spinner = ({
  height,
  fullscreen = true,
  size = "6x",
  message = null,
}) => (
  <Container fullscreen={fullscreen} height={height}>
    <div className="item">
      <div>
        <IconStyled spin icon={faCircleNotch} size={size} />
      </div>
      {message && (
        <div className="message-item">
          <h3>{message}</h3>
        </div>
      )}
    </div>
  </Container>
);

const Container = styled.section`
  ${({ fullscreen, height }) => css`
    width: 100%;
    height: ${height || (fullscreen ? "100%" : " calc(100% - 90px)")};
    opacity: 90%;
    display: grid;
    place-items: center;
    .item {
      width: auto;
      height: auto;
      padding: 1em;
      margin: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1em;
    }
  `}
`;

const IconStyled = styled(FontAwesomeIcon)`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
  `}
`;
