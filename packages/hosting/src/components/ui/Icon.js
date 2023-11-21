import React from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Icon = ({
  label,
  icon,
  onClick,
  color,
  fontSize,
  cursor = "pointer",
  margin,
  border,
  borderRadius,
  direction = "column",
}) => {
  return (
    <Container margin={margin} direction={direction}>
      <StyledIcon
        color={color}
        onClick={onClick}
        icon={icon}
        fontSize={fontSize}
        cursor={cursor}
        bordericon={border}
        borderradiusicon={borderRadius}
      />
      {label && <Text>{label}</Text>}
    </Container>
  );
};

const Container = styled.div`
  margin: ${({ margin = "0 5px" }) => margin};
  ${({ direction }) =>
    direction === "column"
      ? css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        `
      : css`
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        `}
`;

const StyledIcon = styled(FontAwesomeIcon)`
  color: ${({ color }) => color};
  font-size: ${({ fontSize = "1.5rem" }) => fontSize};
  cursor: ${({ cursor }) => cursor};
  border: ${({ bordericon = "none" }) => bordericon};
  border-radius: ${({ borderradiusicon = "none" }) => borderradiusicon};
`;

const Text = styled.div`
  font-size: 12px;
  color: rgb(166, 168, 180);
  line-height: 1;
  margin: 5px;
`;
