import React from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Typography from "antd/lib/typography";
import {
  Acl,
  AddButton,
  modalConfirm,
  notification,
} from "../../../components";
import { Divider } from "antd";
import { useAuthentication, useGlobalData } from "../../../providers";
import { useNavigate } from "react-router";
import { UsersTable } from "./UserTable";
import { useApiUserPatch } from "../../../api";
import { assign, isEmpty } from "lodash";

const { Title } = Typography;

export const Users = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();
  const { users } = useGlobalData();
  const { patchUser, patchUserResponse } = useApiUserPatch();

  const navigateTo = (userId) => {
    const url = `/users/${userId}`;
    navigate(url);
  };

  const onAddUser = () => navigateTo("new");

  const onEditUser = (user) => navigateTo(user.id);

  const onDeleteUser = async (user) => {
    if (!isEmpty(user?.assignedTo?.id)) {
      return notification({
        type: "warning",
        title: "Este usuario está asignado como miembro",
        description:
          "Para eliminar, el usuario no debe estar como miembro en ningún grupo como (departamento, sección u oficina)",
      });
    }

    const user_ = assign({}, user, { updateBy: authUser?.email });

    await patchUser(user_);

    if (!patchUserResponse.ok)
      return notification({
        type: "error",
      });

    notification({
      type: "success",
      title: "User deleted successfully!",
    });
  };

  const onConfirmRemoveUser = (user) =>
    modalConfirm({
      content: "El usuario se eliminará",
      onOk: async () => {
        await onDeleteUser(user);
      },
    });

  return (
    <Acl redirect name="/users">
      <Row gutter={[16, 16]}>
        <Acl name="/users/new">
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
        <Col span={24}>
          <UsersTable
            users={users}
            onEditUser={onEditUser}
            onConfirmRemoveUser={onConfirmRemoveUser}
          />
        </Col>
      </Row>
    </Acl>
  );
};
