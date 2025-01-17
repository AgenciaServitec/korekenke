import React from "react";
import styled from "styled-components";
import { mediaQuery } from "../../styles";
import { Select } from "../../components";
import { WorkPlaces } from "../../data-list";
import { concat } from "lodash";

export const AssistancesFilter = ({ assistances, filterFields, onFilter }) => {
  const onChangeType = (value) =>
    onFilter({
      ...filterFields,
      workPlace: !value ? "all" : value,
    });

  return (
    <Container>
      <FormContent>
        <Select
          label="Lugar de trabajo"
          value={filterFields.workPlace}
          onChange={(value) => onChangeType(value)}
          options={concat(
            [{ label: "Todos", value: "all" }],
            WorkPlaces.map((workPlace) => ({
              label: workPlace.label,
              value: workPlace.value,
            })),
          )}
        />
      </FormContent>
    </Container>
  );
};

const Container = styled.section``;

const FormContent = styled.div`
  display: grid;
  align-items: center;
  grid-gap: 1rem;
  grid-template-columns: 1fr;

  ${mediaQuery.minDesktop} {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;
