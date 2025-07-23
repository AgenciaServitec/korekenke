import React from "react";
import { faCircleCheck, faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Timeline } from "antd";
import styled from "styled-components";

export const VisitProcessModal = ({ visit, onCloseModal }) => {
  console.log("visit: ", visit);

  return (
    <Container>
      <Timeline
        items={[
          {
            dot: <FontAwesomeIcon icon={faCircleCheck} size="2x" />,
            color:
              visit?.timeline?.entryCuartel.status === "approved"
                ? "green"
                : "red",
            children: (
              <VisitInformation
                title="Registro de la Visita"
                date={visit?.timeline?.entryCuartel.timestamp}
              />
            ),
          },
          {
            dot: <FontAwesomeIcon icon={faCircleCheck} size="2x" />,
            color:
              visit?.timeline?.entryCuartel.status === "approved"
                ? "green"
                : "red",
            children: (
              <VisitInformation
                title="Aprobación de la visita"
                date={visit?.timeline?.entryCuartel.timestamp}
              />
            ),
          },
          {
            dot: <FontAwesomeIcon icon={faCircleCheck} size="2x" />,
            color:
              visit?.timeline?.entryCuartel.status === "approved"
                ? "green"
                : "red",
            children: (
              <VisitInformation
                title={visit?.timeline?.entryCuartel.title}
                date={visit?.timeline?.entryCuartel.timestamp}
              />
            ),
          },
          {
            dot: <FontAwesomeIcon icon={faClock} size="2x" />,
            color:
              visit?.timeline?.entryDependency.status === "approved"
                ? "green"
                : "red",
            children: (
              <VisitInformation
                title={visit?.timeline?.entryDependency.title}
                date={visit?.timeline?.entryDependency.timestamp}
              />
            ),
          },
          {
            dot: <FontAwesomeIcon icon={faClock} size="2x" />,
            color:
              visit?.timeline?.exitDependency.status === "approved"
                ? "green"
                : "red",
            children: (
              <VisitInformation
                title={visit?.timeline?.exitDependency.title}
                date={visit?.timeline?.exitDependency.timestamp}
              />
            ),
          },
          {
            dot: <FontAwesomeIcon icon={faClock} size="2x" />,
            color:
              visit?.timeline?.exitCuartel.status === "approved"
                ? "green"
                : "red",
            children: (
              <VisitInformation
                title={visit?.timeline?.exitCuartel.title}
                date={visit?.timeline?.exitCuartel.timestamp}
              />
            ),
          },
        ]}
      />
    </Container>
  );
};

const VisitInformation = ({ title, date }) => (
  <div className="information">
    <h5>{title}</h5>
    <p>{date}</p>
  </div>
);

const Container = styled.div`
  padding: 2rem;

  .information {
    padding-bottom: 1rem;
  }
`;
