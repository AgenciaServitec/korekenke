import React, { useState } from "react";
import { Col, notification, Row, Steps, Title } from "../../../../components";
import { useDefaultFirestoreProps } from "../../../../hooks";
import { firestore } from "../../../../firebase";
import { getOrganizationalClimateStudyId } from "../../../../firebase/collections/organizationalClimateStudies";
import { QuestionsOrganizationalStudyStep1 } from "./QuestionsOrganizationalStudyStep1";
import { ItemsOrganizationalStudyStep2 } from "./ItemsOrganizationalStudyStep2";
import { useAuthentication } from "../../../../providers";
import { CompletedQuestionnaire } from "./CompletedQuestionnaire";
import { useParams } from "react-router";
import { EditOrganizationClimateStudyId } from "./EditOrganizationClimateStudyId";
import styled from "styled-components";

export const OrganizationalClimateStudyIntegration = () => {
  const { authUser } = useAuthentication();
  const { organizationalClimateStudyId } = useParams();
  const { assignCreateProps } = useDefaultFirestoreProps();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [stepData1, setStepData1] = useState(null);

  const mapForm = (formData, organizationalClimateStudyId) => ({
    id: organizationalClimateStudyId,
    userId: authUser?.id,
    questions: stepData1.questions,
    items: formData.items,
  });

  const saveOrganizationalClimateStudy = async (formData) => {
    try {
      setLoading(true);

      const organizationalClimateStudyId = getOrganizationalClimateStudyId();

      await firestore
        .collection("organizational-climate-studies-surveys")
        .doc(organizationalClimateStudyId)
        .set(
          assignCreateProps(mapForm(formData, organizationalClimateStudyId)),
        );

      notification({ type: "success" });
      setCurrent(2);
    } catch (e) {
      console.error("ErrorSaveOrganizationalClimateStudySurveys: ", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Preguntas",
      content: (
        <QuestionsOrganizationalStudyStep1
          onSetCurrent={setCurrent}
          loading={loading}
          stepData1={stepData1}
          onSetStepData1={setStepData1}
        />
      ),
    },
    {
      title: "Items",
      content: (
        <ItemsOrganizationalStudyStep2
          current={current}
          loading={loading}
          onSetCurrent={setCurrent}
          onSubmit={saveOrganizationalClimateStudy}
        />
      ),
    },
    {
      title: "Completado",
      content: <CompletedQuestionnaire />,
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <Container>
      <div className="card-wrapper">
        <Row justify="center" gutter={[16, 16]}>
          <Col span={24}>
            <Title level={2}>
              Cuestionario para el estudio del Clima Organizacional
            </Title>
          </Col>
          {organizationalClimateStudyId !== "new" ? (
            <Col span={24}>
              <EditOrganizationClimateStudyId />
            </Col>
          ) : (
            <>
              <Col span={10}>
                <Steps current={current} items={items} />
                <br />
              </Col>
              <Col span={24}>{steps[current].content}</Col>
            </>
          )}
        </Row>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100svh;
  height: auto;
  padding: 1em;
`;
