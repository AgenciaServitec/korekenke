import React, { useEffect, useState } from "react";
import {
  Acl,
  modalConfirm,
  notification,
  Spin,
  Row,
  Col,
  AddButton,
  Legend,
  Space,
  Tag,
  Flex,
  Button,
} from "../../components";
import { useNavigate } from "react-router";
import {
  useDebounce,
  useDefaultFirestoreProps,
  useDevice,
  useQueriesState,
} from "../../hooks";
import {
  ModalProvider,
  useAuthentication,
  useGlobalData,
  useModal,
} from "../../providers";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { updateVisit } from "../../firebase/collections";
import { VisitsTable } from "./VisitsTable";
import { ExitChecker } from "./ExitChecker";
import { VisitReply } from "./VisitReply";
import { VisitsFilter } from "./Visits.Filter";
import { VisitsListFinder } from "./VisitsList.Finder";
import { VisitsStatus } from "../../data-list";
import { visitsListQuery } from "./utils";
import { VisitedObservation } from "./VisitedObservation";
import { VisitedObservationView } from "./VisitedObservationView";
import { VisitsDoorFilter } from "./Visits.DoorFilter";

export const Visits = () => {
  const navigate = useNavigate();
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const { authUser } = useAuthentication();

  const [searchFields, setSearchFields] = useQueriesState({
    visitInformation: undefined,
  });

  const debouncedSearchFields = useDebounce(searchFields, 750);

  const [visits = [], visitsLoading, visitsError] = useCollectionData(
    visitsListQuery({
      visitInformation: debouncedSearchFields.visitInformation?.toLowerCase(),
    }),
  );

  useEffect(() => {
    if (visitsError) {
      console.error("visitsError: ", visitsError);
      notification({
        type: "error",
      });
    }
  }, [visitsError]);

  const onNavigateTo = (visitId) => navigate(visitId);

  const onAddVisit = () => navigate("new");

  const onEditVisit = (visitId) => onNavigateTo(visitId);

  const onConfirmDeleteVisit = async (visitId) =>
    modalConfirm({
      title: "¿Estás seguro de eliminar esta visita?",
      onOk: async () => {
        await updateVisit(visitId, assignDeleteProps({ isDeleted: true }));
        notification({ type: "success" });
      },
    });

  return (
    <Spin size="large" spinning={visitsLoading}>
      <ModalProvider>
        <VisitsList
          user={authUser}
          visits={visits}
          onAddVisit={onAddVisit}
          onEditVisit={onEditVisit}
          onConfirmDeleteVisit={onConfirmDeleteVisit}
          searchFields={searchFields}
          setSearchFields={setSearchFields}
        />
      </ModalProvider>
    </Spin>
  );
};

