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
            <div className="main__information">
              <div className="section_image">
                <div className="column_image">
                  <div>
                    <a href="" target="_blank" rel="noopener noreferrer">
                      <img
                        src="https://www.shutterstock.com/image-photo/red-warmbllood-horse-isolated-on-600w-1678135447.jpg"
                        alt="Perfil Izquierdo"
                        style={{ maxWidth: "70%", height: "auto" }}
                      />
                    </a>
                  </div>
                </div>
                <div className="column_image">
                  <div>
                    <a href="" target="_blank" rel="noopener noreferrer">
                      <img
                        src="https://img.freepik.com/foto-gratis/vista-frontal-elegante-caballo-marron-melena-larga_181624-29024.jpg?size=626&ext=jpg&ga=GA1.1.44546679.1716163200&semt=ais_user"
                        alt="Perfil Frontal"
                        style={{ maxWidth: "37%", height: "auto" }}
                      />
                    </a>
                  </div>
                </div>
                <div className="column_image">
                  <div>
                    <a href="" target="_blank" rel="noopener noreferrer">
                      <img
                        src="https://www.ecuestre.es/contenidos/imagenes/articulo/60916f498e5ff059ed71f7e2/1620144719622-la-conformacion-del-caballo-y-su-relacion-con-las-lesiones.jpg"
                        alt="Perfil Derecho"
                        style={{ maxWidth: "70%", height: "auto" }}
                      />
                    </a>
                  </div>
                </div>
              </div>
              <div className="section_information">
                <div className="column_information">
                  <div>
                    <strong>Unidad:</strong> RC &quot;MDN&quot; - EPR
                  </div>
                  <div>
                    <strong>Gran Unidad:</strong> II DE
                  </div>
                  <div>
                    <strong>Nombre:</strong> Very Gracioso Z
                  </div>
                  <div>
                    <strong>N° Matricula:</strong> 9 - 21
                  </div>
                  <div>
                    <strong>N° CHIP:</strong> 2098897
                  </div>
                  <div>
                    <strong>Sexo :</strong> Macho
                  </div>
                  <div>
                    <strong>Color :</strong> Alazan
                  </div>
                </div>
                <div className="column_information">
                  <div>
                    <strong>F. Nacimiento:</strong> 06/11/2009
                  </div>
                  <div>
                    <strong>Talla:</strong> 1.70 Mts
                  </div>
                  <div>
                    <strong>Padre:</strong> Very Volt Z
                  </div>
                  <div>
                    <strong>Madre:</strong> Graciela
                  </div>
                  <div>
                    <strong>Procedencia:</strong> Argentino
                  </div>
                  <div>
                    <strong>Raza/Linea:</strong> Zangersheide
                  </div>
                </div>
              </div>
              <div className="description">
                <strong> Reseña: </strong> <br />
                <strong> ALAZAN </strong>Lucero cordon fino terminando en la
                termilla, lepra entre los ollares, albo posterior derecho
              </div>
              <div className="section_signature">
                <div className="signature_content">
                  <div className="signature_tittle">
                    <strong> JEFE DEL SVETRE</strong>
                  </div>
                  <div className="signature_img">
                    <img
                      src="https://cdn.shopify.com/s/files/1/0594/4639/5086/files/Line_Through_Name.jpg"
                      alt="Perfil Izquierdo"
                      style={{ maxWidth: "70%", height: "auto" }}
                    />
                  </div>
                  <div className="signature_info">
                    <p>
                      <strong>0-224163373</strong>
                    </p>
                    <p>
                      <strong>JUAN CARLOS HOLGUIN AVILA</strong>
                    </p>
                    <p>
                      <strong>CRL-EP</strong>
                    </p>
                    <p>
                      <strong>
                        JEFE DEL SERVICIO DE VETERINARIA Y REMONTA DEL EJERCITO
                      </strong>
                    </p>
                  </div>
                </div>
                <div className="signature_content">
                  <div className="signature_tittle">
                    <strong> JEFE DE UNIDAD</strong>
                  </div>
                  <div className="signature_img">
                    <img
                      src="https://cdn.shopify.com/s/files/1/0594/4639/5086/files/Line_Through_Name.jpg"
                      alt="Perfil Izquierdo"
                      style={{ maxWidth: "70%", height: "auto" }}
                    />
                  </div>
                  <div className="signature_info">
                    <p>
                      <strong>O-226561074-O+</strong>
                    </p>
                    <p>
                      <strong>CARLOS OMAR RUIZ BARDALES</strong>
                    </p>
                    <p>
                      <strong>Coronel de Caballeria </strong>
                    </p>
                    <p>
                      <strong>Comandante del RC &quot;MDN&quot; EPR</strong>
                    </p>
                  </div>
                </div>
                <div className="signature_content">
                  <div className="signature_tittle">
                    <strong> OFICIAL VETERINARIO</strong>
                  </div>
                  <div className="signature_img">
                    <img
                      src="https://cdn.shopify.com/s/files/1/0594/4639/5086/files/Line_Through_Name.jpg"
                      alt="Perfil Izquierdo"
                      style={{ maxWidth: "70%", height: "auto" }}
                    />
                  </div>
                  <div className="signature_info">
                    <p>
                      <strong>O-126259900 - O+</strong>
                    </p>
                    <p>
                      <strong>RODYNEL WALDIR GONZALES MAYTA</strong>
                    </p>
                    <p>
                      <strong>TTE S VET</strong>
                    </p>
                    <p>
                      <strong>JEFE PEL VET DEL RC &quot;MDN&quot;EPR</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </WrapperContent>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;

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

  .main__information {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .section_image {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
    padding-left: 4em;
  }

  .column_image {
    width: calc(30% - 10px);
    margin-bottom: 1em;
  }

  .section_information {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .column_information {
    width: calc(50% - 10px);
    margin-bottom: 1em;

    div {
      padding-left: 3em;
      margin-bottom: 0.3em;
    }
  }
  .description {
    padding: 0 0 4.5em 3em;
  }
  .section_signature {
    width: 100%;
    padding: 0.1em;
    display: flex;
    justify-content: space-between;
    gap: 0 7em;
    .signature_content {
      text-align: center;

      .signature_tittle {
        font-size: 0.8em;
      }

      .signature_info {
        font-size: 0.7em;
        border-top: 1px solid #000;
      }
    }
  }
`;

const WrapperContent = styled.div`
  padding: 0.8em 0;
`;
