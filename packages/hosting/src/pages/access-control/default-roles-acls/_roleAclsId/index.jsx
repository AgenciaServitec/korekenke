import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useAsync,
  useDefaultFirestoreProps,
  useFormUtils,
} from "../../../../hooks";
import { assign, isEmpty, isObject } from "lodash";
import {
  Acl,
  Button,
  CheckboxGroup,
  Col,
  ComponentContainer,
  Form,
  Input,
  modalConfirm,
  notification,
  Row,
  Select,
  Title,
  Upload,
} from "../../../../components";
import { useNavigate, useParams } from "react-router-dom";
import { mapAcls } from "../../../../utils";
import { useAuthentication, useGlobalData } from "../../../../providers";
import {
  addRoleAcl,
  fetchRoleAcl,
  updateRoleAcl,
} from "../../../../firebase/collections";
import { acls } from "../../../../data-list";

export const RoleAclIntegration = () => {
  const navigate = useNavigate();
  const { roleAclsId } = useParams();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();
  const { authUser } = useAuthentication();

  const { rolesAcls } = useGlobalData();
  const [roleAcls, setRoleAcls] = useState({});

  useEffect(() => {
    const _roleAcls =
      roleAclsId !== "new"
        ? rolesAcls.find((roleAcls) => roleAcls.id === roleAclsId)
        : {};

    if (!_roleAcls) return navigate(-1);

    setRoleAcls(_roleAcls);
  }, []);

  const {
    run: saveRoleAcls,
    loading: saveRoleAclsLoading,
    error: saveRoleAclsError,
    success: saveRoleAclsSuccess,
  } = useAsync(async (roleAcls) => {
    roleAclsId === "new"
      ? await addRoleAcl(assignCreateProps(roleAcls))
      : await updateRoleAcl(roleAcls.id, assignUpdateProps(roleAcls));
  });

  useEffect(() => {
    saveRoleAclsError && notification({ type: "error" });
  }, [saveRoleAclsError]);

  useEffect(() => {
    if (saveRoleAclsSuccess) {
      notification({
        type: "success",
        title: "Acls de rol guardados exitosamente",
      });

      navigate(-1);
    }
  }, [saveRoleAclsSuccess]);

  const onSaveRoleAcls = async (formData) => {
    const roleId = formData.roleId.toLowerCase().split(" ").join("_");
    if (roleAclsId === "new") {
      const roleAcl = await fetchRoleAcl(roleId);
      if (roleAcl)
        return notification({
          type: "warning",
          title: "El nombre del Rol ya existe, ingrese un nuevo nombre.",
        });
    }

    await saveRoleAcls(
      assign({}, formData, {
        id: roleAcls?.id || roleId,
        name: formData.name.toLowerCase(),
        avatarImage: formData?.avatarImage || null,
        acls: mapAcls(formData.acls),
      })
    );
  };

  const onCancel = (modifiedFields) => {
    if (!isEmpty(modifiedFields))
      return modalConfirm({
        title: "¿Te vas sin guardar?",
        onOk: () => navigate(-1),
      });
    navigate(-1);
  };

  return (
    <RoleAcl
      isNew={roleAclsId === "new"}
      user={authUser}
      roleAcls={roleAcls}
      savingRoleAcls={saveRoleAclsLoading}
      onSaveRoleAcls={onSaveRoleAcls}
      onCancel={onCancel}
    />
  );
};

