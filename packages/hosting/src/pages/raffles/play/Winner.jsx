import React from "react";
import { useDevice } from "../../../hooks";
import { useModal } from "../../../providers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { WinnerModal } from "./WinnerModal";
import styled from "styled-components";

export const Winner = ({ winner, raffle }) => {
  const { isTablet } = useDevice();
  const { onShowModal, onCloseModal } = useModal();

  const onShowWinner = (winner) => {
    onShowModal({
      width: `${isTablet ? "100%" : "30%"}`,
      onRenderBody: () => <WinnerModal winner={winner} raffle={raffle} />,
    });
  };

  return (
    <Container onClick={() => onShowWinner(winner)}>
      <p>{winner?.fullName}</p>
      <FontAwesomeIcon icon={faAngleRight} size="xl" />
    </Container>
  );
};

const Container = styled.div`
  cursor: pointer;
`;
