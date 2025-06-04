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

      console.log("ALL DEPARTMENTS:", allDepartments); // 👈

      const filteredDepartments = allDepartments.filter(
        (department) => department.entityId === entityId,
      );

      console.log("FILTERED BY ENTITY:", filteredDepartments); // 👈

      setDepartments(filteredDepartments);
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
