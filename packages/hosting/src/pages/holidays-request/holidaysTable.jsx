import React from "react";
import styled from "styled-components";
import {Acl, IconAction, TableVirtualized} from "../../components";
import { capitalize } from "lodash";
import {HolidaysRequestStatus, HolidaysTemps} from "../../data-list";
import {Space, Tag} from "antd";
import {faEdit, faReply, faTrash} from "@fortawesome/free-solid-svg-icons";

export const HolidaysTable = ({ loading }) => {
  const columns = [
    {
      title: "Fecha creación",
      align: "center",
      width: ["9rem", "100%"],
      render: (added) =>
          added.createAt,
    },
    {
      title: "Apellidos y Nombres",
      align: "center",
      width: ["15rem", "100%"],
      render: (added) =>
          `${capitalize(added.user.paternalSurname)} ${capitalize(added.user.maternalSurname)} ${capitalize(added.user.firstName)}`,
    },
    {
      title: "Fecha de Inicio",
      align: "center",
      width: ["11rem", "100%"],
      render: (added) => added.startDate,
    },
    {
      title: "Fecha de Finalización",
      align: "center",
      width: ["15rem", "100%"],
      render: (added) => added.endDate,
    },
    {
      title: "Estado",
      align: "center",
      width: ["7rem", "100%"],
      render: (added) => {
        const holidayStatus = HolidaysRequestStatus[added.status];
        return(
            <Tag color = {holidayStatus?.color}>{holidayStatus?.name}</Tag>
        );
      },
    },
    {
      title: "Respuesta",
      align: "center",
      width: ["8rem", "100%"],
      render: (added) => "Sin respuesta",
    },
    {
      title: "Opciones",
      align: "center",
      width: ["8rem", "100%"],
      render: (added) => (
          <Space>
            <Acl
                category="public"
                subCategory="holidaysRequest"
                name="/holidays-request#reply"
            >
              {added.status !== "finalized" &&(
                  <IconAction
                      tooltipTitle="Responder registro"
                      icon={faReply}
                      styled={{color:(theme)=>theme.colors.primary}}
                      onClick={()=>console.log("Aun no disponible")}
                  />
              )}
            </Acl>
            <Acl
                category="public"
                subCategory="holidaysRequest"
                name="/holidays-request/:holidayRequestId"
            >
              {added?.status !== "finalized" && (
                  <IconAction
                      tooltipTitle="Editar"
                      icon={faEdit}
                      onClick={() => console.log('No disponible')}
                  />
              )}
            </Acl>
            <Acl
                category="public"
                subCategory="holidaysRequest"
                name="/holidays-request#delete"
            >
              <IconAction
                  tooltipTitle="Eliminar"
                  icon={faTrash}
                  styled={{ color: (theme) => theme.colors.error }}
                  onClick={() => console.log('Aun no existe')}
              />
            </Acl>
          </Space>
      )
    },
  ];

  return (
      <Container>
        <TableVirtualized
            loading={loading}
            dataSource={HolidaysTemps}
            columns={columns}
            rowHeaderHeight={50}
            rowBodyHeight={90}
        />
      </Container>
  );
};

const Container = styled.div``;
