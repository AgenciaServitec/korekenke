import React, { useEffect } from "react";
import { notification, PDF, Sheet, Spinner } from "../../../../components";
import { useParams } from "react-router";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { usersRef } from "../../../../firebase/collections";
import { Holiday1Sheet } from "./Holiday1Sheet";
import {
  holidaysRef,
  updateHoliday,
} from "../../../../firebase/collections/holidays";
import { useBosses } from "../../../../hooks";
import { Holiday2Sheet } from "./Holiday2Sheet";
import { firestore } from "../../../../firebase";

const ENTITY_GU_NAME_ID = "departamento-de-apoyo-social";
const DEPARTMENT_NAME_ID = "mesa-de-partes";

export const HolidaysSheets = () => {
  const { holidayRequestId, userId } = useParams();
  const { fetchEntityManager } = useBosses();

  const [holidays] = useCollectionData(
    firestore.collection("holidays").where("isDeleted", "==", false),
  );

  const [holiday] = useDocumentData(
    firestore.collection("holidays").doc(holidayRequestId),
  );

  const [user, userLoading, userError] = useDocumentData(
    userId ? usersRef.doc(userId) : null,
  );
  const [holidayRequest, holidayRequestLoading, holidayRequestError] =
    useDocumentData(
      holidayRequestId ? holidaysRef.doc(holidayRequestId) : null,
    );

  useEffect(() => {
    (userError || holidayRequestError) && notification({ type: "error" });
  }, [userError, holidayRequestError]);

  useEffect(() => {
    (async () => {
      if (!holidayRequest) return;

      if (holidayRequest?.status === "inProgress") return;

      const dasEntityManager = await fetchEntityManager(ENTITY_GU_NAME_ID);

      if (
        holidayRequest?.wasRead === false &&
        holidayRequest?.status === "proceeds" &&
        dasEntityManager?.id === user?.id
      ) {
        await updateHoliday(holidayRequest.id, {
          status: "inProgress",
          wasRead: true,
        });
      }
    })();
  }, [holidayRequest]);

  if (holidayRequestLoading || userLoading) return <Spinner height="100svh" />;

  return (
    <PDF>
      <Sheet layout="landscape">
        <Holiday1Sheet user={user} holiday={holiday} holidays={holidays} />
      </Sheet>
      <Sheet layout="landscape">
        <Holiday2Sheet user={user} holiday={holiday} />
      </Sheet>
    </PDF>
  );
};
