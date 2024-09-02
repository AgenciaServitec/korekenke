import React from "react";
import { Acl, Button, Col, List, notification, Row } from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useGlobalData } from "../../../providers";
import {
  useAcl,
  useDefaultFirestoreProps,
  useUpdateAssignToAndAclsOfUser,
} from "../../../hooks";
import { updateDepartment } from "../../../firebase/collections";

export const DepartmentsIntegration = () => {
  const navigate = useNavigate();
  const { departments, users } = useGlobalData();
  const { aclCheck } = useAcl();
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const { updateAssignToAndAclsOfUser } = useUpdateAssignToAndAclsOfUser();

  const navigateTo = (departmentId) => navigate(departmentId);

  const onAddDepartment = () => navigateTo("new");
  const onEditDepartment = (department) => navigateTo(department?.id);
  const onDeleteDepartment = async (department) => {
    try {
      await updateAssignToAndAclsOfUser({
        oldUsersIds: department.membersIds,
        users: users,
      });

      await updateDepartment(
        department.id,
        assignDeleteProps({
          isDeleted: true,
          membersIds: null,
          bossId: null,
          secondBossId: null,
        }),
      );
    } catch (e) {
      console.error("ErrorDeleteDepartment: ", e);
      notification({ type: "error" });
    }
  };

  return (
    <Acl
      category="administration"
      subCategory="departments"
      name="/departments"
      redirect
    >
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Acl
            category="administration"
            subCategory="departments"
            name="/departments/new"
          >
            <Button
              onClick={onAddDepartment}
              type="primary"
              size="large"
              icon={<FontAwesomeIcon icon={faPlus} />}
            >
              &ensp; Agregar Departamento
            </Button>
          </Acl>
        </Col>
        <Col span={24}>
          <List
            dataSource={departments}
            onDeleteItem={(department) => onDeleteDepartment(department)}
            onEditItem={(department) => onEditDepartment(department)}
            itemTitle={(department) => department.name}
            visibleEditItem={() =>
              aclCheck("administration", "departments", [
                "/departments/:departmentId",
              ])
            }
            visibleDeleteItem={() =>
              aclCheck("administration", "departments", ["/departments#delete"])
            }
          />
        </Col>
      </Row>
    </Acl>
  );
};
