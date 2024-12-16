import React, { useEffect } from "react";
import { Acl, Row, Col, Title, notification } from "../../components";
import { useAuthentication } from "../../providers";
import { useDefaultFirestoreProps } from "../../hooks";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { assistancesRef } from "../../firebase/collections/assistance";
import { GetAssistance } from "./GetAssistance";

export const AssistanceIntegration = () => {
  const { authUser } = useAuthentication();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const [assistances = [], assistancesLoading, assistancesError] =
    useCollectionData(assistancesRef.where("isDeleted", "==", false));

  useEffect(() => {
    assistancesError && notification({ type: "error" });
  }, [assistancesError]);

  if (assistancesLoading) {
    return;
  }

  return <Assistance user={authUser} />;
};

const Assistance = ({ user }) => {
  return (
    <Acl
      redirect
      category="default"
      subCategory="assistance"
      name="/assistance"
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>Control de asistencia</Title>
        </Col>
        <Col span={24}>
          <GetAssistance user={user} />
        </Col>
      </Row>
    </Acl>
  );
};
