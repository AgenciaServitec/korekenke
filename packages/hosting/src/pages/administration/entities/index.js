import React from "react";
import { Acl, Button, Col, List, Row } from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useGlobalData } from "../../../providers";
import { useNavigate } from "react-router";
import { useAcl, useDefaultFirestoreProps } from "../../../hooks";
import { updateEntity } from "../../../firebase/collections";

export const EntitiesGUIntegration = () => {
  const navigate = useNavigate();
  const { entities } = useGlobalData();
  const { aclCheck } = useAcl();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const navigateTo = (entityId) => navigate(entityId);

  const onAddEntity = () => navigateTo("new");
  const onEditEntity = (entity) => navigateTo(entity.id);
  const onDeleteEntity = async (entity) =>
    await updateEntity(entity.id, assignDeleteProps({ isDeleted: true }));

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
            dataSource={entities}
            onDeleteItem={(entity) => onDeleteEntity(entity)}
            onEditItem={(entity) => onEditEntity(entity)}
            itemTitle={(entity) => entity.name}
            visibleEditItem={() =>
              aclCheck("administration", "entities-gu", [
                "/entities-gu/:entityGUId",
              ])
            }
            visibleDeleteItem={() =>
              aclCheck("administration", "entities-gu", ["/entities-gu#delete"])
            }
          />
        </Col>
      </Row>
    </Acl>
  );
};
