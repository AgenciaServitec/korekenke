import React, { useEffect } from "react";
import { DecreeSheet } from "./DecreeSheet";
import { notification, PDF, Sheet, Spinner } from "../../../../components";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { correspondencesRef } from "../../../../firebase/collections";
import { useParams } from "react-router";

export const DecreeSheets = () => {
  const { correspondenceId } = useParams();

  const [correspondence = [], correspondenceLoading, correspondenceError] =
    useDocumentData(
      correspondenceId ? correspondencesRef.doc(correspondenceId) : null
    );

  useEffect(() => {
    correspondenceError && notification({ type: "error" });
  }, [correspondenceError]);

  if (correspondenceLoading) return <Spinner height="80vh" />;

  return (
    <PDF>
      <Sheet layout="portrait">
        <DecreeSheet decree={correspondence?.decree} />
      </Sheet>
    </PDF>
  );
};
