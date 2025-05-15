import React, { useState } from "react";
import { Acl, Button, Col, IconAction, Row } from "../../../components";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { raffleParticipantsRef } from "../../../firebase/collections/raffles";
import { useParams } from "react-router";
import styled from "styled-components";
import { faAngleRight, faArrowsSpin } from "@fortawesome/free-solid-svg-icons";
import { isEmpty } from "lodash";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const RafflePlay = () => {
  const { raffleId } = useParams();
  const { width, height } = useWindowSize();

  const [winner, setWinner] = useState(null);

  const [participants = [], participantsLoading, participantsError] =
    useCollectionData(
      raffleParticipantsRef(raffleId).where("isDeleted", "==", false),
    );

  const onRafflePlay = () => {
    const selectWinner = (participants) => {
      if (participants.length === 0) return null;

      const indexWinner = Math.floor(Math.random() * participants.length);
      console.log(indexWinner, participants[indexWinner]);
      return participants[indexWinner];
    };

    const _winner = selectWinner(participants);
    setWinner(_winner);
  };

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
                      onClick={() => ""}
                    />
                  </div>
                  <p>Total: {participants.length}</p>
                </div>
                <ul className="list">
                  {participants.map(({ fullName, id }) => (
                    <li key={id}>{fullName}</li>
                  ))}
                </ul>
              </div>
              <Button
                type="primary"
                block
                size="large"
                style={{ backgroundColor: "#85bf31" }}
                onClick={() => onRafflePlay(participants)}
              >
                Comenzar
              </Button>
            </Container>
          </Col>
        ) : (
          <Container>
            <ReactConfetti width={width} height={height} />
            <h2>Ganadores</h2>
            <div className="winners">
              <div>
                <p>{winner?.nombres}</p>
                <FontAwesomeIcon icon={faAngleRight} size="xl" />
              </div>
            </div>
          </Container>
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
    background: #1d8511;
    background: -webkit-linear-gradient(
      90deg,
      rgba(29, 133, 17, 1) 0%,
      rgba(72, 255, 0, 1) 100%
    );
    background: -moz-linear-gradient(
      90deg,
      rgba(29, 133, 17, 1) 0%,
      rgba(72, 255, 0, 1) 100%
    );
    background: linear-gradient(
      90deg,
      rgba(29, 133, 17, 1) 0%,
      rgba(72, 255, 0, 1) 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#1D8511", endColorstr="#48FF00", GradientType=1);
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

  .winners {
    div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 0.625rem;
      padding: 1rem;
      box-shadow: 0 0 8px #b1b1b1;
    }
    p {
      margin: 0;
    }
  }
`;
