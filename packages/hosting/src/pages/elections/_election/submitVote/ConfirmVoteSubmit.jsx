import React from "react";
import styled from "styled-components";
import { Button } from "../../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimes,
  faVoteYea,
} from "@fortawesome/free-solid-svg-icons";

export const ConfirmVoteSubmit = ({
  onSubmitVote,
  onSubmitBlankVote,
  onCloseModal,
  type,
  candidate,
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
      <div className="modal-header">
        <FontAwesomeIcon icon={faCheckCircle} className="header-icon" />
        <h3 className="modal-title">Confirmar Voto</h3>
      </div>

      <p className="confirmation-text">
        {type === "vote"
          ? `¿Estás seguro de que deseas confirmar tu voto por ${candidate.name}?`
          : "¿Deseas registrar un voto en blanco para esta elección?"}
      </p>

      <div className="button-group">
        <Button
          className="confirm-button"
          type="primary"
          onClick={onVote}
          icon={<FontAwesomeIcon icon={faVoteYea} />}
        >
          {type === "vote" ? "Confirmar Voto" : "Votar en Blanco"}
        </Button>
        <Button
          className="cancel-button"
          type="secondary"
          onClick={onCloseModal}
          icon={<FontAwesomeIcon icon={faTimes} />}
        >
          Cancelar
        </Button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
  text-align: center;
  max-width: 500px;
  margin: 0 auto;

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.5rem;

    .header-icon {
      color: #1a237e;
      font-size: 1.8rem;
    }

    .modal-title {
      color: #1a237e;
      margin: 0;
      font-size: 1.5rem;
    }
  }

  .confirmation-text {
    color: #616161;
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .button-group {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;

    @media (max-width: 480px) {
      flex-direction: column;
      gap: 1rem;
    }
  }

  .confirm-button {
    background: #1a237e;
    border: none;
    padding: 0.8rem 2rem;
    min-width: 200px;
    transition: all 0.3s ease;

    &:hover {
      background: #303f9f;
      transform: translateY(-1px);
    }
  }

  .cancel-button {
    color: #1a237e;
    border: 2px solid #1a237e;
    background: white;
    padding: 0.8rem 2rem;
    min-width: 200px;
    transition: all 0.3s ease;

    &:hover {
      background: #f8f9ff;
      color: #303f9f;
      border-color: #303f9f;
    }
  }

  @media (max-width: 480px) {
    padding: 1.5rem;

    .button-group {
      width: 100%;

      button {
        width: 100%;
      }
    }
  }
`;
