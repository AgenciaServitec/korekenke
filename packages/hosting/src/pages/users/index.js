import React from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Typography from "antd/lib/typography";
import { AddButton, modalConfirm, notification } from "../../components";
import { Divider } from "antd";
import { useAuthentication, useGlobalData } from "../../providers";
import { useNavigate } from "react-router";
import { UsersTable } from "./UserTable";
import { useDevice } from "../../hooks";
import { useApiUserPatch } from "../../api";
import { assign } from "lodash";

const { Title, Text } = Typography;

export const Users = () => {
  const { isMobile } = useDevice();
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
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <AddButton onClick={onAddUser} title="Usuario" margin="0" />
      </Col>
      <Divider />
      <Col span={24}>
        <Title level={3}>Usuarios</Title>
      </Col>
      <Col span={24}>
        <UsersTable users={users} onDeleteUser={onDeleteUser} />{" "}
        {/* Aquí se utiliza el componente UsersTable */}
      </Col>
    </Row>
  );
};
