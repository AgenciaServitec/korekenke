import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAcl, useAsync, useDefaultFirestoreProps } from "../../../hooks";
import { capitalize } from "lodash";
import { Acl, Button, List, notification } from "../../../components";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { useGlobalData } from "../../../providers";
import { updateRoleAcl } from "../../../firebase/collections";
import { pathnameWithCommand } from "../../../utils";
import { useParams } from "react-router";

export const DefaultRolesAclsIntegration = () => {
  const { commandId } = useParams();
  const navigate = useNavigate();
  const { rolesAcls } = useGlobalData();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const {
    run: deleteRoleAcls,
    error: deleteRoleAclsError,
    success: deleteRoleAclsSuccess,
  } = useAsync((roleAcls) =>
    updateRoleAcl(roleAcls.id, assignDeleteProps(roleAcls))
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

  const navigateToRoleAcls = (roleAclsId = undefined) =>
    navigate(
      pathnameWithCommand(commandId, `/default-roles-acls/${roleAclsId}`)
    );

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
    name: capitalize(roleAcl.name),
    initialPathname: "/home",
  }));

  return (
    <Acl
      category="accessControl"
      subCategory="defaultRolesAcls"
      name="/default-roles-acls"
      redirect
    >
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
            visibleEditItem={() =>
              aclCheck("accessControl", "defaultRolesAcls", [
                "/default-roles-acls/:roleAclsId",
              ])
            }
            visibleDeleteItem={() =>
              aclCheck("accessControl", "defaultRolesAcls", [
                "/default-roles-acls#delete",
              ])
            }
          />
        </Col>
      </Row>
    </Acl>
  );
};
