import React from "react";
import { Space, Table } from "antd";
import { useAuthentication } from "../../../providers";
import { IconAction } from "../../../components";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export const CmstsTable = ({ onDeleteFamilyMember }) => {
  const { authUser } = useAuthentication();

  const familyMembers = authUser?.familyMembers || [];

  console.log(...familyMembers);

  const columns = [
    {
      title: "Apellidos y Nombres",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Parentesco",
      dataIndex: "relationship",
      key: "relationship",
    },
    {
      title: "Edad",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "CCIIFFS",
      dataIndex: "cciiffs",
      key: "cciiffs",
    },
    {
      title: "DNI",
      dataIndex: "dni",
      key: "dni",
    },
    {
      title: "Acciones",
      key: "behavior",
      render: (_, { dni }) => (
        <Space>
          <IconAction
            onClick={() => onDeleteFamilyMember(dni)}
            size={35}
            icon={faTrash}
            styled={{
              color: () => "rgb(241, 13, 13)",
            }}
          />
        </Space>
      ),
    },
  ];

  const data = familyMembers.map((familyMember, index) => {
    return {
      ...familyMember,
      key: index,
      fullName: `${familyMember.paternalSurname} ${familyMember.maternalSurname} ${familyMember.firstName}`,
      relationship: familyMember.relationship,
      cciiffs: familyMember.cciiffs,
      dni: familyMember.dni,
      behavior: familyMember?.behavior,
    };
  });

  return <Table columns={columns} dataSource={data} pagination={false} />;
};
