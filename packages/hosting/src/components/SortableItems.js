import React from "react";
import {
  closestCenter,
  DndContext,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styled, { css } from "styled-components";
import { isObjectType } from "../utils";
import {
  disableDragProps,
  MouseSensor,
} from "./utils/upload/SortableItems.utils";
import { get } from "lodash";

// export interface SortableItemsProps<Data extends DataSourceValue> {
//   dataSource: Data[];
//   fieldAsId: FieldAsId<Data>;
//   renderItem: (data: Data, index: number, options: Options) => JSX.Element;
//   onChange: (dataSource: Data[]) => void;
//   className?: string;
//   itemClassName?: string;
//   isDisabledLastElement?: boolean;
// }

// interface Options {
//   disableDragProps: DisableDragProps;
// }
//
// type DataSourceValue = string | number | ObjectType;
//
// type FieldAsId<Data extends DataSourceValue> = Data extends ObjectType
//   ? Paths<Data>
//   : undefined;

export const SortableItems = ({
  dataSource,
  fieldAsId,
  renderItem,
  onChange,
  className,
  itemClassName,
  isDisabledLastElement,
}) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const getUniqueIdentifier = (dataSourceValue) =>
    isObjectType(dataSourceValue) && fieldAsId
      ? get(dataSourceValue, fieldAsId, null)
      : dataSourceValue;

  const onDragEnd = ({ active, over }) => {
    if (over && active.id !== over?.id) {
      const oldIndex = dataSource.findIndex(
        (dataSourceValue) => getUniqueIdentifier(dataSourceValue) === active.id
      );
      const newIndex = dataSource.findIndex(
        (dataSourceValue) => getUniqueIdentifier(dataSourceValue) === over.id
      );

      const newDataSource = arrayMove(dataSource, oldIndex, newIndex);

      onChange(newDataSource);
    }
  };

  const items = dataSource.map((dataSourceValue) =>
    getUniqueIdentifier(dataSourceValue)
  );

  return (
    <DndContext
      autoScroll={false}
      onDragEnd={onDragEnd}
      sensors={sensors}
      collisionDetection={closestCenter}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <ListItems className={className}>
          {dataSource.map((dataSourceValue, index) => {
            const lastElement = isDisabledLastElement
              ? items.length - 1 === index
              : false;
            const uniqueIdentifier = getUniqueIdentifier(dataSourceValue);

            return (
              <ListItemSortable
                index={index}
                key={uniqueIdentifier}
                uniqueIdentifier={uniqueIdentifier}
                className={itemClassName}
                lastElement={lastElement}
              >
                {renderItem(dataSourceValue, index, { disableDragProps })}
              </ListItemSortable>
            );
          })}
        </ListItems>
      </SortableContext>
    </DndContext>
  );
};

const ListItems = styled.ul`
  padding: 0;
  margin: 0;
`;

// interface ListItemProps {
//   isDragging: boolean;
//   isOver: boolean;
//   isSorting: boolean;
// }

const ListItem = styled.li`
  ${({ isSorting }) => css`
    position: relative;
    cursor: ${isSorting ? "grabbing" : "grab"};
    outline: none;
    box-sizing: border-box;
    list-style: none;
    transform-origin: 50% 50%;
    white-space: nowrap;
    transform: scale(var(--scale, 1));
    transition: box-shadow 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22);

    #disabled-dnd {
      cursor: default;
    }
  `}
`;

// interface ListItemSortableProps {
//   children: React.ReactNode;
//   index: number;
//   uniqueIdentifier: UniqueIdentifier;
//   className?: string;
//   lastElement: boolean;
// }

const ListItemSortable = ({
  children,
  index,
  uniqueIdentifier,
  className,
  lastElement,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    isOver,
    isSorting,
    transition,
  } = useSortable({
    id: uniqueIdentifier,
    animateLayoutChanges: () => true,
  });

  const style = {
    transform: lastElement ? undefined : CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: lastElement ? "default" : "grab",
  };

  return (
    <ListItem
      isSorting={isSorting}
      isOver={isOver}
      isDragging={isDragging}
      ref={setNodeRef}
      style={style}
      key={index}
      {...attributes}
      {...listeners}
      className={className}
    >
      {children}
    </ListItem>
  );
};
