import React from "react";
import {
  Acl,
  Button,
  Col,
  List,
  notification,
  Row,
  Title,
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
import { Link } from "react-router-dom";
import { userFullName } from "../../../utils";

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

  const departmentsViews = departments.map((department) => {
    const boss = users.find((user) => user.id === department?.bossId);

    return {
      ...department,
      boss: boss || null,
    };
  });

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
            dataSource={departmentsViews}
            onDeleteItem={(department) => onDeleteDepartment(department)}
            onEditItem={(department) => onEditDepartment(department)}
            itemTitle={(department) => (
              <div>
                <Title level={5}>
                  {department.name}{" "}
                  {department?.abbreviation && (
                    <span>({department?.abbreviation.toUpperCase()})</span>
                  )}
                </Title>
                <div style={{ fontSize: 12 }}>
                  Jefe:{" "}
                  {department?.bossId ? (
                    <Link
                      to={`/users/${department?.bossId}`}
                      style={{ fontSize: 12 }}
                    >
                      {department?.boss ? userFullName(department?.boss) : null}
                    </Link>
                  ) : (
                    "No se asignó un jefe"
                  )}
                </div>
                <div style={{ fontSize: 12 }}>
                  Miembros:{" "}
                  {department?.membersIds
                    ? department?.membersIds.length
                    : "No hay miembros"}
                </div>
              </div>
            )}
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
