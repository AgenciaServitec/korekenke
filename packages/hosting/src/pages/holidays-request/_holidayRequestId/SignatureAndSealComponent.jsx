import React, { useEffect, useState } from "react";
import {
  Col,
  ComponentContainer,
  CustomStampSheet,
  Flex,
  Input,
  Row,
} from "../../../components";

export const SignatureAndSealComponent = ({
  label = "",
  value,
  onChange,
  error,
  required,
}) => {
  const [sealTopText, setSealTopText] = useState("");
  const [sealBottomText, setSealBottomText] = useState("");
  const [supervisorName, setSupervisorName] = useState("");
  const [supervisorCip, setSupervisorCip] = useState("");
  const [supervisorDegree, setSupervisorDegree] = useState("");

  useEffect(() => {
    onChange({
      sealTopText,
      sealBottomText,
      supervisorName,
      supervisorCip,
      supervisorDegree,
    });
  }, [
    sealTopText,
    sealBottomText,
    supervisorName,
    supervisorCip,
    supervisorDegree,
  ]);

  return (
    <ComponentContainer.group error={error} label={label} required={required}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Flex
            vertical
            gap={15}
            style={{ width: "100%", height: "100%" }}
            justify="center"
          >
            <Input
              label="Nombres:"
              onChange={(e) => setSupervisorName(e.target.value)}
              animation={false}
            />
            <Input
              label="CIP:"
              onChange={(e) => setSupervisorCip(e.target.value)}
              animation={false}
            />
            <Input
              label="Cargo:"
              onChange={(e) => setSupervisorDegree(e.target.value)}
              animation={false}
              placeholder="Ejm: Jefe de (Comando, Departamento, etc.)"
            />
            <Input
              label="Texto Superior Sello"
              onChange={(e) => setSealTopText(e.target.value)}
              animation={false}
            />
            <Input
              label="Texto Inferior Sello"
              onChange={(e) => setSealBottomText(e.target.value)}
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
    </ComponentContainer.group>
  );
};
