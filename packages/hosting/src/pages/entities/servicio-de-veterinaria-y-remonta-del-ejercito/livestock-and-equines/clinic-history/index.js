import React, { useState } from "react";
import { Col, Row } from "antd";
import { AddButton, Card, modalConfirm } from "../../../../../components";
import { useDefaultFirestoreProps } from "../../../../../hooks";
import styled from "styled-components";
import { ClinicHistoryTable } from "./ClinicHistoryTable";
import { ClinicHistoryInformation } from "./ClinicHistoryInformation";
import { firestore } from "../../../../../firebase";
import { useNavigate } from "react-router";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { ClinicHistoryModalComponent } from "./ClinicHistoryModalComponent";

export const ClinicHistoryIntegration = () => {
  const navigate = useNavigate();
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const [visibleForm, setVisibleForm] = useState(false);

  const [
    livestockAndEquines,
    livestockAndEquinesLoading,
    livestockAndEquinesError,
  ] = useCollectionData(
    firestore
      .collection("livestock-and-equines")
      .doc("3817zSlDzCIFyuI94txS")
      .collection("clinic-history")
      .where("isDeleted", "==", false)
  );

  const navigateTo = (liveStockEquinesId) =>
    navigate(`/clinic-history/${liveStockEquinesId}`);

  const onDeleteClinicHistory = async (equine) => {
    try {
      await firestore
        .collection("livestock-and-equines")
        .doc("3817zSlDzCIFyuI94txS")
        .collection("clinic-history")
        .doc(equine.id)
        .update(assignDeleteProps({ isDeleted: true }));
    } catch (e) {
      console.error("ErrorDeleteClinicHistory: ", e);
    }
  };

  const onConfirmRemoveClinicHistory = (equine) =>
    modalConfirm({
      content: "El registro se eliminará",
      onOk: async () => {
        await onDeleteClinicHistory(equine);
      },
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
          onClick={() => setVisibleForm(true)}
          title="Historia Clínica"
          margin="0"
        />
      </Col>
      <Col span={24}>
        <ClinicHistoryTable
          livestockAndEquines={livestockAndEquines}
          loading={livestockAndEquinesLoading}
          onConfirmRemoveClinicHistory={onConfirmRemoveClinicHistory}
          onSetVisibleForm={setVisibleForm}
        />
      </Col>
      <ClinicHistoryModalComponent
        key={visibleForm}
        visibleForm={visibleForm}
        onSetVisibleForm={setVisibleForm}
      />
    </Container>
  );
};

const Container = styled(Row)``;
