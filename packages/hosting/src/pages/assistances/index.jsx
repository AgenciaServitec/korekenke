import React, { useEffect, useState } from "react";
import {
  Acl,
  Button,
  Col,
  Legend,
  notification,
  Row,
  Spinner,
  Title,
} from "../../components";
import { useNavigate } from "react-router";
import { useAuthentication } from "../../providers";
import { useCollectionData } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { AssistancesTable } from "./AssistancesTable";
import { fetchUsersByCip } from "../../firebase/collections";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { isEmpty } from "lodash";
import { useDebounce, useQueriesState } from "../../hooks";
import { AssistancesFilter } from "./Assistances.Filter";
import { AssistancesFinder } from "./AssistancesFinder";
import dayjs from "dayjs";
import { assistancesQuery } from "./_utils";

export const AssistancesIntegration = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();
  const [searchFields, setSearchFields] = useQueriesState({
    cip: undefined,
    fromDate: dayjs().format("DD-MM-YYYY"),
    toDate: dayjs().format("DD-MM-YYYY"),
  });

  const debouncedSearchFields = useDebounce(searchFields, 750);

  // assistancesRef.where("isDeleted", "==", false)
  const [assistances = [], assistancesLoading, assistancesError] =
    useCollectionData(
      assistancesQuery({
        cip: debouncedSearchFields.cip,
        fromDate: debouncedSearchFields.fromDate,
        toDate: debouncedSearchFields.toDate,
      }),
    );

  console.log("assistancesError: ", assistancesError);

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

  const onNavigateGoTo = (pathname = "/") => navigate(pathname);

  const assistancesView = selectedUser
    ? assistances.filter((assistance) => assistance.user.id === selectedUser.id)
    : assistances;

  if (loadingUser || assistancesLoading) return <Spinner fullscreen />;

  return (
    <Assistances
      user={authUser}
      onNavigateGoTo={onNavigateGoTo}
      assistancesLoading={assistancesLoading}
      assistances={assistancesView}
      searchCIP={searchCIP}
      setSearchCIP={setSearchCIP}
      onSearchUser={onSearchUser}
      onResetView={onResetView}
      selectedUser={selectedUser}
      searchFields={searchFields}
      setSearchFields={setSearchFields}
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
  searchFields,
  setSearchFields,
}) => {
  const [filterFields, setFilterFields] = useQueriesState({
    date: "all",
    type: "all",
    cip: "all",
  });

  const mapAssistancesView = (assistances) => {
    const mapView = {
      assistances: assistances,
      filter(filterFields) {
        mapView.assistances = filteredAssistances(
          mapView.assistances,
          filterFields,
        );
        return mapView;
      },
    };

    return mapView;
  };

  const assistancesView =
    mapAssistancesView(assistances).filter(filterFields).assistances;

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
            <Col span={24}>
              <span>{assistancesView.length} Resultados</span>
            </Col>
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
            <Legend title="Busqueda">
              <AssistancesFinder
                searchFields={searchFields}
                onSearch={setSearchFields}
              />
            </Legend>
          </Col>
          <Col span={24}>
            <Legend title="Filtros">
              <AssistancesFilter
                assistances={assistancesView}
                filterFields={filterFields}
                onFilter={setFilterFields}
              />
            </Legend>
          </Col>
          <Col span={24}>
            <AssistancesTable
              assistances={assistancesView}
              user={user}
              loading={assistancesLoading}
            />
          </Col>
        </Row>
      </Container>
    </Acl>
  );
};

const filteredAssistances = (assistances, filterFields) =>
  assistances
    .filter((assistance) =>
      filterFields.type === "all"
        ? true
        : filterFields.type === assistance.type,
    )
    .filter((assistance) =>
      filterFields.date === "all"
        ? true
        : filterFields.date === assistance.date,
    )
    .filter((assistance) =>
      filterFields.cip === "all"
        ? true
        : filterFields.cip === assistance.user.cip,
    );

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
