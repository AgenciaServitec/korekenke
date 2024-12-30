import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Col, CustomStampSheet, Input, Row, Title } from "../../../components";
import { Flex } from "antd";
import { capitalize } from "lodash";

export const SignatureAndSealComponent = ({ onSetSeals }) => {
  const [firstSealTopText, setFirstSealTopText] = useState("");
  const [firstSealBottomText, setFirstSealBottomText] = useState("");
  const [firstSupervisorName, setFirstSupervisorName] = useState("");
  const [firstSupervisorCip, setFirstSupervisorCip] = useState("");
  const [firstSupervisorDegree, setFirstSupervisorDegree] = useState("");
  const [secondSealTopText, setSecondSealTopText] = useState("");
  const [secondSealBottomText, setSecondSealBottomText] = useState("");
  const [secondSupervisorName, setSecondSupervisorName] = useState("");
  const [secondSupervisorCip, setSecondSupervisorCip] = useState("");
  const [secondSupervisorDegree, setSecondSupervisorDegree] = useState("");

  const onSetFirstSupervisorName = (event) => {
    setFirstSupervisorName(event.target.value);
  };

  const onSetFirstSupervisorCip = (event) => {
    setFirstSupervisorCip(event.target.value);
  };

  const onSetFirstSupervisorDegree = (event) => {
    setFirstSupervisorDegree(event.target.value);
  };

  const onSetFirstSealTopText = (event) => {
    setFirstSealTopText(event.target.value);
  };

  const onSetFirstSealBottomText = (event) => {
    setFirstSealBottomText(event.target.value);
  };

  const onSetSecondSupervisorName = (event) => {
    setSecondSupervisorName(event.target.value);
  };

  const onSetSecondSupervisorCip = (event) => {
    setSecondSupervisorCip(event.target.value);
  };

  const onSetSecondSupervisorDegree = (event) => {
    setSecondSupervisorDegree(event.target.value);
  };

  const onSetSecondSealTopText = (event) => {
    setSecondSealTopText(event.target.value);
  };

  const onSetSecondSealBottomText = (event) => {
    setSecondSealBottomText(event.target.value);
  };

  const _seals = {
    firstSeal: {
      supervisorName: capitalize(firstSupervisorName),
      supervisorCip: firstSupervisorCip,
      supervisorDegree: firstSupervisorDegree,
      sealTopText: firstSealTopText.toUpperCase(),
      sealBottomText: firstSealBottomText.toUpperCase(),
    },
    secondSeal: {
      supervisorName: capitalize(secondSupervisorName),
      supervisorCip: secondSupervisorCip,
      supervisorDegree: secondSupervisorDegree,
      sealTopText: secondSealTopText.toUpperCase(),
      sealBottomText: secondSealBottomText.toUpperCase(),
    },
  };

  useEffect(() => {
    onSetSeals(_seals);
  }, [
    firstSupervisorName,
    firstSupervisorCip,
    firstSupervisorDegree,
    firstSealTopText,
    firstSealBottomText,
    secondSupervisorName,
    secondSupervisorCip,
    secondSupervisorDegree,
    secondSealTopText,
    secondSealBottomText,
  ]);

  return (
    <Container>
      <SignatureAndSeal
        numberOfSeal={1}
        supervisorName={firstSupervisorName}
        supervisorCip={firstSupervisorCip}
        supervisorDegree={firstSupervisorDegree}
        sealTopText={firstSealTopText}
        sealBottomText={firstSealBottomText}
        onSetSupervisorName={onSetFirstSupervisorName}
        onSetSupervisorCip={onSetFirstSupervisorCip}
        onSetSupervisorDegree={onSetFirstSupervisorDegree}
        onSetSealTopText={onSetFirstSealTopText}
        onSetSealBottomText={onSetFirstSealBottomText}
      />
      <SignatureAndSeal
        numberOfSeal={2}
        supervisorName={secondSupervisorName}
        supervisorCip={secondSupervisorCip}
        supervisorDegree={secondSupervisorDegree}
        sealTopText={secondSealTopText}
        sealBottomText={secondSealBottomText}
        onSetSupervisorName={onSetSecondSupervisorName}
        onSetSupervisorCip={onSetSecondSupervisorCip}
        onSetSupervisorDegree={onSetSecondSupervisorDegree}
        onSetSealTopText={onSetSecondSealTopText}
        onSetSealBottomText={onSetSecondSealBottomText}
      />
    </Container>
  );
};

const SignatureAndSeal = ({
  numberOfSeal,
  supervisorName,
  supervisorCip,
  supervisorDegree,
  sealTopText,
  sealBottomText,
  onSetSupervisorName,
  onSetSupervisorCip,
  onSetSupervisorDegree,
  onSetSealTopText,
  onSetSealBottomText,
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Title level={4}>Encargado {numberOfSeal}</Title>
      </Col>
      <Col span={12}>
        <Flex
          vertical
          gap={15}
          style={{ width: "100%", height: "100%" }}
          justify="center"
        >
          <Input
            label="Nombres:"
            onChange={onSetSupervisorName}
            animation={false}
          />
          <Input label="CIP:" onChange={onSetSupervisorCip} animation={false} />
          <Input
            label="Cargo:"
            onChange={onSetSupervisorDegree}
            animation={false}
            placeholder="Ejm: Jefe de (Comando, Departamento, etc.)"
          />
          <Input
            label={`Texto Superior Sello ${numberOfSeal}:`}
            onChange={onSetSealTopText}
            animation={false}
          />
          <Input
            label={`Texto Inferior Sello ${numberOfSeal}:`}
            onChange={onSetSealBottomText}
            animation={false}
          />
        </Flex>
      </Col>
      <Col span={12}>
        <CustomStampSheet
          supervisorName={supervisorName}
          supervisorCip={supervisorCip}
          supervisorDegree={supervisorDegree}
          topText={sealTopText}
          bottomText={sealBottomText}
        />
      </Col>
    </Row>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3em;
  margin: 2em 0;
  justify-content: center;
`;
