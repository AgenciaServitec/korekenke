import React, { useEffect, useRef } from "react";
import styled from "styled-components";

export const Audio = ({ audio, autoPlay }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    console.log("current->", audioRef.current);
  }, [audioRef]);

  return (
    <ContainerAudio
      ref={audioRef}
      key={autoPlay}
      src={audio}
      autoPlay={autoPlay}
      preload="none"
      controls
    />
  );
};

const ContainerAudio = styled.audio`
  visibility: hidden;
`;
