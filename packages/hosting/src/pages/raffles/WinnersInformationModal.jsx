import React from "react";
import styled from "styled-components";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { raffleParticipantsRef } from "../../firebase/collections/raffles";
import {
  faUser,
  faIdCard,
  faPhone,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const WinnersInformationModal = ({ raffleId, isOrganizer }) => {
  const [winners = [], winnersLoading, winnersError] = useCollectionData(
    raffleParticipantsRef(raffleId)
      .where("isDeleted", "==", false)
      .where("winner", "==", true),
  );

  return (
    <Container>
      <div className="modal-header">
        <h2 className="modal-title">
          <FontAwesomeIcon icon={faTrophy} />
          Ganadores del Sorteo
        </h2>
      </div>

      <div className="modal-body">
        {winnersLoading && (
          <p className="status-message loading">Cargando ganadores...</p>
        )}

        {winnersError && (
          <p className="status-message error">Error al cargar los ganadores.</p>
        )}

        {!winnersLoading && winners.length === 0 && (
          <p className="status-message empty">No hay ganadores registrados.</p>
        )}

        <div className="winner-list">
          {winners.map((winner, index) => (
            <div key={winner.id} className="winner-card">
              <div className="winner-number">{index + 1}</div>
              <div className="winner-info">
                <h3 className="winner-name">
                  <FontAwesomeIcon icon={faUser} className="icon" />
                  {winner.fullName}
                </h3>
                {isOrganizer && (
                  <>
                    <p className="winner-detail">
                      <FontAwesomeIcon icon={faIdCard} className="icon" />
                      DNI: {winner.dni}
                    </p>
                    <p className="winner-detail">
                      <FontAwesomeIcon icon={faPhone} className="icon" />
                      Celular: {winner.phone?.prefix} {winner.phone?.number}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};
const Container = styled.div`
  animation: fadeIn 0.3s ease-out;

  .modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background-color: #f8fafc;
    text-align: center;
  }

  .modal-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.6rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .status-message {
    text-align: center;
    font-size: 0.95rem;
    margin: 1rem 0;
  }

  .status-message.loading {
    color: #3b82f6;
  }

  .status-message.error {
    color: #ef4444;
  }

  .status-message.empty {
    color: #9ca3af;
  }

  .winner-list {
    display: grid;
    gap: 1.25rem;
    grid-template-columns: 1fr;

    @media (min-width: 640px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (min-width: 1024px) {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  .winner-card {
    background: linear-gradient(135deg, #f9fafb, #f3f4f6);
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 1.25rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }
  }

  .winner-number {
    width: 44px;
    height: 44px;
    background-color: #6366f1;
    color: white;
    font-weight: bold;
    font-size: 1rem;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .winner-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .winner-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .winner-detail {
    font-size: 0.9rem;
    color: #4b5563;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .icon {
    color: #6b7280;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.97);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
