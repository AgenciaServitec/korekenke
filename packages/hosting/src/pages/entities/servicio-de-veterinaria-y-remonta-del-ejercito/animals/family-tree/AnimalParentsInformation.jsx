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
          <div className={`item-information ${animal?.relationship}`}>
            {animal?.relationship && (
              <div className="relationship">
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
              </div>
            )}
            <div className="content">
              <strong>{animal?.fullName || "Sin registro"}</strong>
              <span>{animal?.registrationNumber || "Sin registro"}</span>
              <span>{animal?.raceOrLine || "Sin registro"}</span>
            </div>
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
              {animal?.relationship && !animal?.["isDefault"] && (
                <IconAction
                  tooltipTitle="Eliminar familiares"
                  icon={faTrash}
                  styled={{ color: (theme) => theme.colors.error }}
                  onClick={() => onConfirmDeleteAnimalParents(animal.id)}
                />
              )}
            </>
          )}
          <div className="arrow-line"></div>
          <div className="line-white"></div>
        </div>
      </div>
      <div className="family-tree-branches">
        <div className="root-line"></div>
        <div className="family-tree-branches-content">{children}</div>
      </div>
    </WrapperContent>
  );
};

const WrapperContent = styled.div`
  display: flex;
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
      text-align: center;
      text-transform: uppercase;
      position: relative;

      .relationship {
        .ant-tag {
          width: 100%;
          border-top-left-radius: 0.37rem;
          border-top-right-radius: 0.37rem;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
      }
      .content {
        display: flex;
        flex-direction: column;
        padding: 0.4em 0.2em;
      }
    }

    .father {
      &::before {
        transform: translateY(-8%);
        border-right: none;
        border-bottom: none;
      }
      &::after {
        min-height: 105%;
        transform: translateY(5%);
        border-top: none;
        border-bottom: none;
        border-right: none;
      }
    }

    .mother {
      &::before {
        transform: translateY(-80%);
        border-top: none;
        border-right: none;
      }
      &::after {
        min-height: 105%;
        transform: translateY(-100%);
        border-top: none;
        border-bottom: none;
        border-right: none;
      }
    }

    .buttons {
      position: relative;

      .arrow-line {
        width: 1rem;
        height: 1rem;
        position: absolute;
        top: 50%;
        right: -3.5px;
        transform: translateY(-50%);
        z-index: 500;

        &::before {
          content: "";
          width: 1rem;
          height: 1.1rem;
          position: absolute;
          top: 50%;
          right: -1rem;
          transform: translateY(-97%);
          border: 2px solid #000;
          border-left: none;
          border-top: none;
          border-bottom-right-radius: 0.5rem;
        }

        &::after {
          content: "";
          width: 1rem;
          height: 1.1rem;
          position: absolute;
          top: 50%;
          right: -1rem;
          transform: translateY(-2.5%);
          border: 2px solid #000;
          border-left: none;
          border-bottom: none;
          border-top-right-radius: 0.5rem;
        }
      }

      .line-white {
        width: 2px;
        height: 2rem;
        position: absolute;
        top: 50%;
        right: -1.2rem;
        transform: translateY(-50%);
        background-color: #fff;
        z-index: 1;
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
    align-items: center;
    position: relative;

    .root-line {
      width: 1rem;
      height: 50%;
      min-height: 3rem;
      position: absolute;
      top: 50%;
      left: -0.9rem;
      transform: translateY(-50%);
      border: 2px solid #000;
      border-right: none;
      border-top-left-radius: 0.5rem;
      border-bottom-left-radius: 0.5rem;
    }

    .family-tree-branches-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }
`;
