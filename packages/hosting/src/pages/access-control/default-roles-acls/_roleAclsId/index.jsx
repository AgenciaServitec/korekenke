import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useAsync,
  useDefaultFirestoreProps,
  useFormUtils,
} from "../../../../hooks";
import { isEmpty, isObject } from "lodash";
import {
  Acl,
  Button,
  CheckboxGroup,
  Col,
  ComponentContainer,
  Form,
  modalConfirm,
  notification,
  Row,
  Select,
  Title,
} from "../../../../components";
import { useNavigate, useParams } from "react-router-dom";
import { mapAcls } from "../../../../utils";
import { useGlobalData } from "../../../../providers";
import { addRoleAcl, updateRoleAcl } from "../../../../firebase/collections";
import { acls, Roles } from "../../../../data-list";

export const RoleAclIntegration = () => {
  const navigate = useNavigate();
  const { roleAclsId } = useParams();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

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
    const role = Roles.find((_role) => _role.id === formData.roleId);

    if (!role)
      return notification({
        type: "warning",
        title: "El Rol no existe.",
      });

    await saveRoleAcls({
      id: formData.roleId,
      name: role.name,
      initialPathname: role.initialPathname,
      acls: mapAcls(formData.acls),
    });
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
      roleAcls={roleAcls}
      savingRoleAcls={saveRoleAclsLoading}
      onSaveRoleAcls={onSaveRoleAcls}
      onCancel={onCancel}
    />
  );
};

const RoleAcl = ({
  isNew,
  roleAcls,
  savingRoleAcls,
  onSaveRoleAcls,
  onCancel,
}) => {
  const schema = yup.object({
    roleId: yup.string().required(),
  });

  const {
    control,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      "acls.default.home": ["/home"],
      "acls.default.profile": ["/profile"],
    },
  });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    roleAcls && roleAclsToForm(roleAcls);
  }, [roleAcls]);

  const roleAclsToForm = (roleAcls) =>
    reset({
      roleId: roleAcls?.id || "",
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
                <Select
                  label="Rol de usuario"
                  onChange={onChange}
                  value={value}
                  error={error(name)}
                  options={Roles.map((role) => ({
                    label: role.name,
                    value: role.id,
                  }))}
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
                                  disabled={[
                                    "acls.default.home",
                                    "acls.default.profile",
                                  ].includes(name)}
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
              Guardar
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
