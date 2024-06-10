import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import CalendarAntd from "antd/lib/calendar";

// interface Props {
//   defaultValue?: Moment;
//   fullscreen?: boolean;
// }

export const Calendar = ({ defaultValue, fullscreen = false, ...props }) => (
  <CalendarStyled
    fullscreen={fullscreen}
    defaultValue={defaultValue || dayjs()}
    {...props}
  />
);

const CalendarStyled = styled(CalendarAntd)`
  .ant-picker-calendar-header {
    background: ${({ theme }) => theme.colors.primary};
  }
`;
