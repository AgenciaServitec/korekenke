import React from "react";
import { Select } from "../../components";
import { concat } from "lodash";
import styled from "styled-components";
import { mediaQuery } from "../../styles";

export const VisitsDependencyFilter = ({ filterFields, onFilter }) => {
  const onChangeDependencyFilter = (value) => {
    onFilter({
      ...filterFields,
      dependency: value,
    });
  };

  const dependencies = [
    {
      label: "COBIENE",
      value: "cobiene",
    },
    {
      label: "COPERE",
      value: "copere",
    },
    {
      label: "COLOGE",
      value: "cologe",
    },
  ];

  return (
    <Container>
      <FormContent>
        <Select
          label="Dependencia"
          value={filterFields.dependency}
          onChange={onChangeDependencyFilter}
          options={concat(
            [{ label: "Todos", value: "all" }],
            dependencies.map((dep) => ({
              label: dep.label,
              value: dep.value,
            })),
          )}
        />
      </FormContent>
    </Container>
  );
};

const Container = styled.section`
  width: 100%;
`;

const FormContent = styled.div`
  display: grid;
  align-items: center;
  grid-gap: 1rem;
  width: 100%;
  ${mediaQuery.minDesktop} {
    grid-template-columns: 1fr;
  }
`;
