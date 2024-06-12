import styled from "styled-components";
import TableAntd from "antd/lib/table";

export const Table = styled(TableAntd)`
  .ant-table {
    .ant-table-container {
      .ant-table-header {
        .ant-table-thead {
          tr {
            th {
              .ant-table-filter-column {
                .active {
                  span {
                    color: ${({ theme }) => theme.colors.primary};
                  }
                }
              }

              .ant-table-filter-trigger-container-open,
              .ant-table-filter-trigger,
              .ant-table-filter-trigger:hover {
                color: ${({ theme }) => theme.colors.dark};
              }

              span {
                color: ${({ theme }) => theme.colors.dark};
              }
            }
          }
        }
      }

      .ant-table-body {
        .ant-table-tbody {
        }
        .ant-table-summary {
          background-color: ${({ theme }) => theme.colors.tertiary};
        }
      }
    }
  }
`;
