import React, { useState } from "react";
import {
  Acl,
  AddButton,
  Button,
  Col,
  Divider,
  modalConfirm,
  notification,
  Row,
  Select,
  Space,
  Title,
} from "../../../components";
import { useAuthentication, useGlobalData } from "../../../providers";
import { useNavigate } from "react-router";
import { UsersTable } from "./UserTable";
import {
  apiErrorNotification,
  getApiErrorResponse,
  useApiUserPatch,
} from "../../../api";
import { assign, isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
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
import { useUpdateAssignToAndAclsOfUser } from "../../../hooks";
import { faAccessibleIcon } from "@fortawesome/free-brands-svg-icons";

export const Users = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();
  const { users, commands } = useGlobalData();
  const { patchUser, patchUserResponse } = useApiUserPatch();
  const { updateAssignToAndAclsOfUser } = useUpdateAssignToAndAclsOfUser();
  const [userType, setUserType] = useState("all");
  const [disabledUser, setDisabledUser] = useState(false);

  const navigateTo = (userId) => navigate(userId);

  const onAddUser = () => navigateTo("new");
  const onEditUser = (user) => navigateTo(user.id);

  const updateModuleAndUser = async (
    moduleType = undefined,
    moduleId,
    user,
    withUserDeletion = true,
  ) => {
    if (!moduleType || !moduleId) return;

    const userRemove = withUserDeletion && (await removeUser(user));

    switch (moduleType) {
      case "entity": {
        await updateEntity(moduleId, { entityManageId: null });

        //Update of assignTo of users
        await updateAssignToAndAclsOfUser({
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
        await updateAssignToAndAclsOfUser({
          oldUsersIds: [user.id],
          moduleId: moduleId,
          users: users,
        });

        await updateDepartment(moduleId, {
          ...(department.bossId === user.id && { bossId: null }),
          ...(department.secondBossId === user.id && { secondBossId: null }),
          membersIds: department.membersIds.filter(
            (memberId) => memberId !== user.id,
          ),
        });

        await userRemove;
        break;
      }
      case "unit": {
        const unit = await fetchUnit(moduleId);

        //Update of assignTo of users
        await updateAssignToAndAclsOfUser({
          oldUsersIds: [user.id],
          moduleId: moduleId,
          users: users,
        });

        await updateUnit(moduleId, {
          ...(unit.bossId === user.id && { bossId: null }),
          membersIds: unit.membersIds.filter(
            (memberId) => memberId !== user.id,
          ),
        });

        await userRemove;
        break;
      }
      case "section": {
        const section = await fetchSection(moduleId);

        //Update of assignTo of users
        await updateAssignToAndAclsOfUser({
          oldUsersIds: [user.id],
          moduleId: moduleId,
          users: users,
        });

        await updateSection(moduleId, {
          ...(section.bossId === user.id && { bossId: null }),
          membersIds: section.membersIds.filter(
            (memberId) => memberId !== user.id,
          ),
        });

        await userRemove;
        break;
      }
      case "office": {
        const office = await fetchOffice(moduleId);

        //Update of assignTo of users
        await updateAssignToAndAclsOfUser({
          oldUsersIds: [user.id],
          moduleId: moduleId,
          users: users,
        });

        await updateOffice(moduleId, {
          ...(office.bossId === user.id && { bossId: null }),
          membersIds: office.membersIds.filter(
            (memberId) => memberId !== user.id,
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
          ? "de la ENTIDAD / G.U"
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
          withUserDeletion,
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
            "Para eliminar, el usuario no debe estar como miembro o jefe en (entidad / G.U, departamento, sección u oficina)",
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

  const options = [
    { label: "Todos", value: "all" },
    { label: "Sin Comando", value: "noCommand" },
    {
      label: "Comando De Bienestar Del Ejército (COBIENE)",
      value: "cobiene",
    },
    {
      label: "Comando Logístico Del Ejército (COLOGE)",
      value: "cologe",
    },
    {
      label: "Comando De Personal Del Ejército (COPERE)",
      value: "copere",
    },
  ];

  const usersView = users.filter((user) =>
    userType === "all"
      ? user
      : user?.commands?.some((command) => command.id === userType)
        ? user
        : userType === "noCommand"
          ? isEmpty(user.commands)
          : null,
  );

  const isDisabledUsers = usersView.filter((user) => user.cgi === disabledUser);

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
          <Title level={3}>Usuarios ({isDisabledUsers?.length})</Title>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Select
            value={userType}
            onChange={(value) => setUserType(value)}
            options={options}
          />
        </Col>
        <Col span={24} md={6}>
          <Button
            type={disabledUser ? "primary" : "default"}
            danger
            block
            onClick={(e) => setDisabledUser(!disabledUser)}
            icon={<FontAwesomeIcon icon={faAccessibleIcon} />}
          >
            {disabledUser ? "Discapacitados" : "No Discapacitados"}
          </Button>
        </Col>
        <Col span={24}>
          <UsersTable
            users={isDisabledUsers}
            onEditUser={onEditUser}
            onRemoveUser={onConfirmRemoveUser}
            onUnlinkAssignedToUser={onConfirmUnlinkAssignedToUser}
          />
        </Col>
      </Row>
    </Acl>
  );
};
