import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { firestore } from "../../firebase";
import { useAcl, useAsync } from "../../hooks";
import { capitalize } from "lodash";
import { Acl, Button, List, notification } from "../../components";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { useGlobalData } from "../../providers";

export const DefaultRolesAclsIntegration = () => {
  const navigate = useNavigate();
  const { rolesAcls } = useGlobalData();

  const {
    run: deleteRoleAcls,
    error: deleteRoleAclsError,
    success: deleteRoleAclsSuccess,
  } = useAsync((roleAcls) =>
    firestore
      .collection("roles-acls")
      .doc(roleAcls.id)
      .update({ isDeleted: true })
  );

  useEffect(() => {
    deleteRoleAclsError && notification({ type: "error" });
  }, [deleteRoleAclsError]);

  useEffect(() => {
    deleteRoleAclsSuccess &&
      notification({
        type: "success",
        title: "El rol se eliminó exitosamente junto con sus acls!",
      });
  }, [deleteRoleAclsSuccess]);

  const onAddRoleAcls = () => navigateToRoleAcls("new");

  const onEditRoleAcls = (roleAcls) => navigateToRoleAcls(roleAcls.id);

  const navigateToRoleAcls = (roleAclsId = undefined) => {
    const url = `/default-roles-acls/${roleAclsId}`;

    navigate(url);
  };

  const onDeleteRoleAcls = async (roleAcls) => deleteRoleAcls(roleAcls);

  return (
    <DefaultRolesAcls
      rolesAcls={rolesAcls}
      onAddRoleAcls={onAddRoleAcls}
      onEditRoleAcls={onEditRoleAcls}
      onDeleteRoleAcls={onDeleteRoleAcls}
    />
  );
};

const DefaultRolesAcls = ({
  rolesAcls,
  onAddRoleAcls,
  onDeleteRoleAcls,
  onEditRoleAcls,
}) => {
  const { aclCheck } = useAcl();

  const rolesAclsView = rolesAcls.map((roleAcl) => ({
    id: roleAcl.id,
    name: capitalize(roleAcl.roleCode),
    initialPathname: "/home",
  }));

  console.log(rolesAclsView);

  return (
    <Acl redirect name="/default-roles-acls">
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Button
            onClick={onAddRoleAcls}
            type="primary"
            size="large"
            icon={<FontAwesomeIcon icon={faPlus} />}
          >
            &ensp; Agregar rol con acls
          </Button>
        </Col>
        <Col span={24}>
          <List
            dataSource={rolesAclsView}
            onDeleteItem={(roleAcls) => onDeleteRoleAcls(roleAcls)}
            onEditItem={(roleAcls) => onEditRoleAcls(roleAcls)}
            itemTitle={(roleAcls) => roleAcls.name}
            visibleEditItem={() => aclCheck("/default-roles-acls/:roleAclsId")}
            visibleDeleteItem={() => aclCheck("/default-roles-acls#delete")}
          />
        </Col>
      </Row>
    </Acl>
  );
};
