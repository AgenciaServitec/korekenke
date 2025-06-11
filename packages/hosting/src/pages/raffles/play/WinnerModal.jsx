import React from "react";
import styled from "styled-components";
import { Button } from "../../../components";
import { useNavigate } from "react-router";

export const WinnerModal = ({ winner, raffle }) => {
  const navigate = useNavigate();

  const onGoToParticipants = () =>
    navigate(`/raffles/${raffle.id}/participants`);

  return (
    <Container>
      <div>
        <span>🥳</span>
        <p>{winner.fullName}</p>
      </div>
      <Button size="large" block onClick={() => onGoToParticipants()}>
        Ver contacto
      </Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  text-align: center;

  div {
    span {
      font-size: 6rem;
    }
    p {
      font-weight: bold;
      font-size: 1.2rem;
      margin: 0;
    }
  }
`;
