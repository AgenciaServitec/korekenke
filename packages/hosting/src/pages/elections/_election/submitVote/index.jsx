import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ModalProvider,
  useAuthentication,
  useModal,
} from "../../../../providers";
import {
  checkVoterEligibility,
  fetchCandidates,
  submitVote,
} from "../../../../firebase/collections";
import { notification, Card, Button, Tag, Spin } from "../../../../components";
import styled from "styled-components";
import { useDevice } from "../../../../hooks";
import { ConfirmVoteSubmit } from "./ConfirmVoteSubmit";

export const VotingBooth = () => {
  const navigate = useNavigate();
  const { electionId } = useParams();
  const { authUser } = useAuthentication();

  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isEligible, setIsEligible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const onGoBack = () => navigate(-1);

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        if (authUser.id) {
          const eligible = await checkVoterEligibility(electionId, authUser.id);
          setIsEligible(eligible);
        }
      } catch (error) {
        notification({
          type: "error",
          description: "Error verificando elegibilidad",
        });
      }
    };

    checkEligibility();
  }, [authUser.id, electionId]);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const candidatesList = await fetchCandidates(electionId);
        setCandidates(candidatesList);
      } catch (error) {
        notification({
          type: "error",
          description: "Error cargando candidatos",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, [electionId]);

  const onSubmitVote = async () => {
    if (submitLoading) return;

    setSubmitLoading(true);
    if (!selectedCandidate) {
      return notification({
        type: "warning",
        description: "Selecciona un Candidato",
      });
    }

    try {
      await submitVote(electionId, {
        userId: authUser.id,
        candidateId: selectedCandidate.id,
      });

      notification({ type: "success", description: "¡Voto Registrado!" });
      onGoBack();
    } catch (error) {
      notification({ type: "error", description: error.message });
    }
  };

  const onSubmitBlankVote = async () => {
    if (submitLoading) return;

    setSubmitLoading(true);
    try {
      await submitVote(electionId, {
        userId: authUser.id,
        candidateId: "blank",
      });

      notification({ type: "success", message: "¡Voto en blanco registrado!" });
      onGoBack();
    } catch (error) {
      notification({ type: "error", message: error.message });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!isEligible) {
    return (
      <Spin size="large" spinning={loading}>
        <Tag color="red">
          No estás Autorizado para Votar o Ya has realizado tu Votación
        </Tag>
      </Spin>
    );
  }

  return (
    <ModalProvider>
      <Voting
        loading={loading}
        submitLoading={submitLoading}
        candidates={candidates}
        setSelectedCandidate={setSelectedCandidate}
        onSubmitVote={onSubmitVote}
        onSubmitBlankVote={onSubmitBlankVote}
        selectedCandidate={selectedCandidate}
      />
    </ModalProvider>
  );
};

const Voting = ({
  loading,
  candidates,
  setSelectedCandidate,
  onSubmitVote,
  selectedCandidate,
  onSubmitBlankVote,
  submitLoading,
}) => {
  const { isTablet } = useDevice();
  const { onShowModal, onCloseModal } = useModal();

  const onShowConfirmVoteSubmit = (type) => {
    onShowModal({
      title: `¿Seguro(a) de Votar ${type === "vote" ? `por ${selectedCandidate.name}` : "en blanco"}?`,
      width: `${isTablet ? "40%" : "40%"}`,
      centered: false,
      onRenderBody: () => (
        <ConfirmVoteSubmit
          type={type}
          candidate={selectedCandidate}
          onSubmitVote={onSubmitVote}
          onSubmitBlankVote={onSubmitBlankVote}
          onCloseModal={onCloseModal}
        />
      ),
    });
  };

  return (
    <Spin size="large" spinning={loading || submitLoading}>
      <Container>
        <div className="voting-title">
          <h2>Candidatos</h2>
        </div>
        <div className="candidates-list">
          {candidates.map((candidate) => (
            <Card
              key={candidate.id}
              className={`candidate-card ${
                selectedCandidate?.id === candidate.id ? "selected" : ""
              }`}
              onClick={() => setSelectedCandidate(candidate)}
            >
              <h3 className="candidate-name">{candidate.name}</h3>
              <p className="candidate-slogan">{candidate.slogan}</p>
            </Card>
          ))}

          <Button
            className="vote-button primary"
            onClick={() => onShowConfirmVoteSubmit("vote")}
            disabled={!selectedCandidate}
          >
            Votar
          </Button>
          <Button
            className="blank-vote-button"
            onClick={() => onShowConfirmVoteSubmit("blank")}
            type="default"
          >
            Votar en Blanco
          </Button>
        </div>
      </Container>
    </Spin>
  );
};

const Container = styled.div`
  text-align: center;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

  .voting-title {
    margin-bottom: 2rem;
    color: #2c3e50;
  }

  .candidates-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .candidate-card {
    padding: 1.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .candidate-card.selected {
    border-color: #1890ff;
    background-color: #e6f7ff;
    transform: scale(1.02);
  }

  .candidate-card:hover:not(.selected) {
    background-color: #f5f5f5;
  }

  .candidate-name {
    color: #1a1a1a;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }

  .candidate-slogan {
    color: #666;
    font-size: 0.9rem;
  }

  .vote-button.primary {
    border: black solid 0.1em;
    background-color: #56e756;
    margin-top: 2rem;
    width: 100%;
    max-width: 30em;
    margin-left: auto;
    margin-right: auto;

    &:hover {
      background-color: #25cb25;
    }
  }

  .blank-vote-button {
    border: black solid 0.1em;
    background-color: white;
    margin-top: 2rem;
    width: 100%;
    max-width: 30em;
    margin-left: auto;
    margin-right: auto;
  }
`;
