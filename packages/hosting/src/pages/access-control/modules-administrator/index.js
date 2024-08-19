import React, { useEffect } from "react";
import { Acl, Col, List, Row, Title, Tag } from "../../../components";
import { useNavigate } from "react-router";
import { useGlobalData } from "../../../providers";
import { useAcl, useDefaultFirestoreProps } from "../../../hooks";
import { isEmpty } from "lodash";
import { ModulesAdministratorData } from "../../../data-list";
import { addModuleAdministrator } from "../../../firebase/collections";
import { Space } from "antd";

export const ModulesAdministrator = () => {
  const navigate = useNavigate();
  const { modulesAdministrator } = useGlobalData();
  const { assignCreateProps } = useDefaultFirestoreProps();
  const { aclCheck } = useAcl();

  const navigateTo = (moduleId) => navigate(moduleId);

  const onEditModuleAdministrator = (module) => navigateTo(module.id);

  useEffect(() => {
    if (isEmpty(modulesAdministrator)) {
      const modulesPromises = ModulesAdministratorData.map((module) =>
        addModuleAdministrator(assignCreateProps(module)),
      );

      (async () => await Promise.all(modulesPromises))();
    }
  }, []);

  return (
    <Acl
      category="accessControl"
      subCategory="modulesAdministrator"
      name="/modules-administrator"
      redirect
    >
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Title level={2}>Administracion de permisos a módulos</Title>
        </Col>
        <Col span={24}>
          <List
            dataSource={modulesAdministrator}
            onEditItem={(module) => onEditModuleAdministrator(module)}
            itemTitle={(module) => (
              <Space direction="vertical">
                <div>
                  <h3>{module?.name}</h3>
                </div>
                <div>
                  ID: &nbsp; <Tag color="blue">{module.id}</Tag>
                </div>
                <div>
                  <Space
                    style={{ fontSize: 11, display: "flex", flexWrap: "wrap" }}
                    size="middle"
                  >
                    <span>
                      Entidades / G.U:{" "}
                      <strong style={{ fontSize: 13 }}>
                        {module?.entitiesIds.length}
                      </strong>
                    </span>
                    <span>
                      Departaments:{" "}
                      <strong style={{ fontSize: 13 }}>
                        {module?.departmentsIds.length}
                      </strong>
                    </span>
                    <span>
                      Unidades:{" "}
                      <strong style={{ fontSize: 13 }}>
                        {module?.unitsIds.length}
                      </strong>
                    </span>
                    <span>
                      Secciones:{" "}
                      <strong style={{ fontSize: 13 }}>
                        {module?.sectionsIds.length}
                      </strong>
                    </span>
                    <span>
                      Oficinas:{" "}
                      <strong style={{ fontSize: 13 }}>
                        {module?.officesIds.length}
                      </strong>
                    </span>
                  </Space>
                </div>
              </Space>
            )}
          />
        </Col>
      </Row>
    </Acl>
  );
};
