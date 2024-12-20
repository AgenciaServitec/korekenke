import React, { useEffect, useState } from "react";
import {
  Acl,
  Button,
  Col,
  Row,
  notification,
  Title,
  Spinner,
} from "../../components";
import { useNavigate } from "react-router";
import { useAuthentication } from "../../providers";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { assistancesRef } from "../../firebase/collections/assistance";
import styled from "styled-components";
import { AssistancesTable } from "./AssistancesTable";
import { fetchUsers } from "../../firebase/collections";
import { userFullName } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";

export const AssistancesIntegration = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();

  const [assistances = [], assistancesLoading, assistancesError] =
    useCollectionData(assistancesRef.where("isDeleted", "==", false));

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers();
        const filteredUsers =
          authUser.roleCode === "manager"
            ? fetchedUsers.filter(
                (user) => user.department === authUser.department,
              )
            : fetchedUsers;

        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setUsersLoading(false);
      }
    };

    (async () => {
      await loadUsers();
    })();
  }, [authUser.roleCode, authUser.department]);

  useEffect(() => {
    assistancesError && notification({ type: "error" });
  }, [assistancesError]);

  const onNavigateGoTo = (pathname = "/") => navigate(pathname);

  const filteredAssistances = selectedUser
    ? assistances.filter((assistance) => assistance.user.id === selectedUser.id)
    : assistances;

  if (usersLoading) return <Spinner />;

  return (
    <Assistances
      user={authUser}
      onNavigateGoTo={onNavigateGoTo}
      assistancesLoading={assistancesLoading}
      assistances={filteredAssistances}
      users={users}
      selectedUser={selectedUser}
      onSelectUser={setSelectedUser}
    />
  );
};

const Assistances = ({
  user,
  onNavigateGoTo,
  assistances,
  assistancesLoading,
  users,
  selectedUser,
  onSelectUser,
}) => {
  return (
    <Acl
      redirect
      category="default"
      subCategory="assistances"
      name="/assistances"
    >
      <Container>
        <Button
          onClick={() => onNavigateGoTo("/assistances/assistance")}
          className="button"
        >
          <FontAwesomeIcon icon={faSignInAlt} />
          Marcar mi asistencia
        </Button>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div className="header-content">
              <Title level={2}>LISTA DE ASISTENCIAS</Title>
            </div>
            {["super_admin", "manager"].includes(user.roleCode) && (
              <div className="user-selector">
                <label htmlFor="user-select">Ver asistencias de:</label>
                <select
                  id="user-select"
                  value={selectedUser?.id || ""}
                  onChange={(e) =>
                    onSelectUser(users.find((u) => u.id === e.target.value))
                  }
                >
                  <option value="">Todos los usuarios</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {userFullName(u)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </Col>
          <Col span={24}>
            <AssistancesTable
              user={user}
              loading={assistancesLoading}
              assistances={assistances}
            />
          </Col>
        </Row>
      </Container>
    </Acl>
  );
};

const Container = styled.div`
  .button {
    background-color: #17b21e;
    color: white;
    font-size: 16px;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    margin-bottom: 10px;

    &:hover {
      background-color: #ffffff;
      transform: scale(1.05);
    }
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1em;
    overflow: hidden;
  }

  .user-selector {
    display: flex;
    align-items: center;
    gap: 0.5em;
    flex-grow: 1;
    justify-content: flex-start;
    margin-top: 1em;

    label {
      font-weight: bold;
      white-space: nowrap;
    }

    select {
      padding: 0.5em;
      border: 1px solid #ccc;
      border-radius: 4px;
      min-width: 150px;
      flex-shrink: 1;
    }
  }

  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      align-items: flex-start;
    }

    .user-selector {
      margin-top: 1em;
      width: 100%;
    }
    .button {
      font-size: 14px;
      padding: 8px 16px;
    }
  }
`;
