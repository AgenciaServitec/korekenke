import React from "react";
import {
  Acl,
  Col,
  IconAction,
  modalConfirm,
  Row,
  Space,
  TableVirtualized,
  Title,
} from "../../../components";
import { orderBy } from "lodash";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  raffleParticipantsRef,
  updateRaffle,
} from "../../../firebase/collections/raffles";
import { useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowLeft,
  faArrowsSpin,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useDefaultFirestoreProps } from "../../../hooks";
import styled from "styled-components";
import { ModalProvider } from "../../../providers";

export const RafflesParticipants = () => {
  const navigate = useNavigate();
  const { raffleId } = useParams();
  const { assignCreateProps, assignUpdateProps, assignDeleteProps } =
    useDefaultFirestoreProps();

  const [participants = [], participantsLoading, participantsError] =
    useCollectionData(
      raffleParticipantsRef(raffleId).where("isDeleted", "==", false),
    );

  const onEditParticipant = (raffleId) => navigate(raffleId);

  const onConfirmDeleteParticipant = async (raffleId) =>
    modalConfirm({
      title: "¿Estás seguro de eliminar este sorteo?",
      onOk: async () => {
        await updateRaffle(raffleId, assignDeleteProps({ isDeleted: true }));
      },
    });

  const columns = [
    {
      title: "F. Creación",
      align: "center",
      width: ["7rem", "100%"],
      render: (participant) =>
        dayjs(participant.createAt.toDate()).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Nombres",
      align: "center",
      width: ["15rem", "100%"],
      render: (participant) => <div>{participant.nombres}</div>,
    },
    {
      title: "DNI",
      align: "center",
      width: ["20rem", "100%"],
      render: (participant) => {
        return <div>{participant?.dni}</div>;
      },
    },
    {
      title: "Contácto",
      align: "center",
      width: ["14rem", "100%"],
      render: (participant) => (
        <div className="contact">
          <IconAction
            tooltipTitle="Whatsapp"
            icon={faWhatsapp}
            size={27}
            styled={{ color: (theme) => theme.colors.success }}
            onClick={() =>
              window.open(
                `https://api.whatsapp.com/send?phone=51${participant.celular}`,
              )
            }
          />
          <span>{participant.celular}</span>
        </div>
      ),
    },
    {
      title: "Opciones",
      align: "center",
      width: ["14rem", "100%"],
      render: (participant) => (
        <Space>
          <Acl
            category="public"
            subCategory="raffles"
            name="/raffles/:raffleId/participants#:participantId"
          >
            <IconAction
              tooltipTitle="Editar"
              icon={faEdit}
              onClick={() => onEditParticipant(participant)}
            />
          </Acl>
          <Acl
            category="public"
            subCategory="raffles"
            name="/raffles/:raffleId/participants#delete"
          >
            <IconAction
              tooltipTitle="Eliminar"
              icon={faTrash}
              styled={{ color: (theme) => theme.colors.error }}
              onClick={() => onConfirmDeleteParticipant(participant)}
            />
          </Acl>
        </Space>
      ),
    },
  ];

  return (
    <Acl
      category="public"
      subCategory="raffles"
      name="/raffles/:raffleId/participants"
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Space>
              <IconAction icon={faArrowLeft} onClick={() => navigate(-1)} />
              <Col span={24}>
                <Title level={2} style={{ margin: "0" }}>
                  Participantes
                </Title>
              </Col>
            </Space>
            <IconAction
              tooltipTitle="Chocolatear participantes"
              icon={faArrowsSpin}
              onClick={() => ""}
            />
          </div>
        </Col>
        <Col span={24}>
          <Container>
            <TableVirtualized
              dataSource={orderBy(participants, "createAt", "desc")}
              columns={columns}
              rowHeaderHeight={50}
              rowBodyHeight={150}
              loading={participantsLoading}
            />
          </Container>
          <ModalProvider></ModalProvider>
        </Col>
      </Row>
    </Acl>
  );
};

const Container = styled.div`
  .contact {
    display: flex;
    align-items: center;
  }
`;
