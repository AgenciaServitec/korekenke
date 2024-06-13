import React from "react";
import { Acl, Button, Col, List, Row } from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useGlobalData } from "../../../providers";
import { useAcl, useDefaultFirestoreProps } from "../../../hooks";
import { updateOffice } from "../../../firebase/collections";

export const OfficesIntegration = () => {
  const navigate = useNavigate();
  const { offices } = useGlobalData();
  const { aclCheck } = useAcl();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const navigateTo = (officeId) => navigate(officeId);

  const onAddOffice = () => navigateTo("new");

  const navigateToOffice = (officeId = undefined) => {
    const url = `/offices/${officeId}`;
    navigate(url);
  };

  const onEditOffice = (office) => navigateToOffice(office.id);
  const onDeleteOffice = async (office) => {
    try {
      await updateOffice(office.id, assignDeleteProps({ isDeleted: true }));
    } catch (error) {
      console.error("Error deleting office:", error);
    }
  };

  return (
    <Acl
      category="administration"
      subCategory="offices"
      name="/offices"
      redirect
    >
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Acl
            category="administration"
            subCategory="offices"
            name="/offices/new"
          >
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
            visibleEditItem={() =>
              aclCheck("administration", "offices", ["/offices/:officeId"])
            }
            visibleDeleteItem={() =>
              aclCheck("administration", "offices", ["/offices#delete"])
            }
          />
        </Col>
      </Row>
    </Acl>
  );
};
