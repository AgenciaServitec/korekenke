import React, { useState } from "react";
import { orderBy } from "lodash";
import {
  Acl,
  Button,
  Checkbox,
  Col,
  IconAction,
  Row,
  Space,
  TableVirtualized,
  Tag,
  Title,
} from "../../../components";
import dayjs from "dayjs";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowLeft,
  faEdit,
  faPeopleGroup,
  faTrash,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { useDevice } from "../../../hooks";
import { useModal } from "../../../providers";
import { UpdateParticipant } from "../_raffleId/UpdateParticipant";
import { AddParticipants } from "../AddParticipants";
import { RaffleParticipantStatus } from "../../../data-list";

export const ParticipantsTable = ({
  participants,
  participantsLoading,
  onConfirmDeleteParticipant,
  onConfirmDeleteParticipants,
}) => {
  const navigate = useNavigate();
  const [removeParticipants, setRemoveParticipants] = useState([]);

  const { isTablet } = useDevice();
  const { onShowModal, onCloseModal } = useModal();

  console.log(participants);

  const onShowUpdateParticipant = (participant) => {
    onShowModal({
      width: `${isTablet ? "100%" : "70%"}`,
      onRenderBody: () => (
        <UpdateParticipant
          participant={participant}
          onCloseModal={onCloseModal}
        />
      ),
    });
  };

  const onIsremoveParticipants = (participantId) =>
    removeParticipants.some((id) => id === participantId);

  const onShowAddParticipants = () => {
    onShowModal({
      width: `${isTablet ? "100%" : "70%"}`,
      onRenderBody: () => <AddParticipants onCloseModal={onCloseModal} />,
    });
  };

  const onAddRemoveParticipants = (participantId, checked) => {
    if (!checked) {
      const newCheckedList = removeParticipants.filter(
        (id) => id !== participantId,
      );
      setRemoveParticipants(newCheckedList);
    } else {
      setRemoveParticipants((prev) => [...prev, participantId]);
    }
  };

  const columns = [
    {
      title: "F. Creación",
      align: "center",
      width: ["7rem", "100%"],
      render: (participant) => (
        <Space>
          <Checkbox
            onChange={(checked) =>
              onAddRemoveParticipants(participant.id, checked)
            }
            checked={onIsremoveParticipants(participant.id)}
          />
          <span>
            {dayjs(participant.createAt.toDate()).format("DD/MM/YYYY HH:mm")}
          </span>
        </Space>
      ),
    },
    {
      title: "Apellidos y Nombres",
      align: "center",
      width: ["15rem", "100%"],
      render: (participant) => <div>{participant.fullName}</div>,
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
                `https://api.whatsapp.com/send?phone=${participant.phone.prefix.replace(
                  "+",
                  "",
                )}${participant.phone.number}`,
              )
            }
          />
          <span>{participant.phone.number}</span>
        </div>
      ),
    },
    {
      title: "Estado",
      align: "center",
      width: ["5rem", "100%"],
      render: (participant) => {
        const requestStatus = RaffleParticipantStatus[participant.status];

        return <Tag color={requestStatus?.color}>{requestStatus?.name}</Tag>;
      },
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
              onClick={() => onShowUpdateParticipant(participant)}
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
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div className="header">
            <Space>
              <IconAction icon={faArrowLeft} onClick={() => navigate(-1)} />
              <Col span={24}>
                <Title level={2} style={{ margin: "0" }}>
                  Participantes
                </Title>
              </Col>
            </Space>
            <Space>
              <IconAction
                tooltipTitle="Agregar participante"
                icon={faUserPlus}
                onClick={() => onShowUpdateParticipant()}
              />
              <IconAction
                tooltipTitle="Agregar participantes"
                icon={faPeopleGroup}
                onClick={() => onShowAddParticipants()}
              />
              <Button
                danger
                type="primary"
                onClick={() =>
                  onConfirmDeleteParticipants(
                    removeParticipants,
                    setRemoveParticipants,
                  )
                }
              >
                Eliminar participantes ({removeParticipants.length})
              </Button>
            </Space>
          </div>
        </Col>
        <Col span={24}>
          <TableVirtualized
            dataSource={orderBy(participants, "createAt", "desc")}
            columns={columns}
            rowHeaderHeight={50}
            rowBodyHeight={150}
            loading={participantsLoading}
          />
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  .header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .contact {
    display: flex;
    align-items: center;
  }
`;
