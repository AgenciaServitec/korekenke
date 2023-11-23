import React, { useState } from "react";
import styled from "styled-components";
import { Button, Checkbox, Col, Divider, Row } from "antd";
import { toUpper } from "lodash";

export const FilterDropdown = ({
  filters,
  clearFilters,
  setSelectedKeys,
  confirm,
}) => {
  const [selected, setSelected] = useState([]);
  const [checkAll, setCheckAll] = useState(false);

  const onCheckAll = (checked) => {
    const values = filters.map((filter) => filter.value);
    setCheckAll(checked);
    setSelected(checked ? values : []);
  };

  const onGroupChange = (selected) => {
    setSelected(selected);
    setCheckAll(selected.length === filters.length);
  };

  const onConfirm = () => {
    if (selected.length === 0) {
      clearFilters();
      confirm();
    } else {
      setSelectedKeys(selected);
      confirm();
    }
  };

  const onReset = () => {
    clearFilters();
    setSelected([]);
    setCheckAll(false);
    confirm();
  };

  return (
    <Container>
      <Row className="content">
        <Col span={24}>
          <Checkbox
            onChange={(e) => onCheckAll(e.target.checked)}
            checked={checkAll}
          >
            All
          </Checkbox>
          <Checkbox.Group
            options={filters.map((filter) => ({
              label: toUpper(filter.text),
              value: filter.value,
            }))}
            onChange={(checkedValue) => onGroupChange(checkedValue)}
            value={selected}
          />
        </Col>
      </Row>
      <Divider />
      <Row className="buttons" align="middle" justify="space-between">
        <Col flex="none">
          <Button onClick={() => onConfirm()} type="link">
            Ok
          </Button>
        </Col>
        <Col flex="none">
          <Button onClick={() => onReset()} type="link">
            Reset
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.border_radius.xx_small};
  padding: 0.4rem 0.1rem;

  .content {
    ::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 3px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: ${({ theme }) => theme.border_radius.xxx_large};
      background-color: #bfbfbf;
      -webkit-box-shadow: 0 0 1px #bfbfbf;
    }

    ::-webkit-scrollbar-corner {
      background-color: transparent;
    }

    max-height: 200px;
    overflow-y: auto;
    padding: 0 0.1rem;

    .ant-checkbox-wrapper {
      margin-left: 0;
      padding: 6px 12px 6px 12px;
      color: ${({ theme }) => theme.colors.white};
    }

    div.ant-checkbox-group {
      display: grid;
    }
  }

  .ant-divider {
    margin: 0.4rem 0;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.white};
  }

  .buttons {
    .ant-btn-link {
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;
