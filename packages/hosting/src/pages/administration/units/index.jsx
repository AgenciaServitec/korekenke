import React from "react";
import { useNavigate } from "react-router";
import {
  useAcl,
  useDefaultFirestoreProps,
  useUpdateAssignToAndAclsOfUser,
} from "../../../hooks";
import { updateUnit } from "../../../firebase/collections";
import {
  Acl,
  Button,
  Col,
  List,
  notification,
  Row,
  Title,
} from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useGlobalData } from "../../../providers";
import { Link } from "react-router-dom";
import { userFullName } from "../../../utils";

export const UnitsIntegration = () => {
  const navigate = useNavigate();
  const { units, users } = useGlobalData();
  const { aclCheck } = useAcl();
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const { updateAssignToAndAclsOfUser } = useUpdateAssignToAndAclsOfUser();

  const navigateTo = (unitId) => navigate(unitId);
  const onAddUnit = () => navigateTo("new");
  const onEditUnit = (unit) => navigateTo(unit.id);
  const onDeleteUnit = async (unit) => {
    try {
      await updateAssignToAndAclsOfUser({
        oldUsersIds: unit.membersIds,
        users: users,
      });

      await updateUnit(
        unit.id,
        assignDeleteProps({
          isDeleted: true,
          membersIds: null,
          bossId: null,
          secondBossId: null,
        }),
      );
    } catch (e) {
      console.error("ErrorDeleteUnit: ", e);
      notification({ type: "error" });
    }
  };

  const unitsViews = units.map((unit) => {
    const boss = users.find((user) => user.id === unit?.bossId);

    return {
      ...unit,
      boss: boss || null,
    };
  });

  return (
    <Acl category="administration" subCategory="units" name="/units" redirect>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Acl category="administration" subCategory="units" name="/units/new">
            <Button
              onClick={onAddUnit}
              type="primary"
              size="large"
              icon={<FontAwesomeIcon icon={faPlus} />}
            >
              &ensp; Agregar Unidad
            </Button>
          </Acl>
        </Col>
        <Col span={24}>
          <List
            dataSource={unitsViews}
            onDeleteItem={(unit) => onDeleteUnit(unit)}
            onEditItem={(unit) => onEditUnit(unit)}
            itemTitle={(unit) => (
              <div>
                <Title level={5}>
                  {unit.name}{" "}
                  {unit?.abbreviation && (
                    <span>({unit?.abbreviation.toUpperCase()})</span>
                  )}
                </Title>
                <div style={{ fontSize: 12 }}>
                  Jefe:{" "}
                  {unit?.bossId ? (
                    <Link
                      to={`/users/${unit?.bossId}`}
                      style={{ fontSize: 12 }}
                    >
                      {unit?.boss ? userFullName(unit?.boss) : null}
                    </Link>
                  ) : (
                    "No se asignó un jefe"
                  )}
                </div>
                <div style={{ fontSize: 12 }}>
                  Miembros:{" "}
                  {unit?.membersIds
                    ? unit?.membersIds.length
                    : "No hay miembros"}
                </div>
              </div>
            )}
            visibleEditItem={() =>
              aclCheck("administration", "units", ["/units/:unitId"])
            }
            visibleDeleteItem={() =>
              aclCheck("administration", "units", ["/units#delete"])
            }
          />
        </Col>
      </Row>
    </Acl>
  );
};
