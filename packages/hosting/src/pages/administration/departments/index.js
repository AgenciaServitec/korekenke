import React from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { Acl, Button, List } from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useGlobalData } from "../../../providers";
import { useAcl, useDefaultFirestoreProps } from "../../../hooks";
import { updateDepartment } from "../../../firebase/collections";

export const DepartmentsIntegration = () => {
  const navigate = useNavigate();
  const { departments } = useGlobalData();
  const { aclCheck } = useAcl();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const navigateTo = (departmentsId) => {
    const url = `/departments/${departmentsId}`;
    navigate(url);
  };

  const onAddDepartment = () => navigateTo("new");

  const navigateToDepartment = (departmentId = undefined) => {
    const url = `/departments/${departmentId}`;
    navigate(url);
  };

  const onEditDepartment = (department) => navigateToDepartment(department.id);
  const onDeleteDepartment = async (department) => {
    try {
      await updateDepartment(
        department.id,
        assignDeleteProps({ isDeleted: true })
      );
    } catch (e) {
      console.error("ErrorDeleteDepartment: ", e);
    }
  };

  return (
    <Acl name="/departments" redirect>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Acl name="/departments/new">
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
            visibleEditItem={() => aclCheck("/departments/:departmentId")}
            visibleDeleteItem={() => aclCheck("/departments#delete")}
          />
        </Col>
      </Row>
    </Acl>
  );
};
