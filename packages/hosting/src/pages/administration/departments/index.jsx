import React, { useState } from "react";
import {
  Acl,
  Button,
  Col,
  List,
  notification,
  Row,
  Select,
} from "../../../components";
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
import { concat } from "lodash";

export const DepartmentsIntegration = () => {
  const navigate = useNavigate();
  const { departments, departmentUsers, entities } = useGlobalData();
  const { aclCheck } = useAcl();
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const { updateAssignToUser } = useUpdateAssignToAndAclsOfUser();
  const [entityId, setEntityId] = useState("all");

  const navigateTo = (departmentId) => navigate(departmentId);

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
        }),
      );
    } catch (e) {
      console.error("ErrorDeleteDepartment: ", e);
      notification({ type: "error" });
    }
  };

  const departmentsView = departments.filter((department) =>
    entityId === "all" ? true : department.entityId === entityId,
  );

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
        <Col span={24} md={8}>
          <Select
            value={entityId}
            onChange={(value) => setEntityId(value)}
            options={concat(
              [{ label: "Todos", value: "all" }],
              entities.map((entity) => ({
                label: entity.name,
                value: entity.id,
              })),
            )}
          />
        </Col>
        <Col span={24}>
          <List
            dataSource={departmentsView}
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
