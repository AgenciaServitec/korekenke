import React, { useEffect, useState } from "react";
import {
  Button,
  CheckboxGroup,
  Col,
  ComponentContainer,
  DataEntryModal,
  Form,
  List,
  notification,
  Row,
  Select,
  Title,
} from "../../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Controller, useForm } from "react-hook-form";
import { acls, GroupRoles } from "../../../../data-list";
import { assign, isEmpty, isObject, orderBy } from "lodash";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../hooks";
import { findRole, mapAcls } from "../../../../utils";
import { useCommand } from "../../../../providers";
import { firestore } from "../../../../firebase";

export const RolesByGroupIntegration = ({ moduleType, moduleData }) => {
  const { currentCommand } = useCommand();
  const { assignUpdateProps, assignCreateProps, assignDeleteProps } =
    useDefaultFirestoreProps();

  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [savingRoleAclsByGroup, setSavingRoleAclsByGroup] = useState(false);
  const [currentData, setCurrentData] = useState({});

  const saveRoleByGroup = async (_moduleData) => {
    await firestore
      .collection(moduleType)
      .doc(moduleData.id)
      .update(_moduleData);
  };

  const saveRole = async (formData) => {
    try {
      setSavingRoleAclsByGroup(true);
      if (!moduleData) return;

      if (!isEmpty(currentData)) {
        const _roles = moduleData.roles.filter(
          (_role) => _role.roleId !== formData.roleId,
        );

        await saveRoleByGroup(
          assignUpdateProps({
            roles: [..._roles, { ...formData }],
          }),
        );

        setIsVisibleModal(false);
        setCurrentData({});
        notification({ type: "success" });
        return;
      }

      const existsRole = (moduleData?.roles || []).some(
        (role) => role?.roleId === formData?.roleId,
      );

      if (existsRole)
        return notification({ type: "warning", title: "Ya existe el rol" });

      await saveRoleByGroup(
        assignCreateProps({
          roles: [...(moduleData?.roles || []), formData],
        }),
      );

      setIsVisibleModal(false);
      notification({ type: "success" });
    } catch (e) {
      console.log("errorSaveRoleAclsByGroup: ", e);
    } finally {
      setSavingRoleAclsByGroup(false);
    }
  };

  const onConfirmDeleteRole = async (role) => {
    const newRoles = (moduleData?.roles || []).filter(
      (item) => item.roleId !== role.roleId,
    );

    await saveRoleByGroup(
      assignDeleteProps({
        roles: newRoles,
      }),
    );
  };

  return (
    <RolesByGroup
      moduleData={moduleData}
      currentCommand={currentCommand}
      isVisibleModal={isVisibleModal}
      onSetIsVisibleModal={setIsVisibleModal}
      savingRoleAclsByGroup={savingRoleAclsByGroup}
      onSaveRoleAclsByGroup={saveRole}
      onConfirmDeleteRole={onConfirmDeleteRole}
      currentModal={currentData}
      onSetCurrentModal={setCurrentData}
    />
  );
};

const RolesByGroup = ({
  moduleData,
  currentCommand,
  isVisibleModal,
  onSetIsVisibleModal,
  savingRoleAclsByGroup,
  onSaveRoleAclsByGroup,
  onConfirmDeleteRole,
  currentModal,
  onSetCurrentModal,
}) => {
  const schema = yup.object({
    roleId: yup.string().required(),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    roleAclsToForm();
  }, [currentModal]);

  const roleAclsToForm = () =>
    reset({
      roleId: currentModal?.roleId || "",
      acls: currentModal?.acls ? mapAcls(currentModal?.acls) : null,
    });

  const rolesView = GroupRoles.map((role) =>
    assign({}, role, {
      disabled: (moduleData?.roles || []).some(
        (_role) => _role?.roleId === role?.id,
      ),
    }),
  );

  const onSubmitRoleAclsByGroup = (formData) => onSaveRoleAclsByGroup(formData);

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <br />
          <Button
            type="primary"
            icon={<FontAwesomeIcon icon={faPlus} />}
            onClick={() => onSetIsVisibleModal(true)}
          >
            Agregar rol
          </Button>
        </Col>
        <Col span={24}>
          <List
            dataSource={orderBy(moduleData?.roles || [], "roleId", "asc")}
            itemTitle={(role) => findRole(GroupRoles, role.roleId)?.name}
            onDeleteItem={(role) => onConfirmDeleteRole(role)}
            onEditItem={(role) => {
              onSetIsVisibleModal(true);
              onSetCurrentModal(role);
            }}
          />
        </Col>
      </Row>
      <DataEntryModal
        title="Rol"
        visible={isVisibleModal}
        onCancel={() => {
          onSetCurrentModal({});
          return onSetIsVisibleModal(false);
        }}
      >
        <Form onSubmit={handleSubmit(onSubmitRoleAclsByGroup)}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Controller
                name="roleId"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Rol de usuario"
                    onChange={onChange}
                    value={value}
                    error={error(name)}
                    options={rolesView.map((role) => ({
                      label: role.name,
                      value: role.id,
                      disabled: role.disabled,
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
            {Object.entries(acls)
              .filter(([, category]) => category.command === currentCommand.id)
              .map(([keyCategory, subCategories]) => (
                <Col span={24} key={keyCategory}>
                  <ComponentContainer.group label={subCategories.label}>
                    <Row gutter={[16, 16]}>
                      {Object.entries(subCategories).map(
                        ([keySubCategory, items]) => {
                          const unlabeledAclsForSelectOptions =
                            isObject(items) &&
                            Object.entries(items).filter(
                              (_item) =>
                                !_item.includes("label") &&
                                !_item.includes("command"),
                            );

                          return (
                            keySubCategory !== "label" &&
                            keySubCategory !== "command" && (
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
                                        }),
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
                        },
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
                loading={savingRoleAclsByGroup}
              >
                Guardar
              </Button>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Button
                size="large"
                block
                onClick={() => {
                  onSetCurrentModal({});
                  return onSetIsVisibleModal(false);
                }}
                disabled={savingRoleAclsByGroup}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </DataEntryModal>
    </>
  );
};