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
import { v4 as uuidv4 } from "uuid";
import { isEmpty } from "lodash";

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

  const onAddAnimalParents = () => {
    setParentId(uuidv4());
    setIsVisibleModal(true);
  };

  const onEditAnimalParents = (animalId) => {
    setParentId(animalId);
    setIsVisibleModal(true);
  };

  const animalView = (animal) =>
    (animal?.parents || []).map((_animal) => {
      if (isEmpty(_animal?.parents)) return;

      return (
        <AnimalParentsInformation
          key={_animal.id}
          animal={_animal}
          onAddAnimalParents={onAddAnimalParents}
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
          <AnimalParentsInformation
            animal={animal}
            onAddAnimalParents={onAddAnimalParents}
            onEditAnimalParents={onEditAnimalParents}
          >
            {animalParentsInformationView}
          </AnimalParentsInformation>
        </Col>
        <FamilyTreeModalComponent
          animal={animal}
          parentId={parentId}
          isVisibleModal={isVisibleModal}
          onSetIsVisibleModal={setIsVisibleModal}
        />
      </Row>
    </Acl>
  );
};
