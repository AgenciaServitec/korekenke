import React, { useRef, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import styled from "styled-components";

export const CountdownTimerWinner = ({ raffle, onSetShowWinner }) => {
  return (
    <Container>
      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying
          duration={raffle?.durationSeconds}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[7, 5, 2, 0]}
          onComplete={() => onSetShowWinner(true)}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
    </Container>
  );
};

const renderTime = ({ remainingTime }) => {
  const currentTime = useRef(remainingTime);
  const prevTime = useRef(null);
  const isNewTimeFirstTick = useRef(false);
  const [, setOneLastRerender] = useState(0);

  if (currentTime.current !== remainingTime) {
    isNewTimeFirstTick.current = true;
    prevTime.current = currentTime.current;
    currentTime.current = remainingTime;
  } else {
    isNewTimeFirstTick.current = false;
  }

  if (remainingTime === 0) {
    setTimeout(() => {
      setOneLastRerender((val) => val + 1);
    }, 20);
  }

  const isTimeUp = isNewTimeFirstTick.current;

  return (
    <div className="time-wrapper">
      <div key={remainingTime} className={`time ${isTimeUp ? "up" : ""}`}>
        {remainingTime}
      </div>
      {prevTime.current !== null && (
        <div
          key={prevTime.current}
          className={`time ${!isTimeUp ? "down" : ""}`}
        >
          {prevTime.current}
        </div>
      )}
    </div>
  );
};

const Container = styled.div`
  width: 100%;
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .timer-wrapper {
    display: flex;
    justify-content: center;
  }

  .time-wrapper {
    position: relative;
    width: 80px;
    height: 60px;
    font-size: 48px;
  }

  .time-wrapper .time {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateY(0);
    opacity: 1;
    transition: all 0.2s;
  }

  .time-wrapper .time.up {
    opacity: 0;
    transform: translateY(-100%);
  }

  .time-wrapper .time.down {
    opacity: 0;
    transform: translateY(100%);
  }
`;
