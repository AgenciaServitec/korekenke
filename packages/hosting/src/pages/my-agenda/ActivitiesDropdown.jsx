import React from "react";
import { Dropdown, IconAction, Space } from "../../components";
import { faAngleDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

export const ActivitiesDropdown = ({ onShowAddTask, onShowAddEvent }) => {
  return (
    <AgendaOptions
      onShowAddTask={onShowAddTask}
      onShowAddEvent={onShowAddEvent}
    />
  );
};

const AgendaOptions = ({ onShowAddTask, onShowAddEvent }) => {
  const items = [
    {
      key: "1",
      label: "Mi agenda",
      disabled: true,
    },
    {
      key: "2",
      label: "Tarea",
      onClick: () => onShowAddTask("Tarea"),
    },
    {
      key: "3",
      label: "Evento",
      onClick: () => onShowAddEvent("Evento"),
    },
  ];
  return (
    <Container>
      <div className="dropdown-wrapper">
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <IconAction size="1.3x" icon={faPlus} />
            <Space>Crear</Space>
            <IconAction size="1.3x" icon={faAngleDown} />
          </a>
        </Dropdown>
      </div>
    </Container>
  );
};

const Container = styled.div`
  max-width: 100%;
  width: 100%;
  height: auto;
  padding: 1em;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  box-shadow:
    0px 4px 8px rgba(0, 0, 0, 0.2),
    inset 0px 2px 4px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);

  .dropdown-wrapper {
    padding: 1em;
    margin: auto;
    border-radius: 10px;
    box-shadow:
      0px 4px 8px rgba(0, 0, 0, 0.2),
      inset 0px 2px 4px rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    width: 40%;
    transition: 0.5s;

    a {
      display: flex;
      font-size: 1em;
      color: black;
      justify-content: space-around;
      flex-wrap: wrap;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &:hover {
      background-color: lightblue;
    }
  }
`;
