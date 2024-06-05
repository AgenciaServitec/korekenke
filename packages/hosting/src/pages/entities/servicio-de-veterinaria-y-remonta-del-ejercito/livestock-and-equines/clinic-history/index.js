import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { AddButton, Card, modalConfirm } from "../../../../../components";
import { useDefaultFirestoreProps, useQueryString } from "../../../../../hooks";
import styled from "styled-components";
import { ClinicHistoryTable } from "./ClinicHistoryTable";
import { ClinicHistoryInformation } from "./ClinicHistoryInformation";
import { firestore } from "../../../../../firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { ClinicHistoryModalComponent } from "./ClinicHistoryModalComponent";
import { useParams } from "react-router-dom";
import { updateClinicHistory } from "../../../../../firebase/collections";

export const ClinicHistoryIntegration = () => {
  const { livestockAndEquineId } = useParams();
  const [clinicHistoryId, setClinicHistoryId] = useQueryString(
    "clinicHistoryId",
    ""
  );
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const [isVisibleModal, setIsVisibleModal] = useState({
    historyClinicModal: false,
  });
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
    <Container gutter={[16, 16]}>
      <Col span={24}>
        <Card>
          <ClinicHistoryInformation />
        </Card>
      </Col>
      <Col span={24} md={6}>
        <AddButton
          onClick={() => {
            setClinicHistoryId("new");
            onSetVisibleHistoryClinicModal();
          }}
          title="Historia Clínica"
          margin="0"
        />
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
        clinicHistories={clinicHistories}
        currentHistoryClinic={currentHistoryClinic}
        isVisibleModal={isVisibleModal}
        onSetIsVisibleModal={onSetVisibleHistoryClinicModal}
        clinicHistoryId={clinicHistoryId}
        onSetClinicHistoryId={setClinicHistoryId}
      />
    </Container>
  );
};

const Container = styled(Row)``;
