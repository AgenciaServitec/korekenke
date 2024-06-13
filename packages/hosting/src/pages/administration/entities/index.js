import React from "react";
import Col from "antd/lib/col";
import { Acl, Button, List, modalConfirm } from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Row from "antd/lib/row";
import { useGlobalData } from "../../../providers";
import { useNavigate } from "react-router";
import { useAcl, useDefaultFirestoreProps } from "../../../hooks";
import { updateEntity } from "../../../firebase/collections";

export const EntitiesIntegration = () => {
  const navigate = useNavigate();
  const { entities } = useGlobalData();
  const { aclCheck } = useAcl();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const navigateTo = (entityId) => navigate(entityId);

  const onAddEntity = () => navigateTo("new");
  const onEditEntity = (entity) => navigateTo(entity.id);
  const onDeleteEntity = async (entity) =>
    modalConfirm({
      title: "¿Estás seguro de que quieres eliminar la entidad?",
      onOK: async () =>
        await updateEntity(entity.id, assignDeleteProps({ isDeleted: true })),
    });

  return (
    <Acl
      category="administration"
      subCategory="entities"
      name="/entities"
      redirect
    >
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Acl
            category="administration"
            subCategory="entities"
            name="/entities/new"
          >
            <Button
              onClick={onAddEntity}
              type="primary"
              size="large"
              icon={<FontAwesomeIcon icon={faPlus} />}
            >
              &ensp; Agregar Entidad
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
              aclCheck("administration", "entities", ["/entities/:entityId"])
            }
            visibleDeleteItem={() =>
              aclCheck("administration", "entities", ["/entities#delete"])
            }
          />
        </Col>
      </Row>
    </Acl>
  );
};
