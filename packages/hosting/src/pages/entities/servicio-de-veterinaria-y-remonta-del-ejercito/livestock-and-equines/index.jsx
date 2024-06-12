import React from "react";
import {
  Acl,
  Button,
  Col,
  modalConfirm,
  Row,
  Title,
} from "../../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { LiveStockAndEquinesTable } from "./LiveStockAndEquinesTable";
import { useGlobalData } from "../../../../providers";
import { updateLivestockAndEquine } from "../../../../firebase/collections";
import { useDefaultFirestoreProps } from "../../../../hooks";

export const LiveStockAndEquinesIntegration = () => {
  const navigate = useNavigate();
  const { livestockAndEquines } = useGlobalData();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const navigateTo = (pathname = "new") => navigate(pathname);

  const onAddEquine = () => navigateTo("new");
  const onEditEquine = (livestockAndEquine) =>
    navigateTo(livestockAndEquine.id);

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
      onNavigateTo={navigateTo}
    />
  );
};

const LiveStockAndEquines = ({
  livestockAndEquines,
  onAddEquine,
  onEditEquine,
  onDeleteEquine,
  onNavigateTo,
}) => {
  const onNavigateGoToPdfEquineLivestockRegistrationCard = (
    livestockAndEquineId
  ) =>
    onNavigateTo(
      `${livestockAndEquineId}/pdf-equine-livestock-registration-card`
    );

  const onNavigateGoToEquineMagazineProfiles = (livestockAndEquineId) =>
    onNavigateTo(`${livestockAndEquineId}/equine-magazine-profiles`);

  const onNavigateGoToClinicHistory = (livestockAndEquineId) =>
    onNavigateTo(`${livestockAndEquineId}/clinic-history`);

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
            onNavigateGoToEquineMagazineProfiles={
              onNavigateGoToEquineMagazineProfiles
            }
            onNavigateGoToClinicHistory={onNavigateGoToClinicHistory}
          />
        </Col>
      </Row>
    </Acl>
  );
};
