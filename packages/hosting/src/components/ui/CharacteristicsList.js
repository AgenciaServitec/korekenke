import React, { useState } from "react";
import { IconAction, Button, Input, InputNumber, TextArea } from "./index";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import styled, { css } from "styled-components";
import { keyframes } from "../../styles";
import Text from "antd/lib/typography";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { capitalize, isEmpty, startCase } from "lodash";

export const CharacteristicsList = ({
  onChange,
  label,
  value = [],
  required = false,
  error = false,
  hidden = false,
  disabled = false,
  helperText,
}) => {
  const [name, setName] = useState("");
  const [value_, setValue_] = useState("");

  const addCharacteristic = () => {
    if (isEmpty(name) && isEmpty(value_)) return;

    const characteristic_ = {
      name: name,
      value: value_,
    };

    setName("");
    setValue_("");

    onChange([...value, characteristic_]);
  };

  const removeCharacteristic = (option) => {
    const optionsFilter = Object.entries(value)
      .map(([key, option_]) => ({
        index: +key,
        ...option_,
      }))
      .filter((option_) => option_.index !== option.index);

    onChange(
      optionsFilter.map((option_) => ({
        name: option_.name,
        value: option_.value,
      }))
    );
  };

  return (
    <>
      <Container hidden={hidden} disabled={disabled} error={error}>
        <Row gutter={[10, 16]}>
          <Col span={24}>
            <Label required={required}>{label}</Label>
          </Col>
          <Col xs={24} sm={8}>
            <Input
              label="Nombre"
              animation={false}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Input
              label="Valor"
              animation={false}
              value={value_}
              onChange={(e) => setValue_(e.target.value)}
            />
          </Col>
          <Col sm={4}>
            <Button size="large" onClick={() => addCharacteristic()} block>
              Agregar
            </Button>
          </Col>
        </Row>
        <br />
        <div>
          {value && (
            <WrapperList>
              {value.map((option, index) => (
                <Row key={index} className="item-list">
                  <Col span={22}>
                    <div>
                      <strong>{option.name}</strong>
                    </div>
                    <div>{option.value}</div>
                  </Col>
                  <Col span={2}>
                    <div>
                      <IconAction
                        icon={faTrash}
                        onClick={() =>
                          removeCharacteristic({ index, ...option })
                        }
                        styled={{ color: (theme) => theme.colors.error }}
                        size={33}
                      />
                    </div>
                  </Col>
                </Row>
              ))}
            </WrapperList>
          )}
        </div>
      </Container>
      {helperText && (
        <ErrorItem error={error}>{capitalize(startCase(helperText))}</ErrorItem>
      )}
    </>
  );
};

const Container = styled.div`
  ${({ theme, hidden, disabled, error }) => css`
    position: relative;
    width: inherit;
    border-radius: ${theme.border_radius.xx_small};
    background: ${theme.colors.white};
    border: 1px solid ${error ? theme.colors.error : theme.colors.gray};
    animation: ${error && keyframes.shake} 340ms
      cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    padding: 0.8em 1em;

    ${hidden &&
    css`
      display: none;
    `}

    ${disabled &&
    css`
      pointer-events: none;
      opacity: 0.5;
    `}
  `}
`;

const Label = styled.label`
  ${({ required }) =>
    required &&
    `   ::after {
          margin-right: 3px;
            color: red;
            content: "*";
        }
    `}
`;

const WrapperList = styled.div`
  display: flex;
  flex-direction: column;

  .item-list {
    background: #f6f6f6;
    border-bottom: 1px solid lightgrey;
    padding: 0.2em;
    div {
      padding: 0 0.3em;
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: center;
    }

    div:last-child {
      border-bottom: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const ErrorItem = styled(Text)`
  ${({ theme, error }) => css`
    color: ${theme.colors.error};
    font-size: ${theme.font_sizes.x_small};
    ${error &&
    css`
      animation: ${keyframes.shake} 340ms;
    `}
  `}
`;
