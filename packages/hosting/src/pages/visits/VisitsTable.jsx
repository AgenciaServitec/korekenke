import React, { useEffect, useState } from "react";
import {
  Acl,
  Col,
  IconAction,
  Row,
  Space,
  TableVirtualized,
  Tag,
} from "../../components/ui";
import dayjs from "dayjs";
import { VisitsStatus } from "../../data-list";
import {
  faBuildingCircleXmark,
  faEdit,
  faEye,
  faHourglassStart,
  faReply,
  faRightFromBracket,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { orderBy } from "lodash";
import { userFullName } from "../../utils/users/userFullName2";
import { useAuthentication } from "../../providers";
import { useBosses } from "../../hooks";

export const VisitsTable = ({
  visits,
  onClickDeleteVisit,
  onClickEditVisit,
  onConfirmIOChecker,
  onShowVisitReplyModal,
  setFilterCount,
  setFilterStates,
  filterCount,
  onShowVisitedObservation,
  onShowVisitedObservationView,
}) => {
  const { authUser } = useAuthentication();
  const { fetchEntityManager, fetchDepartmentBoss, fetchDepartmentBossSecond } =
    useBosses();

  const [managerEntityGu, setManagerEntityGu] = useState(null);
  const [managerEntityGuSeguridad, setManagerEntityGuSeguridad] =
    useState(null);
  const [bossDepartment, setBossDepartment] = useState(null);
  const [bossSecondDepartment, setBossSecondDepartment] = useState(null);
  const [bossDepartment1, setBossDepartment1] = useState(null);
  const [bossSecondDepartment1, setBossSecondDepartment1] = useState(null);

  useEffect(() => {
    (async () => {
      const _managerEntityGuSeguridad = await fetchEntityManager("seguridad");
      const _bossDepartmentSeguridad1 = await fetchDepartmentBoss(
        "puerta-de-ingreso-1",
      );
      const _bossSecondDepartmentSeguridad1 = await fetchDepartmentBossSecond(
        "puerta-de-ingreso-1",
      );
      const _managerEntityGu = await fetchEntityManager(
        "departamento-de-inteligencia-y-contrainteligencia-del-ejercito",
      );
      const _bossDepartment = await fetchDepartmentBoss("puerta-de-ingreso");
      const _bossSecondDepartment =
        await fetchDepartmentBossSecond("puerta-de-ingreso");

      setManagerEntityGuSeguridad(_managerEntityGuSeguridad);
      setBossDepartment1(_bossDepartmentSeguridad1);
      setBossSecondDepartment1(_bossSecondDepartmentSeguridad1);

      setManagerEntityGu(_managerEntityGu);
      setBossDepartment(_bossDepartment);
      setBossSecondDepartment(_bossSecondDepartment);
    })();
  }, []);

  const messageWhatsapp = (visit) =>
    `https://api.whatsapp.com/send/?phone=${visit.personVisited.phone.prefix.replace("+", "")}${visit.personVisited.phone.number}&text=Hola ${userFullName(visit.personVisited)} 👋,te viene a visitar ${userFullName(visit)} ‍💼.%0A%0APor favor, ingresa al módulo de visitas en Korekenke 📲 para que puedas aprobar la visita ✅.%0A%0AGracias.&app_absent=0`;

  const isManagerEntityGuSeguridad =
    authUser.id === managerEntityGuSeguridad?.id;
  const isBossSeguridad1 = authUser.id === bossDepartment1?.id;
  const isBossSecondSeguridad1 = authUser.id === bossSecondDepartment1?.id;

  const isManagerEntityGu = authUser.id === managerEntityGu?.id;
  const isBossPI = authUser.id === bossDepartment?.id;
  const isBossSecondPI = authUser.id === bossSecondDepartment?.id;

  const visitsView = (() => {
    const filteredVisits = visits.filter((visit) => {
      if (
        ["super_admin"].includes(authUser.roleCode) ||
        isManagerEntityGuSeguridad ||
        isBossSeguridad1 ||
        isBossSecondSeguridad1
      )
        return true;

      if (
        visit.dependency.toLowerCase() === authUser?.initialCommand.id &&
        (["pending", "approved", "disapproved"].includes(visit.status) ||
          isManagerEntityGu ||
          isBossPI ||
          isBossSecondPI)
      )
        return true;

      if (visit.userId === authUser.id) return true;

      return false;
    });

    setFilterCount(filteredVisits.length);
    return filteredVisits;
  })();

  useEffect(() => {
    const statusCounts = visitsView.reduce((acc, visit) => {
      if (visit?.status) {
        acc[visit.status] = (acc[visit.status] || 0) + 1;
      }
      return acc;
    }, {});
    setFilterStates(statusCounts);
  }, [filterCount]);

  const columns = [
    {
      title: "F. Creación",
      align: "center",
      width: ["9rem", "100%"],
      render: (visit) =>
        dayjs(visit.createAt.toDate()).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Apellidos Y Nombres",
      align: "center",
      width: ["9rem", "100%"],
      render: (visit) => (
        <Space direction="vertical">
          <span>{userFullName(visit)}</span>
          {visit.phone.number && (
            <Space>
              <IconAction
                tooltipTitle="Whatsapp"
                icon={faWhatsapp}
                size={27}
                styled={{ color: (theme) => theme.colors.success }}
                onClick={() =>
                  window.open(
                    `https://api.whatsapp.com/send/?phone=${visit.phone.prefix.replace("+", "")}${visit.phone.number}&text=${messageWhatsapp(visit)}&app_absent=0`,
                  )
                }
              />
              <span>{visit.phone.number}</span>
            </Space>
          )}
        </Space>
      ),
    },
    {
      title: "DNI",
      align: "center",
      width: ["9rem", "100%"],
      render: (visit) => visit.dni,
    },
    {
      title: "Dependencia",
      align: "center",
      width: ["9rem", "100%"],
      render: (visit) => visit.dependency,
    },
    {
      title: "¿A quién visita?",
      align: "center",
      width: ["9rem", "100%"],
      render: (visit) => (
        <div>
          <span>{userFullName(visit?.personVisited)}</span>
          <Space>
            <IconAction
              tooltipTitle="Whatsapp"
              icon={faWhatsapp}
              size={27}
              styled={{ color: (theme) => theme.colors.success }}
              onClick={() =>
                window.open(
                  `https://api.whatsapp.com/send/?phone=${visit.personVisited.phone.prefix.replace("+", "")}${visit.personVisited.phone.number}&text=${messageWhatsapp(visit)}&app_absent=0`,
                )
              }
            />
            <span>{visit.personVisited.phone.number}</span>
          </Space>
        </div>
      ),
    },
    {
      title: "Estado",
      align: "center",
      width: ["9rem", "100%"],
      render: (visit) => {
        const status = VisitsStatus?.[visit?.status];
        return <Tag color={status?.color}>{status?.name}</Tag>;
      },
    },
    {
      title: "F/H - INGRESO",
      align: "center",
      width: ["9rem", "100%"],
      render: (visit) => visit?.entryDateTime,
    },
    {
      title: "F/H - SALIDA",
      align: "center",
      width: ["9rem", "100%"],
      render: (visit) =>
        visit.exitDateTime ? (
          visit.exitDateTime
        ) : (
          <Acl category="public" subCategory="visits" name="/visits#check-out">
            {visit.status === "approved" ? (
              <IconAction
                tooltipTitle="Registrar Salida"
                styled={{ color: (theme) => theme.colors.info }}
                icon={faRightFromBracket}
                onClick={() => onConfirmIOChecker(visit)}
              />
            ) : visit.status === "pending" ? (
              <IconAction
                tooltipTitle="Esperando aprobación"
                styled={{ color: (theme) => theme.colors.warning }}
                icon={faHourglassStart}
                onClick={() => {}}
              />
            ) : (
              <IconAction
                tooltipTitle="Visita Desaprobada"
                styled={{ color: (theme) => theme.colors.error }}
                icon={faBuildingCircleXmark}
                onClick={() => {}}
              />
            )}
          </Acl>
        ),
    },
    {
      title: "Opciones",
      align: "center",
      width: ["14rem", "100%"],
      render: (visit) => (
        <Space>
          {visit.userId === authUser.id ? (
            <IconAction
              tooltipTitle="Observacion"
              icon={faEye}
              styled={{ color: (theme) => theme.colors.info }}
              onClick={() => onShowVisitedObservation(visit)}
            />
          ) : (
            <IconAction
              tooltipTitle="Ver Observacion"
              icon={faEye}
              styled={{
                color: visit.visitedObservation
                  ? (theme) => theme.colors.info
                  : (theme) => theme.colors.gray,
              }}
              onClick={() =>
                visit.visitedObservation && onShowVisitedObservationView(visit)
              }
            />
          )}
          <Acl
            category="public"
            subCategory="visits"
            name="/visits/:visitId#reply"
          >
            <IconAction
              tooltipTitle="Responder solicitud"
              icon={faReply}
              styled={{ color: (theme) => theme.colors.primary }}
              onClick={() => onShowVisitReplyModal(visit)}
            />
          </Acl>
          <Acl category="public" subCategory="visits" name="/visits/:visitId">
            <IconAction
              tooltipTitle="Editar"
              onClick={() => onClickEditVisit(visit.id)}
              styled={{ color: (theme) => theme.colors.tertiary }}
              icon={faEdit}
            />
          </Acl>
          <Acl category="public" subCategory="visits" name="/visits#delete">
            <IconAction
              tooltipTitle="Eliminar"
              onClick={() => onClickDeleteVisit(visit.id)}
              icon={faTrash}
              styled={{
                color: (theme) => theme.colors.error,
              }}
            />
          </Acl>
        </Space>
      ),
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <TableVirtualized
          dataSource={orderBy(visitsView, "createAt", "desc")}
          columns={columns}
          rowHeaderHeight={50}
          rowBodyHeight={150}
        />
      </Col>
    </Row>
  );
};
