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
  RolesByGroupIntegration,
  Row,
  Tabs,
  Title,
} from "../../../../components";
import {
  addOffice,
  getOfficeId,
  officesRef,
  updateOffice,
} from "../../../../firebase/collections";
import { getNameId } from "../../../../utils";
import { EditingOffice } from "./EditingOffice";

export const OfficeIntegration = () => {
  const { officeId } = useParams();
  const navigate = useNavigate();
  const { entities, departments, units, sections, offices, users, rolesAcls } =
    useGlobalData();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();
  const { updateAssignToAndAclsOfUser } = useUpdateAssignToAndAclsOfUser();
  const { currentCommand } = useCommand();

  const [loading, setLoading] = useState(false);
  const [office, setOffice] = useState({});

  const isNew = officeId === "new";
  const onGoBack = () => navigate(-1);

  useEffect(() => {
    (async () => {
      if (isNew) {
        setOffice({ id: getOfficeId() });
        return;
      }

      await officesRef
        .doc(officeId)
        .onSnapshot((snapshot) => setOffice(snapshot.data()));
    })();
  }, []);

  const mapOffice = (formData) => ({
    ...office,
    name: formData.name,
    nameId: getNameId(formData.name),
    description: formData.description,
    membersIds: formData?.membersIds || [],
    bossId: formData.bossId || null,
    commandId: office?.commandId || currentCommand.id,
    entityId: formData.entityId,
    departmentId: formData.departmentId,
    unitId: formData.unitId,
    sectionId: formData.sectionId,
  });

  const saveOffice = async (formData) => {
    try {
      //Get users ids deselection
      const usersIdsDeselected = (office?.membersIds || []).filter(
        (memberId) => !(formData?.membersIds || []).includes(memberId),
      );

      //Update of assignTo of users
      await updateAssignToAndAclsOfUser({
        oldUsersIds: usersIdsDeselected,
        newUsersIds: formData.membersIds,
        moduleId: office?.id,
        users: users,
      });

      //Update of office
      isNew
        ? await addOffice(assignCreateProps(mapOffice(formData)))
        : await updateOffice(office.id, assignUpdateProps(mapOffice(formData)));

      notification({ type: "success" });
      onGoBack();
    } catch (error) {
      console.error("Error saving office:", error);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Office
      isNew={isNew}
      office={office}
      entities={entities}
      departments={departments}
      units={units}
      sections={sections}
      rolesAcls={rolesAcls}
      users={users}
      onSaveOffice={saveOffice}
      onGoBack={onGoBack}
      loading={loading}
    />
  );
};

const Office = ({
  isNew,
  office,
  entities,
  departments,
  units,
  sections,
  rolesAcls,
  users,
  onSaveOffice,
  onGoBack,
  loading,
}) => {
  const [tabView, setTabView] = useState(1);

  return (
    <Acl
      category="administration"
      subCategory="offices"
      name={isNew ? "/offices/new" : "/offices/:officeId"}
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>Oficina</Title>
        </Col>
        <Col span={24}>
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
                      <EditingOffice
                        isNew={isNew}
                        onGoBack={onGoBack}
                        users={users}
                        rolesAcls={rolesAcls}
                        office={office}
                        entities={entities}
                        units={units}
                        departments={departments}
                        sections={sections}
                        loading={loading}
                        onSaveOffice={onSaveOffice}
                      />
                    ),
                  },
                  {
                    label: "Roles",
                    disabled: !office?.name,
                    key: 2,
                    children: (
                      <RolesByGroupIntegration
                        moduleType="offices"
                        moduleData={office}
                      />
                    ),
                  },
                ]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Acl>
  );
};
