import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CirclePicker } from "react-color";
import { lighten, readableColor, rgba } from "polished";
import { Title } from "./Title";

export const ColorPicker = ({ initialColor = "#ffffff", onChange }) => {
  const [background, setBackground] = useState(initialColor);
  const [textColor, setTextColor] = useState(readableColor(initialColor));

  useEffect(() => {
    setTextColor(readableColor(background));
    if (onChange) onChange(background);
  }, [background, onChange]);

  const handleChangeComplete = (color) => {
    setBackground(color.hex);
  };

  return (
    <Container bgColor={background}>
      <PickerHeader>
        <StyledTitle level={3} textColor={textColor}>
          Color Principal
        </StyledTitle>
        <ColorBox
          bgColor={background}
          textColor={textColor}
          title={background}
        />
      </PickerHeader>
      <PickerWrapper textColor={textColor}>
        <ResponsiveCirclePicker
          colors={[
            "#ffffff",
            "#F44336",
            "#E91E63",
            "#9C27B0",
            "#673AB7",
            "#3F51B5",
            "#2196F3",
            "#03A9F4",
            "#00BCD4",
            "#009688",
            "#4CAF50",
            "#8BC34A",
            "#CDDC39",
            "#FFEB3B",
            "#FFC107",
            "#FF9800",
            "#FF5722",
            "#795548",
            "#607D8B",
            "#000000",
          ]}
          color={background}
          onChangeComplete={handleChangeComplete}
        />
      </PickerWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 2rem;
  border-radius: 0.3em;
  border: 1px solid rgb(121, 131, 140);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: ${({ bgColor }) =>
    `linear-gradient(135deg, ${bgColor} 0%, ${lighten(0.2, bgColor)} 100%)`};
  transition: background 0.3s ease;
`;

const PickerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledTitle = styled(Title)`
  color: ${({ textColor }) => textColor} !important;
  margin: 0;
  font-size: 1.5rem;
`;

const ColorBox = styled.div`
  width: 40px;
  height: 40px;
  border: 2px solid ${({ textColor }) => rgba(textColor, 0.6)};
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 12px;
  transition: transform 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

const PickerWrapper = styled.div`
  background: ${({ textColor }) => rgba(textColor, 0.08)};
  padding: 1.25rem;
  border-radius: 1rem;
  transition: background 0.3s ease;
  backdrop-filter: blur(8px);
`;

const ResponsiveCirclePicker = styled(CirclePicker).attrs({
  circleSize: 28,
  circleSpacing: 12,
})`
  width: 100% !important;
`;
