import { formatDateStr } from "@/app/utils/formatDateStr";
import { formatTime } from "@/app/utils/formatTime";
import Link from "next/link";

type Props = {
  date: string | null;
  diaries: Diaries[];
  index: number | null;
};

type Diaries = {
  title: string;
  createdAt: Date;
};

export default function SideList({ date, diaries, index }: Props) {
  return (
    <div className="flex flex-col">
      <h1 className="text-xl mb-8 font-bold">
        {date ? formatDateStr(date) : ""}
      </h1>
      <ul className="sidebar-list">
        {diaries.map((diary, diaryIndex) => (
          <li
            key={diaryIndex}
            className="text-lg border-b-2 border-orange-400 cursor-pointer flex justify-between items-center w-hull"
          >
            <Link
              href={`${diaryIndex}`}
              className={`p-8 w-full ${
                diaryIndex == index
                  ? "text-orange-400"
                  : "hover:text-orange-400"
              }`}
            >
              {`${formatTime(diary.createdAt)} ${diary.title}`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
