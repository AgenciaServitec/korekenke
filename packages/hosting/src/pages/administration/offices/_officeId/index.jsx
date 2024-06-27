import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGlobalData } from "../../../../providers";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../hooks";
import { capitalize, concat, isEmpty } from "lodash";
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
import {
  addOffice,
  getOfficeId,
  updateOffice,
} from "../../../../firebase/collections";
import { findRole, userFullName } from "../../../../utils";
import { useUpdateAssignToInUser } from "../../../../hooks/useUpdateAssignToInUser";

export const OfficeIntegration = () => {
  const { officeId } = useParams();
  const navigate = useNavigate();
  const { offices, officeUsers, sections, rolesAcls } = useGlobalData();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();
  const { updateAssignToUser } = useUpdateAssignToInUser();

  const [loading, setLoading] = useState(false);
  const [office, setOffice] = useState({});
  const isNew = officeId === "new";

  useEffect(() => {
    const _office = isNew
      ? { id: getOfficeId() }
      : offices.find((office) => office.id === officeId);

    if (!_office) navigate(-1);

    setOffice(_office);
  }, []);

  const mapOffice = (formData) => ({
    ...office,
    name: formData.name,
    description: formData.description,
    sectionId: formData.sectionId,
    membersIds: formData?.membersIds || [],
    bossId: formData.bossId || null,
  });

  const saveOffice = async (formData) => {
    try {
      //Get users ids deselection
      const usersIdsDeselected = (office?.membersIds || []).filter(
        (memberId) => !(formData?.membersIds || []).includes(memberId)
      );

      //Update of assignTo of users
      await updateAssignToUser({
        oldUsersIds: usersIdsDeselected,
        newUsersIds: formData.membersIds,
        moduleId: office?.id,
        users: officeUsers,
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

  const onGoBack = () => navigate(-1);

  return (
    <Office
      isNew={isNew}
      office={office}
      sections={sections}
      rolesAcls={rolesAcls}
      officeUsers={officeUsers}
      onSaveOffice={saveOffice}
      onGoBack={onGoBack}
      loading={loading}
    />
  );
};

const Office = ({
  isNew,
  onGoBack,
  office,
  sections,
  rolesAcls,
  officeUsers,
  onSaveOffice,
  loading,
}) => {
  const schema = yup.object({
    name: yup.string().required(),
    description: yup.string(),
    sectionId: yup.string().required(),
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
  }, [office]);

  const resetForm = () => {
    reset({
      name: office?.name || "",
      description: office?.description || "",
      sectionId: office?.sectionId || "",
      membersIds: office?.membersIds || null,
      bossId: office?.bossId || "",
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

  const membersInEdition = officeUsers.filter((user) =>
    !isEmpty(office?.membersIds) ? office.membersIds.includes(user.id) : false
  );

  const userBosses = officeUsers.filter(
    (user) => user.roleCode === "office_boss"
  );

  //LIST TO SELECTS
  const usersViewForMembers = concat(
    isNew ? [] : membersInEdition,
    officeUsers.filter(
      (user) => user.assignedTo.type === "office" && isEmpty(user.assignedTo.id)
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

  const submitSaveOffice = (formData) => onSaveOffice(formData);

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
          <Form onSubmit={handleSubmit(submitSaveOffice)}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Controller
                  name="name"
                  control={control}
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
                  name="description"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Descripción"
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
                  name="sectionId"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Sección"
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      options={sections.map((section) => ({
                        label: section.name,
                        value: section.id,
                      }))}
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <Controller
                  name="membersIds"
                  control={control}
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
