import React from "react";
import {
  Acl,
  AddButton,
  Col,
  Divider,
  modalConfirm,
  notification,
  Row,
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

export const Users = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();
  const { users, rolesAcls } = useGlobalData();
  const { patchUser, patchUserResponse } = useApiUserPatch();

  const navigateTo = (userId) => navigate(userId);

  const onAddUser = () => navigateTo("new");
  const onEditUser = (user) => navigateTo(user.id);

  // const removeUserOfGroup = (user) =>
  //   modalConfirm({
  //     title: `¿Estás seguro de que quieres desvincular al usuario ${
  //       user.assignedTo.type === "entity"
  //         ? "de la ENTIDAD"
  //         : user.assignedTo.type === "department"
  //         ? "del DEPARTAMENTO"
  //         : user.assignedTo.type === "office"
  //         ? "de la OFICINA"
  //         : "de la SECCIÓN"
  //     }?`,
  //     onOk: async () => {
  //       console.log({ user });
  //     },
  //   });

  const onDeleteUser = async (user) => {
    try {
      if (!isEmpty(user?.assignedTo?.id)) {
        return notification({
          type: "open",
          icon: <FontAwesomeIcon icon={faWarning} color="orange" size="lg" />,
          title: "Este usuario está asignado como miembro",
          description:
            "Para eliminar, el usuario no debe estar como miembro en ningún grupo como (departamento, sección u oficina)",
          // btn: (
          //   <Space>
          //     <Button
          //       type="primary"
          //       size="small"
          //       onClick={() => removeUserOfGroup(user)}
          //     >
          //       Desvincular usuario
          //     </Button>
          //   </Space>
          // ),
        });
      }

      const user_ = assign({}, user, { updateBy: authUser?.email });

      const response = await patchUser(user_);
      if (!patchUserResponse.ok) {
        throw new Error(response);
      }

      notification({
        type: "success",
        title: "User deleted successfully!",
      });
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
        <Col span={24}>
          <UsersTable
            users={users}
            rolesAcls={rolesAcls}
            onEditUser={onEditUser}
            onConfirmRemoveUser={onConfirmRemoveUser}
          />
        </Col>
      </Row>
    </Acl>
  );
};
