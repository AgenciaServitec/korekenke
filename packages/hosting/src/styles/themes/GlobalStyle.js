import { css, createGlobalStyle } from "styled-components";
import { mediaQuery } from "../constants";
import { darken } from "polished";

const global = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
      sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background: #e9eef6;
    font-size: 15px;
    overflow-x: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
      sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    color: ${({ theme }) => theme.colors.font2};
  }

  h1,
  h2,
  h3 {
    color: ${({ theme }) => theme.colors.font1};
  }

  h4,
  h5,
  h6 {
    color: ${({ theme }) => theme.colors.font2};
    //font-family: "DINPro-Bold", serif;
  }

  h1 {
    font-size: 2rem;
    font-weight: bold;
    line-height: 3.4rem;
  }

  h2 {
    font-size: 1.7rem;
    font-weight: bold;
    line-height: 2.2rem;
  }

  h3 {
    font-size: 1.3rem;
    font-weight: bold;
  }

  h4 {
    font-size: 1.1rem;
    font-weight: bold;
  }

  h5 {
    font-size: 1rem;
    font-weight: bold;
  }

  .link-color {
    color: rgba(49, 138, 255, 0.93);
    cursor: pointer;
  }

  .d-flex {
    display: flex;
  }

  .pointer {
    cursor: pointer;
  }

  .capitalize {
    text-transform: capitalize;
  }

  .data-entry-modal {
    pointer-events: none;
  }
`;

const antd = {
  datePicker: css`
    .ant-calendar-picker-container {
      .ant-calendar {
        background: ${({ theme }) => theme.colors.secondary} !important;
        color: ${({ theme }) => theme.colors.font2} !important;
        border: none;
        .ant-calendar-input-wrap {
          border: none;
          .ant-calendar-input {
            color: ${({ theme }) => theme.colors.font2};
            background: ${({ theme }) => theme.colors.secondary};
          }
        }
        .ant-calendar-date-panel {
          .ant-calendar-header {
            border: none;
            .ant-calendar-my-select {
              .ant-calendar-month-select,
              .ant-calendar-year-select {
                color: ${({ theme }) => theme.colors.font1};
              }
            }
          }

          .ant-calendar-body {
            border: none;
            .ant-calendar-date {
              color: ${({ theme }) => theme.colors.font2};
              font-weight: 600;
              &:hover {
                background: rgba(102, 101, 101, 0.54);
              }
            }
            .ant-calendar-selected-day .ant-calendar-date {
              background: ${({ theme }) => theme.colors.secondary};
              border: ${({ theme }) => `1px solid ${theme.colors.tertiary}`};
            }
            .ant-calendar-today .ant-calendar-date {
              color: ${({ theme }) => theme.colors.font2};
              border: ${({ theme }) => `1px solid ${theme.colors.font2}`};
            }
            .ant-calendar-last-month-cell .ant-calendar-date,
            .ant-calendar-next-month-btn-day .ant-calendar-date,
            .ant-calendar-last-month-cell .ant-calendar-date:hover,
            .ant-calendar-next-month-btn-day .ant-calendar-date:hover {
              color: ${({ theme }) => theme.colors.font1};
              font-weight: 400;
            }
          }

          .ant-calendar-footer {
            border: none;
            .ant-calendar-today-btn {
              color: ${({ theme }) => theme.colors.font2};
            }
          }
        }
      }
    }

    .ant-calendar-picker {
      div {
        .ant-calendar-picker-icon {
          color: ${({ theme }) => theme.colors.font2} !important;
        }
      }
    }
  `,
  radio: css`
    .ant-radio-checked .ant-radio-inner {
      border-color: ${({ theme }) => theme.colors.primary} !important;
      background-color: ${({ theme }) => theme.colors.primary} !important;
      &:hover {
        border-color: ${({ theme }) => theme.colors.primary} !important;
      }
    }
  `,
  checkbox: css`
    .ant-checkbox-checked .ant-checkbox-inner {
      background-color: ${({ theme }) => theme.colors.primary};
      border-color: ${({ theme }) => theme.colors.primary};
    }
    .ant-checkbox-wrapper:hover .ant-checkbox-inner,
    .ant-checkbox:hover .ant-checkbox-inner,
    .ant-checkbox-input:focus + .ant-checkbox-inner {
      border-color: ${({ theme }) => darken(0.09, theme.colors.primary)};
    }
    .ant-checkbox-checked::after {
      border-color: ${({ theme }) => darken(0.09, theme.colors.primary)};
    }
  `,
  switch: css`
    .ant-switch {
      background-color: ${({ theme }) => theme.colors.error};
    }
    .ant-switch-checked {
      background-color: ${({ theme }) => theme.colors.primary};
    }
  `,
  dropdown: css`
    .ant-dropdown-trigger {
      .ant-dropdown-menu-submenu-title {
        padding: 1.7rem 1rem !important;
      }
    }
  `,
  card: css`
    .ant-card-bordered {
      border: 1px solid #dcdcdc;
    }
  `,
};

const scroll = css`
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 5px;
    height: 5px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 1rem;
    background-color: darkgrey;
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }

  ::-webkit-scrollbar-corner {
    background-color: transparent;
  }
`;

export const GlobalStyle = createGlobalStyle`
    ${global}
    ${Object.values(antd).map((antdComponent) => antdComponent)}
    ${mediaQuery.minTablet}{    
        ${scroll}
    }
`;
