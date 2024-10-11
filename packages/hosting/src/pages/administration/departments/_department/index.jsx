import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useCommand, useGlobalData } from "../../../../providers";
import {
  useDefaultFirestoreProps,
  useUpdateAssignToAndAclsOfUser,
} from "../../../../hooks";
import {
  Acl,
  Col,
  notification,
  Row,
  Tabs,
  Title,
  RolesByGroupIntegration,
} from "../../../../components";
import {
  addDepartment,
  departmentsRef,
  getDepartmentId,
  updateDepartment,
} from "../../../../firebase/collections";
import { getNameId } from "../../../../utils";
import { EditingDepartment } from "./EditingDepartment";
import { AssignmentForUsers } from "../../../../data-list";

export const DepartmentIntegration = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const { rolesAcls, entities, units, offices, sections, users } =
    useGlobalData();
  const { currentCommand } = useCommand();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();
  const { updateAssignToAndAclsOfUser } = useUpdateAssignToAndAclsOfUser();

  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState({});

  const isNew = departmentId === "new";
  const onGoBack = () => navigate(-1);

  useEffect(() => {
    (async () => {
      if (isNew) {
        setDepartment({ id: getDepartmentId() });
        return;
      }

      await departmentsRef
        .doc(departmentId)
        .onSnapshot((snapshot) => setDepartment(snapshot.data()));
    })();
  }, []);

  const mapDepartment = (formData) => ({
    ...department,
    name: formData.name,
    nameId: getNameId(formData.name),
    description: formData.description,
    membersIds: formData?.membersIds || [],
    bossId: formData?.bossId || null,
    secondBossId: formData?.secondBossId || null,
    commandId: department?.commandId || currentCommand.id,
    entityId: formData.entityId,
    unitId: formData.unitId,
    officeId: formData.officeId,
    sectionId: formData.sectionId,
  });

  const onSaveDepartment = async (formData) => {
    try {
      setLoading(true);

      //Get users ids deselection
      const usersIdsDeselected = formData?.membersIds
        ? (department?.membersIds || []).filter(
            (memberId) => !formData.membersIds.includes(memberId),
          )
        : [];

      //Update of assignTo of users
      await updateAssignToAndAclsOfUser({
        oldUsersIds: usersIdsDeselected,
        newUsersIds: formData?.membersIds,
        moduleNameId: AssignmentForUsers.department,
        module: department,
        users: users,
        formData: formData,
      });

      //Update of department
      isNew
        ? await addDepartment(assignCreateProps(mapDepartment(formData)))
        : await updateDepartment(
            department.id,
            assignUpdateProps(mapDepartment(formData)),
          );

      notification({ type: "success" });

      onGoBack();
    } catch (e) {
      console.error("ErrorSaveDepartment: ", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Department
      isNew={isNew}
      onGoBack={onGoBack}
      department={department}
      rolesAcls={rolesAcls}
      entities={entities}
      units={units}
      sections={sections}
      offices={offices}
      users={users}
      onSaveDepartment={onSaveDepartment}
      loading={loading}
    />
  );
};

const Department = ({
  isNew,
  onGoBack,
  department,
  rolesAcls,
  entities,
  units,
  sections,
  offices,
  users,
  onSaveDepartment,
  loading,
}) => {
  const [tabView, setTabView] = useState(1);

  return (
    <Acl
      category="administration"
      subCategory="departments"
      name={isNew ? "/departments/new" : "/departments/:departmentId"}
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>Departamento</Title>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Tabs
            defaultActiveKey={tabView}
            onChange={setTabView}
            type="card"
            items={[
              {
                label: "Edicion",
                key: 1,
                children: (
                  <EditingDepartment
                    isNew={isNew}
                    onGoBack={onGoBack}
                    users={users}
                    rolesAcls={rolesAcls}
                    department={department}
                    entities={entities}
                    units={units}
                    sections={sections}
                    offices={offices}
                    loading={loading}
                    onSaveDepartment={onSaveDepartment}
                  />
                ),
              },
              {
                label: "Roles",
                disabled: !department?.name,
                key: 2,
                children: (
                  <RolesByGroupIntegration
                    moduleType="departments"
                    moduleData={department}
                    rolesToOptionsSelect={["boss", "secondary_boss", "member"]}
                  />
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </Acl>
  );
};
