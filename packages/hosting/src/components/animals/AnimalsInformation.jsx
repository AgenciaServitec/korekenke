import dayjs from "dayjs";
import React from "react";
import styled from "styled-components";
import { DATE_FORMAT_TO_FIRESTORE } from "../../firebase/firestore";

export const AnimalsInformation = ({ animal }) => {
  return (
    <Container className="section">
      <div className="information-column">
        <ul>
          <ItemInformation existField={true} value="NSG" />
          <ItemInformation existField={animal?.unit?.name} value="UNIDAD" />
          <ItemInformation existField={true} value="GRAN UNIDAD" />
          <ItemInformation existField={animal?.name} value="NOMBRE" />
          <ItemInformation existField={animal?.slopeNumber} value="N° ARETE" />
          <ItemInformation
            existField={animal?.registrationNumber}
            value="N° MATRICULA"
          />
          <ItemInformation existField={animal?.chipNumber} value="N° CHIP" />
          <ItemInformation existField={animal?.gender} value="SEXO" />
          <ItemInformation existField={animal?.color} value="COLOR" />
        </ul>
      </div>
      <div className="information-column">
        <ul>
          <ItemInformation
            existField={true}
            value={`: ${animal?.nsgId || "S/N"}`}
          />
          <ItemInformation
            existField={animal?.unit?.name}
            value={`: ${animal?.unit?.name}`}
          />
          <ItemInformation
            existField={true}
            value={`: ${animal?.greatUnitStatic || "S/N"}`}
          />
          <ItemInformation
            existField={animal?.name}
            value={`: ${animal?.name}`}
          />
          <ItemInformation
            existField={animal?.slopeNumber}
            value={`: ${animal?.slopeNumber}`}
          />
          <ItemInformation
            existField={animal?.registrationNumber}
            value={`: ${animal?.registrationNumber}`}
          />
          <ItemInformation
            existField={animal?.chipNumber}
            value={`: ${animal?.chipNumber}`}
          />
          <ItemInformation
            existField={animal?.gender}
            value={`: ${animal?.gender === "male" ? "Macho" : "Hembra"}`}
          />
          <ItemInformation
            existField={animal?.color}
            value={`: ${animal?.color}`}
          />
        </ul>
      </div>
      <div className="information-column">
        <ul>
          <ItemInformation
            existField={animal?.birthdate}
            value="F. NACIMIENTO"
          />
          <ItemInformation existField={animal?.height} value="TALLA" />
          <ItemInformation existField={animal?.father} value="PADRE" />
          <ItemInformation existField={animal?.mother} value="MADRE" />
          <ItemInformation
            existField={animal?.origin}
            value="PROCEDENCIA"
            label
          />
          <ItemInformation
            existField={animal?.raceOrLine}
            value="RAZA/LINEA"
            label
          />
        </ul>
      </div>
      <div className="information-column">
        <ul>
          <ItemInformation
            existField={animal?.birthdate}
            value={`: ${
              animal?.birthdate
                ? dayjs(animal?.birthdate, DATE_FORMAT_TO_FIRESTORE).format(
                    "DD/MM/YYYY",
                  )
                : ""
            }`}
          />
          <ItemInformation
            existField={animal?.height}
            value={`: ${animal?.height} Mts`}
          />
          <ItemInformation
            existField={animal?.father}
            value={`: ${animal?.father}`}
          />
          <ItemInformation
            existField={animal?.mother}
            value={`: ${animal?.mother}`}
          />
          <ItemInformation
            existField={animal?.origin}
            value={`: ${animal?.origin}`}
          />
          <ItemInformation
            existField={animal?.raceOrLine}
            value={`: ${animal?.raceOrLine}`}
          />
        </ul>
      </div>
    </Container>
  );
};

const ItemInformation = ({ existField = false, value = undefined }) =>
  existField ? <li>{value}</li> : null;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1em;

  .information-column {
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      font-weight: 600;
      font-size: 0.8em;
      text-transform: uppercase;
      display: grid;
      gap: 0.1em;
    }
  }
`;
