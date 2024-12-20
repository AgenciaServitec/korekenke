import React, { useState } from "react";
import { Title, Tabs, List } from "../../components";
import styled from "styled-components";
import { orderBy } from "lodash";

export const ActivitiesList = ({
  activities,
  onEditActivity,
  onConfirmDeleteActivity,
}) => {
  const [activeTab, setActiveTab] = useState("1");

  const filterActivities =
    activeTab === "1"
      ? activities.filter((activity) => activity.type === "task")
      : activities.filter((activity) => activity.type === "event");

  const items = [
    {
      key: "1",
      label: "Tareas",
    },
    {
      key: "2",
      label: "Eventos",
    },
  ];

  return (
    <Container>
      <Title level={3}>Mi Agenda</Title>
      <Tabs
        items={items}
        defaultActiveKey="1"
        onChange={(key) => setActiveTab(key)}
      />
      <List
        dataSource={orderBy(filterActivities, "createAt", "desc")}
        itemTitle={(activity) => (
          <div className="title-wrapper">{activity?.title || "Sin Título"}</div>
        )}
        onEditItem={(activity) => {
          onEditActivity(activity.id);
        }}
        onDeleteItem={(activity) => {
          onConfirmDeleteActivity(activity.id);
        }}
      />
    </Container>
  );
};

const Container = styled.div`
  max-width: 100%;
  width: 100%;
  height: 85vh;
  padding: 1em;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  box-shadow:
    0px 4px 8px rgba(0, 0, 0, 0.2),
    inset 0px 2px 4px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  overflow-y: auto;

  .title-wrapper {
    font-size: 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5em;

    .text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .actions {
      display: flex;
      gap: 0.5em;

      button {
        padding: 0.3em 0.5em;
        font-size: 0.8em;
        cursor: pointer;

        @media (max-width: 480px) {
          font-size: 0.7em;
          padding: 0.2em 0.4em;
        }
      }
    }
  }

  @media (max-width: 768px) {
    height: auto;
    padding: 0.5em;
    border: 3px solid rgba(255, 255, 255, 0.3);

    .title-wrapper {
      font-size: 0.9em;

      .text {
        font-size: 0.85em;
      }
    }
  }

  @media (max-width: 480px) {
    padding: 0.5em;
    border-radius: 5px;

    .title-wrapper {
      font-size: 0.8em;

      .text {
        font-size: 0.8em;
      }
    }
  }
`;
