import React, { useEffect, useState } from "react";
import { Card, Col, Row, Spinner, Button } from "../../../../components";
import { useParams, useNavigate } from "react-router";
import { fetchOrganizationalClimateStudy } from "../../../../firebase/collections/organizationalClimateStudies";
import { isEmpty } from "lodash";
import styled from "styled-components";
import { Surveys } from "../../../../data-list";

export const EditOrganizationClimateStudyId = () => {
  const navigate = useNavigate();
  const { organizationalClimateStudyId } = useParams();
  const [organizationalClimateStudy, setOrganizationalClimateStudy] = useState(
    {}
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
      (response) => response.value === _itemsOptions.value
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
                  <span>1. Nombre de la Organización: </span>
                  <span>{questions?.establishment}</span>
                </WrapperComponent>
              </Col>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>2. Tipo de Organización: </span>
                  <span>
                    {
                      Surveys.questions[1].options.find(
                        (option) => option.value === questions?.type
                      ).label
                    }
                  </span>
                </WrapperComponent>
              </Col>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>3. Sub Sector: </span>
                  <span>{questions?.subsector}</span>
                </WrapperComponent>
              </Col>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>4. Ubicación Geográfica: </span>
                  <span>
                    {
                      Surveys.questions[3].options.find(
                        (option) => option.value === questions?.ubigeus
                      ).label
                    }
                  </span>
                </WrapperComponent>
              </Col>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>5. Edad: </span>
                  <span>{questions?.age}</span>
                </WrapperComponent>
              </Col>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>6. Sexo: </span>
                  <span>
                    {
                      Surveys.questions[5].options.find(
                        (option) => option.value === questions?.gender
                      ).label
                    }
                  </span>
                </WrapperComponent>
              </Col>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>7. Grupo Ocupacional: </span>
                  <span>
                    {
                      Surveys.questions[6].options.find(
                        (option) =>
                          option.value === questions?.occupationalGroup
                      ).label
                    }
                  </span>
                </WrapperComponent>
              </Col>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>8. Personal: </span>
                  <span>
                    {
                      Surveys.questions[7].options.find(
                        (option) => option.value === questions?.personal
                      ).label
                    }
                  </span>
                </WrapperComponent>
              </Col>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>9. Condición: </span>
                  <span>
                    {
                      Surveys.questions[8].options.find(
                        (option) => option.value === questions?.condition
                      ).label
                    }
                  </span>
                </WrapperComponent>
              </Col>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>10. Tiempo trabajando en la Institución: </span>
                  <span>{questions?.dwellTime}</span>
                </WrapperComponent>
              </Col>
              <Col span={24} md={8}>
                <WrapperComponent>
                  <span>11. Tiempo trabajando en el Puesto Actual: </span>
                  <span>{questions?.timeInCurrentPosition}</span>
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
