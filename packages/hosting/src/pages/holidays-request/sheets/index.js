import React, { useEffect } from "react";
import { notification, PDF, Sheet } from "../../../components";
import { useParams } from "react-router";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { usersRef } from "../../../firebase/collections";
import { Holiday1Sheet } from "./Holiday1Sheet";

export const HolidaysSheets = () => {
  const { userId } = useParams();
  const [user, userLoading, userError] = useDocumentOnce(
    userId ? usersRef.doc(userId) : null,
  );

  useEffect(() => {
    userError && notification({ type: "error" });
  }, [userError]);

  return (
    <PDF>
      <Sheet layout="portrait">
        <Holiday1Sheet user={user} />
      </Sheet>
    </PDF>
  );
};
