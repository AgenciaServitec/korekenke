import React, { useEffect } from "react";
import {
  Acl,
  AddButton,
  Col,
  Divider,
  modalConfirm,
  notification,
  Row,
} from "../../../../../components";
import { EquineMagazineProfilesTable } from "./EquineMagazineProfilesTable";
import { useNavigate, useParams } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../../../../../firebase";
import { updateEquineMagazineProfile } from "../../../../../firebase/collections";

export const EquineMagazineProfilesIntegration = () => {
  const { livestockAndEquineId } = useParams();
  const navigate = useNavigate();

  const [
    equineMagazineProfiles = [],
    equineMagazineProfilesLoading,
    equineMagazineProfilesError,
  ] = useCollectionData(
    firestore
      .collection("livestock-and-equines")
      .doc(livestockAndEquineId)
      .collection("equine-magazine-profiles")
      .where("isDeleted", "==", false)
  );

  useEffect(() => {
    equineMagazineProfilesError && notification({ type: "error" });
  }, [equineMagazineProfilesError]);

  const navigateTo = (pathname = "new") => navigate(pathname);

  const onAddEquineMagazineProfile = () => navigateTo("new");
  const onDeleteEquineMagazineProfile = (equineMagazineProfileId) =>
    modalConfirm({
      title: "¿Estás seguro de que quieres eliminar la revista equina?",
      onOk: async () =>
        await updateEquineMagazineProfile(
          livestockAndEquineId,
          equineMagazineProfileId,
          {
            isDeleted: true,
          }
        ),
    });

  return (
    <Acl
      category="servicio-de-veterinaria-y-remonta-del-ejercito"
      subCategory="equineMagazineProfiles"
      name="/livestock-and-equines/:livestockAndEquineId/equine-magazine-profiles"
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24} md={8}>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="equineMagazineProfiles"
            name="/livestock-and-equines/:livestockAndEquineId/equine-magazine-profiles/new"
          >
            <AddButton
              onClick={() => onAddEquineMagazineProfile()}
              title="Ficha de Revista Equina"
              margin="0"
            />
          </Acl>
        </Col>
        <Divider />
        <Col span={24}>
          <EquineMagazineProfilesTable
            equineMagazineProfiles={equineMagazineProfiles}
            equineMagazineProfilesLoading={equineMagazineProfilesLoading}
            onDeleteEquineMagazineProfile={onDeleteEquineMagazineProfile}
          />
        </Col>
      </Row>
    </Acl>
  );
};
