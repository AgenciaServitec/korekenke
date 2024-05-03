import React, { useEffect } from "react";
import Col from "antd/lib/col";
import { Acl, Button, List, notification } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Row from "antd/lib/row";
import { useGlobalData } from "../../providers";
import { useNavigate } from "react-router";
import { useAcl, useAsync } from "../../hooks";
import { firestore } from "../../firebase";

export const Entities = () => {
  const navigate = useNavigate();

  const { entities } = useGlobalData();

  const navigateTo = (entitiesId) => {
    const url = `/entities/${entitiesId}`;
    navigate(url);
  };

  const onAddEntity = () => navigateTo("new");

  const {
    run: deleteEntity,
    error: deleteEntityError,
    success: deleteEntitySuccess,
  } = useAsync((entities) =>
    firestore
      .collection("entities")
      .doc(entities.id)
      .update({ isDeleted: true })
  );

  useEffect(() => {
    deleteEntitySuccess && notification({ type: "success" });
  }, [deleteEntitySuccess]);

  useEffect(() => {
    deleteEntityError && notification({ type: "error" });
  }, [deleteEntityError]);

  const navigateToEntity = (entityId = undefined) => {
    const url = `/entities/${entityId}`;

    navigate(url);
  };

  const { aclCheck } = useAcl();

  const onEditEntity = (entity) => navigateToEntity(entity.id);
  const onDeleteEntity = async (entity) => {
    try {
      await deleteEntity(entity);
    } catch (e) {
      console.error("ErrorDeleteEntity: ", e);
    }
  };

  return (
    <Acl name="/entities" redirect>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Acl name="/entities/new">
            <Button
              onClick={onAddEntity}
              type="primary"
              size="large"
              icon={<FontAwesomeIcon icon={faPlus} />}
            >
              &ensp; Agregar Núcleo
            </Button>
          </Acl>
        </Col>
        <Col span={24}>
          <List
            dataSource={entities}
            onDeleteItem={(entity) => onDeleteEntity(entity)}
            onEditItem={(entity) => onEditEntity(entity)}
            itemTitle={(entity) => entity.name}
            visibleEditItem={() => aclCheck("/entities/:entityId")}
            visibleDeleteItem={() => aclCheck("/entities#delete")}
          />
        </Col>
      </Row>
    </Acl>
  );
};
