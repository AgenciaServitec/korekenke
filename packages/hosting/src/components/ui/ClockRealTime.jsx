import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";

export const ClockRealTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState(
    dayjs().format("DD/MM/YYYY HH:mm:ss A"),
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(dayjs().format("DD MMM YYYY HH:mm:ss A"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container style={{ minWidth: "13em", textAlign: "right" }}>
      <strong className="current-datetime">{currentDateTime}</strong>
    </Container>
  );
};

const Container = styled.div`
  min-width: 13em;
  text-align: center;
  background: #313131;
  color: #ffffff;
  padding: 0.8em 1em;
  border-radius: 0.7em;
  font-size: 1.2em;
  .current-datetime {
    text-transform: capitalize;
  }
`;
