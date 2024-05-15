import React from "react";
import { useNavigate } from "react-router";
import { useGlobalData } from "../../../providers";
import { useAcl, useDefaultFirestoreProps } from "../../../hooks";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { Acl, Button, List, notification } from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { updateSection } from "../../../firebase/collections";

export const SectionsIntegration = () => {
  const navigate = useNavigate();
  const { sections } = useGlobalData();
  const { aclCheck } = useAcl();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const navigateTo = (sectionsId) => navigate(`/sections/${sectionsId}`);

  const onAddSection = () => navigateTo("new");

  const navigateToSection = (sectionId = undefined) =>
    navigate(`/sections/${sectionId}`);

  const onEditSection = (section) => navigateToSection(section.id);
  const onDeleteSection = async (section) => {
    try {
      await updateSection(section.id, assignDeleteProps({ isDeleted: true }));
    } catch (e) {
      console.error("ErrorDeleteSection: ", e);
      notification({ type: "error" });
    }
  };

  return (
    <Acl name="/sections" redirect>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Acl name="/sections/new">
            <Button
              onClick={onAddSection}
              type="primary"
              size="large"
              icon={<FontAwesomeIcon icon={faPlus} />}
            >
              &ensp; Agregar Sección
            </Button>
          </Acl>
        </Col>
        <Col span={24}>
          <List
            dataSource={sections}
            onDeleteItem={(section) => onDeleteSection(section)}
            onEditItem={(section) => onEditSection(section)}
            itemTitle={(section) => section.name}
            visibleEditItem={() => aclCheck("/sections/:sectionId")}
            visibleDeleteItem={() => aclCheck("/sections#delete")}
          />
        </Col>
      </Row>
    </Acl>
  );
};
