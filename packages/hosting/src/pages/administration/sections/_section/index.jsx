import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGlobalData } from "../../../../providers";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../hooks";
import {
  Acl,
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
  Title,
} from "../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { capitalize, concat, isEmpty } from "lodash";
import {
  addSection,
  getSectionId,
  updateSection,
} from "../../../../firebase/collections";
import { findRole, userFullName } from "../../../../utils";
import { useUpdateAssignToInUser } from "../../../../hooks/useUpdateAssignToInUser";

export const SectionIntegration = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const { rolesAcls, departments, sections, sectionUsers } = useGlobalData();
  const { assignUpdateProps, assignCreateProps } = useDefaultFirestoreProps();
  const { updateAssignToUser } = useUpdateAssignToInUser();

  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState({});

  const isNew = sectionId === "new";
  const onGoBack = () => navigate(-1);

  useEffect(() => {
    const _section = isNew
      ? { id: getSectionId() }
      : sections.find((section) => section.id === sectionId);

    if (!_section) return navigate(-1);

    setSection(_section);
  }, []);

  const mapSection = (formData) => ({
    ...section,
    name: formData.name,
    departmentId: formData.departmentId,
    membersIds: formData?.membersIds || [],
    bossId: formData.bossId || null,
  });

  const onSaveSection = async (formData) => {
    try {
      setLoading(true);

      const usersIdsDeselected = (section?.membersIds || []).filter(
        (memberId) => !(formData?.membersIds || []).includes(memberId)
      );

      await updateAssignToUser({
        oldUsersIds: usersIdsDeselected,
        newUsersIds: formData.membersIds,
        moduleId: section?.id,
        users: sectionUsers,
      });

      isNew
        ? await addSection(assignCreateProps(mapSection(formData)))
        : await updateSection(
            section.id,
            assignUpdateProps(mapSection(formData))
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
      departments={departments}
      sectionUsers={sectionUsers}
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
  departments,
  sectionUsers,
  onSaveSection,
  loading,
}) => {
  const schema = yup.object({
    name: yup.string().required(),
    departmentId: yup.string().required(),
    membersIds: yup.array().nullable(),
    bossId: yup.string(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, [section]);

  const resetForm = () => {
    reset({
      name: section?.name || "",
      departmentId: section?.departmentId || "",
      membersIds: section?.membersIds || null,
      bossId: section?.bossId || "",
    });
  };

  //VIEWS TO SELECTS
  const mapOptionSelectMembers = (user) => ({
    label: `${userFullName(user)} (${capitalize(
      findRole(rolesAcls, user?.roleCode)?.name || ""
    )})`,
    value: user.id,
    key: user.id,
    roleCode: user.roleCode,
  });

  const membersInEdition = sectionUsers.filter((user) =>
    !isEmpty(section?.membersIds) ? section.membersIds.includes(user.id) : false
  );

  const userBosses = sectionUsers.filter(
    (user) => user.roleCode === "section_boss"
  );

  //LIST TO SELECTS
  const usersViewForMembers = concat(
    isNew ? [] : membersInEdition,
    sectionUsers.filter(
      (user) =>
        user?.assignedTo?.type === "section" && isEmpty(user?.assignedTo?.id)
    )
  ).map(mapOptionSelectMembers);

  const bossesView = () =>
    userBosses
      .filter((user) => (watch("membersIds") || []).includes(user.id))
      .map(mapOptionSelectMembers);

  const onChangeMembersWithValidation = (onChange, value) => {
    const _userBosses = userBosses.filter((user) => value.includes(user.id));

    if (_userBosses.length > 0) {
      setValue("bossId", _userBosses?.[0]?.id || "");
    }

    if (_userBosses.length <= 0) {
      setValue("bossId", "");
    }

    return onChange(value);
  };

  const onSubmitSaveSection = (formData) => onSaveSection(formData);

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
          <Form onSubmit={handleSubmit(onSubmitSaveSection)}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Nombre"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <Controller
                  name="departmentId"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Departamento"
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      options={departments.map((department) => ({
                        label: department.name,
                        value: department.id,
                      }))}
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <Controller
                  name="membersIds"
                  control={control}
                  defaultValue={null}
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      mode="multiple"
                      label="Miembros"
                      value={value}
                      onChange={(value) =>
                        onChangeMembersWithValidation(onChange, value)
                      }
                      error={error(name)}
                      required={required(name)}
                      options={usersViewForMembers}
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <Controller
                  name="bossId"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Jefe"
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      options={bossesView()}
                      disabled={!watch("membersIds")}
                    />
                  )}
                />
              </Col>
            </Row>
            <Row justify="end" gutter={[16, 16]}>
              <Col xs={24} sm={6} md={4}>
                <Button
                  type="default"
                  size="large"
                  block
                  onClick={() => onGoBack()}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </Col>
              <Col xs={24} sm={6} md={4}>
                <Button
                  type="primary"
                  size="large"
                  block
                  htmlType="submit"
                  loading={loading}
                >
                  Guardar
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Acl>
  );
};
