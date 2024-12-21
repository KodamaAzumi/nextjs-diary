import React from "react";
import Calendar from "./calendar";

type Props = {
  year: number;
  month: number;
  weeks: string[];
  show: number;
  dates: string[];
};

const Calendars = ({ year, month, weeks, show, dates }: Props) => {
  return (
    <div className="mx-auto flex justify-center flex-wrap gap-4">
      {Array.from({ length: show }).map((_, i) => {
        let currentMonth = month - i;
        let currentYear = year;

        if (currentMonth < 1) {
          currentYear -= 1;
          currentMonth = 12 + currentMonth;
        }

        return (
          <Calendar
            key={`${currentYear}-${currentMonth}`}
            year={currentYear}
            month={currentMonth}
            weeks={weeks}
            dates={dates}
          />
        );
      })}
    </div>
  );
};

export default Calendars;
