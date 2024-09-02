import React from "react";
import { useNavigate } from "react-router";
import {
  useAcl,
  useDefaultFirestoreProps,
  useUpdateAssignToAndAclsOfUser,
} from "../../../hooks";
import { updateOffice, updateUnit } from "../../../firebase/collections";
import {
  Acl,
  Button,
  Col,
  List,
  notification,
  Row,
  Spinner,
} from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useGlobalData } from "../../../providers";

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
      console.error("ErrorDeleteOffice: ", e);
      notification({ type: "error" });
    }
  };

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
            dataSource={units}
            onDeleteItem={(unit) => onDeleteUnit(unit)}
            onEditItem={(unit) => onEditUnit(unit)}
            itemTitle={(unit) => unit.name}
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
