import React from "react";
import { Acl, Button, Col, List, notification, Row } from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useGlobalData } from "../../../providers";
import {
  useAcl,
  useDefaultFirestoreProps,
  useUpdateAssignToAndAclsOfUser,
} from "../../../hooks";
import { updateOffice } from "../../../firebase/collections";

export const OfficesIntegration = () => {
  const navigate = useNavigate();
  const { users, offices } = useGlobalData();
  const { aclCheck } = useAcl();
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const { updateAssignToAndAclsOfUser } = useUpdateAssignToAndAclsOfUser();

  const navigateTo = (officeId) => navigate(officeId);

  const onAddOffice = () => navigateTo("new");
  const onEditOffice = (office) => navigateTo(office.id);
  const onDeleteOffice = async (office) => {
    try {
      await updateAssignToAndAclsOfUser({
        oldUsersIds: office.membersIds,
        users: users,
      });

      await updateOffice(
        office.id,
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
    <Acl
      category="administration"
      subCategory="offices"
      name="/offices"
      redirect
    >
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Acl
            category="administration"
            subCategory="offices"
            name="/offices/new"
          >
            <Button
              onClick={onAddOffice}
              type="primary"
              size="large"
              icon={<FontAwesomeIcon icon={faPlus} />}
            >
              &ensp; Agregar Oficina
            </Button>
          </Acl>
        </Col>
        <Col span={24}>
          <List
            dataSource={offices}
            onDeleteItem={(office) => onDeleteOffice(office)}
            onEditItem={(office) => onEditOffice(office)}
            itemTitle={(office) => office.name}
            visibleEditItem={() =>
              aclCheck("administration", "offices", ["/offices/:officeId"])
            }
            visibleDeleteItem={() =>
              aclCheck("administration", "offices", ["/offices#delete"])
            }
          />
        </Col>
      </Row>
    </Acl>
  );
};
