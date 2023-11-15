import React, { useState } from "react";
import styled from "styled-components";
import Modal from "antd/lib/modal";
import DatePickerAntd from "antd/lib/date-picker";
import { Calendar } from "./calendar";
import { ComponentContainer } from "./component-container";
import { useDevice } from "../../hooks";
//
// interface Props {
//   value?: Moment;
//   required?: boolean;
//   disabled?: boolean;
//   error?: FormError;
//   label?: string;
//   variant?: "outlined" | "filled";
// }
//
// interface DatePickerDesktopProps {
//   id?: string;
//   value?: Moment;
//   disabled?: boolean;
// }
//
// interface DatePickerMobileProps extends Pick<DatePickerProps, "onChange"> {
//   id?: string;
//   value?: Moment;
//   label?: string;
//   disabled?: boolean;
//   calendar?: Record<string, unknown>;
// }

export const DatePicker = ({
  value = undefined,
  defaultValue = undefined,
  required,
  disabled,
  error,
  label,
  variant = "outlined",
  size = "middle",
  animation = false,
  ...props
}) => {
  const { isMobile } = useDevice();
  const Container = ComponentContainer[variant];

  return (
    <Container
      label={label}
      value={value}
      required={required}
      disabled={disabled}
      error={error}
      animation={animation}
    >
      {isMobile ? (
        <DatePickerMobile
          value={value}
          defaultValue={defaultValue}
          label={label}
          disabled={disabled}
          size={size}
          {...props}
        />
      ) : (
        <DatePickerDesktop
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          size={size}
          {...props}
        />
      )}
    </Container>
  );
};

const DatePickerDesktop = ({ id, value, defaultValue, size, ...props }) => (
  <DatePickerAntd
    bordered={false}
    id={id}
    size={size}
    value={value}
    defaultValue={defaultValue}
    placeholder=""
    format="DD/MM/YYYY"
    {...props}
  />
);

const DatePickerMobile = ({
  id,
  value,
  defaultValue,
  label,
  onChange,
  calendar,
  size,
  ...props
}) => {
  const [visiblePanel, setVisiblePanel] = useState(false);

  const onChangeDate = (value, dateString) => {
    setVisiblePanel(false);
    onChange && onChange(value, dateString);
  };

  return (
    <DatePickerAntd
      bordered={false}
      id={id}
      size={size}
      value={value}
      defaultValue={defaultValue}
      format="DD/MM/YYYY"
      placeholder=""
      open={visiblePanel}
      inputReadOnly={true}
      onClick={() => setVisiblePanel(true)}
      onChange={onChangeDate}
      panelRender={() => (
        <ModalMobileStyled
          title={label}
          visible={visiblePanel}
          footer={false}
          centered
          onCancel={() => setVisiblePanel(false)}
        >
          <Calendar defaultValue={defaultValue} {...calendar} />
        </ModalMobileStyled>
      )}
      {...props}
    />
  );
};

const ModalMobileStyled = styled(Modal)`
  max-width: 100vw;
  margin: 0;
  padding: 0;

  .ant-modal-content {
    .ant-modal-close {
    }
    .ant-modal-header {
    }
    .ant-modal-body {
      padding: 0;
    }
  }
`;
