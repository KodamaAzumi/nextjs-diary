"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import uuid4 from "uuid4";

type Diary = {
  title: string;
  content: string;
  date: string | null;
  createdAt: Date;
};

const LookEditPage = ({
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
  const titleRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const router = useRouter();

  if (index !== null && diaries[index]) {
    if (titleRef.current) {
      titleRef.current.value = diaries[index].title;
    }
    if (contentRef.current) {
      contentRef.current.value = diaries[index].content;
    }
  }

  useEffect(() => {
    // ユーザーidがない場合は新しく作り、ローカルストレージに保存する
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
      }
    };
    fetchDiaries();
  }, [datesData, date, userId]);

  const updateDiary = async (
    title: string | undefined,
    content: string | undefined
  ) => {
    if (datesData && date && index) {
      const res = await fetch(`/api/diary/${datesData[date][index]}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, title, content, date }),
      });
      return res.json();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateDiary(titleRef.current?.value, contentRef.current?.value);
    router.push(`/look/${date}/${index}`);
  };

  return (
    <main className="h-[calc(100vh-80px)]">
      <div className="w-full h-full flex items-center justify-center">
        <form
          className="flex flex-col gap-y-4 max-w-[700px] w-full px-4"
          onSubmit={handleSubmit}
        >
          <h2 className="font-semibold text-lg text-gray-800">編集中です...</h2>
          <input
            type="text"
            className="w-full h-[100px] text-lg resize-none p-8 rounded-md border-4 border-orange-400 focus:outline-none"
            ref={titleRef}
          />
          <textarea
            maxLength={200}
            minLength={1}
            className="w-full h-[300px] text-lg resize-none p-8 rounded-md border-4 border-orange-400 focus:outline-none"
            ref={contentRef}
          ></textarea>
          <div className="">
            <button
              type="submit"
              className="bg-orange-400 py-3 px-5 text-white font-medium rounded-md hover:bg-orange-300"
            >
              完了
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default LookEditPage;
