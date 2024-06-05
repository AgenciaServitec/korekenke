import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import {
  Acl,
  AddButton,
  Card,
  modalConfirm,
  notification,
} from "../../../../../components";
import { useDefaultFirestoreProps, useQueryString } from "../../../../../hooks";
import styled from "styled-components";
import { ClinicHistoryTable } from "./ClinicHistoryTable";
import { ClinicHistoryInformation } from "./ClinicHistoryInformation";
import { firestore } from "../../../../../firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { ClinicHistoryModalComponent } from "./ClinicHistoryModalComponent";
import { useParams } from "react-router-dom";
import { updateClinicHistory } from "../../../../../firebase/collections";
import { useGlobalData } from "../../../../../providers";

export const ClinicHistoryIntegration = () => {
  const { livestockAndEquineId } = useParams();
  const [clinicHistoryId, setClinicHistoryId] = useQueryString(
    "clinicHistoryId",
    ""
  );
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const { livestockAndEquines } = useGlobalData();

  const [isVisibleModal, setIsVisibleModal] = useState({
    historyClinicModal: false,
  });
  const [livestockAndEquine, setLivestockAndEquine] = useState({});
  const [currentHistoryClinic, setCurrentHistoryClinic] = useState(null);

  const [clinicHistories = [], clinicHistoriesLoading, clinicHistoriesError] =
    useCollectionData(
      firestore
        .collection("livestock-and-equines")
        .doc(livestockAndEquineId)
        .collection("clinic-history")
        .where("isDeleted", "==", false)
    );

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
  }, [isVisibleModal.historyClinicModal]);

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

  return (
    <Acl
      category="servicio-de-veterinaria-y-remonta-del-ejercito"
      subCategory="clinicHistory"
      name="/livestock-and-equines/:livestockAndEquineId/clinic-history"
      redirect
    >
      <Container gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <ClinicHistoryInformation livestockAndEquine={livestockAndEquine} />
          </Card>
        </Col>
        <Col span={24} md={8}>
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
        <Col span={24}>
          <ClinicHistoryTable
            clinicHistories={clinicHistories}
            livestockAndEquineId={livestockAndEquineId}
            loading={clinicHistoriesLoading}
            onConfirmRemoveClinicHistory={onConfirmRemoveClinicHistory}
            onSetIsVisibleModal={onSetVisibleHistoryClinicModal}
            onSetClinicHistoryId={setClinicHistoryId}
          />
        </Col>
        <ClinicHistoryModalComponent
          key={isVisibleModal.historyClinicModal}
          livestockAndEquineId={livestockAndEquineId}
          currentHistoryClinic={currentHistoryClinic}
          isVisibleModal={isVisibleModal}
          onSetIsVisibleModal={onSetVisibleHistoryClinicModal}
          clinicHistoryId={clinicHistoryId}
          onSetClinicHistoryId={setClinicHistoryId}
        />
      </Container>
    </Acl>
  );
};

const Container = styled(Row)``;
