import React, { useState } from "react";
import {
  Acl,
  AddButton,
  Col,
  Divider,
  modalConfirm,
  notification,
  Row,
  Select,
  Title,
} from "../../../components";
import {
  useAuthentication,
  useCommand,
  useGlobalData,
} from "../../../providers";
import { useNavigate } from "react-router";
import { UsersTable } from "./UserTable";
import {
  apiErrorNotification,
  getApiErrorResponse,
  useApiUserPatch,
} from "../../../api";
import { assign, concat, isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { Button, Space } from "antd";
import {
  fetchDepartment,
  fetchOffice,
  fetchSection,
  fetchUnit,
  updateDepartment,
  updateEntity,
  updateOffice,
  updateSection,
  updateUnit,
} from "../../../firebase/collections";
import { useUpdateAssignToInUser } from "../../../hooks/useUpdateAssignToInUser";

export const Users = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();
  const { users, rolesAcls, commands } = useGlobalData();
  const { patchUser, patchUserResponse } = useApiUserPatch();
  const { currentCommand } = useCommand();
  const { updateAssignToUser } = useUpdateAssignToInUser();

  const [commandId, setCommandId] = useState(currentCommand.id || "all");

  const navigateTo = (userId) => navigate(userId);

  const onAddUser = () => navigateTo("new");
  const onEditUser = (user) => navigateTo(user.id);

  const updateModuleAndUser = async (
    moduleType = undefined,
    moduleId,
    user,
    withUserDeletion = true
  ) => {
    if (!moduleType || !moduleId) return;

    const userRemove = withUserDeletion && (await removeUser(user));

    switch (moduleType) {
      case "entity": {
        await updateEntity(moduleId, { entityManageId: null });

        //Update of assignTo of users
        await updateAssignToUser({
          oldUsersIds: [user.id],
          moduleId: moduleId,
          users: users,
        });

        await userRemove;
        break;
      }
      case "department": {
        const department = await fetchDepartment(moduleId);

        //Update of assignTo of users
        await updateAssignToUser({
          oldUsersIds: [user.id],
          moduleId: moduleId,
          users: users,
        });

        await updateDepartment(moduleId, {
          ...(department.bossId === user.id && { bossId: null }),
          ...(department.secondBossId === user.id && { secondBossId: null }),
          membersIds: department.membersIds.filter(
            (memberId) => memberId !== user.id
          ),
        });

        await userRemove;
        break;
      }
      case "unit": {
        const unit = await fetchUnit(moduleId);

        //Update of assignTo of users
        await updateAssignToUser({
          oldUsersIds: [user.id],
          moduleId: moduleId,
          users: users,
        });

        await updateUnit(moduleId, {
          ...(unit.bossId === user.id && { bossId: null }),
          membersIds: unit.membersIds.filter(
            (memberId) => memberId !== user.id
          ),
        });

        await userRemove;
        break;
      }
      case "section": {
        const section = await fetchSection(moduleId);

        //Update of assignTo of users
        await updateAssignToUser({
          oldUsersIds: [user.id],
          moduleId: moduleId,
          users: users,
        });

        await updateSection(moduleId, {
          ...(section.bossId === user.id && { bossId: null }),
          membersIds: section.membersIds.filter(
            (memberId) => memberId !== user.id
          ),
        });

        await userRemove;
        break;
      }
      case "office": {
        const office = await fetchOffice(moduleId);

        //Update of assignTo of users
        await updateAssignToUser({
          oldUsersIds: [user.id],
          moduleId: moduleId,
          users: users,
        });

        await updateOffice(moduleId, {
          ...(office.bossId === user.id && { bossId: null }),
          membersIds: office.membersIds.filter(
            (memberId) => memberId !== user.id
          ),
        });

        await userRemove;
        break;
      }
    }
  };

  const removeUserOfGroup = (user, withUserDeletion = true) =>
    modalConfirm({
      title: `¿Estás seguro de que quieres desvincular al usuario ${
        user.assignedTo.type === "entity"
          ? "de la ENTIDAD"
          : user.assignedTo.type === "unit"
          ? "de la UNIDAD"
          : user.assignedTo.type === "department"
          ? "del DEPARTAMENTO"
          : user.assignedTo.type === "office"
          ? "de la OFICINA"
          : "de la SECCIÓN"
      } ${withUserDeletion ? "y eliminar" : ""}?`,
      onOk: async () => {
        await updateModuleAndUser(
          user.assignedTo.type,
          user.assignedTo.id,
          user,
          withUserDeletion
        );
      },
    });

  const removeUser = async (user) => {
    const response = await patchUser(user);
    if (!patchUserResponse.ok) {
      throw new Error(response);
    }

    notification({
      type: "success",
      title: "¡Usuario eliminado exitosamente!",
    });
  };

  const onDeleteUser = async (user) => {
    try {
      if (!isEmpty(user?.assignedTo?.id)) {
        return notification({
          type: "open",
          duration: 10,
          icon: <FontAwesomeIcon icon={faWarning} color="orange" size="lg" />,
          title: "Este usuario está asignado como miembro",
          description:
            "Para eliminar, el usuario no debe estar como miembro o jefe en (entidad, departamento, sección u oficina)",
          btn: (
            <Space>
              <Button
                type="primary"
                size="small"
                onClick={() => removeUserOfGroup(user)}
              >
                Desvincular y eliminar usuario
              </Button>
            </Space>
          ),
        });
      }

      const user_ = assign({}, user, { updateBy: authUser?.email });

      await removeUser(user_);
    } catch (e) {
      const errorResponse = await getApiErrorResponse(e);
      apiErrorNotification(errorResponse);
    }
  };

  const onConfirmRemoveUser = (user) =>
    modalConfirm({
      content: "El usuario se eliminará",
      onOk: async () => {
        await onDeleteUser(user);
      },
    });

  const onConfirmUnlinkAssignedToUser = (user) =>
    removeUserOfGroup(user, false);

  const usersView = users.filter((user) =>
    commandId === "all" ? true : user?.initialCommand?.id === commandId
  );

  return (
    <Acl redirect category="administration" subCategory="users" name="/users">
      <Row gutter={[16, 16]}>
        <Acl category="administration" subCategory="users" name="/users/new">
          <>
            <Col span={24}>
              <AddButton onClick={onAddUser} title="Usuario" margin="0" />
            </Col>
            <Divider />
          </>
        </Acl>
        <Col span={24}>
          <Title level={3}>Usuarios</Title>
        </Col>
        <Col span={24} md={8}>
          <Select
            value={commandId}
            onChange={(value) => setCommandId(value)}
            options={concat(
              [{ label: "Todos", value: "all" }],
              commands.map((command) => ({
                label: `${command.name} (${command.code.toUpperCase()})`,
                value: command.id,
              }))
            )}
          />
        </Col>
        <Col span={24}>
          <UsersTable
            users={usersView}
            rolesAcls={rolesAcls}
            onEditUser={onEditUser}
            onRemoveUser={onConfirmRemoveUser}
            onUnlinkAssignedToUser={onConfirmUnlinkAssignedToUser}
          />
        </Col>
      </Row>
    </Acl>
  );
};
