import dayjs from "dayjs";
import React from "react";
import styled from "styled-components";
import { DATE_FORMAT_TO_FIRESTORE } from "../../../../../firebase/firestore";
import { userFullName } from "../../../../../utils/users/userFullName2";

export const AnimalsInformation = ({ animal, unit = undefined, users }) => {
  return (
    <Container className="section">
      <div className="information-column">
        <ul>
          <ItemInformation
            existField={animal?.nscCorrelativo}
            value="NSC - CORRELATIVO"
          />
          <ItemInformation existField={unit?.name} value="UNIDAD" />
          <ItemInformation existField={animal?.greatUnit} value="GRAN UNIDAD" />
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
            existField={animal?.nscCorrelativo}
            value={`: ${animal?.nscCorrelativo}`}
          />
          <ItemInformation existField={unit?.name} value={`: ${unit?.name}`} />
          <ItemInformation
            existField={animal?.greatUnit}
            value={`: ${animal?.greatUnit}`}
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
          <ItemInformation existField={animal?.origin} value="PROCEDENCIA" />
          <ItemInformation existField={animal?.raceOrLine} value="RAZA/LINEA" />
          <ItemInformation
            existField={animal?.assignedOrAffectedId}
            value="ASIGNADO U AFECTADO"
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
          <ItemInformation
            existField={animal?.assignedOrAffectedId}
            value={`: ${userFullName(
              users.find((_user) => _user.id === animal?.assignedOrAffectedId),
            )}`}
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
