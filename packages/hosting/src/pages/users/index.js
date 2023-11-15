import React from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Typography from "antd/lib/typography";
import List from "antd/lib/list";
import Tag from "antd/lib/tag";
import {
  Button,
  IconAction,
  modalConfirm,
  notification,
} from "../../components";
import { Divider } from "antd";
import { useAuthentication, useGlobalData } from "../../providers";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useDevice } from "../../hooks";
import { Link } from "react-router-dom";
import { roles } from "../../data-list";
import { useApiUserPatch } from "../../api";
import { assign, capitalize } from "lodash";

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

  const findRole = (roleCode) =>
    roles.find((role) => role.roleCode === roleCode);

  const onDeleteUser = async (_user) => {
    const user_ = assign({}, _user, { updateBy: authUser?.email });

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
      content: "El usuario se eliminara",
      onOk: async () => {
        await onDeleteUser(user);
      },
    });

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Button type="primary" onClick={() => onAddUser()}>
          Agregar usuario
        </Button>
      </Col>
      <Divider />
      <Col span={24}>
        <Title level={3}>Usuarios</Title>
      </Col>
      <Col span={24}>
        <List
          className="demo-loadmore-list"
          itemLayout={isMobile}
          dataSource={users}
          renderItem={(user) => (
            <List.Item
              actions={[
                <IconAction
                  key={user.id}
                  tooltipTitle="Editar"
                  icon={faEdit}
                  onClick={() => onEditUser(user)}
                />,
                <IconAction
                  key={user.id}
                  tooltipTitle="Eliminar"
                  styled={{ color: (theme) => theme.colors.error }}
                  icon={faTrash}
                  onClick={() => onConfirmRemoveUser(user)}
                />,
              ]}
            >
              <List.Item.Meta
                title={
                  <Link to={`/users/${user.id}`}>
                    <h4 className="link-color">{user.email}</h4>
                  </Link>
                }
                description={
                  <>
                    <div>
                      <Text>
                        {capitalize(`${user?.firstName} ${user?.lastName}`)}
                      </Text>
                    </div>
                    <div>
                      <Text>
                        Rol:{" "}
                        <Tag color="blue">{`${
                          findRole(user?.roleCode)?.roleName || ""
                        }`}</Tag>
                      </Text>
                    </div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
};
