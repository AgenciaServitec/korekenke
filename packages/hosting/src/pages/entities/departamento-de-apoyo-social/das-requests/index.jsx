import React, { useEffect, useState } from "react";
import {
  Acl,
  Button,
  Col,
  Flex,
  Legend,
  modalConfirm,
  notification,
  Row,
  Space,
  Tag,
  Title,
} from "../../../../components";
import { DasRequestsTable } from "./DasRequests.Table";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useNavigate } from "react-router";
import {
  useDebounce,
  useDefaultFirestoreProps,
  useDevice,
  useQueriesState,
} from "../../../../hooks";
import { updateDasRequest } from "../../../../firebase/collections";
import {
  ModalProvider,
  useAuthentication,
  useModal,
} from "../../../../providers";
import { ReplyDasRequestModal } from "./ReplyDasRequest";
import { ReplyDasRequestInformationModal } from "./ReplyDasRequestInformation";
import { DasRequestProceedsModal } from "./DasRequestProceedsModal";
import { DasRequestsFinder } from "./DasRequests.Finder";
import { DasRequestsFilter } from "./DasRequests.Filter";
import { dasRequestsQuery } from "./_utils";
import { DasRequestStatus } from "../../../../data-list";
import { DasRequestFilterByDate } from "./DasRequest.FilterByDate";

export const DasRequestsListIntegration = () => {
  const navigate = useNavigate();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const { authUser } = useAuthentication();
  const [searchFields, setSearchFields] = useQueriesState({
    dasRequestInformation: undefined,
  });

  const debouncedSearchFields = useDebounce(searchFields, 750);

  const [dasRequests = [], dasRequestsLoading, dasRequestsError] =
    useCollectionData(
      dasRequestsQuery({
        dasRequestInformation:
          debouncedSearchFields.dasRequestInformation?.toLowerCase(),
        fromDate: debouncedSearchFields.fromDate,
        toDate: debouncedSearchFields.toDate,
      }),
    );

  useEffect(() => {
    if (dasRequestsError) {
      console.error("dasRequestsError: ", dasRequestsError);
      notification({ type: "error" });
    }
  }, [dasRequestsError]);

  const navigateTo = (pathname = "new") => navigate(pathname);
  const onEditDasRequest = (dasRequest) => navigateTo(dasRequest.id);

  const onConfirmDeleteDasRequest = async (dasRequest) => {
    modalConfirm({
      title: "¿Estás seguro que quieres eliminar la solicitud?",
      onOk: async () => {
        await updateDasRequest(
          dasRequest.id,
          assignDeleteProps({ isDeleted: true }),
        );
      },
    });
  };

  return (
    <ModalProvider>
      <DasRequestsList
        dasRequests={dasRequests}
        dasRequestsLoading={dasRequestsLoading}
        onEditDasRequest={onEditDasRequest}
        onDeleteDasRequest={onConfirmDeleteDasRequest}
        user={authUser}
        searchFields={searchFields}
        setSearchFields={setSearchFields}
      />
    </ModalProvider>
  );
};

const DasRequestsList = ({
  dasRequests,
  dasRequestsLoading,
  onEditDasRequest,
  onDeleteDasRequest,
  user,
  searchFields,
  setSearchFields,
}) => {
  const { isTablet } = useDevice();
  const { onShowModal, onCloseModal } = useModal();

  const [filterCount, setFilterCount] = useState([]);
  const [filterStates, setFilterStates] = useState({});
  const [filterFields, setFilterFields] = useQueriesState({
    status: "all",
  });

  const onResetFilters = () => {
    setSearchFields({
      dasRequestInformation: undefined,
      fromDate: undefined,
      toDate: undefined,
    });
    setFilterFields({
      status: "all",
    });
  };

  const mapDasRequestsView = (dasRequests) => {
    const mapView = {
      dasRequests: dasRequests,
      filter(filterFields) {
        mapView.dasRequests = filteredDasRequests(
          mapView.dasRequests,
          filterFields,
        );
        return mapView;
      },
    };

    return mapView;
  };

  const dasRequestsView =
    mapDasRequestsView(dasRequests).filter(filterFields)?.dasRequests || [];

  const onShowDasRequestProceedsModal = (dasRequest) => {
    onShowModal({
      title: "Evaluación de la solicitud",
      width: `${isTablet ? "100%" : "50%"}`,
      centered: false,
      top: 0,
      padding: 0,
      clearOnDestroy: true,
      onRenderBody: () => (
        <DasRequestProceedsModal
          onCloseModal={onCloseModal}
          dasRequest={dasRequest}
        />
      ),
    });
  };

  const onShowReplyDasRequestModal = (dasRequest) => {
    onShowModal({
      title: "Responder solicitud",
      width: `${isTablet ? "100%" : "50%"}`,
      centered: false,
      top: 0,
      padding: 0,
      clearOnDestroy: true,
      onRenderBody: () => (
        <ReplyDasRequestModal
          onCloseModal={onCloseModal}
          dasRequest={dasRequest}
        />
      ),
    });
  };

  const onShowReplyDasRequestInformationModal = (dasRequest) => {
    onShowModal({
      title: "Detalle de respuesta",
      width: `${isTablet ? "100%" : "50%"}`,
      centered: false,
      top: 0,
      padding: 0,
      clearOnDestroy: true,
      onRenderBody: () => (
        <ReplyDasRequestInformationModal response={dasRequest?.response} />
      ),
    });
  };

  return (
    <Acl
      category="public"
      subCategory="dasRequests"
      name="/das-requests"
      redirect
    >
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Title level={3}>Lista de Solicitudes</Title>
        </Col>
        <Col span={24}>
          <Legend title="Busqueda">
            <Row gutter={[16, 16]}>
              <Col span={24} md={8}>
                <DasRequestsFinder
                  searchFields={searchFields}
                  onSearch={setSearchFields}
                />
              </Col>
              <Col span={24} md={16}>
                <DasRequestFilterByDate
                  searchFields={searchFields}
                  onSearch={setSearchFields}
                />
              </Col>
            </Row>
          </Legend>
        </Col>
        <Col span={24}>
          <Legend title="Filtros">
            <DasRequestsFilter
              dasRequests={dasRequestsView}
              filterFields={filterFields}
              onFilter={setFilterFields}
            />
          </Legend>
        </Col>
        <Col span={24} sm={18}>
          <Space direction="vertical" size={12}>
            <div>
              <strong>{filterCount} </strong>Resultados
            </div>
            {filterStates && (
              <div>
                {Object.entries(DasRequestStatus).map(([statusKey, _]) => {
                  const statusConfig = DasRequestStatus[statusKey];
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
          <DasRequestsTable
            filterCount={filterCount}
            setFilterCount={setFilterCount}
            dasRequests={dasRequestsView}
            onEditDasRequest={onEditDasRequest}
            onDeleteDasRequest={onDeleteDasRequest}
            onShowDasRequestProceedsModal={onShowDasRequestProceedsModal}
            onShowReplyDasRequestModal={onShowReplyDasRequestModal}
            onShowReplyDasRequestInformationModal={
              onShowReplyDasRequestInformationModal
            }
            setFilterStates={setFilterStates}
            dasRequestsLoading={dasRequestsLoading}
            user={user}
          />
        </Col>
      </Row>
    </Acl>
  );
};

const filteredDasRequests = (dasRequests, filterFields) =>
  dasRequests.filter((dasRequest) =>
    filterFields?.status === "all"
      ? true
      : filterFields.status === dasRequest.status,
  );