const RoleAcl = ({
  isNew,
  user,
  roleAcls,
  savingRoleAcls,
  onSaveRoleAcls,
  onCancel,
}) => {
  const schema = yup.object({
    roleId: yup.string().required(),
    name: yup.string().required(),
    initialPathname: yup.string().required(),
    avatarImage: yup.mixed().required(),
  });

  const {
    control,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    roleAcls && roleAclsToForm(roleAcls);
  }, [roleAcls]);

  const roleAclsToForm = (roleAcls) =>
    reset({
      roleId: roleAcls?.id || "",
      name: roleAcls?.name || "",
      avatarImage: roleAcls?.avatarImage || null,
      initialPathname: roleAcls?.initialPathname || "/home",
      acls: mapAcls(roleAcls?.acls),
    });

  const onSubmitRoleAcls = (formData) => onSaveRoleAcls(formData);

  return (
    <Acl
      category="accessControl"
      subCategory="defaultRolesAcls"
      name={
        isNew ? "/default-roles-acls/new" : "/default-roles-acls/:roleAclsId"
      }
      redirect
    >
      <Form onSubmit={handleSubmit(onSubmitRoleAcls)}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Controller
              name="roleId"
              defaultValue=""
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Rol id en inglés"
                  name={name}
                  onChange={onChange}
                  value={value}
                  error={error(name)}
                  disabled={!isNew}
                />
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              name="name"
              defaultValue=""
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Nombre"
                  name={name}
                  onChange={onChange}
                  value={value}
                  error={error(name)}
                />
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              name="initialPathname"
              defaultValue=""
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Select
                  label="Página de Inicio"
                  onChange={onChange}
                  value={value}
                  error={error(name)}
                  options={[
                    {
                      label: "Inicio",
                      value: "/home",
                    },
                    {
                      label: "Perfil",
                      value: "/profile",
                    },
                  ]}
                />
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              control={control}
              name="avatarImage"
              render={({ field: { onChange, value, name } }) => (
                <Upload
                  label="Avatar"
                  accept="image/*"
                  buttonText="Subir foto"
                  value={value}
                  name={name}
                  filePath={`default-roles/${user.id}`}
                  withThumbImage={false}
                  onChange={(file) => onChange(file)}
                  required={required(name)}
                  error={error(name)}
                />
              )}
            />
          </Col>
        </Row>
        <Row gutter={[16, 24]}>
          <Col span={24}>
            <Title level={4}>Privilegios de usuario</Title>
          </Col>
          {Object.entries(acls).map(([keyCategory, subCategories]) => (
            <Col span={24} key={keyCategory}>
              {/*{keyCategory === "jefatura-de-bienestar-del-ejercito" && (*/}
              {/*  <>*/}
              {/*    <h5>Entidades:</h5>*/}
              {/*    <br />*/}
              {/*  </>*/}
              {/*)}*/}
              <ComponentContainer.group label={subCategories.label}>
                <Row gutter={[16, 16]}>
                  {Object.entries(subCategories).map(
                    ([keySubCategory, items]) => {
                      const unlabeledAclsForSelectOptions =
                        isObject(items) &&
                        Object.entries(items).filter(
                          (_item) => !_item.includes("label")
                        );

                      return (
                        keySubCategory !== "label" && (
                          <Col span={24} key={keySubCategory}>
                            <Controller
                              name={`acls.${keyCategory}.${keySubCategory}`}
                              control={control}
                              render={({
                                field: { onChange, value, name },
                              }) => (
                                <CheckboxGroup
                                  label={items.label}
                                  options={unlabeledAclsForSelectOptions.map(
                                    (_item) => ({
                                      label: _item[1],
                                      value: _item[0],
                                    })
                                  )}
                                  name={name}
                                  value={value}
                                  onChange={onChange}
                                  error={error(name)}
                                  required={required(name)}
                                />
                              )}
                            />
                          </Col>
                        )
                      );
                    }
                  )}
                </Row>
              </ComponentContainer.group>
            </Col>
          ))}
        </Row>
        <Row justify="start" gutter={[16, 16]}>
          <Col xs={24} sm={12} md={5}>
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              block
              loading={savingRoleAcls}
            >
              Save
            </Button>
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Button
              size="large"
              block
              onClick={() => onCancel(dirtyFields)}
              disabled={savingRoleAcls}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    </Acl>
  );
};
