import React from "react";
import { useNavigate } from "react-router";
import { useAcl, useDefaultFirestoreProps } from "../../../hooks";
import { updateUnit } from "../../../firebase/collections";
import { Acl, Button, Col, List, Row, Spinner } from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useGlobalData } from "../../../providers";

export const UnitsIntegration = () => {
  const navigate = useNavigate();
  const { aclCheck } = useAcl();
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const { units } = useGlobalData();

  const navigateTo = (unitId) => navigate(unitId);
  const onAddUnit = () => navigateTo("new");
  const onEditUnit = (unit) => navigateTo(unit.id);
  const onDeleteUnit = async (unit) =>
    await updateUnit(unit.id, assignDeleteProps({ isDeleted: true }));

  if (!units) return <Spinner height="80vh" />;

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
