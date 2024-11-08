import React from "react";
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
import { useAuthentication, useGlobalData } from "../../../providers";
import { useNavigate } from "react-router";
import {
  useAcl,
  useDefaultFirestoreProps,
  useUpdateAssignToAndAclsOfUser,
} from "../../../hooks";
import { updateEntity } from "../../../firebase/collections";
import { Tag } from "antd";
import { userFullName } from "../../../utils";
import { Link } from "react-router-dom";

export const EntitiesGUIntegration = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();
  const { entities, users } = useGlobalData();
  const { aclCheck } = useAcl();
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const { updateAssignToAndAclsOfUser } = useUpdateAssignToAndAclsOfUser();

  const navigateTo = (entityId) => navigate(entityId);

  const onAddEntity = () => navigateTo("new");
  const onEditEntity = (entity) => navigateTo(entity.id);
  const onDeleteEntity = async (entity) => {
    try {
      await updateAssignToAndAclsOfUser({
        oldUsersIds: [entity.entityManageId],
        users: users,
      });

      await updateEntity(
        entity.id,
        assignDeleteProps({
          isDeleted: true,
          entityManageId: null,
        }),
      );
    } catch (e) {
      console.error("ErrorDeleteEntity: ", e);
      notification({ type: "error" });
    }
  };

  const entitiesViews = entities.map((entity) => {
    const manager = users.find((user) => user.id === entity?.managerId);

    return {
      ...entity,
      manager: manager || null,
    };
  });

  return (
    <Acl
      category="administration"
      subCategory="entities-gu"
      name="/entities-gu"
      redirect
    >
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Acl
            category="administration"
            subCategory="entities-gu"
            name="/entities-gu/new"
          >
            <Button
              onClick={onAddEntity}
              type="primary"
              size="large"
              icon={<FontAwesomeIcon icon={faPlus} />}
            >
              &ensp; Agregar Entidad / G.U
            </Button>
          </Acl>
        </Col>
        <Col span={24}>
          <List
            dataSource={entitiesViews}
            onDeleteItem={(entity) => onDeleteEntity(entity)}
            onEditItem={(entity) => onEditEntity(entity)}
            itemTitle={(entity) => (
              <div>
                <Title level={5}>
                  {entity.name}{" "}
                  {entity?.abbreviation && (
                    <span>({entity?.abbreviation.toUpperCase()})</span>
                  )}
                </Title>
                <div style={{ fontSize: 12 }}>
                  Gerente:{" "}
                  {entity?.managerId ? (
                    <Link
                      to={`/users/${entity?.managerId}`}
                      style={{ fontSize: 12 }}
                    >
                      {entity?.manager ? userFullName(entity?.manager) : null}
                    </Link>
                  ) : (
                    "No se asignó un gerente"
                  )}
                </div>
              </div>
            )}
            visibleEditItem={() =>
              aclCheck("administration", "entities-gu", [
                "/entities-gu/:entityGUId",
              ])
            }
            visibleDeleteItem={() =>
              aclCheck("administration", "entities-gu", [
                "/entities-gu#delete",
              ]) && authUser.roleCode === "super_admin"
            }
          />
        </Col>
      </Row>
    </Acl>
  );
};
