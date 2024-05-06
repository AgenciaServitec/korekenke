import React from "react";
import { Acl, Button, List } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useGlobalData } from "../../providers";
import { useAcl } from "../../hooks";
import { firestore } from "../../firebase";
import { Col, Row } from "antd";

export const OfficesIntegration = () => {
  const navigate = useNavigate();
  const { offices, sections } = useGlobalData(); // Obtener las secciones
  const { aclCheck } = useAcl();

  const navigateTo = (officeId) => {
    const url = `/offices/${officeId}`;
    navigate(url);
  };

  const onAddOffice = () => navigateTo("new");

  const navigateToOffice = (officeId = undefined) => {
    const url = `/offices/${officeId}`;
    navigate(url);
  };

  const onEditOffice = (office) => navigateToOffice(office.id);
  const onDeleteOffice = async (office) => {
    try {
      await firestore
        .collection("offices")
        .doc(office.id)
        .update({ isDeleted: true });
    } catch (error) {
      console.error("Error deleting office:", error);
    }
  };

  return (
    <Acl name="/offices" redirect>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Acl name="/offices/new">
            <Button
              onClick={onAddOffice}
              type="primary"
              size="large"
              icon={<FontAwesomeIcon icon={faPlus} />}
            >
              &ensp; Agregar Oficina
            </Button>
          </Acl>
        </Col>
        <Col span={24}>
          <List
            dataSource={offices}
            onDeleteItem={(office) => onDeleteOffice(office)}
            onEditItem={(office) => onEditOffice(office)}
            itemTitle={(office) => office.name}
            visibleEditItem={() => aclCheck("/offices/:officeId")}
            visibleDeleteItem={() => aclCheck("/offices#delete")}
          />
        </Col>
      </Row>
    </Acl>
  );
};
