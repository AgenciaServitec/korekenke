import React, { useEffect } from "react";
import {
  Acl,
  Button,
  Col,
  Legend,
  notification,
  Row,
  Spin,
  Title,
} from "../../components";
import { useNavigate } from "react-router";
import { useAuthentication } from "../../providers";
import { useCollectionData } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { useDebounce, useQueriesState } from "../../hooks";
import { AssistancesFilter } from "./Assistances.Filter";
import { AssistancesFinder } from "./Assistances.Finder";
import { AssistancesTable } from "./Assistances.Table";
import dayjs from "dayjs";
import { assistancesQuery } from "./_utils";

export const AssistancesIntegration = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();
  const [searchFields, setSearchFields] = useQueriesState({
    cip: undefined,
    fromDate: dayjs().format("DD-MM-YYYY HH:mm"),
    toDate: dayjs().format("DD-MM-YYYY HH:mm"),
  });

  const debouncedSearchFields = useDebounce(searchFields, 750);

  const [assistances = [], assistancesLoading, assistancesError] =
    useCollectionData(
      assistancesQuery({
        cip: debouncedSearchFields.cip,
        fromDate: debouncedSearchFields.fromDate,
        toDate: debouncedSearchFields.toDate,
      }),
    );

  useEffect(() => {
    assistancesError && notification({ type: "error" });
  }, [assistancesError]);

  const onNavigateGoTo = (pathname = "/") => navigate(pathname);

  return (
    <Assistances
      user={authUser}
      onNavigateGoTo={onNavigateGoTo}
      assistances={assistances}
      assistancesLoading={assistancesLoading}
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
  searchFields,
  setSearchFields,
}) => {
  const [filterFields, setFilterFields] = useQueriesState({
    workPlace: "all",
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

  const assistancesView = (
    mapAssistancesView(assistances).filter(filterFields)?.assistances || []
  ).filter((assistance) => {
    if (["super_admin"].includes(user.roleCode)) return true;
    if (assistance.user.id === user.id) return assistance;
    if (["manager"].includes(user.roleCode))
      return assistance.user.department === user.department;
    return false;
  });

  return (
    <Acl
      redirect
      category="default"
      subCategory="assistances"
      name="/assistances"
    >
      <Spin spinning={assistancesLoading}>
        <Container>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Button
                onClick={() => onNavigateGoTo("/assistances/assistance")}
                type="primary"
                className="btn-assistance"
                size="large"
              >
                <FontAwesomeIcon icon={faSignInAlt} />
                Marcar mi asistencia
              </Button>
            </Col>
            <Col span={24}>
              <Title level={2}>Lista de asistencias</Title>
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
      </Spin>
    </Acl>
  );
};

const filteredAssistances = (assistances, filterFields) =>
  assistances.filter((assistance) =>
    filterFields?.workPlace === "all"
      ? true
      : filterFields.workPlace === assistance.workPlace,
  );

const Container = styled.div`
  .btn-assistance {
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
      background-color: #0c8511 !important;
      transform: scale(1.05);
    }
  }

  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      align-items: flex-start;
    }

    .button {
      font-size: 14px;
      padding: 8px 16px;
    }
  }
`;
