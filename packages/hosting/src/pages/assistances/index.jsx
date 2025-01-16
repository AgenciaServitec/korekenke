import React, { useEffect, useState } from "react";
import {
  Acl,
  Button,
  Col,
  notification,
  Row,
  Spinner,
  Title,
} from "../../components";
import { useAuthentication } from "../../providers";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { assistancesRef } from "../../firebase/collections/assistance";
import styled from "styled-components";
import { AssistancesTable } from "./AssistancesTable";
import { fetchUsersByCip } from "../../firebase/collections";
import { isEmpty } from "lodash";

export const AssistancesIntegration = () => {
  const { authUser } = useAuthentication();

  const [assistances = [], assistancesLoading, assistancesError] =
    useCollectionData(assistancesRef.where("isDeleted", "==", false));

  const [searchCIP, setSearchCIP] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    assistancesError && notification({ type: "error" });
  }, [assistancesError]);

  const onSearchUser = async (cip) => {
    try {
      setLoadingUser(true);

      if (isEmpty(cip) && cip.length !== 9) {
        return notification({
          type: "warning",
          message: "Ingrese un CIP válido (9 dígitos)",
        });
      }

      const fetchedUsers = await fetchUsersByCip(cip);
      if (fetchedUsers.length > 0) return setSelectedUser(fetchedUsers[0]);

      notification({
        type: "warning",
        message: "No se encontró un usuario con ese CIP",
      });
    } catch (error) {
      console.error("ErrorOnSearchUser:", error);
      notification({ type: "error" });
    } finally {
      setLoadingUser(false);
    }
  };

  const onResetView = () => {
    setSelectedUser(null);
    setSearchCIP("");
  };

  const filteredAssistances = selectedUser
    ? assistances.filter((assistance) => assistance.user.id === selectedUser.id)
    : assistances;

  if (loadingUser || assistancesLoading) return <Spinner fullscreen />;

  return (
    <Assistances
      user={authUser}
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
  }
`;
