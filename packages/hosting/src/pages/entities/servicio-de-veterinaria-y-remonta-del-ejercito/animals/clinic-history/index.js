import React, { useEffect, useState } from "react";
import {
  Acl,
  AddButton,
  Card,
  Col,
  IconAction,
  modalConfirm,
  notification,
  Row,
  Spinner,
} from "../../../../../components";
import {
  useDefaultFirestoreProps,
  useQuery,
  useQueryString,
} from "../../../../../hooks";
import styled from "styled-components";
import { ClinicHistoryTable } from "./ClinicHistoryTable";
import { firestore } from "../../../../../firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { ClinicHistoryModalComponent } from "./ClinicHistoryModalComponent";
import { useParams } from "react-router-dom";
import {
  fetchAnimal,
  updateClinicHistory,
} from "../../../../../firebase/collections";
import { useAuthentication, useGlobalData } from "../../../../../providers";
import { faArrowLeft, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { AnimalInformation } from "../../../../../components/ui/entities";
import { ClinicHistoryCheckedModalComponent } from "./ClinicHistoryCheckedModalComponent";
import { getAnimalEntitiesAndBosses } from "../../../../../utils";

export const ClinicHistoryIntegration = () => {
  const { authUser } = useAuthentication();
  const { animalId } = useParams();
  const navigate = useNavigate();
  const [clinicHistoryId, setClinicHistoryId] = useQueryString(
    "clinicHistoryId",
    "",
  );
  const { assignDeleteProps } = useDefaultFirestoreProps();
  const { animals } = useGlobalData();

  const [isVisibleModal, setIsVisibleModal] = useState({
    historyClinicModal: false,
    historyClinicCheckModal: false,
  });
  const [animal, setAnimal] = useState({});
  const [currentHistoryClinic, setCurrentHistoryClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animalEntitiesAndBosses, setAnimalEntitiesAndBosses] = useState({});

  const animalsByType = animals.filter(
    (_animal) => _animal?.type === animal?.type,
  );

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const _animal = await fetchAnimal(animalId);
        const result = await getAnimalEntitiesAndBosses(_animal);
        setAnimal(_animal);
        setAnimalEntitiesAndBosses(result);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const [clinicHistories = [], clinicHistoriesLoading, clinicHistoriesError] =
    useCollectionData(
      firestore
        .collection("animals")
        .doc(animalId)
        .collection("clinic-history")
        .where("isDeleted", "==", false),
    );

  const onNavigateGoTo = (pathname) => navigate(pathname);

  useEffect(() => {
    setAnimal(animalsByType.find((_animal) => _animal.id === animalId) || {});
  }, [animalId]);

  useEffect(() => {
    clinicHistoriesError && notification({ type: "error" });
  }, [clinicHistoriesError]);

  useEffect(() => {
    const clinicHistory = clinicHistories.find(
      (clinicHistory) => clinicHistory?.id === clinicHistoryId,
    );

    if (!clinicHistory) return setCurrentHistoryClinic(null);

    setCurrentHistoryClinic(clinicHistory);
  }, [
    isVisibleModal.historyClinicModal,
    isVisibleModal.historyClinicCheckModal,
  ]);

  const onDeleteClinicHistory = async (clinicHistory) => {
    try {
      await updateClinicHistory(
        animalId,
        clinicHistory.id,
        assignDeleteProps({ isDeleted: true }),
      );
    } catch (e) {
      console.error("ErrorDeleteClinicHistory: ", e);
    }
  };

  const onConfirmRemoveClinicHistory = (clinicHistory) =>
    modalConfirm({
      content: "El registro se eliminará",
      onOk: async () => {
        await onDeleteClinicHistory(clinicHistory);
      },
    });

  const onSetVisibleHistoryClinicModal = () =>
    setIsVisibleModal({
      historyClinicModal: !isVisibleModal.historyClinicModal,
    });

  const onSetVisibleHistoryClinicCheckModal = () =>
    setIsVisibleModal({
      historyClinicCheckModal: !isVisibleModal.historyClinicCheckModal,
    });

  if (loading) return <Spinner height="80vh" />;

  const { departmentBoss } = animalEntitiesAndBosses;

  return (
    <Acl
      category="servicio-de-veterinaria-y-remonta-del-ejercito"
      subCategory="clinicHistory"
      name="/animals/:animalId/clinic-history"
      redirect
    >
      <Container gutter={[16, 16]}>
        <Col span={24}>
          <IconAction
            icon={faArrowLeft}
            onClick={() =>
              onNavigateGoTo(
                `/entities/servicio-de-veterinaria-y-remonta-del-ejercito/animals?animalType=${animal?.type}`,
              )
            }
          />
        </Col>
        <Col span={24}>
          <Card
            title={<span style={{ fontSize: "1.5em" }}>Datos del animal</span>}
            bordered={false}
            type="inner"
          >
            <AnimalInformation animal={animal} />
          </Card>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col span={24} sm={8}>
              <Acl
                category="servicio-de-veterinaria-y-remonta-del-ejercito"
                subCategory="clinicHistory"
                name="/animals/:animalId/clinic-history/:clinicHistoryId"
              >
                <AddButton
                  onClick={() => {
                    setClinicHistoryId("new");
                    onSetVisibleHistoryClinicModal();
                  }}
                  title="Historia clínica"
                  margin="0"
                />
              </Acl>
            </Col>

            <Col
              span={24}
              sm={16}
              style={{ display: "flex", justifyContent: "end" }}
            >
              <Acl
                category="servicio-de-veterinaria-y-remonta-del-ejercito"
                subCategory="clinicHistory"
                name="/animals/:animalId/clinic-history/pdf-clinic-history"
              >
                <IconAction
                  tooltipTitle="Pdf del historial clínico"
                  icon={faFilePdf}
                  styled={{ color: (theme) => theme.colors.error }}
                  onClick={() => onNavigateGoTo("pdf-clinic-history")}
                />
              </Acl>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <ClinicHistoryTable
            clinicHistories={clinicHistories}
            onConfirmRemoveClinicHistory={onConfirmRemoveClinicHistory}
            onSetIsVisibleModal={onSetVisibleHistoryClinicModal}
            onSetIsVisibleCheckModal={onSetVisibleHistoryClinicCheckModal}
            onSetClinicHistoryId={setClinicHistoryId}
            loading={clinicHistoriesLoading}
            user={authUser}
            departmentBoss={departmentBoss}
          />
        </Col>
        <ClinicHistoryModalComponent
          isVisibleModal={isVisibleModal}
          onSetIsVisibleModal={onSetVisibleHistoryClinicModal}
          onSetClinicHistoryId={setClinicHistoryId}
          clinicHistoryId={clinicHistoryId}
          currentHistoryClinic={currentHistoryClinic}
          animalId={animalId}
        />
        <ClinicHistoryCheckedModalComponent
          user={authUser}
          isVisibleModal={isVisibleModal}
          onSetIsVisibleModal={onSetVisibleHistoryClinicCheckModal}
          onSetClinicHistoryId={setClinicHistoryId}
          animalId={animalId}
          currentHistoryClinic={currentHistoryClinic}
        />
      </Container>
    </Acl>
  );
};

const Container = styled(Row)``;
