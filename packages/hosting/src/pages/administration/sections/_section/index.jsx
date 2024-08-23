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
  addSection,
  getSectionId,
  sectionsRef,
  updateSection,
} from "../../../../firebase/collections";
import { getNameId } from "../../../../utils";
import { EditingSection } from "./EditingSection";

export const SectionIntegration = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const { rolesAcls, entities, departments, units, sections, offices, users } =
    useGlobalData();
  const { assignUpdateProps, assignCreateProps } = useDefaultFirestoreProps();
  const { updateAssignToAndAclsOfUser } = useUpdateAssignToAndAclsOfUser();
  const { currentCommand } = useCommand();

  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState({});

  const isNew = sectionId === "new";
  const onGoBack = () => navigate(-1);

  useEffect(() => {
    (async () => {
      if (isNew) {
        setSection({ id: getSectionId() });
        return;
      }

      await sectionsRef
        .doc(sectionId)
        .onSnapshot((snapshot) => setSection(snapshot.data()));
    })();
  }, []);

  const mapSection = (formData) => ({
    ...section,
    name: formData.name,
    nameId: getNameId(formData.name),
    membersIds: formData?.membersIds || [],
    bossId: formData.bossId || null,
    commandId: section?.commandId || currentCommand.id,
    entityId: formData.entityId,
    departmentId: formData.departmentId,
    unitId: formData.unitId,
    officeId: formData.officeId,
  });

  const onSaveSection = async (formData) => {
    try {
      setLoading(true);

      const usersIdsDeselected = (section?.membersIds || []).filter(
        (memberId) => !(formData?.membersIds || []).includes(memberId),
      );

      await updateAssignToAndAclsOfUser({
        oldUsersIds: usersIdsDeselected,
        newUsersIds: formData.membersIds,
        moduleId: section?.id,
        users: users,
      });

      isNew
        ? await addSection(assignCreateProps(mapSection(formData)))
        : await updateSection(
            section.id,
            assignUpdateProps(mapSection(formData)),
          );

      notification({ type: "success" });

      onGoBack();
    } catch (e) {
      console.error("ErrorSaveSection: ", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section
      isNew={isNew}
      onGoBack={onGoBack}
      section={section}
      rolesAcls={rolesAcls}
      entities={entities}
      departments={departments}
      units={units}
      sections={sections}
      offices={offices}
      users={users}
      onSaveSection={onSaveSection}
      loading={loading}
    />
  );
};

const Section = ({
  isNew,
  onGoBack,
  section,
  rolesAcls,
  entities,
  departments,
  units,
  sections,
  offices,
  users,
  onSaveSection,
  loading,
}) => {
  const [tabView, setTabView] = useState(1);

  return (
    <Acl
      category="administration"
      subCategory="sections"
      name={isNew ? "/sections/new" : "/sections/:sectionId"}
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>Sección</Title>
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
                      <EditingSection
                        isNew={isNew}
                        onGoBack={onGoBack}
                        users={users}
                        rolesAcls={rolesAcls}
                        section={section}
                        entities={entities}
                        units={units}
                        departments={departments}
                        offices={offices}
                        loading={loading}
                        onSaveSection={onSaveSection}
                      />
                    ),
                  },
                  {
                    label: "Roles",
                    disabled: !section?.name,
                    key: 2,
                    children: (
                      <RolesByGroupIntegration
                        moduleType="sections"
                        moduleData={section}
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
