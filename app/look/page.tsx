"use client";
import React, { useEffect, useState } from "react";
import Calendars from "../../components/look/calendars";
import uuid4 from "uuid4";

// 日付を年、月、日にばらす
const splitDate = (dateStr: string) => {
  const dateParts = dateStr.split("-");
  return dateParts; // [year, month, day]
};

// 新しい日付から、古い日付までの月数を数える
const countMonth = (oldDDate: string, newDate: string) => {
  const oldDateYear = parseInt(splitDate(oldDDate)[0]);
  const oldDateMonth = parseInt(splitDate(oldDDate)[1]);
  const newDateYear = parseInt(splitDate(newDate)[0]);
  const newDateMonth = parseInt(splitDate(newDate)[1]);

  let numOfMonths;
  if (oldDateYear === newDateYear) {
    numOfMonths = newDateMonth - oldDateMonth + 1;
  } else {
    const numOfYears = newDateYear - oldDateYear;
    let addMonths = 0;
    if (numOfYears > 1) {
      addMonths = 12 * (numOfYears - 1);
    }
    numOfMonths = 12 - oldDateMonth + 1 + newDateMonth + addMonths;
  }
  return numOfMonths;
};

const LookPage = () => {
  const weeks = ["日", "月", "火", "水", "木", "金", "土"];
  const [userId, setUserId] = useState<string | null>(null);
  const [datesData, setDatesData] = useState<{
    [date: string]: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let storedUserId = localStorage.getItem("uuid");
    if (!storedUserId) {
      storedUserId = uuid4();
      localStorage.setItem("uuid", storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    const fetchDates = async () => {
      if (userId) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/diary/date/${userId}`, {
            cache: "no-store",
          });
          const result = await response.json();
          setDatesData(result.diaryDate);
        } catch (error) {
          console.error("データの取得に失敗しました:", error);
        } finally {
          setIsLoading(false); // ローディングを終了
        }
      }
    };
    fetchDates();
  }, [userId]);

  let year = 2024;
  let month = 1;
  let show = 0;

  if (datesData && Object.keys(datesData).length > 0) {
    const dates = Object.keys(datesData);
    const dateObjects = dates.map((dateStr) => new Date(dateStr));
    const oldestDate = new Date(
      Math.min(...dateObjects.map((date) => date.getTime()))
    );
    const oldestDateStr = oldestDate.toISOString().split("T")[0];
    const newestDate = new Date(
      Math.max(...dateObjects.map((date) => date.getTime()))
    );
    const newestDateStr = newestDate.toISOString().split("T")[0];
    year = parseInt(splitDate(newestDateStr)[0]);
    month = parseInt(splitDate(newestDateStr)[1]);
    show = countMonth(oldestDateStr, newestDateStr);
  }

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-lg text-center font-bold">読み込み中...</div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] px-4">
      <Calendars
        year={year}
        month={month}
        weeks={weeks}
        show={show}
        dates={datesData ? Object.keys(datesData) : []}
      />
      {datesData && Object.keys(datesData).length > 0 ? (
        ""
      ) : (
        <div className="text-lg text-center mt-20 font-bold">
          日記が一つも保存されていません
        </div>
      )}
    </main>
  );
};

export default LookPage;
