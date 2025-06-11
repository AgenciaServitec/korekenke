import React, { useEffect, useState } from "react";
import {
  Acl,
  Button,
  Col,
  IconAction,
  Row,
  Spinner,
} from "../../../components";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  fetchRaffle,
  raffleParticipantsRef,
  rafflesRef,
} from "../../../firebase/collections/raffles";
import { useParams } from "react-router";
import styled from "styled-components";
import { faArrowsSpin } from "@fortawesome/free-solid-svg-icons";
import { isEmpty } from "lodash";
import { RaffleWinner } from "./RaffleWinner";

export const RafflePlay = () => {
  const { raffleId } = useParams();

  const [raffle, setRaffle] = useState(null);
  const [winner, setWinner] = useState(null);
  const [shuffledParticipants, setShuffledParticipants] = useState([]);

  const [participants = [], participantsLoading, participantsError] =
    useCollectionData(
      raffleParticipantsRef(raffleId).where("isDeleted", "==", false),
    );

  useEffect(() => {
    setShuffledParticipants(participants);
  }, [participants]);

  useEffect(() => {
    (async () => {
      const _raffle = await fetchRaffle(raffleId);
      setRaffle(_raffle);
    })();
  }, []);

  const onRafflePlay = () => {
    const selectWinner = (participants) => {
      if (participants.length === 0) return null;

      const indexWinner = Math.floor(Math.random() * participants.length);
      return participants[indexWinner];
    };

    const _winner = selectWinner(participants);
    setWinner(_winner);
  };

  const onShuffleParticipants = () => {
    const nuevoArray = [...participants];
    for (let i = nuevoArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nuevoArray[i], nuevoArray[j]] = [nuevoArray[j], nuevoArray[i]];
    }
    setShuffledParticipants(nuevoArray);
  };

  if (participantsLoading) return <Spinner />;

  return (
    <Acl
      category="public"
      subCategory="raffles"
      name="/raffles/:raffleId/play"
      redirect
    >
      <Row gutter={[16, 16]}>
        {isEmpty(winner) ? (
          <Col span={24}>
            <Container>
              <div className="sorteo">
                <div className="header">
                  <div className="title">
                    <h2>Participantes</h2>
                    <IconAction
                      tooltipTitle="Chocolatear"
                      icon={faArrowsSpin}
                      size={50}
                      onClick={() => onShuffleParticipants()}
                      styled={{ color: (theme) => theme.colors.black }}
                    />
                  </div>
                  <strong>Total: {participants.length}</strong>
                </div>
                <ul className="list">
                  {shuffledParticipants.map(({ fullName, id }) => (
                    <li key={id}>{fullName}</li>
                  ))}
                </ul>
              </div>
              <Button
                type="primary"
                block
                size="large"
                style={{
                  background: "linear-gradient(135deg, #4da6ff, #70cfff)",
                }}
                onClick={() => onRafflePlay(participants)}
              >
                Comenzar
              </Button>
            </Container>
          </Col>
        ) : (
          <RaffleWinner raffle={raffle} winner={winner} />
        )}
      </Row>
    </Acl>
  );
};

const Container = styled.div`
  max-width: 30rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;

  .sorteo {
    border-radius: 0.625rem;
    box-shadow: 0 0 8px #b1b1b1;
    overflow: hidden;
  }

  .header {
    padding: 1rem;
    background: linear-gradient(135deg, #4da6ff, #70cfff);

    color: white;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h2 {
        color: white;
      }
    }
  }

  .list {
    height: 20rem;
    list-style: none;
    overflow-y: scroll;

    li {
      height: 3rem;
      line-height: 3rem;
      text-align: center;
      border-top: 1px solid #b1b1b1;
      font-weight: bold;
    }
  }
`;
