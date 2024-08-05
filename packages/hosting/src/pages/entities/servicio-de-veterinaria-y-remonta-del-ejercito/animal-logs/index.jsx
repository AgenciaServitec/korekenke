import React, { useEffect, useState } from "react";
import {
  Acl,
  Col,
  notification,
  Radio,
  Row,
  Title,
} from "../../../../components";
import { useNavigate } from "react-router";
import { AnimalLogsTable } from "./AnimalLogsTable";
import { useQueryString } from "../../../../hooks";
import { AnimalsType } from "../../../../data-list";
import queryString from "query-string";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../../../../firebase";

export const AnimalLogsIntegration = () => {
  const navigate = useNavigate();
  const [animalLogs = [], animalLogsLoading, animalLogsError] =
    useCollectionData(
      firestore.collection("animal-logs").where("isDeleted", "==", false),
    );

  useEffect(() => {
    animalLogsError && notification({ type: "error" });
  }, [animalLogsError]);

  const query = queryString.parse(location.search);

  const [animalType, onSetAnimalType] = useQueryString("animalType", "all");

  const [animalsView, setAnimalsView] = useState([]);

  useEffect(() => {
    onSetAnimalType(query?.animalType);

    console.log("animalLogs: ", animalLogs);

    setAnimalsView(
      animalLogs.filter((animal) =>
        query?.animalType === "all" ? true : animal.type === query?.animalType,
      ),
    );
  }, [query?.animalType, animalLogs]);

  const navigateTo = (pathname = "new") => navigate(pathname);

  const navigateToWithQuery = (pathname = "new") =>
    navigate(`${pathname}?animalType=${animalType}`);

  return (
    <AnimalLogs
      animals={animalsView}
      animalType={animalType}
      onNavigateToWithQuery={navigateToWithQuery}
      onSetAnimalType={onSetAnimalType}
      animalLogsLoading={animalLogsLoading}
    />
  );
};

const AnimalLogs = ({
  animals,
  animalType,
  onNavigateToWithQuery,
  onSetAnimalType,
  animalLogsLoading,
}) => {
  const onNavigateGoToPdfAnimalRegistrationCard = (animalId) =>
    onNavigateToWithQuery(`${animalId}/pdf-animal-log-card`);

  return (
    <Acl
      category="servicio-de-veterinaria-y-remonta-del-ejercito"
      subCategory="animalLogs"
      name="/animal-logs"
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
            <Title level={3}>
              {AnimalsType?.[animalType]?.titlePlural || "Animales"} - Historial
            </Title>
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
                <Radio.Button value="all">Todos</Radio.Button>
                <Radio.Button value="equine">Equinos</Radio.Button>
                <Radio.Button value="cattle">Vacunos</Radio.Button>
                <Radio.Button value="canine">Caninos</Radio.Button>
              </Radio.Group>
            </Acl>
          </div>
        </Col>
        <Col span={24}>
          <AnimalLogsTable
            animals={animals}
            onNavigateGoToPdfAnimalRegistrationCard={
              onNavigateGoToPdfAnimalRegistrationCard
            }
            loading={animalLogsLoading}
          />
        </Col>
      </Row>
    </Acl>
  );
};
