import React from "react";
import Col from "antd/lib/col";
import { Acl, Button, modalConfirm } from "../../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Row } from "antd";
import { useNavigate } from "react-router";
import Title from "antd/es/typography/Title";
import { LiveStockAndEquinesTable } from "./LiveStockAndEquinesTable";
import { useGlobalData } from "../../../../providers";
import { updateLivestockAndEquine } from "../../../../firebase/collections";
import { useDefaultFirestoreProps } from "../../../../hooks";

export const LiveStockAndEquinesIntegration = () => {
  const navigate = useNavigate();
  const { livestockAndEquines } = useGlobalData();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const navigateTo = (id = "new") => navigate(id);

  const onAddEquine = () => navigateTo("new");
  const onEditEquine = (livestockAndEquine) =>
    navigateTo(livestockAndEquine.id);
  const onNavigateGoToPdfEquineLivestockRegistrationCard = (
    livestockAndEquineId
  ) =>
    navigate(`${livestockAndEquineId}/pdf-equine-livestock-registration-card`);

  const onConfirmDeleteEquine = async (livestockAndEquine) => {
    modalConfirm({
      title: "¿Estás seguro que quieres eliminar el ganado o equino?",
      onOk: async () => {
        await updateLivestockAndEquine(
          livestockAndEquine.id,
          assignDeleteProps({ isDeleted: true })
        );
      },
    });
  };

  return (
    <LiveStockAndEquines
      livestockAndEquines={livestockAndEquines}
      onAddEquine={onAddEquine}
      onEditEquine={onEditEquine}
      onDeleteEquine={onConfirmDeleteEquine}
      onNavigateGoToPdfEquineLivestockRegistrationCard={
        onNavigateGoToPdfEquineLivestockRegistrationCard
      }
    />
  );
};

const LiveStockAndEquines = ({
  livestockAndEquines,
  onAddEquine,
  onEditEquine,
  onDeleteEquine,
  onNavigateGoToPdfEquineLivestockRegistrationCard,
}) => {
  return (
    <Acl
      category="servicio-de-veterinaria-y-remonta-del-ejercito"
      subCategory="livestockAndEquines"
      name="/livestock-and-equines"
      redirect
    >
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="livestockAndEquines"
            name="/livestock-and-equines/new"
          >
            <Button
              onClick={onAddEquine}
              type="primary"
              size="large"
              icon={<FontAwesomeIcon icon={faPlus} />}
            >
              &ensp; Agregar Ganado o Equino
            </Button>
          </Acl>
        </Col>
        <Col span={24}>
          <Title level={3}>Ganados y equinos</Title>
        </Col>
        <Col span={24}>
          <LiveStockAndEquinesTable
            livestockAndEquines={livestockAndEquines}
            onEditLiveStockAndEquine={onEditEquine}
            onConfirmRemoveLiveStockAndEquine={onDeleteEquine}
            onNavigateGoToPdfEquineLivestockRegistrationCard={
              onNavigateGoToPdfEquineLivestockRegistrationCard
            }
          />
        </Col>
      </Row>
    </Acl>
  );
};
