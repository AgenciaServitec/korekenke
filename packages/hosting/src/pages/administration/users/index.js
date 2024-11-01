import React, { useEffect, useState } from "react";
import {
  Acl,
  AddButton,
  Button,
  Col,
  Divider,
  Input,
  modalConfirm,
  notification,
  Row,
  Select,
  Space,
  Switch,
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
import { assign, isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faWarning } from "@fortawesome/free-solid-svg-icons";
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
import { useQueryString, useUpdateAssignToAndAclsOfUser } from "../../../hooks";
import styled from "styled-components";
import { upperCase } from "lodash/string";

export const Users = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();
  const { users } = useGlobalData();
  const { currentCommand } = useCommand();
  const { patchUser, patchUserResponse } = useApiUserPatch();
  const { updateAssignToAndAclsOfUser } = useUpdateAssignToAndAclsOfUser();
  const [userType, onSetUserType] = useQueryString(
    "userType",
    currentCommand.id,
  );
  const [disabledUser, onSetDisabledUser] = useQueryString(
    "disabledUser",
    false,
  );
  const [userSearch, setUserSearch] = useState("");
  const [usersView, setUsersView] = useState([]);

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

  const isSuperAdmin = authUser?.roleCode === "super_admin";

  const options = [
    ...(isSuperAdmin ? [{ label: "Todos", value: "all" }] : []),
    { label: "Sin Comando", value: "ep" },
    ...(isSuperAdmin
      ? [
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
        ]
      : [
          {
            label: `${currentCommand?.name} (${upperCase(currentCommand?.id)})`,
            value: currentCommand?.id,
          },
        ]),
  ];

  const usersViewTable = users.filter((user) =>
    userType === "all"
      ? user
      : user?.commands?.some((command) => command.id === userType)
        ? user
        : userType === "ep"
          ? isEmpty(user.commands)
          : null,
  );

  const handleUserSearch = (e) => {
    const user = e.target.value;
    setUserSearch(user);
  };

  useEffect(() => {
    const usersMatch = usersViewTable.filter((_user) => {
      if (
        `${_user.firstName} ${_user.paternalSurname} ${_user.maternalSurname} ${_user.degree} ${_user.cip}`.includes(
          userSearch,
        )
      )
        return _user;
    });

    if (isEmpty(userSearch)) {
      setUsersView(usersViewTable);
    } else {
      setUsersView(usersMatch);
    }
  }, [userSearch, userType]);

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
          <Container>
            <Input
              label="Búsqueda de usuarios (Nombres, Grado y Cip)"
              value={userSearch}
              onChange={handleUserSearch}
              name={name}
              suffix={<FontAwesomeIcon icon={faSearch} />}
            />
          </Container>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Select
            value={userType}
            onChange={(value) => onSetUserType(value)}
            options={options}
          />
        </Col>
        <Col span={24} md={12} lg={8}>
          <ContainerDisabledUser>
            <Space>
              <span>Visualizar Discapacitados</span>
              <Switch
                value={disabledUser}
                onChange={(value) => onSetDisabledUser(value)}
                checkedChildren="Si"
                unCheckedChildren="No"
              />
            </Space>
          </ContainerDisabledUser>
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

const Container = styled.div`
  input {
    height: 1.65rem;
  }
`;

const ContainerDisabledUser = styled.div`
  span {
    font-weight: 500;
  }

  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;
