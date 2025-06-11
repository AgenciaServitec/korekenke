import React, { useRef, useState } from "react";
import styled from "styled-components";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import { CountdownTimerWinner } from "../CountdownTimerWinner";
import { Title } from "../../../components";
import { ModalProvider } from "../../../providers";
import { Winner } from "./Winner";

export const RaffleWinner = ({ raffle, winner }) => {
  const [showWinner, setShowWinner] = useState(false);
  const { width, height } = useWindowSize();

  return (
    <ModalProvider>
      <Container>
        {showWinner ? (
          <div className="winners">
            {/*<ReactConfetti width={width} height={height} />*/}
            <div className="winners__module">
              <Title level={3} align="center">
                Ganadores
              </Title>
              <div className="winners__list">
                <Winner winner={winner} raffle={raffle} />
              </div>
            </div>
          </div>
        ) : (
          <CountdownTimerWinner
            raffle={raffle}
            onSetShowWinner={setShowWinner}
          />
        )}
      </Container>
    </ModalProvider>
  );
};

const Container = styled.div`
  width: 100%;
  height: 80vh;

  .winners {
    &__module {
      max-width: 25rem;
      margin: 0 auto;
    }

    &__list {
      > div {
        height: 4rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 0.625rem;
        padding: 1rem;
        border: 2px solid #eaeaea;
        box-shadow: 1px 2px 0 1px #eaeaea;

        &:hover {
          background-color: rgba(241, 241, 241, 0.35);
        }

        p {
          margin: 0;
          font-weight: bold;
        }
      }
    }
  }
`;
