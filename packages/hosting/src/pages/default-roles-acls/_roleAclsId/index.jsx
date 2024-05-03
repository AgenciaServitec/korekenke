import React, { useEffect, useState } from "react";
import { firestore } from "../../../firebase";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useAsync,
  useDefaultFirestoreProps,
  useFormUtils,
} from "../../../hooks";
import { allRoles } from "../../../data-list";
import { assign, capitalize, flatten, isEmpty, map, uniq } from "lodash";
import {
  Button,
  CheckboxGroup,
  Form,
  modalConfirm,
  notification,
  Select,
  Title,
} from "../../../components";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { useNavigate, useParams } from "react-router-dom";
import { filterAcl, mapAcls } from "../../../utils";
import { useGlobalData } from "../../../providers";

export const RoleAclIntegration = () => {
  const navigate = useNavigate();
  const { roleAclsId } = useParams();
  const { assignCreateProps, assignUpdateProps } =
    useDefaultFirestoreProps(false);

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
    await firestore
      .collection("roles-acls")
      .doc(roleAcls.id)
      .set(
        roleAclsId === "new"
          ? assignCreateProps(roleAcls)
          : assignUpdateProps(roleAcls),
        { merge: true }
      );
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

  const onSaveRoleAcls = async (formData) =>
    await saveRoleAcls(
      assign({}, formData, {
        id: formData.roleCode,
        acls: uniq([
          "/home",
          ...flatten(map(formData.acls, (acl) => acl).filter((acl) => acl)),
        ]),
      })
    );

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
      rolesAcls={rolesAcls}
      savingRoleAcls={saveRoleAclsLoading}
      onSaveRoleAcls={onSaveRoleAcls}
      onCancel={onCancel}
    />
  );
};

const RoleAcl = ({
  isNew,
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
      roleCode: roleAcls.id,
    });

  const rolesView = allRoles.map((role) =>
    assign({}, role, {
      disabled: rolesAcls.some((roleAcls) => roleAcls.id === role.code),
    })
  );

  const onSubmitRoleAcls = (formData) => onSaveRoleAcls(formData);

  return (
    <Form onSubmit={handleSubmit(onSubmitRoleAcls)}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Controller
            name="roleCode"
            defaultValue=""
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Select
                label="Rol"
                value={value}
                onChange={onChange}
                error={error(name)}
                helperText={errorMessage(name)}
                required={required(name)}
                autoFocus
                options={rolesView.map((role) => ({
                  label: capitalize(role.name),
                  value: role.code,
                  disabled: role.disabled,
                }))}
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
  );
};
