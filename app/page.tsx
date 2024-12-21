"use client";
import { useEffect, useRef, useState } from "react";
import uuid4 from "uuid4";
import { formatDate } from "./utils/formatDate";

const postDiary = async (
  userId: string | null,
  title: string | undefined,
  content: string | undefined,
  date: string | undefined
) => {
  const res = await fetch("/api/diary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, title, content, date }),
  });

  return res.json();
};

export default function Home() {
  const titleRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // ユーザーidがない場合は新しく作り、ローカルストレージに保存する
    let storedUserId = localStorage.getItem("uuid");
    if (!storedUserId) {
      storedUserId = uuid4();
      localStorage.setItem("uuid", storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userId && titleRef.current?.value && contentRef.current?.value) {
      const date = formatDate();
      await postDiary(
        userId,
        titleRef.current?.value,
        contentRef.current?.value,
        date
      );
      titleRef.current.value = "";
      contentRef.current.value = "";
    }
  };

  return (
    <main className="h-[calc(100vh-80px)]">
      <div className="w-full h-full flex items-center justify-center">
        <form
          className="flex flex-col gap-y-4 max-w-[700px] w-full px-4"
          onSubmit={handleSubmit}
        >
          <input
            placeholder="タイトルを入力"
            type="text"
            className="w-full h-[100px] text-lg resize-none p-8 rounded-md border-4 border-orange-400 focus:outline-none"
            ref={titleRef}
          />
          <textarea
            placeholder="さあ、日記を書きましょう"
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
              送信
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