const VisitsList = ({
  user,
  onAddVisit,
  onEditVisit,
  onConfirmDeleteVisit,
  visits,
  searchFields,
  setSearchFields,
}) => {
  const { isTablet } = useDevice();
  const { onShowModal, onCloseModal } = useModal();

  const [filterCount, setFilterCount] = useState([]);
  const [filterStates, setFilterStates] = useState({});
  const [filterFields, setFilterFields] = useQueriesState({
    status: "all",
    door: "all",
  });

  const onResetFilters = () => {
    setSearchFields({
      visitInformation: undefined,
    });
    setFilterFields({
      status: "all",
      door: "all",
    });
  };

  const mapVisitsView = (visits) => {
    const mapView = {
      visits: visits,
      filter(filterFields) {
        mapView.visits = filteredVisits(mapView.visits, filterFields);
        return mapView;
      },
    };

    return mapView;
  };

  const visitsView = mapVisitsView(visits).filter(filterFields)?.visits || [];

  const onConfirmIOChecker = (visit, type) => {
    onShowModal({
      title: `Registrar ${type === "entry" ? "Entrada" : "Salida"}`,
      textAlign: "center",
      width: "50%",
      onRenderBody: () => (
        <ExitChecker visit={visit} onCloseModal={onCloseModal} type={type} />
      ),
    });
  };

  const onShowVisitReplyModal = (visit) => {
    onShowModal({
      title: "Solicitud de Visita",
      width: `${isTablet ? "100%" : "50%"}`,
      centered: false,
      top: 0,
      padding: 0,
      clearOnDestroy: true,
      onRenderBody: () => (
        <VisitReply onCloseModal={onCloseModal} visit={visit} />
      ),
    });
  };

  const onShowVisitedObservation = (visit) => {
    onShowModal({
      centered: true,
      top: 0,
      padding: 0,
      title: "Agregar Observation",
      width: `${isTablet ? "90%" : "50%"}`,
      onRenderBody: () => (
        <VisitedObservation visit={visit} onCloseModal={onCloseModal} />
      ),
    });
  };

  const onShowVisitedObservationView = (visit) => {
    onShowModal({
      centered: true,
      top: 0,
      padding: 0,
      title: `Observacion de ${visit.personVisited.firstName}`,
      width: `${isTablet ? "90%" : "50%"}`,
      onRenderBody: () => <VisitedObservationView visit={visit} />,
    });
  };

  return (
    <Acl category="public" subCategory="visits" name="/visits" redirect>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <AddButton onClick={onAddVisit} type="primary" title="Visita" />
        </Col>
        <Col span={24}>
          <Legend title="Busqueda">
            <VisitsListFinder
              searchFields={searchFields}
              onSearch={setSearchFields}
            />
          </Legend>
        </Col>
        <Col span={24}>
          <Legend title="Filtros">
            <Row gutter={[16, 16]}>
              <Col span={24} md={8}>
                <VisitsFilter
                  visits={visitsView}
                  filterFields={filterFields}
                  onFilter={setFilterFields}
                />
              </Col>
              <Col span={24} md={8}>
                <VisitsDoorFilter
                  filterFields={filterFields}
                  onFilter={setFilterFields}
                />
              </Col>
            </Row>
          </Legend>
        </Col>
        <Col span={24} sm={18}>
          <Space direction="vertical" size={12}>
            <div>
              <strong>{filterCount} </strong>Resultados
            </div>
            {filterStates && (
              <div>
                {Object.entries(VisitsStatus).map(([statusKey, _]) => {
                  const statusConfig = VisitsStatus[statusKey];
                  const count = filterStates[statusKey] || 0;

                  if (filterFields.status !== "all" && count <= 0) return null;

                  return (
                    <Tag
                      key={statusKey}
                      color={statusConfig?.color}
                      style={{ marginRight: 8, marginBottom: 4 }}
                    >
                      {statusConfig?.name}: {count}
                    </Tag>
                  );
                })}
              </div>
            )}
          </Space>
        </Col>
        <Col span={24} sm={6}>
          <Flex align="center" justify="end">
            <Button type="default" onClick={onResetFilters}>
              Limpiar filtros
            </Button>
          </Flex>
        </Col>
        <Col span={24}>
          <VisitsTable
            user={user}
            visits={visitsView}
            onClickAddVisit={onAddVisit}
            onClickEditVisit={onEditVisit}
            onConfirmIOChecker={onConfirmIOChecker}
            onShowVisitReplyModal={onShowVisitReplyModal}
            onClickDeleteVisit={onConfirmDeleteVisit}
            filterCount={filterCount}
            setFilterCount={setFilterCount}
            setFilterStates={setFilterStates}
            onShowVisitedObservation={onShowVisitedObservation}
            onShowVisitedObservationView={onShowVisitedObservationView}
          />
        </Col>
      </Row>
    </Acl>
  );
};

const filteredVisits = (visits, filterFields) =>
  visits.filter((visit) => {
    const matchesStatus =
      filterFields?.status === "all" || visit?.status === filterFields.status;

    const matchesDoor =
      filterFields?.door === "all" || visit?.door === filterFields.door;

    return matchesStatus && matchesDoor;
  });
