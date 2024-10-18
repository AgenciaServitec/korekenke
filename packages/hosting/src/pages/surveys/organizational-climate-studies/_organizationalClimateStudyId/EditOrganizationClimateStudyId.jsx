import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Spinner } from "../../../../components";
import { useNavigate, useParams } from "react-router";
import { fetchOrganizationalClimateStudy } from "../../../../firebase/collections/organizationalClimateStudies";
import { isEmpty } from "lodash";
import styled from "styled-components";
import { getOcupationalGroup, getQuestionValue } from "../../../../utils";
import { Surveys } from "../../../../data-list";

export const EditOrganizationClimateStudyId = () => {
  const navigate = useNavigate();
  const { organizationalClimateStudyId } = useParams();
  const [organizationalClimateStudy, setOrganizationalClimateStudy] = useState(
    {},
  );

  useEffect(() => {
    (async () => {
      if (organizationalClimateStudyId !== "new") {
        const _organizationalClimateStudy =
          await fetchOrganizationalClimateStudy(organizationalClimateStudyId);
        setOrganizationalClimateStudy(_organizationalClimateStudy);
      }
    })();
  }, []);

  if (isEmpty(organizationalClimateStudy)) return <Spinner height="80vh" />;

  const { questions, items } = organizationalClimateStudy;

  const itemsOptions = Surveys.items.options.reduce((acc, option) => {
    if (items[option.code.split(".")[1]]) {
      acc.push({
        label: option.label,
        value: items[option.code.split(".")[1]],
      });
    }
    return acc;
  }, []);

  const itemsSurvey = itemsOptions.reduce((acc, _itemsOptions) => {
    const response = Surveys.items.responses.find(
      (response) => response.value === _itemsOptions.value,
    );
    if (response) {
      acc.push({ label: _itemsOptions.label, value: response.label });
    }
    return acc;
  }, []);

  const onGoBack = () => navigate(-1);

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={<span style={{ fontSize: "1.5em" }}>Preguntas</span>}
            bordered={false}
            type="inner"
          >
            <Row gutter={[16, 16]}>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>1. Nombre de la dependencia donde laboras: </span>
                  <span>{questions?.dependencyName}</span>
                </WrapperComponent>
              </Col>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>2. Cargo que desempeña en la dependencia: </span>
                  <span>{questions?.positionHeld}</span>
                </WrapperComponent>
              </Col>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>3. Tipo de dependencia: </span>
                  <span>
                    {getQuestionValue(
                      "questions.dependencyType",
                      questions?.dependencyType,
                    )}
                  </span>
                </WrapperComponent>
              </Col>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>4. Edad: </span>
                  <span>{questions?.age}</span>
                </WrapperComponent>
              </Col>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>5. Sexo: </span>
                  <span>
                    {getQuestionValue("questions.gender", questions?.gender)}
                  </span>
                </WrapperComponent>
              </Col>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>6. Grupo ocupacional: </span>
                  <span>
                    {getOcupationalGroup(
                      "questions.ocupationalGroup",
                      questions?.ocupationalGroup,
                    )}
                  </span>
                </WrapperComponent>
              </Col>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>7. Condición: </span>
                  <span>
                    {getQuestionValue(
                      "questions.condition",
                      questions?.condition,
                    )}
                  </span>
                </WrapperComponent>
              </Col>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>8. Tiempo trabajando en la Institución: </span>
                  <span>{questions?.timeWorkingInstitution}</span>
                </WrapperComponent>
              </Col>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>9. Tiempo trabajando en el puesto actual: </span>
                  <span>{questions?.timeWorkingCurrentPosition}</span>
                </WrapperComponent>
              </Col>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>
                    10. Se han realizado actividades recreativas en los últimos
                    seis (06) meses:{" "}
                  </span>
                  <span>{questions?.recreationalActivitiesInSixMonths}</span>
                </WrapperComponent>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Card
            title={<span style={{ fontSize: "1.5em" }}>Items</span>}
            bordered={false}
            type="inner"
          >
            <Row gutter={[16, 16]}>
              {itemsSurvey.map((_itemsSurvey, index) => (
                <Col key={index} span={24} md={12}>
                  <WrapperComponent>
                    <span>
                      {index + 12}. {_itemsSurvey.label}
                    </span>
                    <br />
                    <span>- {_itemsSurvey.value}</span>
                  </WrapperComponent>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Row justify="end" gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Button size="large" block htmlType="submit" onClick={onGoBack}>
                Cancelar
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

const WrapperComponent = styled.div`
  span:last-child {
    font-weight: 500;
    text-transform: capitalize;
  }
`;
