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
import { fetchUsersByCip } from "../../firebase/collections";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";

export const AssistancesIntegration = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();

  const [assistances = [], assistancesLoading, assistancesError] =
    useCollectionData(assistancesRef.where("isDeleted", "==", false));

  const [searchCIP, setSearchCIP] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const onSearchUser = async (cip) => {
    if (cip.length !== 9 || isNaN(Number(cip))) {
      notification({
        type: "warning",
        message: "Ingrese un CIP válido (9 dígitos)",
      });
      return;
    }

    setLoadingUser(true);

    try {
      const fetchedUsers = await fetchUsersByCip(cip);
      if (fetchedUsers.length > 0) {
        setUsers(fetchedUsers);
        setSelectedUser(fetchedUsers[0]);
      } else {
        notification({
          type: "warning",
          message: "No se encontró un usuario con ese CIP",
        });
      }
    } catch (error) {
      console.error("Error fetching user by CIP:", error);
      notification({ type: "error", message: "Error buscando usuario" });
    } finally {
      setLoadingUser(false);
    }
  };

  const onResetView = () => {
    setSelectedUser(null);
    setSearchCIP("");
    setUsers([]);
  };

  useEffect(() => {
    assistancesError && notification({ type: "error" });
  }, [assistancesError]);

  const onNavigateGoTo = (pathname = "/") => navigate(pathname);

  const filteredAssistances = selectedUser
    ? assistances.filter((assistance) => assistance.user.id === selectedUser.id)
    : assistances;

  if (loadingUser) return <Spinner />;
  if (assistancesLoading) return <Spinner />;

  return (
    <Assistances
      user={authUser}
      onNavigateGoTo={onNavigateGoTo}
      assistancesLoading={assistancesLoading}
      assistances={filteredAssistances}
      searchCIP={searchCIP}
      setSearchCIP={setSearchCIP}
      onSearchUser={onSearchUser}
      onResetView={onResetView}
      selectedUser={selectedUser}
    />
  );
};

const Assistances = ({
  user,
  onNavigateGoTo,
  assistances,
  assistancesLoading,
  searchCIP,
  setSearchCIP,
  onSearchUser,
  onResetView,
  selectedUser,
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
              <div className="user-search">
                <label htmlFor="cip-search">Buscar por CIP:</label>
                <input
                  id="cip-search"
                  type="text"
                  placeholder="Ingrese CIP (9 dígitos)"
                  value={searchCIP}
                  onChange={(e) => setSearchCIP(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && onSearchUser(searchCIP)
                  }
                />
                <Button onClick={() => onSearchUser(searchCIP)}>Buscar</Button>
                {selectedUser && (
                  <Button onClick={onResetView} className="reset-button">
                    Ver todas las asistencias
                  </Button>
                )}
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

  .user-search {
    display: flex;
    align-items: center;
    gap: 0.5em;
    margin-top: 1em;

    label {
      font-weight: bold;
      white-space: nowrap;
    }

    input {
      padding: 0.5em;
      border: 1px solid #ccc;
      border-radius: 4px;
      flex-shrink: 1;
      min-width: 200px;
    }

    button {
      padding: 0.5em 1em;
    }
  }

  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      align-items: flex-start;
    }
    .user-search {
      flex-wrap: wrap;
    }
    .button {
      font-size: 14px;
      padding: 8px 16px;
    }
  }
`;
