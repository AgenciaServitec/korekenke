import { FilterDropdown } from "./FilterDropdown";
import { get, groupBy, isEmpty, orderBy } from "lodash";

export const mapColumns = ({ columns, dataSource, currentFilters }) => {
  const dataSourceView = dataSourceFilters(dataSource, currentFilters);

  return {
    columnsTable: columns.map((column) =>
      mapTableColumn(column, dataSourceView)
    ),
    itemsFiltered: dataSourceView,
  };
};

const dataSourceFilters = (dataSource, currentFilters) => {
  Object.entries(currentFilters).forEach(([fieldName, filterValues]) => {
    dataSource = dataSource.filter((record) =>
      recordFilter(record, fieldName, filterValues)
    );
  });

  return dataSource;
};

const recordFilter = (record, fieldName, filterValues) => {
  if (isEmpty(filterValues)) return true;

  return filterValues.some((filterValue) =>
    onFilter(filterValue, record, fieldName)
  );
};

const mapTableColumn = (column, dataSourceView) => {
  if (column.withFilter) {
    column.filterDropdown = FilterDropdown;
    column.filters = filters(column.key, dataSourceView);
    column.onFilter = (filterValue, record) =>
      onFilter(filterValue, record, column.key);
  }

  return column;
};

const filters = (fieldName, dataSourceView) => {
  const valuesByFieldName = groupBy(
    dataSourceView,
    (record) => get(record, `${fieldName}`) || ""
  );

  const filters = Object.entries(valuesByFieldName).map(([value, records]) => {
    return value
      ? {
          value: value,
          text: `${value} (${records.length})`,
        }
      : { value: " ", text: `Blank (${records.length})` };
  });

  return orderBy(filters, ["value"], ["asc"]);
};

const onFilter = (filterValue, record, fieldName) => {
  const recordValue = get(record, `${fieldName}`, "");

  return filterValue === " " ? !recordValue : recordValue === filterValue;
};
