import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../../../firebase";
import {
  Acl,
  AddButton,
  Col,
  Divider,
  IconAction,
  notification,
  Row,
  Space,
  Table,
} from "../../../components";
import { updateOrganizationalClimateStudy } from "../../../firebase/collections/organizationalClimateStudies";
import {
  faEye,
  faFilePdf,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { orderBy } from "lodash";
import { useDefaultFirestoreProps } from "../../../hooks";
import dayjs from "dayjs";

export const OrganizationalClimateStudiesIntegration = () => {
  const navigate = useNavigate();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const [
    organizationalClimateStudies = [],
    organizationalClimateStudiesLoading,
    organizationalClimateStudiesError,
  ] = useCollectionData(
    firestore
      .collection("organizational-climate-studies-surveys")
      .where("isDeleted", "==", false)
  );

  useEffect(() => {
    organizationalClimateStudiesError && notification({ type: "error" });
  }, [organizationalClimateStudiesError]);

  const navigateTo = (pathname = "new") => navigate(pathname);
  const onAddOrganizationalClimateStudy = () => navigateTo("new");
  const onEditOrganizationalClimateStudy = (organizationClimateStudyId) =>
    navigateTo(organizationClimateStudyId);
  const onDeleteOrganizationClimateStudy = async (organizationClimateStudy) => {
    await updateOrganizationalClimateStudy(
      organizationClimateStudy.id,
      assignDeleteProps(organizationClimateStudy)
    );
  };

  const columns = [
    {
      title: "Fecha creación",
      dataIndex: "createAt",
      key: "createAt",
      render: (_, organizationClimateStudy) =>
        dayjs(organizationClimateStudy.createAt.toDate()).format(
          "DD/MM/YYYY HH:mm"
        ),
    },
    {
      title: "Nombre de la Organización",
      dataIndex: "establishment",
      key: "establishment",
      render: (_, organizationClimateStudy) => (
        <span>{organizationClimateStudy?.questions?.establishment}</span>
      ),
    },
    {
      title: "Acctiones",
      key: "actions",
      render: (_, organizationClimateStudy) => (
        <Space>
          <IconAction
            tooltipTitle="Ver"
            icon={faEye}
            onClick={() =>
              onEditOrganizationalClimateStudy(organizationClimateStudy.id)
            }
          />
          <IconAction
            tooltipTitle="Eliminar"
            icon={faTrash}
            styled={{ color: (theme) => theme.colors.error }}
            onClick={() =>
              onDeleteOrganizationClimateStudy(organizationClimateStudy)
            }
          />
        </Space>
      ),
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      <Col span={24} md={22}>
        <Acl
          category="surveys"
          subCategory="organizational-climate-studies"
          name="/organizational-climate-studies/new"
        >
          <AddButton
            onClick={() => onAddOrganizationalClimateStudy()}
            title="Estudio del clima organizacional"
            margin="0"
          />
        </Acl>
      </Col>
      <Col span={24} md={2}>
        <Acl
          category="surveys"
          subCategory="organizational-climate-studies"
          name="/organizational-climate-studies/sheets"
        >
          <IconAction
            tooltipTitle="PDF"
            icon={faFilePdf}
            styled={{ color: (theme) => theme.colors.error }}
            onClick={() =>
              navigate("/surveys/organizational-climate-studies/sheets")
            }
          />
        </Acl>
      </Col>
      <Divider />
      <Col span={24}>
        <Acl
          category="surveys"
          subCategory="organizational-climate-studies"
          name="/organizational-climate-studies/list"
        >
          <Table
            columns={columns}
            dataSource={orderBy(
              organizationalClimateStudies,
              "createAt",
              "desc"
            )}
            loading={organizationalClimateStudiesLoading}
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        </Acl>
      </Col>
    </Row>
  );
};
