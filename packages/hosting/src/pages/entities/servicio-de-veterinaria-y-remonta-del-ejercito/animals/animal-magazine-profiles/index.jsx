import React, { useEffect } from "react";
import {
  Acl,
  AddButton,
  Col,
  Divider,
  IconAction,
  modalConfirm,
  notification,
  Row,
  Title,
  Space,
} from "../../../../../components";
import { AnimalMagazineProfilesTable } from "./AnimalMagazineProfilesTable";
import { useNavigate, useParams } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../../../../../firebase";
import { updateAnimalMagazineProfile } from "../../../../../firebase/collections";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "../../../../../hooks";

export const AnimalMagazineProfilesIntegration = () => {
  const { animalId } = useParams();
  const { animalType } = useQuery();
  const navigate = useNavigate();

  const [
    animalMagazineProfiles = [],
    animalMagazineProfilesLoading,
    animalMagazineProfilesError,
  ] = useCollectionData(
    firestore
      .collection("animals")
      .doc(animalId)
      .collection("animal-magazine-profiles")
      .where("isDeleted", "==", false),
  );

  useEffect(() => {
    animalMagazineProfilesError && notification({ type: "error" });
  }, [animalMagazineProfilesError]);

  const navigateTo = (pathname = "new") => navigate(pathname);

  const onAddAnimalMagazineProfile = () => navigateTo("new");
  const onDeleteAnimalMagazineProfile = (animalMagazineProfileId) =>
    modalConfirm({
      title: "¿Estás seguro de que quieres eliminar la revista del animal?",
      onOk: async () =>
        await updateAnimalMagazineProfile(animalId, animalMagazineProfileId, {
          isDeleted: true,
        }),
    });

  return (
    <Acl
      category="servicio-de-veterinaria-y-remonta-del-ejercito"
      subCategory="animalMagazineProfiles"
      name="/animals/:animalId/animal-magazine-profiles"
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space>
            <IconAction
              icon={faArrowLeft}
              onClick={() =>
                navigate(
                  `/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals?animalType=${animalType}`,
                )
              }
            />
            <Col span={24}>
              <Title level={2} style={{ margin: "0" }}>
                Ficha revista de animal
              </Title>
            </Col>
          </Space>
        </Col>
        <Col span={24} md={8}>
          <Acl
            category="servicio-de-veterinaria-y-remonta-del-ejercito"
            subCategory="animalMagazineProfiles"
            name="/animals/:animalId/animal-magazine-profiles/new"
          >
            <AddButton
              onClick={() => onAddAnimalMagazineProfile()}
              title="Ficha de revista"
              margin="0"
            />
          </Acl>
        </Col>
        <Divider />
        <Col span={24}>
          <AnimalMagazineProfilesTable
            animalMagazineProfiles={animalMagazineProfiles}
            animalMagazineProfilesLoading={animalMagazineProfilesLoading}
            onDeleteAnimalMagazineProfile={onDeleteAnimalMagazineProfile}
          />
        </Col>
      </Row>
    </Acl>
  );
};
