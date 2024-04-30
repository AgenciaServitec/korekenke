import React from "react";
import styled from "styled-components";
import {PDF} from "./PDF";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import {PdfRegistrationCmsts} from "./PdfRegistrationCmsts";
import {Sheet} from "./Sheet";

const PAGE_SIZES = {
  portrait: { width: "210mm", height: "297mm" },
  landscape: { width: "297mm", height: "210mm" },
};
export const InscriptionFile = () => {
  return (
      <PDF>
        <Sheet layout="portrait">
            <PdfRegistrationCmsts/>
        </Sheet>
      </PDF>
  );
};

const Container = styled(Row)`
  padding: 0 1em;
  margin: 1em 0;
  .item-button {
    @media print {
      display: none;
    }
  }

  .background-yellow {
    background-color: #ccc;
  }
`;
