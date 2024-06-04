import React from "react";
import { Col, Divider, Row } from "antd";
import { AddButton, Card } from "../../../../../components";
import { EquineMagazineProfilesTable } from "./EquineMagazineProfilesTable";
import { useNavigate, useParams } from "react-router-dom";

export const EquineMagazineProfilesIntegration = () => {
  const { livestockOrEquineId } = useParams();
  const navigate = useNavigate();

  const navigateTo = (equineMagazineProfileId) =>
    navigate(
      `/entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines/${livestockOrEquineId}/equine-magazine-profiles/${equineMagazineProfileId}`
    );

  const onAddEquineMagazineProfile = () => navigateTo("new");

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}></Col>
      <Col span={24} md={6}>
        <AddButton
          onClick={() => onAddEquineMagazineProfile()}
          title="Ficha de Revista Equina"
          margin="0"
        />
      </Col>
      <Divider />
      <Col span={24}>
        <EquineMagazineProfilesTable
          livestockOrEquineId={livestockOrEquineId}
        />
      </Col>
    </Row>
  );
};
