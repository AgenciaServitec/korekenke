import React from "react";
import styled from "styled-components";
import { IconAction } from "../../../components";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export const ActivityInformation = ({
  activity,
  onEditActivity,
  onConfirmDeleteActivity,
}) => {
  if (!activity) return null;

  const allDay = activity.allDay === true ? "Si" : "No";

  return (
    <Container>
      <div className="title-wrapper">
        <span>{activity.title}</span>
      </div>
      <div className="all-content">
        <div className="information">
          <div className="date">
            <p>Fecha: {activity.date}</p>
          </div>
          <div className="extra-data">
            <p>Todo el día: {allDay}</p>
            <p>Descripción: {activity.description}</p>
            <p>Ubicación: {activity.location}</p>
          </div>
        </div>
        <div className="actions">
          <IconAction
            tooltipTitle="Editar"
            icon={faEdit}
            onClick={() => onEditActivity(activity.id)}
          />
          <IconAction
            tooltipTitle="Eliminar"
            icon={faTrash}
            styled={{ color: (theme) => theme.colors.error }}
            onClick={() => {
              onConfirmDeleteActivity(activity.id);
            }}
          />
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  font-weight: normal;
  text-align: center;

  .title-wrapper {
    text-align: center;
    text-decoration: underline;
    font-size: 1.4em;
    font-weight: 600;
    margin-bottom: 0.7em;
  }
  .all-content {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.5em;

    .information {
      max-width: 60%;
      width: 60%;
      text-align: left;
    }
    .actions {
      text-align: right;
      max-width: 40%;
      width: 40%;
      font-size: 3em;
    }
  }
`;