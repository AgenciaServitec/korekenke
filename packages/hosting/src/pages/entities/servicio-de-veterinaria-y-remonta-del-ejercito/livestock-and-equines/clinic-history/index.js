import React, { useEffect, useState } from "react";
import {
  Acl,
  AddButton,
  Card,
  Col,
  IconAction,
  modalConfirm,
  notification,
  Row,
} from "../../../../../components";
import { useDefaultFirestoreProps, useQueryString } from "../../../../../hooks";
import styled from "styled-components";
import { ClinicHistoryTable } from "./ClinicHistoryTable";
import { firestore } from "../../../../../firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { ClinicHistoryModalComponent } from "./ClinicHistoryModalComponent";
import { useParams } from "react-router-dom";
import {
  fetchUser,
  updateClinicHistory,
} from "../../../../../firebase/collections";
import { useAuthentication, useGlobalData } from "../../../../../providers";
import { faArrowLeft, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { LivestockAndEquineInformation } from "../../../../../components/ui/entities";
import { pathnameWithCommand } from "../../../../../utils";
import { ClinicHistoryCheckedModalComponent } from "./ClinicHistoryCheckedModalComponent";

export const ClinicHistoryIntegration = () => {
  const { authUser } = useAuthentication();
  const { commandId, livestockAndEquineId } = useParams();
  const navigate = useNavigate();
  const [clinicHistoryId, setClinicHistoryId] = useQueryString(
    "clinicHistoryId",
    ""
  );
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const { livestockAndEquines, departments } = useGlobalData();

  const [isVisibleModal, setIsVisibleModal] = useState({
    historyClinicModal: false,
    historyClinicCheckModal: false,
  });
  const [livestockAndEquine, setLivestockAndEquine] = useState({});
  const [currentHistoryClinic, setCurrentHistoryClinic] = useState(null);
  const [PEL_VET_DEL_RC_MDN_EPR_boss, setPEL_VET_DEL_RC_MDN_EPR_boss] =
    useState(null);

  useEffect(() => {
    (async () => {
      const PEL_VET_DEL_RC_MDN_EPR_department = departments.find(
        (department) => department?.id === "BP0Z7ZSLIXyz1pGYFwhU"
      );

      if (!PEL_VET_DEL_RC_MDN_EPR_department?.bossId) return;

      const userBoss = await fetchUser(
        PEL_VET_DEL_RC_MDN_EPR_department.bossId
      );

      setPEL_VET_DEL_RC_MDN_EPR_boss(userBoss);
    })();
  }, []);

  const [clinicHistories = [], clinicHistoriesLoading, clinicHistoriesError] =
    useCollectionData(
      firestore
        .collection("livestock-and-equines")
        .doc(livestockAndEquineId)
        .collection("clinic-history")
        .where("isDeleted", "==", false)
    );

  const onNavigateGoTo = (pathname) => navigate(pathname);

  useEffect(() => {
    setLivestockAndEquine(
      livestockAndEquines.find(
        (_livestockAndEquine) => _livestockAndEquine.id === livestockAndEquineId
      ) || {}
    );
  }, [livestockAndEquineId]);

  useEffect(() => {
    clinicHistoriesError && notification({ type: "error" });
  }, [clinicHistoriesError]);

  useEffect(() => {
    const clinicHistory = clinicHistories.find(
      (clinicHistory) => clinicHistory?.id === clinicHistoryId
    );

    if (!clinicHistory) return setCurrentHistoryClinic(null);

    setCurrentHistoryClinic(clinicHistory);
  }, [
    isVisibleModal.historyClinicModal,
    isVisibleModal.historyClinicCheckModal,
  ]);

  const onDeleteClinicHistory = async (clinicHistory) => {
    try {
      await updateClinicHistory(
        livestockAndEquineId,
        clinicHistory.id,
        assignDeleteProps({ isDeleted: true })
      );
    } catch (e) {
      console.error("ErrorDeleteClinicHistory: ", e);
    }
  };

  const onConfirmRemoveClinicHistory = (clinicHistory) =>
    modalConfirm({
      content: "El registro se eliminará",
      onOk: async () => {
        await onDeleteClinicHistory(clinicHistory);
      },
    });

  const onSetVisibleHistoryClinicModal = () =>
    setIsVisibleModal({
      historyClinicModal: !isVisibleModal.historyClinicModal,
    });

  const onSetVisibleHistoryClinicCheckModal = () =>
    setIsVisibleModal({
      historyClinicCheckModal: !isVisibleModal.historyClinicCheckModal,
    });

  return (
    <Acl
      category="servicio-de-veterinaria-y-remonta-del-ejercito"
      subCategory="clinicHistory"
      name="/livestock-and-equines/:livestockAndEquineId/clinic-history"
      redirect
    >
      <Container gutter={[16, 16]}>
        <Col span={24}>
          <IconAction
            icon={faArrowLeft}
            onClick={() =>
              onNavigateGoTo(
                pathnameWithCommand(
                  commandId,
                  `/entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines`
                )
              )
            }
          />
        </Col>
        <Col span={24}>
          <Card
            title={<span style={{ fontSize: "1.5em" }}>Datos del Equino</span>}
            bordered={false}
            type="inner"
          >
            <LivestockAndEquineInformation
              livestockAndEquine={livestockAndEquine}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col span={24} sm={8}>
              <Acl
                category="servicio-de-veterinaria-y-remonta-del-ejercito"
                subCategory="clinicHistory"
                name="/livestock-and-equines/:livestockAndEquineId/clinic-history/:clinicHistoryId"
              >
                <AddButton
                  onClick={() => {
                    setClinicHistoryId("new");
                    onSetVisibleHistoryClinicModal();
                  }}
                  title="Historia Clínica"
                  margin="0"
                />
              </Acl>
            </Col>

            <Col
              span={24}
              sm={16}
              style={{ display: "flex", justifyContent: "end" }}
            >
              <Acl
                category="servicio-de-veterinaria-y-remonta-del-ejercito"
                subCategory="clinicHistory"
                name="/livestock-and-equines/:livestockAndEquineId/clinic-history/pdf-clinic-history"
              >
                <IconAction
                  tooltipTitle="Pdf del historial clínico"
                  icon={faFilePdf}
                  styled={{ color: (theme) => theme.colors.error }}
                  onClick={() => onNavigateGoTo("pdf-clinic-history")}
                />
              </Acl>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <ClinicHistoryTable
            clinicHistories={clinicHistories}
            onConfirmRemoveClinicHistory={onConfirmRemoveClinicHistory}
            onSetIsVisibleModal={onSetVisibleHistoryClinicModal}
            onSetIsVisibleCheckModal={onSetVisibleHistoryClinicCheckModal}
            onSetClinicHistoryId={setClinicHistoryId}
            loading={clinicHistoriesLoading}
            user={authUser}
            PEL_VET_DEL_RC_MDN_EPR_boss={PEL_VET_DEL_RC_MDN_EPR_boss}
          />
        </Col>
        <ClinicHistoryModalComponent
          key={isVisibleModal.historyClinicModal}
          isVisibleModal={isVisibleModal}
          onSetIsVisibleModal={onSetVisibleHistoryClinicModal}
          onSetClinicHistoryId={setClinicHistoryId}
          clinicHistoryId={clinicHistoryId}
          currentHistoryClinic={currentHistoryClinic}
          livestockAndEquineId={livestockAndEquineId}
        />
        <ClinicHistoryCheckedModalComponent
          key={isVisibleModal.historyClinicCheckModal}
          user={authUser}
          isVisibleModal={isVisibleModal}
          onSetIsVisibleModal={onSetVisibleHistoryClinicCheckModal}
          onSetClinicHistoryId={setClinicHistoryId}
          livestockAndEquineId={livestockAndEquineId}
          currentHistoryClinic={currentHistoryClinic}
        />
      </Container>
    </Acl>
  );
};

const Container = styled(Row)``;
