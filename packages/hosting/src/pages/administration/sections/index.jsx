import React from "react";
import { useNavigate } from "react-router";
import { useGlobalData } from "../../../providers";
import {
  useAcl,
  useDefaultFirestoreProps,
  useUpdateAssignToAndAclsOfUser,
} from "../../../hooks";
import {
  Acl,
  Button,
  Col,
  List,
  notification,
  Row,
  Title,
} from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { updateSection } from "../../../firebase/collections";
import { Link } from "react-router-dom";
import { userFullName } from "../../../utils";

export const SectionsIntegration = () => {
  const navigate = useNavigate();
  const { sections, users } = useGlobalData();
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
        users: users,
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

  const sectionsViews = sections.map((section) => {
    const boss = users.find((user) => user.id === section?.bossId);

    return {
      ...section,
      boss: boss || null,
    };
  });

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
            dataSource={sectionsViews}
            onDeleteItem={(section) => onDeleteSection(section)}
            onEditItem={(section) => onEditSection(section)}
            itemTitle={(section) => (
              <div>
                <Title level={5}>
                  {section.name}{" "}
                  {section?.abbreviation && (
                    <span>({section?.abbreviation.toUpperCase()})</span>
                  )}
                </Title>
                <div style={{ fontSize: 12 }}>
                  Jefe:{" "}
                  {section?.bossId ? (
                    <Link
                      to={`/users/${section?.bossId}`}
                      style={{ fontSize: 12 }}
                    >
                      {section?.boss ? userFullName(section?.boss) : null}
                    </Link>
                  ) : (
                    "No se asignó un jefe"
                  )}
                </div>
                <div style={{ fontSize: 12 }}>
                  Miembros:{" "}
                  {section?.membersIds
                    ? section?.membersIds.length
                    : "No hay miembros"}
                </div>
              </div>
            )}
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
