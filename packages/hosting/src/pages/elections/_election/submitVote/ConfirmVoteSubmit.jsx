import React from "react";
import styled from "styled-components";
import { Button } from "../../../../components";

export const ConfirmVoteSubmit = ({
  onSubmitVote,
  onSubmitBlankVote,
  onCloseModal,
  type,
}) => {
  const onVote = async () => {
    if (type === "vote") {
      await onCloseModal();
      onSubmitVote();
      return;
    }
    await onCloseModal();
    onSubmitBlankVote();
  };

  return (
    <Container>
      <div className="button-group">
        <Button className="confirm-button" type="primary" onClick={onVote}>
          Votar
        </Button>
        <Button className="cancel-button" type="default" onClick={onCloseModal}>
          Cancelar
        </Button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;

  .button-group {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1.5rem;
  }

  .confirm-button {
    min-width: 120px;
  }

  .cancel-button {
    min-width: 120px;
  }
`;
