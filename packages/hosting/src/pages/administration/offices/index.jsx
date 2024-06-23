import React, { useState } from "react";
import { Acl, Button, Col, List, Row, Select } from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useGlobalData } from "../../../providers";
import { useAcl, useDefaultFirestoreProps } from "../../../hooks";
import { updateOffice } from "../../../firebase/collections";
import { concat } from "lodash";

export const OfficesIntegration = () => {
  const navigate = useNavigate();
  const { offices, sections } = useGlobalData();
  const { aclCheck } = useAcl();
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const [sectionId, setSectionId] = useState("all");

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

  const officesView = offices.filter((office) =>
    sectionId === "all" ? true : office.sectionId === sectionId
  );

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
        <Col span={24} md={8}>
          <Select
            value={sectionId}
            onChange={(value) => setSectionId(value)}
            options={concat(
              [{ label: "Todos", value: "all" }],
              sections.map((section) => ({
                label: section.name,
                value: section.id,
              }))
            )}
          />
        </Col>
        <Col span={24}>
          <List
            dataSource={officesView}
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
