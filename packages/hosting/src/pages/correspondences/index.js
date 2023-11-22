import React from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import List from "antd/lib/list";
import Image from "antd/lib/image";
import Divider from "antd/lib/divider";
import Typography from "antd/lib/typography";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button, IconAction, modalConfirm } from "../../components";
import { useDefaultFirestoreProps, useDevice } from "../../hooks";
import { useGlobalData } from "../../providers";
import { useNavigate } from "react-router";
import { capitalize } from "lodash";
import { Link } from "react-router-dom";
import { firestore } from "../../firebase";
import { AvatarNoFound } from "../../images";
import Tag from "antd/lib/tag";

const { Title } = Typography;

export const CorrespondencesIntegration = () => {
  const { isMobile } = useDevice();
  const navigate = useNavigate();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const { correspondences } = useGlobalData();

  const navigateTo = (receptionId) => {
    const url = `/correspondences/${receptionId}`;

    navigate(url);
  };

  const onAddReception = () => navigateTo("new");

  const onEditReception = (document) => navigateTo(document.id);

  const onRemoveReception = async (document) => {
    await firestore
      .collection("correspondences")
      .doc(document.id)
      .update(assignDeleteProps(document));
  };

  const onConfirmRemoveReception = (reception) =>
    modalConfirm({
      content: "La correspondencia se eliminara",
      onOk: () => onRemoveReception(reception),
    });

  return (
    <Correspondences
      isMobile={isMobile}
      receptions={correspondences}
      onAddReception={onAddReception}
      onEditReception={onEditReception}
      onConfirmRemoveReception={onConfirmRemoveReception}
    />
  );
};

const Correspondences = ({
  isMobile,
  receptions,
  onAddReception,
  onEditReception,
  onConfirmRemoveReception,
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Button type="primary" onClick={() => onAddReception()}>
          Agregar correspondencia
        </Button>
      </Col>
      <Divider />
      <Col span={24}>
        <Title level={3}>Correspondencias</Title>
      </Col>
      <Col span={24}>
        <List
          className="demo-loadmore-list"
          itemLayout={isMobile ? "vertical" : "horizontal"}
          dataSource={receptions}
          renderItem={(reception) => (
            <List.Item
              actions={[
                <IconAction
                  key={reception.id}
                  tooltipTitle="Editar"
                  icon={faEdit}
                  onClick={() => onEditReception(reception)}
                />,
                <IconAction
                  key={reception.id}
                  tooltipTitle="Eliminar"
                  styled={{ color: (theme) => theme.colors.error }}
                  icon={faTrash}
                  onClick={() => onConfirmRemoveReception(reception)}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Image
                    src={
                      reception?.documento1Photo?.url ||
                      reception?.documento1Photo?.thumbUrl ||
                      AvatarNoFound
                    }
                    width={90}
                    height={60}
                    style={{ objectFit: "contain" }}
                    alt="icon category"
                  />
                }
                title={
                  <div>
                    <Link to={`/correspondences/${reception.id}`}>
                      <h4 className="link-color">
                        {capitalize(reception.name)}
                      </h4>
                    </Link>
                    <Tag color={reception.active ? "green" : "red"}>
                      {capitalize(reception.active ? "Procesado" : "En espera")}
                    </Tag>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
};
