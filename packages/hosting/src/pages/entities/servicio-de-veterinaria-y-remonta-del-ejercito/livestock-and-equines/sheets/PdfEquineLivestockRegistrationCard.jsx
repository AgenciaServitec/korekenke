import React, { useEffect } from "react";
import { useParams } from "react-router";
import { firestore } from "../../../../../firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { notification, Spinner } from "../../../../../components";

export const PdfEquineLivestockRegistrationCard = () => {
  const { livestockAndEquineId } = useParams();
  const [
    liveStockAndEquine,
    liveStockAndEquineLoading,
    liveStockAndEquineError,
  ] = useDocumentData(
    firestore.collection("livestock-and-equines").doc(livestockAndEquineId)
  );

  useEffect(() => {
    liveStockAndEquineError && notification({ type: "error" });
  }, [liveStockAndEquineError]);

  if (liveStockAndEquineLoading) return <Spinner height="80vh" />;

  console.log("DATOS DE EQUINO: ", { liveStockAndEquine });

  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <h2 className="header__title">
            SERVICIO DE VETERINARIA Y REMONTA DEL EJÉRCITO
          </h2>
          <h3 className="header__title">
            TARJETA DE REGISTRO DE GANADO EQUINO
          </h3>
        </div>
        <div className="main">
          <WrapperContent>
            <div className="main__information"></div>
          </WrapperContent>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;

  table {
    table {
      width: 100%;
    }
    th,
    td {
      border: 1px solid #000;
    }

    th {
      text-transform: uppercase;
      padding: 0.5em 0;
    }

    td {
      height: 3em;
      padding: 0 0.5em;
    }
  }

  .sheet {
    .header {
      &__title {
        text-align: center;
        font-size: 1.75em;
      }
    }

    .main {
    }
  }
`;

const WrapperContent = styled.div`
  padding: 0.8em 0;
`;
