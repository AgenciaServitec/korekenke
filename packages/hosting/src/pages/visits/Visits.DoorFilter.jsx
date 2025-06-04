import React, { useEffect, useState } from "react";
import { Select } from "../../components";
import { concat } from "lodash";
import styled from "styled-components";
import { mediaQuery } from "../../styles";
import {
  fetchDepartments,
  fetchEntityByNameId,
} from "../../firebase/collections";

export const VisitsDoorFilter = ({ filterFields, onFilter }) => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    (async () => {
      const _entities = await fetchEntityByNameId("seguridad");
      const entityId = _entities[0]?.id;

      const fetchAllDepartments = await fetchDepartments();

      const allDepartments = fetchAllDepartments.filter((department) =>
        department.name.toLowerCase().includes("puerta de ingreso"),
      );

      const filteredDepartments = allDepartments.filter(
        (department) => department.entityId === entityId,
      );

      const sortedDepartments = filteredDepartments.sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)?.[0] || 0);
        const numB = parseInt(b.name.match(/\d+/)?.[0] || 0);
        return numA - numB;
      });

      setDepartments(sortedDepartments);
    })();
  }, []);

  const onChangeDoor = (value) => {
    onFilter({
      ...filterFields,
      door: value,
    });
  };

  return (
    <Container>
      <FormContent>
        <Select
          label="Puerta"
          value={filterFields.door}
          onChange={onChangeDoor}
          options={concat(
            [{ label: "Todos", value: "all" }],
            departments.map((dep) => ({
              label: dep.name,
              value: dep.id,
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
