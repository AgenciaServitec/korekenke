import React from "react";
import styled from "styled-components";

export const BodyWeightEstimationSheet = ({ equineMagazineProfile }) => {
  const { bodyWeightEstimation } = equineMagazineProfile;

  return (
    <Container>
      <div className="sheet">
        <div className="header">
          <h2 className="header__title">ESTIMACIÓN DEL PESO CORPORAL</h2>
        </div>
        <div className="information-section">
          <table>
            <tbody>
              <tr>
                <td>
                  PT: PERIMETRO TORAXICO (
                  <strong>
                    {bodyWeightEstimation.chestCircumference.typeMeasure}
                  </strong>
                  )
                </td>
                <td className="cell-value">
                  {bodyWeightEstimation.chestCircumference.value}
                </td>
                <td>
                  LC: LONGITUD CORPORAL (
                  <strong>{bodyWeightEstimation.bodyLength.typeMeasure}</strong>
                  )
                </td>
                <td className="cell-value">
                  {bodyWeightEstimation.bodyLength.value}
                </td>
              </tr>
              <tr>
                <td>
                  AC: ALTURA DE LA CRUZ (
                  <strong>
                    {bodyWeightEstimation.heightOfTheCross.typeMeasure}
                  </strong>
                  )
                </td>
                <td className="cell-value">
                  {bodyWeightEstimation.heightOfTheCross.value}
                </td>
                <td>
                  PESO DEL CABALLO (
                  <strong>
                    {bodyWeightEstimation.horseWeight.typeMeasure}
                  </strong>
                  )
                </td>
                <td className="cell-value">
                  {bodyWeightEstimation.heightOfTheCross.value}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="observation">
          <WrapperContent>
            <div className="observation__table">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <strong>OBSERVACIONES:</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="cell-value">
                      <pre
                        style={{ textAlign: "left", whiteSpace: "pre-line" }}
                      >
                        {bodyWeightEstimation.observation.value}
                      </pre>
                    </td>
                  </tr>
                </tbody>
              </table>
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
  font-size: 14px;

  table {
    width: 100%;

    th,
    td {
      border: 1px solid #000;
    }

    th {
      text-transform: uppercase;
      padding: 0.5em;
    }

    td {
      height: 3em;
      padding: 0.5em;
    }
  }

  .sheet {
    .header {
      &__title {
        text-align: center;
        font-size: 1.75em;
      }
    }
    .information-section {
      font-size: 0.8em;
      text-transform: uppercase;
      .cell-value {
        width: 170px;
        font-weight: 700;
        text-align: center;
      }
    }

    .observation {
      &__table {
        font-size: 0.8em;
        .cell-value {
          height: 880px;
          pre {
            padding: 0.5em 0;
            width: 100%;
            height: 100%;
            font-family: Arial, sans-serif;
          }
        }
      }
    }
  }
`;

const WrapperContent = styled.div`
  padding: 0.8em 0;
`;
