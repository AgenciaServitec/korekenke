import React from "react";
import {
  Acl,
  Button,
  Col,
  modalConfirm,
  Radio,
  Row,
  Title,
} from "../../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { AnimalsTable } from "./AnimalsTable";
import { useGlobalData } from "../../../../providers";
import { updateAnimal } from "../../../../firebase/collections";
import { useDefaultFirestoreProps, useQueryString } from "../../../../hooks";
import { AnimalsType } from "../../../../data-list";

export const AnimalsIntegration = () => {
  const navigate = useNavigate();
  const [animalType, setAnimalType] = useQueryString("animalType", "equines");
  const { animals } = useGlobalData();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const navigateTo = (pathname = "new") =>
    navigate(`${pathname}?animalType=${animalType}`);

  const onAddAnimal = () => navigateTo("new");
  const onEditAnimal = (animal) => navigateTo(animal.id);

  const onConfirmDeleteAnimal = async (animal) => {
    modalConfirm({
      title: "¿Estás seguro que quieres eliminar el animal?",
      onOk: async () => {
        await updateAnimal(animal.id, assignDeleteProps({ isDeleted: true }));
      },
    });
  };

  const animalsView = animals.filter((animal) => animal.type === animalType);

  return (
    <Animals
      animals={animalsView}
      animalType={animalType}
      onAddAnimal={onAddAnimal}
      onEditAnimal={onEditAnimal}
      onDeleteAnimal={onConfirmDeleteAnimal}
      onNavigateTo={navigateTo}
      onSetAnimalType={setAnimalType}
    />
  );
};

const Animals = ({
  animals,
  animalType,
  onAddAnimal,
  onEditAnimal,
  onDeleteAnimal,
  onNavigateTo,
  onSetAnimalType,
}) => {
  const onNavigateGoToPdfAnimalRegistrationCard = (animalId) =>
    onNavigateTo(`${animalId}/pdf-animal-card`);

  const onNavigateGoToAnimalMagazineProfiles = (animalId) =>
    onNavigateTo(`${animalId}/animal-magazine-profiles`);

  const onNavigateGoToClinicHistory = (animalId) =>
    onNavigateTo(`${animalId}/clinic-history`);

  return (
    <Acl
      category="servicio-de-veterinaria-y-remonta-del-ejercito"
      subCategory="animals"
      name="/animals"
      redirect
    >
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1em",
            }}
          >
            <Acl
              category="servicio-de-veterinaria-y-remonta-del-ejercito"
              subCategory="animals"
              name="/animals/new"
            >
              <Button
                onClick={onAddAnimal}
                type="primary"
                size="large"
                icon={<FontAwesomeIcon icon={faPlus} />}
              >
                &ensp; Agregar {AnimalsType[animalType]?.addButton}
              </Button>
            </Acl>
            <Acl
              category="servicio-de-veterinaria-y-remonta-del-ejercito"
              subCategory="animals"
              name="/animals/new"
            >
              <Radio.Group
                onChange={(e) => onSetAnimalType(e.target.value)}
                defaultValue={animalType}
              >
                <Radio.Button value="equines">Equinos</Radio.Button>
                <Radio.Button value="cattle">Ganados</Radio.Button>
                <Radio.Button value="canines">Caninos</Radio.Button>
              </Radio.Group>
            </Acl>
          </div>
        </Col>
        <Col span={24}>
          <Title level={3}>{AnimalsType[animalType]?.title}</Title>
        </Col>
        <Col span={24}>
          <AnimalsTable
            animals={animals}
            onEditAnimal={onEditAnimal}
            onConfirmRemoveAnimal={onDeleteAnimal}
            onNavigateGoToPdfAnimalRegistrationCard={
              onNavigateGoToPdfAnimalRegistrationCard
            }
            onNavigateGoToAnimalMagazineProfiles={
              onNavigateGoToAnimalMagazineProfiles
            }
            onNavigateGoToClinicHistory={onNavigateGoToClinicHistory}
          />
        </Col>
      </Row>
    </Acl>
  );
};