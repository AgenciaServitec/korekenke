import React from "react";
import styled from "styled-components";
import { IconAction, Tag } from "../../../../../components";
import {
  faEdit,
  faSquarePlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { isEmpty } from "lodash";

export const AnimalParentsInformation = ({
  animal,
  onAddAndEditAnimalParents,
  onConfirmDeleteAnimalParents,
  children,
}) => {
  const isFather = animal?.relationship === "father";
  const isMother = animal?.relationship === "mother";

  return (
    <WrapperContent>
      <div className="item">
        {animal?.relationship && (
          <div className="item-information">
            {animal?.relationship && (
              <span className="relationship">
                {isFather && (
                  <Tag
                    color="#0285B4"
                    style={{ textAlign: "center", margin: 0 }}
                  >
                    Padre
                  </Tag>
                )}
                {isMother && (
                  <Tag
                    color="#D0588D"
                    style={{ textAlign: "center", margin: 0 }}
                  >
                    Madre
                  </Tag>
                )}
              </span>
            )}
            <span>{animal?.fullName || "Sin registro"}</span>
            <span>{animal?.registrationNumber || "Sin registro"}</span>
            <span>{animal?.raceOrLine || "Sin registro"}</span>
          </div>
        )}
        <div className="buttons">
          {isEmpty(animal?.parents) ? (
            <IconAction
              tooltipTitle="Agregar familiares"
              icon={faSquarePlus}
              styled={{ color: () => "#637A3A" }}
              onClick={() => onAddAndEditAnimalParents(animal.id)}
            />
          ) : (
            <>
              <div className={!animal?.relationship && "edit"}>
                <IconAction
                  tooltipTitle="Editar familiares"
                  icon={faEdit}
                  styled={{ color: () => "#637A3A" }}
                  onClick={() => onAddAndEditAnimalParents(animal.id)}
                />
              </div>
              {animal?.relationship && (
                <IconAction
                  tooltipTitle="Eliminar familiares"
                  icon={faTrash}
                  styled={{ color: (theme) => theme.colors.error }}
                  onClick={() => onConfirmDeleteAnimalParents(animal.id)}
                />
              )}
            </>
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
  gap: 2rem;

  .item {
    display: flex;
    align-items: center;
    .item-information {
      min-width: 12rem;
      display: flex;
      flex-direction: column;
      border: 2px solid #000;
      border-radius: 0.5rem;
      padding: 0.8rem;
      text-align: center;
      text-transform: uppercase;

      .relationship {
        margin-bottom: 1rem;
        * {
          width: 100%;
        }
      }
    }

    .edit {
      border: 2px solid #000;
      border-radius: 0.5rem;
      background-color: #00000013;
    }
  }

  .family-tree-branches {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;
