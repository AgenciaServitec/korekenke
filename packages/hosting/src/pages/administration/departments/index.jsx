import React from "react";
import { Acl, Button, Col, List, notification, Row } from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useGlobalData } from "../../../providers";
import { useAcl, useDefaultFirestoreProps } from "../../../hooks";
import { updateDepartment } from "../../../firebase/collections";
import { useUpdateAssignToInUser } from "../../../hooks/useUpdateAssignToInUser";

export const DepartmentsIntegration = () => {
  const navigate = useNavigate();
  const { departments, departmentUsers } = useGlobalData();
  const { aclCheck } = useAcl();
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const { updateAssignToUser } = useUpdateAssignToInUser();

  const navigateTo = (departmentId) => navigate(`/departments/${departmentId}`);

  const onAddDepartment = () => navigateTo("new");
  const onEditDepartment = (department) => navigateTo(department?.id);
  const onDeleteDepartment = async (department) => {
    try {
      await updateAssignToUser({
        oldUsersIds: department.membersIds,
        users: departmentUsers,
      });

      await updateDepartment(
        department.id,
        assignDeleteProps({
          isDeleted: true,
          membersIds: null,
          bossId: null,
          secondBossId: null,
        })
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
            onDeleteConfirmOptions={{
              title: "¿Seguro que deseas eliminar el departamento?",
              content:
                "Al eliminar el departamento los usuarios vinculados estaran libres para ser asignados en otros departamentos.",
            }}
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
