import React from "react";
import styled from "styled-components";
import { IconAction } from "../../../../../components";
import { faEdit, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { isEmpty } from "lodash";

export const AnimalParentsInformation = ({
  animal,
  onAddAnimalParents,
  onEditAnimalParents,
  children,
}) => {
  return (
    <WrapperContent>
      <div className="item">
        <span>{animal?.fullName || "Sin registro"}</span>
        <span>{animal?.registrationNumber || "Sin registro"}</span>
        <span>{animal?.raceOrLine || "Sin registro"}</span>
        <div className="button-add">
          {isEmpty(animal.parents) ? (
            <IconAction
              tooltipTitle="Agregar familiar"
              icon={faSquarePlus}
              styled={{ color: () => "#637A3A" }}
              onClick={() => onAddAnimalParents()}
            />
          ) : (
            <IconAction
              tooltipTitle="Editar familiar"
              icon={faEdit}
              styled={{ color: () => "#637A3A" }}
              onClick={() => onEditAnimalParents(animal.id)}
            />
          )}
        </div>
      </div>
      <div className="family-tree-branches">{children}</div>
    </WrapperContent>
  );
};

const WrapperContent = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;

  .item {
    width: 12rem;
    display: flex;
    flex-direction: column;
    border: 1px solid #000;
    border-radius: 0.5rem;
    padding: 0.5rem;
    text-align: center;
    text-transform: uppercase;
    position: relative;

    .button-add {
      position: absolute;
      top: 50%;
      right: -2.7rem;
      transform: translateY(-50%);
    }
  }

  .family-tree-branches {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;
