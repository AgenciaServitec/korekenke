import React, { useEffect, useState } from "react";
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
import queryString from "query-string";

export const AnimalsIntegration = () => {
  const navigate = useNavigate();
  const { animals } = useGlobalData();
  const { assignDeleteProps } = useDefaultFirestoreProps();

  const query = queryString.parse(location.search);

  const [animalType, setAnimalType] = useQueryString(
    "animalType",
    query?.animalType || "equine",
  );

  const [animalsView, setAnimalsView] = useState([]);

  useEffect(() => {
    setAnimalType(query?.animalType);

    setAnimalsView(
      animals.filter((animal) => animal.type === query?.animalType),
    );
  }, [query?.animalType]);

  const navigateTo = (pathname = "new") => navigate(pathname);

  const navigateToWithQuery = (pathname = "new") =>
    navigate(`${pathname}?animalType=${animalType}`);

  const onAddAnimal = () => navigateToWithQuery("new");
  const onEditAnimal = (animal) => navigateToWithQuery(animal.id);

  const onConfirmDeleteAnimal = async (animal) => {
    modalConfirm({
      title: "¿Estás seguro que quieres eliminar el animal?",
      onOk: async () => {
        await updateAnimal(animal.id, assignDeleteProps({ isDeleted: true }));
      },
    });
  };

  return (
    <Animals
      animals={animalsView}
      animalType={animalType}
      onAddAnimal={onAddAnimal}
      onEditAnimal={onEditAnimal}
      onDeleteAnimal={onConfirmDeleteAnimal}
      onNavigateToWithQuery={navigateToWithQuery}
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
  onNavigateToWithQuery,
  onNavigateTo,
  onSetAnimalType,
}) => {
  const onNavigateGoToPdfAnimalRegistrationCard = (animalId) =>
    onNavigateToWithQuery(`${animalId}/pdf-animal-card`);

  const onNavigateGoToAnimalMagazineProfiles = (animalId) =>
    onNavigateToWithQuery(`${animalId}/animal-magazine-profiles`);

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
                &ensp; Agregar {AnimalsType[animalType]?.titleSingular}
              </Button>
            </Acl>
            <Acl
              category="servicio-de-veterinaria-y-remonta-del-ejercito"
              subCategory="animals"
              name="/animals/new"
            >
              <Radio.Group
                key={animalType}
                onChange={(e) => onSetAnimalType(e.target.value)}
                defaultValue={animalType}
              >
                <Radio.Button value="equine">Equinos</Radio.Button>
                <Radio.Button value="cattle">Vacunos</Radio.Button>
                <Radio.Button value="canine">Caninos</Radio.Button>
              </Radio.Group>
            </Acl>
          </div>
        </Col>
        <Col span={24}>
          <Title level={3}>{AnimalsType?.[animalType]?.titlePlural}</Title>
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
