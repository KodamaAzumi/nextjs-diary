import Link from "next/link";
import React from "react";

type Props = {
  year: number;
  month: number;
  weeks: string[];
  dates: string[];
};

const Calendar = ({ year, month, weeks, dates }: Props) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const endDayCount = endDate.getDate();
  const startDay = startDate.getDay();

  let dayCount = 1;

  return (
    <div className="flex flex-col gap-1 mt-8 items-center flex-wrap">
      <h1 className="text-xl text-center font-semibold mb-2.5">{`${year}年${String(
        month
      ).padStart(2, "0")}月`}</h1>
      <ul className="flex mr-5">
        {weeks.map((week, index) => (
          <li
            key={index}
            className="text-lg w-12 h-12 flex items-center justify-center"
          >
            {week}
          </li>
        ))}
      </ul>
      {Array.from({ length: 6 }).map((_, w) => (
        <ul key={w} className="flex mr-5">
          {Array.from({ length: 7 }).map((_, d) => {
            if (w === 0 && d < startDay) {
              // 1行目で1日の曜日の前
              return (
                <li
                  key={d}
                  className="text-lg w-12 h-12 flex items-center justify-center"
                ></li>
              );
            } else if (dayCount > endDayCount) {
              // 末尾の日数を超えた
              return null;
            } else {
              const dataDate = `${year}-${String(month).padStart(
                2,
                "0"
              )}-${String(dayCount).padStart(2, "0")}`;

              const calendarItem = dates.includes(dataDate) ? (
                <Link
                  href={`/look/${dataDate}/0`}
                  className="bg-orange-400 rounded-full hover:bg-orange-300 w-7 text-center"
                  data-date={dataDate}
                >
                  {dayCount}
                </Link>
              ) : (
                dayCount
              );

              dayCount++;
              return (
                <li
                  key={d}
                  className="text-lg w-12 h-12 flex items-center justify-center"
                >
                  {calendarItem}
                </li>
              );
            }
          })}
        </ul>
      ))}
    </div>
  );
};

export default Calendar;
