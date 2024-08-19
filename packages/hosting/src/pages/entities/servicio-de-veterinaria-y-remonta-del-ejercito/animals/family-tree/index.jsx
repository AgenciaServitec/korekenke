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
import { isEmpty } from "lodash";
import styled from "styled-components";

export const FamilyTreeIntegration = () => {
  const { animalId } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState({});
  const [parentId, setParentId] = useState(null);
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  useEffect(() => {
    (async () => {
      const _animal = animalId ? await fetchAnimal(animalId) : null;
      setAnimal(_animal);
    })();
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
        </AnimalParentsInformation>
      );
    });

  const animalParentsInformationView = animalView(animal);

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
        />
      </Row>
    </Acl>
  );
};

const WrapperContent = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-x: auto;
`;
