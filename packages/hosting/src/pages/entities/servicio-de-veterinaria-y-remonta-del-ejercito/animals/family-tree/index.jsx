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
<<<<<<< HEAD
<<<<<<< HEAD
import { isEmpty } from "lodash";
import styled from "styled-components";
=======
>>>>>>> 61dfb95 (added family tree)
=======
import { v4 as uuidv4 } from "uuid";
=======
>>>>>>> 6d170a0 (refactored the add and edit animal parents information)
import { isEmpty } from "lodash";
>>>>>>> 7ca4409 (added reset form)

export const FamilyTreeIntegration = () => {
  const { animalId } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState({});
<<<<<<< HEAD
<<<<<<< HEAD
  const [parentId, setParentId] = useState(null);
=======
  const [registrationNumber, setRegistrationNumber] = useState(null);
>>>>>>> 61dfb95 (added family tree)
=======
  const [parentId, setParentId] = useState(null);
>>>>>>> 7ca4409 (added reset form)
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  useEffect(() => {
    (async () => {
      const _animal = animalId ? await fetchAnimal(animalId) : null;
      setAnimal(_animal);
    })();
<<<<<<< HEAD
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

<<<<<<< HEAD
=======
    console.log("nodes:", nodes);

>>>>>>> 6d170a0 (refactored the add and edit animal parents information)
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
<<<<<<< HEAD
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
=======
  }, [isVisibleModal]);
>>>>>>> 7ca4409 (added reset form)

  const onNavigateGoTo = (pathname) => navigate(pathname);

  const onAddAnimalParents = () => {
    setParentId(uuidv4());
    setIsVisibleModal(true);
=======
>>>>>>> 6d170a0 (refactored the add and edit animal parents information)
  };

  const onAddAndEditAnimalParents = (animalId) => {
    setParentId(animalId);
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
<<<<<<< HEAD
          {parentsView(_parent)}
>>>>>>> 61dfb95 (added family tree)
=======
          {animalView(_animal)}
>>>>>>> 7ca4409 (added reset form)
        </AnimalParentsInformation>
      );
    });

<<<<<<< HEAD
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
=======
  const animalParentsInformationView = animalView(animal);
>>>>>>> 7ca4409 (added reset form)

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
                  `/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals?animalType=${animal?.type}`,
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
            onAddAndEditAnimalParents={onAddAndEditAnimalParents}
          >
            {animalParentsInformationView}
          </AnimalParentsInformation>
        </Col>
        <FamilyTreeModalComponent
          animal={animal}
          parentId={parentId}
          onSetParentId={setParentId}
          isVisibleModal={isVisibleModal}
          onSetIsVisibleModal={setIsVisibleModal}
<<<<<<< HEAD
>>>>>>> 61dfb95 (added family tree)
=======
          onFindAndUpdateAnimalInformation={findAndUpdateAnimalInformation}
>>>>>>> 6d170a0 (refactored the add and edit animal parents information)
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
