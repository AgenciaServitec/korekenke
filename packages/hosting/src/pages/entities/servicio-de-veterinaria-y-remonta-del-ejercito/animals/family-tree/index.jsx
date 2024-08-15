import React, { useEffect, useState } from "react";
import {
  Acl,
  Col,
  IconAction,
  Row,
  Space,
  Title,
} from "../../../../../components";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router";
import { fetchAnimal } from "../../../../../firebase/collections";
import { FamilyTreeModalComponent } from "./FamilyTreeModalComponent";
import { AnimalParentsInformation } from "./AnimalParentsInformation";

export const FamilyTreeIntegration = () => {
  const { animalId } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState({});
  const [registrationNumber, setRegistrationNumber] = useState(null);
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  useEffect(() => {
    (async () => {
      const _animal = animalId ? await fetchAnimal(animalId) : null;
      setAnimal(_animal);
    })();
  }, []);

  const onNavigateGoTo = (pathname) => navigate(pathname);

  const onAddAnimalParents = (registrationNumber) => {
    setRegistrationNumber(registrationNumber);
    setIsVisibleModal(true);
  };

  const parentsView = (parent) =>
    (parent?.parents || []).map((_parent, index) => {
      if (!_parent?.parents) return;

      return (
        <AnimalParentsInformation
          key={index}
          animal={_parent}
          onSetIsVisibleModal={setIsVisibleModal}
        >
          {parentsView(_parent)}
        </AnimalParentsInformation>
      );
    });

  const animalView = () =>
    (animal?.parents || []).map((parent, index) => {
      if (!parent?.parents) return;

      return (
        <AnimalParentsInformation
          key={index}
          animal={parent}
          onSetIsVisibleModal={setIsVisibleModal}
        >
          {parentsView(parent)}
        </AnimalParentsInformation>
      );
    });

  const animalParentsInformationView = animalView();

  return (
    <Acl
      category="servicio-de-veterinaria-y-remonta-del-ejercito"
      subCategory="animals"
      name="/animals/:animalId/family-tree"
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space>
            <IconAction
              icon={faArrowLeft}
              onClick={() =>
                onNavigateGoTo(
                  `/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals?animalType=${animal?.type}`
                )
              }
            />
            <Col span={24}>
              <Title level={2} style={{ margin: "0" }}>
                Árbol genealógico
              </Title>
            </Col>
          </Space>
        </Col>
        <Col span={24}>
          <AnimalParentsInformation
            animal={animal}
            onSetIsVisibleModal={onAddAnimalParents}
          >
            {animalParentsInformationView}
          </AnimalParentsInformation>
        </Col>
        <FamilyTreeModalComponent
          animal={animal}
          registrationNumber={registrationNumber}
          isVisibleModal={isVisibleModal}
          onSetIsVisibleModal={setIsVisibleModal}
        />
      </Row>
    </Acl>
  );
};
