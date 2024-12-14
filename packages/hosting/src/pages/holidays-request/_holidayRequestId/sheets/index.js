import React, { useEffect, useState } from "react";
import { notification, PDF, Sheet, Spinner } from "../../../../components";
import { useParams } from "react-router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import {
  fetchDepartmentByNameId,
  fetchEntityByNameId,
  fetchUser,
  usersRef,
} from "../../../../firebase/collections";
import { Holiday2Sheet } from "./Holiday2Sheet";
import {
  holidaysRef,
  updateHoliday,
} from "../../../../firebase/collections/holidays";
import { Holiday1Sheet } from "./Holiday1Sheet";

const ENTITY_GU_NAME_ID = "cobiene";
const DEPARTMENT_NAME_ID = "departamento-de-personal";

export const HolidaysSheets = () => {
  const { holidayId, userId } = useParams();

  const [entityManager, setEntityManager] = useState(null);
  const [departmentBoss, setDepartmentBoss] = useState(null);

  const [holiday = [], holidayLoading, holidayError] = useDocumentData(
    holidayId ? holidaysRef.doc(holidayId) : null,
  );

  const [user = {}, userLoading, userError] = useDocumentData(
    userId ? usersRef.doc(userId) : null,
  );

  useEffect(() => {
    (holidayError || userError) && notification({ type: "error" });
  }, [holidayError, userError]);

  useEffect(() => {
    (async () => {
      const _entities = await fetchEntityByNameId(ENTITY_GU_NAME_ID);
      const _departments = await fetchDepartmentByNameId(DEPARTMENT_NAME_ID);

      if (!_entities?.[0]?.managerId || !_departments?.[0]?.bossId) return;

      const _entityManager = await fetchUser(_entities[0].managerId);
      const _departmentBoss = await fetchUser(_departments[0].bossId);

      setEntityManager(_entityManager || null);
      setDepartmentBoss(_departmentBoss || null);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!holiday || !entityManager) return;

      if (holiday?.status === "inProgress") return;

      if (
        holiday?.wasRead === false &&
        holiday?.status === "proceeds" &&
        entityManager?.id === user?.id
      ) {
        await updateHoliday(holiday.id, {
          status: "inProgress",
          wasRead: true,
        });
      }
    })();
  }, [holiday, entityManager]);

  if (holidayLoading || userLoading) return <Spinner height="100svh" />;

  return (
    <PDF>
      <Sheet layout="landscape">
        <Holiday1Sheet
          user={user}
          holiday={holiday}
          entityManager={entityManager}
        />
      </Sheet>
      <Sheet layout="landscape">
        <Holiday2Sheet
          user={user}
          holiday={holiday}
          departmentBoss={departmentBoss}
        />
      </Sheet>
    </PDF>
  );
};
