import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useAsync,
  useDefaultFirestoreProps,
  useFormUtils,
} from "../../../hooks";
import { assign, flatten, isEmpty, map, uniq } from "lodash";
import {
  Acl,
  Button,
  CheckboxGroup,
  Form,
  Input,
  modalConfirm,
  notification,
  Title,
  Upload,
} from "../../../components";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { useNavigate, useParams } from "react-router-dom";
import { filterAcl, mapAcls } from "../../../utils";
import { useAuthentication, useGlobalData } from "../../../providers";
import {
  addRoleAcl,
  fetchRoleAcl,
  updateRoleAcl,
} from "../../../firebase/collections";

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
      : await updateRoleAcl(assignUpdateProps(roleAcls));
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
    const roleId = formData.roleCode.toLowerCase().split(" ").join("_");
    const roleAcl = await fetchRoleAcl(roleId);

    if (roleAcl)
      return notification({
        type: "warning",
        title: "El nombre del Rol ya existe, ingrese un nuevo nombre.",
      });

    await saveRoleAcls(
      assign({}, formData, {
        id: roleId,
        acls: uniq([
          "/home",
          ...flatten(map(formData.acls, (acl) => acl).filter((acl) => acl)),
        ]),
        roleCode: formData.roleCode.toLowerCase(),
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
      rolesAcls={rolesAcls}
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
  rolesAcls,
  savingRoleAcls,
  onSaveRoleAcls,
  onCancel,
}) => {
  const schema = yup.object({
    roleCode: yup.string().required(),
  });

  const {
    control,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  useEffect(() => {
    roleAcls && roleAclsToForm(roleAcls);
  }, [roleAcls]);

  const roleAclsToForm = (roleAcls) =>
    reset({
      acls: roleAcls?.acls ? mapAcls(roleAcls.acls) : {},
      roleCode: roleAcls?.roleCode || "",
      avatarImage: roleAcls?.avatarImage || null,
    });

  const onSubmitRoleAcls = (formData) => onSaveRoleAcls(formData);

  return (
    <Acl
      redirect
      name={
        isNew ? "/default-roles-acls/new" : "/default-roles-acls/:roleAclsId"
      }
    >
      <Form onSubmit={handleSubmit(onSubmitRoleAcls)}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Controller
              name="roleCode"
              defaultValue=""
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Rol"
                  name={name}
                  onChange={onChange}
                  value={value}
                  error={error(name)}
                  helperText={errorMessage(name)}
                />
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              control={control}
              name="avatarImage"
              render={({ field: { onChange, value, onBlur, name } }) => (
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
        <Title level={4}>Privilegios de usuario</Title>
        <Row gutter={[16, 24]}>
          <Col span={24}>
            <Controller
              name="acls.accessControlList"
              defaultValue={[]}
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <CheckboxGroup
                  label="Lista Control de Accesos (acls)"
                  options={map(
                    filterAcl("access-control-list"),
                    (item, itemKey) => ({
                      label: item,
                      value: itemKey,
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
          <Col span={24}>
            <Controller
              name="acls.defaultRolesAcls"
              defaultValue={[]}
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <CheckboxGroup
                  label="Acls de roles predeterminados"
                  options={map(
                    filterAcl("default-roles-acls"),
                    (item, itemKey) => ({
                      label: item,
                      value: itemKey,
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
          <Col span={24}>
            <Controller
              name="acls.manageAcls"
              defaultValue={[]}
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <CheckboxGroup
                  label="Administrador Acls"
                  options={map(filterAcl("manage-acls"), (item, itemKey) => ({
                    label: item,
                    value: itemKey,
                  }))}
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
              name="acls.entities"
              defaultValue={[]}
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <CheckboxGroup
                  label="Núcleos"
                  options={map(filterAcl("entities"), (item, itemKey) => ({
                    label: item,
                    value: itemKey,
                  }))}
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
              name="acls.departments"
              defaultValue={[]}
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <CheckboxGroup
                  label="Departamentos"
                  options={map(filterAcl("departments"), (item, itemKey) => ({
                    label: item,
                    value: itemKey,
                  }))}
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
              name="acls.offices"
              defaultValue={[]}
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <CheckboxGroup
                  label="Oficinas"
                  options={map(filterAcl("offices"), (item, itemKey) => ({
                    label: item,
                    value: itemKey,
                  }))}
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
              name="acls.sections"
              defaultValue={[]}
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <CheckboxGroup
                  label="Secciones"
                  options={map(
                    {
                      ...filterAcl("sections"),
                    },
                    (item, itemKey) => ({
                      label: item,
                      value: itemKey,
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
          <Col span={24}>
            <Controller
              name="acls.profile"
              defaultValue={[]}
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <CheckboxGroup
                  label="Perfil usuario"
                  options={map(filterAcl("profile"), (item, itemKey) => ({
                    label: item,
                    value: itemKey,
                  }))}
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
              name="acls.users"
              defaultValue={[]}
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <CheckboxGroup
                  label="Usuarios"
                  options={map(
                    {
                      ...filterAcl("users"),
                    },
                    (item, itemKey) => ({
                      label: item,
                      value: itemKey,
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
          <Col span={24}>
            <Controller
              name="acls.correspondences"
              defaultValue={[]}
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <CheckboxGroup
                  label="Correspondencias"
                  options={map(
                    {
                      ...filterAcl("correspondences"),
                    },
                    (item, itemKey) => ({
                      label: item,
                      value: itemKey,
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
          <Col span={24}>
            <Controller
              name="acls.inscriptions"
              defaultValue={[]}
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <CheckboxGroup
                  label="Inscripciones"
                  options={map(
                    {
                      ...filterAcl("inscriptions"),
                    },
                    (item, itemKey) => ({
                      label: item,
                      value: itemKey,
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
