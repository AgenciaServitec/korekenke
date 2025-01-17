import React from "react";
import styled from "styled-components";
import { mediaQuery } from "../../styles";
import { Select } from "../../components";

export const AssistancesFilter = ({ assistances, filterFields, onFilter }) => {
  const onChangeType = (value) =>
    onFilter({
      ...filterFields,
      type: !value ? "all" : value,
    });

  return (
    <Container>
      <FormContent>
        <Select
          label="Tipo"
          value={filterFields.type}
          onChange={(value) => onChangeType(value)}
          options={[
            {
              label: "Todos",
              value: "all",
            },
            {
              label: "Entrada",
              value: "entry",
            },
            {
              label: "Salida",
              value: "outlet",
            },
          ]}
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
