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
<<<<<<< HEAD
import { isEmpty } from "lodash";
import styled from "styled-components";
=======
>>>>>>> 61dfb95 (added family tree)

export const FamilyTreeIntegration = () => {
  const { animalId } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState({});
<<<<<<< HEAD
  const [parentId, setParentId] = useState(null);
=======
  const [registrationNumber, setRegistrationNumber] = useState(null);
>>>>>>> 61dfb95 (added family tree)
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  useEffect(() => {
    (async () => {
      const _animal = animalId ? await fetchAnimal(animalId) : null;
      setAnimal(_animal);
    })();
<<<<<<< HEAD
  }, [isVisibleModal]);

  const onNavigateGoTo = (pathname) => navigate(pathname);

  const findAndUpdateAnimalInformation = (
    animal,
    nodes = [],
    id,
    newValues,
  ) => {
    if (animal?.id === parentId) return [...newValues];

    if (typeof nodes !== "string")
      return nodes.map((node) => {
        if (node?.id === id) {
          return { ...node, parents: [...newValues] };
        }

        if (!isEmpty(node.parents)) {
          return {
            ...node,
            parents: findAndUpdateAnimalInformation(
              animal,
              node.parents,
              id,
              newValues,
            ),
          };
        }

        return node;
      });
  };

  const onAddAndEditAnimalParents = (parentId) => {
    setParentId(parentId);
    setIsVisibleModal(true);
  };

  const animalView = (animal) =>
    (animal?.parents || []).map((_animal) => {
      if (!_animal.parents) return;

      return (
        <AnimalParentsInformation
          key={_animal.id}
          animal={_animal}
          onAddAndEditAnimalParents={onAddAndEditAnimalParents}
        >
          {animalView(_animal)}
=======
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
>>>>>>> 61dfb95 (added family tree)
        </AnimalParentsInformation>
      );
    });

<<<<<<< HEAD
  const animalParentsInformationView = animalView(animal);
=======
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
>>>>>>> 61dfb95 (added family tree)

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
<<<<<<< HEAD
          <WrapperContent>
            <AnimalParentsInformation
              animal={animal}
              onAddAndEditAnimalParents={onAddAndEditAnimalParents}
            >
              {animalParentsInformationView}
            </AnimalParentsInformation>
          </WrapperContent>
        </Col>
        <FamilyTreeModalComponent
          animal={animal}
          parentId={parentId}
          onSetParentId={setParentId}
          isVisibleModal={isVisibleModal}
          onSetIsVisibleModal={setIsVisibleModal}
          onFindAndUpdateAnimalInformation={findAndUpdateAnimalInformation}
=======
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
>>>>>>> 61dfb95 (added family tree)
        />
      </Row>
    </Acl>
  );
};
<<<<<<< HEAD

const WrapperContent = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-x: auto;
`;
=======
>>>>>>> 61dfb95 (added family tree)
