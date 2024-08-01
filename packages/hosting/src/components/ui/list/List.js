import React from "react";
import styled, { css } from "styled-components";
import ListAntd from "antd/lib/list";
import { IconAction } from "../IconAction";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { modalConfirm } from "../modalConfirm";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

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
          icon={faPencil}
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
          box-shadow: inset 0 -1px 0 0 rgb(100 121 143 / 12%);
          transition: all ease-in-out 80ms;
          border-radius: ${theme.border_radius.xx_large};
          margin-bottom: 0.5rem;
          border: 1px solid #e4e4e4;

          &:hover {
            border: 1px solid #dadce0;
            box-shadow:
              inset 1px 0 0 #dadce0,
              inset -1px 0 0 #dadce0,
              0 1px 2px 0 rgb(60 64 67 / 30%),
              0 1px 3px 1px rgb(60 64 67 / 15%);
            box-sizing: border-box;
          }

          .ant-list-item-action {
            li {
              .ant-list-item-action-split {
                height: 1.5rem;
                margin-top: -10px;
              }
            }
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
