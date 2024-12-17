import React, { useEffect } from "react";
import { Acl, Row, Col, Title, notification, Spinner } from "../../components";
import { useAuthentication } from "../../providers";
import { useDefaultFirestoreProps, useUserLocation } from "../../hooks";
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

  if (assistancesLoading) return <Spinner height="80svh" />;

  return <Assistance user={authUser} />;
};

const Assistance = ({ user }) => {
  const { userLocation } = useUserLocation();

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
          <GetAssistance user={user} userLocation={userLocation} />
        </Col>
      </Row>
    </Acl>
  );
};
