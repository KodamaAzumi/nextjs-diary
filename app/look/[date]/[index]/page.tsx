"use client";
import SideMenu from "@/components/look/sideMenu";
import SideList from "@/components/look/sideMenuList";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import uuid4 from "uuid4";

type Diary = {
  title: string;
  content: string;
  date: string | null;
  createdAt: Date;
};

const deleteDiary = async (diaryId: string) => {
  const response = await fetch(`/api/diary/${diaryId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

const LookDetailPage = ({
  params,
}: {
  params: Promise<{ date: string; index: number }>;
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [datesData, setDatesData] = useState<{
    [date: string]: string[];
  } | null>(null);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [date, setDate] = useState<string | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        const response = await fetch(`/api/diary/date/${userId}`, {
          cache: "no-store",
        });
        const result = await response.json();
        setDatesData(result.diaryDate);
      }
    };
    fetchDates();
  }, [userId]);

  useEffect(() => {
    const fetchParams = async () => {
      const { date, index } = await params;
      setDate(date);
      setIndex(index);
    };
    fetchParams();
  }, [params]);

  useEffect(() => {
    const fetchDiaries = async () => {
      if (datesData && date) {
        setIsLoading(true); // ローディング開始
        try {
          const diaryIds = datesData[date] || [];

          // 全てのDiaryを取得する
          const diariesData = await Promise.all(
            diaryIds.map(async (diaryId) => {
              if (userId) {
                const response = await fetch(`/api/diary/${diaryId}`, {
                  cache: "no-store",
                });
                const result = await response.json();
                return result.diary; // 取得したdiaryを返す
              }
              return null; // userIdがない場合はnullを返す
            })
          );

          // diariesData配列からnull以外の要素をフィルタリング
          setDiaries(diariesData.filter((diary) => diary !== null) as Diary[]);
        } catch (error) {
          console.error("日記データの取得に失敗しました:", error);
        } finally {
          setIsLoading(false); // ローディング終了
        }
      }
    };
    fetchDiaries();
  }, [datesData, date, userId]);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (date && datesData && index) {
      const diaryId = datesData[date][index];
      await deleteDiary(diaryId);

      if (datesData[date].length === 1) {
        router.push(`/look`);
      } else {
        if (index == 0) {
          window.location.reload();
        } else {
          router.push(`/look/${date}/0`);
        }
      }
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-lg font-bold text-center">読み込み中...</div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)]">
      <div className="w-full h-full flex p-4 lg:p-12 justify-center">
        <div className="w-1/5 mr-20 hidden lg:block">
          <SideList date={date} diaries={diaries} index={index} />
        </div>
        <div className="w-full sm:w-4/5 flex">
          <div className="h-full flex  flex-col gap-y-4 lg:pt-12 w-full max-w-[700px]">
            <SideMenu
              isOpen={isMenuOpen}
              setIsOpen={setIsMenuOpen}
              date={date}
              diaries={diaries}
              index={index}
            />
            <div className="w-full h-[400px] border-4 border-orange-400 p-12 text-lg rounded-md flex flex-col justify-between">
              <p>
                {index && diaries[index]
                  ? diaries[index].content
                  : "日記を選び直してください"}
              </p>
            </div>
            <div className="flex justify-between">
              <Link
                className="bg-orange-400 text-white px-4 py-3 text-lg font-medium rounded-md hover:bg-orange-300"
                href={`/look/${date}/${index}/edit`}
              >
                編集
              </Link>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-3 text-lg font-medium rounded-md hover:bg-red-400"
                onClick={handleDelete}
              >
                消す
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LookDetailPage;
