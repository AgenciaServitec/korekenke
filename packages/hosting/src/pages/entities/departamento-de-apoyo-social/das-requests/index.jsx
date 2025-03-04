import React, { useEffect } from "react";
import {
  Acl,
  Col,
  Legend,
  modalConfirm,
  notification,
  Row,
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
import dayjs from "dayjs";
import { DasRequestsFilter } from "./DasRequests.Filter";
import { dasRequestsQuery } from "./_utils";

export const DasRequestsListIntegration = () => {
  const navigate = useNavigate();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const { authUser } = useAuthentication();
  const [searchFields, setSearchFields] = useQueriesState({
    cip: undefined,
    fromDate: dayjs().subtract(30, "days").format("DD-MM-YYYY"),
    toDate: dayjs().format("DD-MM-YYYY"),
  });

  const debouncedSearchFields = useDebounce(searchFields, 750);

  const [dasRequests = [], dasRequestsLoading, dasRequestsError] =
    useCollectionData(
      dasRequestsQuery({
        cip: debouncedSearchFields.cip,
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

  const [filterFields, setFilterFields] = useQueriesState({
    status: "all",
  });

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

  console.log("dasRequestsView: ", dasRequestsView);

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
            <DasRequestsFinder
              searchFields={searchFields}
              onSearch={setSearchFields}
            />
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
        <Col span={24}>
          <DasRequestsTable
            dasRequests={dasRequestsView}
            onEditDasRequest={onEditDasRequest}
            onDeleteDasRequest={onDeleteDasRequest}
            onShowDasRequestProceedsModal={onShowDasRequestProceedsModal}
            onShowReplyDasRequestModal={onShowReplyDasRequestModal}
            onShowReplyDasRequestInformationModal={
              onShowReplyDasRequestInformationModal
            }
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
