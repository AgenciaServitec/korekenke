import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useCommand, useGlobalData } from "../../../../providers";
import {
  Acl,
  Col,
  notification,
  RolesByGroupIntegration,
  Row,
  Tabs,
  Title,
} from "../../../../components";
import {
  useDefaultFirestoreProps,
  useUpdateAssignToAndAclsOfUser,
} from "../../../../hooks";
import { lowerCase } from "lodash";
import {
  addEntity,
  entitiesRef,
  getEntityId,
  updateEntity,
} from "../../../../firebase/collections";
import { getNameId } from "../../../../utils";
import { EditingEntityGU } from "./EditingEntity";
import { AssignmentForUsers } from "../../../../data-list";

export const EntityIntegration = () => {
  const { entityGUId } = useParams();
  const navigate = useNavigate();
  const { users, rolesAcls } = useGlobalData();
  const { currentCommand } = useCommand();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();
  const { updateAssignToAndAclsOfUser } = useUpdateAssignToAndAclsOfUser();

  const [loading, setLoading] = useState(false);
  const [entity, setEntity] = useState({});

  const isNew = entityGUId === "new";
  const onGoBack = () => navigate(-1);

  useEffect(() => {
    (async () => {
      if (isNew) {
        setEntity({ id: getEntityId() });
        return;
      }

      await entitiesRef
        .doc(entityGUId)
        .onSnapshot((snapshot) => setEntity(snapshot.data()));
    })();
  }, []);

  const mapEntity = (formData) => ({
    ...entity,
    name: formData.name,
    nameId: getNameId(formData.name),
    abbreviation: lowerCase(formData.abbreviation),
    entityManageId: formData?.entityManageId || null,
    commandId: entity?.commandId || currentCommand.id,
  });

  const saveEntity = async (formData) => {
    try {
      setLoading(true);

      //Update of assignTo of users
      await updateAssignToAndAclsOfUser({
        oldUsersIds: [
          entity?.entityManageId &&
          formData?.entityManageId !== entity?.entityManageId
            ? entity?.entityManageId
            : null,
        ],
        newUsersIds: [formData?.entityManageId],
        moduleNameId: AssignmentForUsers.entity,
        module: entity,
        users: users,
        formData: formData,
      });

      isNew
        ? await addEntity(assignCreateProps(mapEntity(formData)))
        : await updateEntity(entity.id, assignUpdateProps(mapEntity(formData)));

      notification({ type: "success" });

      onGoBack();
    } catch (e) {
      console.error("ErrorSaveEntity: ", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Entity
      isNew={isNew}
      entity={entity}
      rolesAcls={rolesAcls}
      users={users}
      loading={loading}
      onSaveEntity={saveEntity}
      onGoBack={onGoBack}
    />
  );
};

const Entity = ({
  isNew,
  entity,
  rolesAcls,
  users,
  loading,
  onSaveEntity,
  onGoBack,
}) => {
  const [tabView, setTabView] = useState(1);

  return (
    <Acl
      category="administration"
      subCategory="entities-gu"
      name={isNew ? "/entities-gu/new" : "/entities-gu/:entityGUId"}
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>Entidad / G.U</Title>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <Tabs
                defaultActiveKey={tabView}
                onChange={setTabView}
                type="card"
                items={[
                  {
                    label: "Edicion",
                    key: 1,
                    children: (
                      <EditingEntityGU
                        entity={entity}
                        users={users}
                        rolesAcls={rolesAcls}
                        loading={loading}
                        onSaveEntity={onSaveEntity}
                        onGoBack={onGoBack}
                      />
                    ),
                  },
                  {
                    label: "Roles",
                    disabled: !entity?.name,
                    key: 2,
                    children: (
                      <RolesByGroupIntegration
                        moduleType="entities"
                        moduleData={entity}
                        rolesToOptionsSelect={["manager"]}
                      />
                    ),
                  },
                ]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Acl>
  );
};
