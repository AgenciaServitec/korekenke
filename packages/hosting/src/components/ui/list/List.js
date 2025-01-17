import React from "react";
import styled, { css } from "styled-components";
import { List as ListAntd } from "antd";
import { IconAction } from "../IconAction";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { modalConfirm } from "../modalConfirm";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { darken } from "polished";

export const List = ({
  actions,
  dataSource,
  isMobile = false,
  isColored = () => false,
  itemContent,
  itemDescription,
  itemTitle,
  loading,
  onDeleteItem,
  onDeleteConfirmOptions,
  onEditItem,
  visibleDeleteItem = () => true,
  visibleEditItem = () => true,
}) => {
  const itemActions = (item, index) => {
    const itemActions = [];

    if (visibleEditItem(item) && onEditItem) {
      const onClickEdit = () => onEditItem(item, index);

      itemActions.push(
        <IconAction
          key="edit"
          data-testid="edit"
          onClick={onClickEdit}
          icon={faEdit}
        />,
      );
    }

    if (visibleDeleteItem(item) && onDeleteItem) {
      const onClickDelete = () => {
        modalConfirm({
          onOk: () => onDeleteItem(item, index),
          ...onDeleteConfirmOptions,
        });
      };

      itemActions.push(
        <IconAction
          key="delete"
          data-testid="delete"
          onClick={onClickDelete}
          icon={faTrashAlt}
          styled={{
            color: () => "rgb(241, 13, 13)",
          }}
        />,
      );
    }

    if (actions) {
      itemActions.concat(actions(item, index));
    }

    return itemActions;
  };

  return (
    <ListWrapper isMobile={isMobile}>
      <ListAntd
        loading={loading}
        dataSource={dataSource}
        itemLayout={isMobile ? "vertical" : "horizontal"}
        renderItem={(item, index) => (
          <ListItem
            key={index}
            isColored={isColored(item)}
            actions={itemActions(item, index)}
          >
            <ListAntd.Item.Meta
              title={itemTitle && itemTitle(item, index)}
              description={itemDescription && itemDescription(item, index)}
            />
            {itemContent && itemContent(item, index)}
          </ListItem>
        )}
      />
    </ListWrapper>
  );
};

const ListWrapper = styled.section`
  ${({ isMobile, theme }) => css`
    ${isMobile ? ListMobileCSS : ListDesktopCSS}
    .ant-spin-container {
      .ant-list-items {
        .ant-list-item {
          position: relative;
          box-sizing: border-box;
          transition: all ease-in-out 80ms;
          border-radius: ${theme.border_radius.small};
          margin-bottom: 0.5rem;
          border: 1px solid #e4e4e4;

          &:hover {
            border: 1px solid ${darken(0.09, "#dadce0")};
            box-sizing: border-box;
          }
        }
      }
    }
  `}
`;

const ListDesktopCSS = css`
  .ant-spin-container {
    .ant-list-items {
      .ant-list-item {
        padding: 0.8rem 1.25rem;

        .ant-list-item-action {
          margin-left: 0;
          li {
            padding: 0 5px;
          }
        }
      }
    }
  }
`;

const ListMobileCSS = css`
  .ant-spin-container {
    .ant-list-items {
      .ant-list-item {
        padding: 1rem;

        .ant-list-item-meta {
          .ant-list-item-meta-title {
            margin-bottom: 5px;
          }
        }

        .ant-list-item-action {
          li {
            padding: 0;
          }
        }
      }
    }
  }
`;

const ListItem = styled(ListAntd.Item)`
  ${({ isColored, theme }) => css`
    background: ${isColored ? "#fde8e8" : theme.colors.white};
  `}
`;
