import React from "react";
import Col from "antd/lib/col";
import {Acl, Button} from "../../../../components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {Row} from "antd";
import {useNavigate} from "react-router";

export const LiveStockAndEquinesIntegration = () => {
  const navigate = useNavigate();

  const navigateTo = (pathname = "new") =>
      navigate(`/entities/servicio-de-veterinaria-y-remonta-del-ejercito/livestock-and-equines/${pathname}`);

  const onAddEquine = () => navigateTo("new");

  return <LiveStockAndEquines onAddEquine={onAddEquine}/>;
};

const LiveStockAndEquines = ({onAddEquine}) => {
  return (
      <Acl name="/entities" redirect>
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Acl name="/entities/new">
              <Button
                  onClick={onAddEquine}
                  type="primary"
                  size="large"
                  icon={<FontAwesomeIcon icon={faPlus} />}
              >
                &ensp; Agregar Equino
              </Button>
            </Acl>
          </Col>
        </Row>
      </Acl>
  );
};
