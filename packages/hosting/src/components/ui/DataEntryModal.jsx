import React from "react";
import styled, { css } from "styled-components";
import ModalAntd from "antd/lib/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { mediaQuery } from "../../styles";

export const DataEntryModal = ({
  onCancel,
  visible = false,
  title,
  children,
  dataTestId,
}) => (
  <ModalStyled
    centered
    wrapClassName="data-entry-modal"
    footer={false}
    onCancel={onCancel}
    visible={visible}
    title={title}
    width="70%"
    closeIcon={<FontAwesomeIcon icon={faTimes} size="lg" />}
    destroyOnClose
    data-testid={dataTestId}
  >
    <WrapperContent>{children}</WrapperContent>
  </ModalStyled>
);

const WrapperContent = styled.div`
  width: 100%;
  padding-bottom: 9em;
  ${mediaQuery.minDesktop} {
    padding-bottom: 2em;
  }
`;

export const ModalStyled = styled(ModalAntd)`
  ${({ theme }) => css`
    max-width: 100vw;
    margin: 0;
    height: calc(100vh - calc(100vh - 100%));
    min-width: 100vw;
    padding-bottom: 9em;
    ${mediaQuery.minDesktop} {
      padding-bottom: 2em;
    }

    ${mediaQuery.minDesktop} {
      min-width: 0;
    }

    .ant-modal-content {
      height: 100%;
      border-radius: 0;

      ${mediaQuery.minDesktop} {
        padding: 2rem 3rem;
      }

      .ant-modal-close {
      }

      .ant-modal-header {
        border-radius: 0;
        border-bottom: 0 solid #f0f0f0;
      }

      .ant-modal-body {
        padding: ${theme.paddings.small};
        height: calc(100% - 0px);
        overflow-y: scroll;

        .ant-picker-calendar {
          .ant-picker-panel {
            border-top: 0 solid #f0f0f0;
          }
        }
      }
    }
  `}
`;
