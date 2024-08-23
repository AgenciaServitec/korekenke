import React, { useEffect, useState } from "react";
import {
  useDefaultFirestoreProps,
  useUpdateAssignToAndAclsOfUser,
} from "../../../../hooks";
import {
  Acl,
  Col,
  notification,
  RolesByGroupIntegration,
  Row,
  Tabs,
  Title,
} from "../../../../components";
import { useNavigate, useParams } from "react-router";
import {
  addUnit,
  getDepartmentId,
  unitsRef,
  updateUnit,
} from "../../../../firebase/collections";
import { useCommand, useGlobalData } from "../../../../providers";
import { getNameId } from "../../../../utils";
import { EditingUnit } from "./EditingUnit";
import { AssignmentForUsers } from "../../../../data-list";

export const UnitIntegration = () => {
  const navigate = useNavigate();
  const { unitId } = useParams();
  const { entities, departments, offices, sections, rolesAcls, users } =
    useGlobalData();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();
  const { updateAssignToAndAclsOfUser } = useUpdateAssignToAndAclsOfUser();
  const { currentCommand } = useCommand();

  const [loading, setLoading] = useState();
  const [unit, setUnit] = useState({});

  const isNew = unitId === "new";
  const onGoBack = () => navigate(-1);

  useEffect(() => {
    (async () => {
      if (isNew) {
        setUnit({ id: getDepartmentId() });
        return;
      }

      await unitsRef
        .doc(unitId)
        .onSnapshot((snapshot) => setUnit(snapshot.data()));
    })();
  }, []);

  const mapUnit = (formData) => ({
    ...unit,
    name: formData.name,
    nameId: getNameId(formData.name),
    membersIds: formData.membersIds || [],
    bossId: formData.bossId || null,
    commandId: unit?.commandId || currentCommand.id,
    entityId: formData.entityId,
    departmentId: formData.departmentId,
    officeId: formData.officeId,
    sectionId: formData.sectionId,
  });

  const saveUnit = async (formData) => {
    try {
      setLoading(true);

      const usersIdsDeselected = formData?.membersIds
        ? (unit?.membersIds || []).filter(
            (memberId) => !formData.membersIds.includes(memberId),
          )
        : [];

      //Update of assignTo of users
      await updateAssignToAndAclsOfUser({
        oldUsersIds: usersIdsDeselected,
        newUsersIds: formData?.membersIds,
        moduleNameId: AssignmentForUsers.unit,
        module: unit,
        users: users,
        formData: formData,
      });

      isNew
        ? await addUnit(assignCreateProps(mapUnit(formData)))
        : await updateUnit(unit.id, assignUpdateProps(mapUnit(formData)));

      notification({ type: "success" });

      onGoBack();
    } catch (e) {
      console.error("ErrorSaveUnit: ", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Unit
      isNew={isNew}
      users={users}
      unit={unit}
      entities={entities}
      departments={departments}
      offices={offices}
      sections={sections}
      rolesAcls={rolesAcls}
      loading={loading}
      onSaveUnit={saveUnit}
      onGoBack={onGoBack}
    />
  );
};

const Unit = ({
  isNew,
  users,
  rolesAcls,
  unit,
  entities,
  departments,
  offices,
  sections,
  loading,
  onSaveUnit,
  onGoBack,
}) => {
  const [tabView, setTabView] = useState(1);

  return (
    <Acl
      category="administration"
      subCategory="units"
      name={isNew ? "/units/new" : "/units/:unitId"}
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>Unidad</Title>
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
                  <EditingUnit
                    isNew={isNew}
                    onGoBack={onGoBack}
                    users={users}
                    rolesAcls={rolesAcls}
                    unit={unit}
                    departments={departments}
                    entities={entities}
                    sections={sections}
                    offices={offices}
                    loading={loading}
                    onSaveUnit={onSaveUnit}
                  />
                ),
              },
              {
                label: "Roles",
                disabled: !unit?.name,
                key: 2,
                children: (
                  <RolesByGroupIntegration
                    moduleType="units"
                    moduleData={unit}
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
