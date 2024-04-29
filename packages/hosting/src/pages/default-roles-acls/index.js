import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { firestore } from "../../firebase";
import { allRoles } from "../../data-list";
import { useAcl, useAsync } from "../../hooks";
import { assign, get } from "lodash";
import { Button, List, notification } from "../../components";
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
    firestore.collection("roles-acls").doc(roleAcls.id).delete()
  );

  useEffect(() => {
    deleteRoleAclsError && notification({ type: "error" });
  }, [deleteRoleAclsError]);

  useEffect(() => {
    deleteRoleAclsSuccess &&
      notification({
        type: "success",
        title: "Role Acls deleted successfully!",
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

  const rolesAclsView = rolesAcls.map((roleAcls) =>
    assign({}, roleAcls, {
      role: allRoles.find((role) => role.code === roleAcls.roleCode),
    })
  );

  return (
    <Row gutter={[0, 24]}>
      <Col span={24}>
        <Button
          onClick={onAddRoleAcls}
          type="primary"
          size="large"
          icon={<FontAwesomeIcon icon={faPlus} />}
        >
          &ensp; Add role acl
        </Button>
      </Col>
      <Col span={24}>
        <List
          dataSource={rolesAclsView}
          onDeleteItem={(roleAcls) => onDeleteRoleAcls(roleAcls)}
          onEditItem={(roleAcls) => onEditRoleAcls(roleAcls)}
          itemTitle={(roleAcls) => get(roleAcls, "role.name", "")}
          visibleEditItem={() => aclCheck("/default-roles-acls/:roleAclsId")}
          visibleDeleteItem={() => aclCheck("/default-roles-acls#delete")}
        />
      </Col>
    </Row>
  );
};
