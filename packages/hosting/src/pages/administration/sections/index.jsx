import React from "react";
import { useNavigate } from "react-router";
import { useGlobalData } from "../../../providers";
import {
  useAcl,
  useDefaultFirestoreProps,
  useUpdateAssignToAndAclsOfUser,
} from "../../../hooks";
import { Acl, Button, Col, List, notification, Row } from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { updateSection } from "../../../firebase/collections";

export const SectionsIntegration = () => {
  const navigate = useNavigate();
  const { sections, sectionUsers } = useGlobalData();
  const { aclCheck } = useAcl();
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const { updateAssignToAndAclsOfUser } = useUpdateAssignToAndAclsOfUser();

  const navigateTo = (sectionId) => navigate(sectionId);

  const onAddSection = () => navigateTo("new");
  const onEditSection = (section) => navigateTo(section?.id);
  const onDeleteSection = async (section) => {
    try {
      await updateAssignToAndAclsOfUser({
        oldUsersIds: section.membersIds,
        users: sectionUsers,
      });

      await updateSection(
        section.id,
        assignDeleteProps({
          isDeleted: true,
          membersIds: null,
          bossId: null,
        }),
      );
    } catch (e) {
      console.error("ErrorDeleteSection: ", e);
      notification({ type: "error" });
    }
  };

  return (
    <Acl
      category="administration"
      subCategory="sections"
      name="/sections"
      redirect
    >
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Acl
            category="administration"
            subCategory="sections"
            name="/sections/new"
          >
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
            onDeleteConfirmOptions={{
              title: "¿Seguro que deseas eliminar la sección?",
              content:
                "Al eliminar la sección los usuarios vinculados estaran libres para ser asignados en otras secciónes.",
            }}
            onEditItem={(section) => onEditSection(section)}
            itemTitle={(section) => section.name}
            visibleEditItem={() =>
              aclCheck("administration", "sections", ["/sections/:sectionId"])
            }
            visibleDeleteItem={() =>
              aclCheck("administration", "sections", ["/sections#delete"])
            }
          />
        </Col>
      </Row>
    </Acl>
  );
};
