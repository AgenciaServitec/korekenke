import React from "react";
import { darken, lighten } from "polished";
import { Tag } from "antd";
import styled, { css } from "styled-components";

export const TagHostname = ({ clientColors, hostname }) => {
  if (!hostname) return null;

  return (
    <a
      href={hostname ? `https://${hostname}` : "#"}
      target="_blank"
      rel="noreferrer"
    >
      <ItemTag
        color={lighten(0.09, clientColors?.bg || "#c4c4c4")}
        clientColors={clientColors}
      >
        {hostname || ""}
      </ItemTag>
    </a>
  );
};

const ItemTag = styled(Tag)`
  ${({ clientColors }) => css`
    color: ${clientColors?.color || "#fff"};
    border: ${`1px solid ${darken(0.07, clientColors?.bg || "#c4c4c4")}`};
  `}
`;
