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
import {
  notification,
  Card,
  Button,
  Tag,
  Spin,
  Row,
  Col,
  Title,
} from "../../../../components";
import styled from "styled-components";
import { useDevice } from "../../../../hooks";
import { ConfirmVoteSubmit } from "./ConfirmVoteSubmit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faFileAlt,
  faUserTie,
  faVoteYea,
} from "@fortawesome/free-solid-svg-icons";

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
      width: `${isTablet ? "100%" : "40%"}`,
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
    <Spin
      size="large"
      spinning={loading || submitLoading}
      tip="Procesando tu voto..."
      indicator={<FontAwesomeIcon icon={faVoteYea} spin />}
    >
      <Container>
        <div className="voting-header">
          <Title level={1} align="center" className="election-title">
            <FontAwesomeIcon icon={faVoteYea} /> Elecciones 2024
          </Title>
          <p className="instructions">
            Selecciona un candidato o vota en blanco
          </p>
        </div>
        <Row gutter={[16, 24]} className="candidates-row">
          {candidates.map((candidate) => (
            <Col key={candidate.id} xs={24} sm={12} md={12} lg={8}>
              <Card
                role="button"
                tabIndex="0"
                className={`candidate-card ${
                  selectedCandidate?.id === candidate.id ? "selected" : ""
                }`}
                onClick={() => setSelectedCandidate(candidate)}
                onKeyPress={(e) =>
                  e.key === "Enter" && setSelectedCandidate(candidate)
                }
              >
                <div className="candidate-profile">
                  <div className="avatar">
                    <FontAwesomeIcon icon={faUserTie} size="3x" />
                  </div>
                  <div className="candidate-info">
                    <h3 className="name">{candidate.name}</h3>
                  </div>
                </div>
                {selectedCandidate?.id === candidate.id && (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="selected-icon"
                  />
                )}
              </Card>
            </Col>
          ))}
        </Row>
        <Row className="actions-row" justify="space-around">
          <Col xs={24} md={12} lg={8}>
            <Button
              className="vote-button"
              type="primary"
              onClick={() => onShowConfirmVoteSubmit("vote")}
              disabled={!selectedCandidate}
              icon={<FontAwesomeIcon icon={faCheckCircle} />}
              block
            >
              Confirmar Voto
            </Button>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Button
              className="blank-vote-button"
              type="secondary"
              onClick={() => onShowConfirmVoteSubmit("blank")}
              icon={<FontAwesomeIcon icon={faFileAlt} />}
              block
            >
              Votar en Blanco
            </Button>
          </Col>
        </Row>
      </Container>
    </Spin>
  );
};

const Container = styled.div`
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;

  .voting-header {
    text-align: center;
    margin-bottom: 2rem;

    .election-title {
      color: #1a237e;
      margin-bottom: 1rem;
    }

    .instructions {
      color: #616161;
      font-size: 1.1rem;
      max-width: 600px;
      margin: 0 auto;
    }
  }

  .candidates-row {
    margin-bottom: 2rem;

    .candidate-card {
      position: relative;
      height: 100%;
      padding: 1.5rem;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      &.selected {
        border-color: #1a237e;
        background: #f8f9ff;
        box-shadow: 0 6px 16px rgba(26, 35, 126, 0.15);

        .avatar {
          border-color: #1a237e;
        }
      }

      .candidate-profile {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0f2f5;
        border: 2px solid #e0e0e0;
        color: #1a237e;
      }

      .candidate-info {
        flex: 1;
        .name {
          color: #1a1a1a;
          margin-bottom: 0.25rem;
          font-size: 1.1rem;
          font-weight: 600;
        }
      }

      .selected-icon {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        color: #1a237e;
        font-size: 1.2rem;
      }
    }
  }

  .actions-row {
    .vote-button {
      background: #1a237e;
      color: white;
      height: 50px;
      font-size: 1.1rem;
      margin-bottom: 1rem;

      &:hover {
        background: #303f9f;
      }

      &:disabled {
        background: #bdbdbd;
        cursor: not-allowed;
      }
    }

    .blank-vote-button {
      height: 50px;
      font-size: 1.1rem;
      border: 2px solid #1a237e;
      color: #1a237e;

      &:hover {
        background: #f8f9ff;
      }
    }
  }
`;
